use bevy_app::{App, Update};
use bevy_ecs::prelude::*;
use bevy_math::Vec3;
use wasm_bindgen::prelude::*;

const FIXED_DELTA_SECONDS: f32 = 1.0 / 120.0;

#[derive(Component)]
struct Position(Vec3);

#[derive(Component)]
struct Velocity(Vec3);

#[derive(Resource)]
struct StepDelta(f32);

#[derive(Clone, Copy)]
struct BodyHandle {
    id: u32,
    entity: Entity,
}

fn integrate(mut bodies: Query<(&mut Position, &Velocity)>, delta: Res<StepDelta>) {
    for (mut position, velocity) in &mut bodies {
        position.0 += velocity.0 * delta.0;
    }
}

/// Headless Bevy ECS runtime used only by the Babylon/Bevy comparative lab.
/// Babylon owns browser rendering; this runtime owns semantic body state.
///
/// The public stepping API is deliberately fixed-tick. Render cadence and wall
/// clock accumulation belong to the host so replay/certification can request an
/// exact number of authoritative simulation ticks independent of frame rate.
#[wasm_bindgen]
pub struct DefendRuntime {
    app: App,
    bodies: Vec<BodyHandle>,
    next_body_id: u32,
    tick: u32,
}

#[wasm_bindgen]
impl DefendRuntime {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut app = App::new();
        app.insert_resource(StepDelta(FIXED_DELTA_SECONDS));
        app.add_systems(Update, integrate);
        Self {
            app,
            bodies: Vec::new(),
            next_body_id: 0,
            tick: 0,
        }
    }

    pub fn fixed_delta_seconds(&self) -> f32 {
        FIXED_DELTA_SECONDS
    }

    pub fn tick(&self) -> u32 {
        self.tick
    }

    /// Spawn one semantic body and return a stable external id.
    ///
    /// Babylon and future protocol consumers must not depend on Bevy query or
    /// archetype iteration order for identity. The runtime therefore retains an
    /// explicit stable body order separate from ECS storage order.
    pub fn spawn_body(
        &mut self,
        x: f32,
        y: f32,
        z: f32,
        velocity_x: f32,
        velocity_y: f32,
        velocity_z: f32,
    ) -> u32 {
        let id = self.next_body_id;
        self.next_body_id = self
            .next_body_id
            .checked_add(1)
            .expect("hybrid lab body id space exhausted");

        let entity = self
            .app
            .world_mut()
            .spawn((
                Position(Vec3::new(x, y, z)),
                Velocity(Vec3::new(velocity_x, velocity_y, velocity_z)),
            ))
            .id();

        self.bodies.push(BodyHandle { id, entity });
        id
    }

    /// Advance the authoritative simulation by exactly `steps` fixed ticks.
    ///
    /// The host is responsible for deciding how wall-clock time maps to ticks.
    /// This makes frame pacing an interpolation concern instead of simulation
    /// state and gives replay fixtures a deterministic primitive.
    pub fn step_fixed(&mut self, steps: u32) {
        for _ in 0..steps {
            self.app.update();
            self.tick = self.tick.wrapping_add(1);
        }
    }

    /// Stable ids in the same order as the flat xyz triples returned by
    /// `positions()`. This first fixture has no lifecycle changes, so callers can
    /// fetch the ids once after spawn. Future spawn/despawn events should update
    /// the protocol explicitly rather than relying on array position identity.
    pub fn body_ids(&self) -> Vec<u32> {
        self.bodies.iter().map(|body| body.id).collect()
    }

    /// Flat xyz triples ordered by the explicit stable body registry.
    ///
    /// This intentionally performs a straightforward copied snapshot. A direct
    /// WASM memory view, shared memory, SoA layout, or binary protocol is only
    /// justified after profiling shows this baseline copy boundary is material.
    pub fn positions(&self) -> Vec<f32> {
        let world = self.app.world();
        let mut positions = Vec::with_capacity(self.bodies.len() * 3);

        for body in &self.bodies {
            let position = world
                .get::<Position>(body.entity)
                .expect("registered hybrid body missing Position");
            positions.push(position.0.x);
            positions.push(position.0.y);
            positions.push(position.0.z);
        }

        positions
    }
}

impl Default for DefendRuntime {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn spawn_linear(runtime: &mut DefendRuntime, x: f32, velocity_x: f32) -> u32 {
        runtime.spawn_body(x, 0.0, 0.0, velocity_x, 0.0, 0.0)
    }

    #[test]
    fn body_ids_are_monotonic_and_snapshot_order_is_stable() {
        let mut runtime = DefendRuntime::new();
        let first = spawn_linear(&mut runtime, 1.0, 1.0);
        let second = spawn_linear(&mut runtime, 10.0, -2.0);

        assert_eq!((first, second), (0, 1));
        assert_eq!(runtime.body_ids(), vec![0, 1]);

        runtime.step_fixed(120);
        let positions = runtime.positions();

        assert_eq!(positions.len(), 6);
        assert!((positions[0] - 2.0).abs() < 0.0001);
        assert!((positions[3] - 8.0).abs() < 0.0001);
    }

    #[test]
    fn fixed_step_partitioning_produces_the_same_state() {
        let mut one_batch = DefendRuntime::new();
        let mut split_batches = DefendRuntime::new();
        spawn_linear(&mut one_batch, -4.0, 3.25);
        spawn_linear(&mut split_batches, -4.0, 3.25);

        one_batch.step_fixed(240);
        split_batches.step_fixed(60);
        split_batches.step_fixed(180);

        assert_eq!(one_batch.tick(), 240);
        assert_eq!(split_batches.tick(), 240);
        assert_eq!(one_batch.positions(), split_batches.positions());
    }
}
