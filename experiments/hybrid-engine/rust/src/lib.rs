use bevy_app::{App, Update};
use bevy_ecs::prelude::*;
use bevy_math::Vec3;
use wasm_bindgen::prelude::*;

const FIXED_DELTA_SECONDS: f32 = 1.0 / 120.0;
const FNV1A_OFFSET_BASIS: u64 = 0xcbf29ce484222325;
const FNV1A_PRIME: u64 = 0x00000100000001b3;

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

fn hash_bytes(hash: &mut u64, bytes: &[u8]) {
    for byte in bytes {
        *hash ^= u64::from(*byte);
        *hash = hash.wrapping_mul(FNV1A_PRIME);
    }
}

fn hash_u32(hash: &mut u64, value: u32) {
    hash_bytes(hash, &value.to_le_bytes());
}

fn hash_vec3(hash: &mut u64, value: Vec3) {
    hash_u32(hash, value.x.to_bits());
    hash_u32(hash, value.y.to_bits());
    hash_u32(hash, value.z.to_bits());
}

fn bounded_velocity(x: f32, y: f32, z: f32, max_speed: f32) -> Option<Vec3> {
    if !x.is_finite() || !y.is_finite() || !z.is_finite() || !max_speed.is_finite() {
        return None;
    }
    let requested = Vec3::new(x, y, z);
    let speed_limit = max_speed.max(0.0);
    if speed_limit <= f32::EPSILON {
        return Some(Vec3::ZERO);
    }
    let speed = requested.length();
    if !speed.is_finite() {
        return None;
    }
    if speed > speed_limit && speed > f32::EPSILON {
        Some(requested * (speed_limit / speed))
    } else {
        Some(requested)
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
    /// Babylon and protocol consumers must not depend on Bevy query or archetype
    /// iteration order for identity. The runtime therefore retains an explicit
    /// stable body order separate from ECS storage order.
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
    pub fn step_fixed(&mut self, steps: u32) {
        for _ in 0..steps {
            self.app.update();
            self.tick = self.tick.wrapping_add(1);
        }
    }

    /// Stable ids in the same order as positions() and velocities().
    pub fn body_ids(&self) -> Vec<u32> {
        self.bodies.iter().map(|body| body.id).collect()
    }

    /// Flat xyz triples ordered by the explicit stable body registry.
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

    /// Flat authoritative velocity triples ordered exactly like body_ids().
    pub fn velocities(&self) -> Vec<f32> {
        let world = self.app.world();
        let mut velocities = Vec::with_capacity(self.bodies.len() * 3);

        for body in &self.bodies {
            let velocity = world
                .get::<Velocity>(body.entity)
                .expect("registered hybrid body missing Velocity");
            velocities.push(velocity.0.x);
            velocities.push(velocity.0.y);
            velocities.push(velocity.0.z);
        }

        velocities
    }

    /// Accept worker-planned velocities at the authoritative boundary.
    ///
    /// Results are rejected wholesale when the source tick is too old (or from
    /// the future under wrapping arithmetic). Individual commands are accepted
    /// only for live ids and finite vectors, and are clamped to `max_speed`.
    /// The return value is the number of commands actually applied.
    pub fn apply_velocity_commands(
        &mut self,
        source_tick: u32,
        max_lag_ticks: u32,
        body_ids: Vec<u32>,
        velocities: Vec<f32>,
        max_speed: f32,
    ) -> u32 {
        if self.tick.wrapping_sub(source_tick) > max_lag_ticks {
            return 0;
        }
        if velocities.len() != body_ids.len().saturating_mul(3) {
            return 0;
        }

        let mut applied = 0_u32;
        for (index, id) in body_ids.iter().enumerate() {
            let offset = index * 3;
            let Some(next_velocity) = bounded_velocity(
                velocities[offset],
                velocities[offset + 1],
                velocities[offset + 2],
                max_speed,
            ) else {
                continue;
            };
            let entity = self
                .bodies
                .iter()
                .find(|body| body.id == *id)
                .map(|body| body.entity);
            let Some(entity) = entity else {
                continue;
            };
            let Some(mut velocity) = self.app.world_mut().get_mut::<Velocity>(entity) else {
                continue;
            };
            velocity.0 = next_velocity;
            applied = applied.saturating_add(1);
        }

        applied
    }

    /// Return a deterministic fingerprint of public semantic state.
    pub fn state_fingerprint(&self) -> String {
        let world = self.app.world();
        let mut hash = FNV1A_OFFSET_BASIS;
        hash_u32(&mut hash, self.tick);
        hash_u32(&mut hash, self.bodies.len() as u32);

        for body in &self.bodies {
            let position = world
                .get::<Position>(body.entity)
                .expect("registered hybrid body missing Position");
            let velocity = world
                .get::<Velocity>(body.entity)
                .expect("registered hybrid body missing Velocity");

            hash_u32(&mut hash, body.id);
            hash_vec3(&mut hash, position.0);
            hash_vec3(&mut hash, velocity.0);
        }

        format!("{hash:016x}")
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
        let velocities = runtime.velocities();

        assert_eq!(positions.len(), 6);
        assert_eq!(velocities, vec![1.0, 0.0, 0.0, -2.0, 0.0, 0.0]);
        assert!((positions[0] - 2.0).abs() < 0.0001);
        assert!((positions[3] - 8.0).abs() < 0.0001);
    }

    #[test]
    fn worker_velocity_commands_are_tick_validated_and_speed_bounded() {
        let mut runtime = DefendRuntime::new();
        let id = spawn_linear(&mut runtime, 0.0, 1.0);
        runtime.step_fixed(10);

        assert_eq!(
            runtime.apply_velocity_commands(10, 2, vec![id], vec![30.0, 0.0, 0.0], 5.0),
            1
        );
        assert!((runtime.velocities()[0] - 5.0).abs() < 0.0001);

        runtime.step_fixed(4);
        assert_eq!(
            runtime.apply_velocity_commands(10, 2, vec![id], vec![-2.0, 0.0, 0.0], 5.0),
            0
        );
        assert!((runtime.velocities()[0] - 5.0).abs() < 0.0001);
    }

    #[test]
    fn malformed_or_unknown_velocity_commands_fail_closed() {
        let mut runtime = DefendRuntime::new();
        let id = spawn_linear(&mut runtime, 0.0, 1.0);

        assert_eq!(
            runtime.apply_velocity_commands(0, 2, vec![id], vec![f32::NAN, 0.0, 0.0], 5.0),
            0
        );
        assert_eq!(
            runtime.apply_velocity_commands(0, 2, vec![99], vec![1.0, 0.0, 0.0], 5.0),
            0
        );
        assert_eq!(runtime.velocities(), vec![1.0, 0.0, 0.0]);
    }

    #[test]
    fn fixed_step_partitioning_produces_the_same_state_and_fingerprint() {
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
        assert_eq!(
            one_batch.state_fingerprint(),
            split_batches.state_fingerprint()
        );
    }

    #[test]
    fn fingerprint_changes_when_authoritative_state_changes() {
        let mut runtime = DefendRuntime::new();
        spawn_linear(&mut runtime, 0.0, 1.0);
        let before = runtime.state_fingerprint();

        runtime.step_fixed(1);

        assert_ne!(before, runtime.state_fingerprint());
    }
}
