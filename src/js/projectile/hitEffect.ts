import { economyGlobals, materialGlobals } from "../main/globalVariables";
import { damage } from "../main/sound";
import { EnemySphere } from "../enemy/enemyBorn";
import { LiveProjectileInstance } from "./startLife";

export function hitEffect(
	projectile: LiveProjectileInstance,
	enemy: EnemySphere
) {
	if (
		projectile.physicsImpostor !== null &&
		enemy.physicsImpostor !== null &&
		typeof projectile.hitPoints === "number" &&
		typeof enemy.hitPoints === "number" &&
		typeof economyGlobals.currentBalance === "number" &&
		!isNaN(projectile.hitPoints)
	) {
		projectile.physicsImpostor.registerOnPhysicsCollide(
			enemy.physicsImpostor,
			() => {

				// sound
				damage(enemy);

				if (
					typeof enemy.hitPoints === "number" &&
					typeof projectile.hitPoints === "number"
				) {
					// hitpoints
					enemy.hitPoints -= projectile.hitPoints;
					economyGlobals.currentBalance +=
						projectile.hitPoints * economyGlobals.energyRecoveryRatio;

					if (economyGlobals.currentBalance > economyGlobals.maxBalance) {
						economyGlobals.currentBalance = economyGlobals.maxBalance;
					}
				}
				if (enemy.material === materialGlobals.hitMaterial) {
					// color
					setTimeout(() => {
						enemy.material = materialGlobals.hitMaterial;
					}, 64);
					enemy.material = materialGlobals.damagedMaterial;
				}


			}
		);
	}
}
