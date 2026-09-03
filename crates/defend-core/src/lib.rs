#![forbid(unsafe_code)]

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn projectile_hit_points(level: u32, base_hit_points: f64) -> f64 {
    level.pow(3) as f64 * base_hit_points
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn projectile_impulse(level: u32, base_speed: f64) -> f64 {
    level.pow(3) as f64 * base_speed
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn projectile_mass(level: u32, base_mass: f64) -> f64 {
    level.pow(2) as f64 * base_mass
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn tower_shot_interval(level: u32, base_rate_of_fire: f64) -> f64 {
    level.pow(3) as f64 * base_rate_of_fire
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn enemy_diameter(level: u32) -> f64 {
    level.pow(2) as f64 + 5.0
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn enemy_hit_points(level: u32, base_hit_points: f64) -> f64 {
    level.pow(2) as f64 * base_hit_points + level as f64 * 440.0
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn enemy_mass(level: u32, base_mass: f64) -> f64 {
    level.pow(2) as f64 * base_mass
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn enemy_move_impulse(level: u32, base_speed: f64) -> f64 {
    level.pow(2) as f64 * base_speed
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn enemy_restitution(level: u32, base_restitution: f64) -> f64 {
    base_restitution - level.pow(2) as f64 / 10.0
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn recovered_energy(
    current_balance: f64,
    projectile_hit_points: f64,
    recovery_ratio: f64,
    max_balance: f64,
) -> f64 {
    (current_balance + projectile_hit_points * recovery_ratio).min(max_balance)
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn bank_damage(enemy_hit_points: f64) -> f64 {
    enemy_hit_points / 2.0
}

/// Kinetic energy normal to a contact.
///
/// `normal_speed` may be signed or already absolute. Using its magnitude keeps
/// this shared scalar aligned with the TypeScript acoustic and terrain models,
/// so physics backends can forward one signed contact-normal velocity without
/// each downstream subsystem silently inventing a different convention.
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub fn impact_energy(effective_mass: f64, normal_speed: f64) -> f64 {
    0.5 * effective_mass.max(0.0) * normal_speed.abs().powi(2)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn assert_close(actual: f64, expected: f64) {
        let error = (actual - expected).abs();
        assert!(
            error < 1e-9,
            "expected {expected}, got {actual} (error {error})"
        );
    }

    #[test]
    fn projectile_tiers_match_legacy_contract() {
        assert_eq!(projectile_hit_points(2, 220.0), 1760.0);
        assert_eq!(projectile_hit_points(3, 220.0), 5940.0);
        assert_eq!(projectile_impulse(2, 3320.0), 26560.0);
        assert_eq!(projectile_impulse(3, 3320.0), 89640.0);
        assert_eq!(projectile_mass(2, 30.0), 120.0);
        assert_eq!(projectile_mass(3, 30.0), 270.0);
        assert_eq!(tower_shot_interval(2, 26.0), 208.0);
        assert_eq!(tower_shot_interval(3, 26.0), 702.0);
    }

    #[test]
    fn enemy_tiers_match_legacy_contract() {
        assert_eq!(enemy_diameter(1), 6.0);
        assert_eq!(enemy_diameter(2), 9.0);
        assert_eq!(enemy_diameter(3), 14.0);

        assert_eq!(enemy_hit_points(1, 15000.0), 15440.0);
        assert_eq!(enemy_hit_points(2, 15000.0), 60880.0);
        assert_eq!(enemy_hit_points(3, 15000.0), 136320.0);

        assert_eq!(enemy_mass(1, 5400.0), 5400.0);
        assert_eq!(enemy_mass(2, 5400.0), 21600.0);
        assert_eq!(enemy_mass(3, 5400.0), 48600.0);

        assert_eq!(enemy_move_impulse(1, 7400.0), 7400.0);
        assert_eq!(enemy_move_impulse(2, 7400.0), 29600.0);
        assert_eq!(enemy_move_impulse(3, 7400.0), 66600.0);

        assert_close(enemy_restitution(1, 0.08), -0.02);
        assert_close(enemy_restitution(2, 0.08), -0.32);
        assert_close(enemy_restitution(3, 0.08), -0.82);
    }

    #[test]
    fn economy_matches_legacy_contract() {
        assert_eq!(recovered_energy(1000.0, 1760.0, 0.14, 30000.0), 1246.4);
        assert_eq!(recovered_energy(29900.0, 1760.0, 0.14, 30000.0), 30000.0);
        assert_eq!(bank_damage(15440.0), 7720.0);
    }

    #[test]
    fn acoustic_impact_energy_is_physics_derived_and_sign_invariant() {
        assert_eq!(impact_energy(120.0, 10.0), 6000.0);
        assert_eq!(impact_energy(120.0, -10.0), 6000.0);
        assert_eq!(impact_energy(-1.0, 10.0), 0.0);
    }
}
