use bevy_app::{App, Update};
use bevy_ecs::prelude::*;
use bevy_math::Vec3;
use wasm_bindgen::prelude::*;

#[derive(Component)]
struct Position(Vec3);

#[derive(Component)]
struct Velocity(Vec3);

#[derive(Resource)]
struct StepDelta(f32);

fn integrate(mut bodies: Query<(&mut Position, &Velocity)>, delta: Res<StepDelta>) {
    for (mut position, velocity) in &mut bodies {
        position.0 += velocity.0 * delta.0;
    }
}

/// Headless Bevy ECS runtime used only by the Babylon/Bevy comparative lab.
/// Babylon owns browser rendering; this runtime owns semantic body state.
#[wasm_bindgen]
pub struct DefendRuntime {
    app: App,
}

#[wasm_bindgen]
impl DefendRuntime {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut app = App::new();
        app.insert_resource(StepDelta(0.0));
        app.add_systems(Update, integrate);
        Self { app }
    }

    pub fn spawn_body(
        &mut self,
        x: f32,
        y: f32,
        z: f32,
        velocity_x: f32,
        velocity_y: f32,
        velocity_z: f32,
    ) {
        self.app.world_mut().spawn((
            Position(Vec3::new(x, y, z)),
            Velocity(Vec3::new(velocity_x, velocity_y, velocity_z)),
        ));
    }

    pub fn step(&mut self, delta_seconds: f32) {
        self.app
            .world_mut()
            .resource_mut::<StepDelta>()
            .0 = delta_seconds.clamp(0.0, 1.0 / 15.0);
        self.app.update();
    }

    /// Flat xyz triples keep the first interoperability fixture deliberately
    /// transparent. A binary/shared-memory protocol is only justified after
    /// profiling shows this copy boundary to be material.
    pub fn positions(&mut self) -> Vec<f32> {
        let world = self.app.world_mut();
        let mut query = world.query::<&Position>();
        let mut positions = Vec::with_capacity(query.iter(world).len() * 3);

        for position in query.iter(world) {
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
