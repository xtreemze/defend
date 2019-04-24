import { currencyMeshColor } from "./currencyMeshColor";

import { economyGlobals } from "../main/globalVariables";
import { damageCurrency } from "../main/sound";
import { EnemySphere } from "./enemyBorn";
import { Vector3, Scene } from "babylonjs";
import { fragment } from "./Enemy";
import { destroyEnemy } from "./destroyEnemy";


function currencyCollide(enemy: EnemySphere, scene: Scene, level: number) {
	if (
		enemy.physicsImpostor !== null &&
		economyGlobals.currencyMesh.physicsImpostor !== null && level > 0
	) {
		enemy.physicsImpostor.registerOnPhysicsCollide(
			economyGlobals.currencyMesh.physicsImpostor,
			() => {
				if (
					!isNaN(enemy.hitPoints) &&
					enemy.hitPoints > 0 &&
					economyGlobals.currentBalance > 0 &&
					enemy.physicsImpostor !== null
				) {
					// color
					currencyMeshColor();
					economyGlobals.currentBalance -= enemy.hitPoints / 2;

					if (
						enemy.physicsImpostor !== null
						) {
							const enemyPosition = enemy.position.clone() as Vector3;
							const enemyRotation = enemy.rotation.clone() as Vector3;
							const enemyLinearVelocity = enemy.physicsImpostor.getLinearVelocity() as Vector3;
							const enemyAngularVelocity = enemy.physicsImpostor.getAngularVelocity() as Vector3;

							fragment(
								level,
								enemyPosition,
								enemyRotation,
								enemyLinearVelocity,
								enemyAngularVelocity,
								true
								);

								// enemy.hitPoints = 0;
								destroyEnemy(enemy, scene, level);


					}
				}
			}
		);
	}
}
export { currencyCollide };
