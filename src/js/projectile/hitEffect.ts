import { economyGlobals, materialGlobals } from "../main/globalVariables";
import { damage } from "../main/sound";
import { EnemySphere } from "../enemy/enemyBorn";
import {
	applyProjectileEnergyRecovery,
	projectileEnergyRecovery
} from "../gameplay/economy";
import {
	energyFlowPrototypeEnabled,
	spawnRecoveredEnergy
} from "../experiments/energyFlowPrototype";
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

					if (energyFlowPrototypeEnabled()) {
						spawnRecoveredEnergy(
							projectile.getScene(),
							enemy.getAbsolutePosition(),
							projectileEnergyRecovery(
								projectile.hitPoints,
								economyGlobals.energyRecoveryRatio
							)
						);
					} else {
						economyGlobals.currentBalance = applyProjectileEnergyRecovery(
							economyGlobals.currentBalance,
							projectile.hitPoints,
							economyGlobals.energyRecoveryRatio,
							economyGlobals.maxBalance
						);
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
