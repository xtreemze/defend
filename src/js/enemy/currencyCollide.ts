import { currencyMeshColor } from "./currencyMeshColor";

import { Scene } from "babylonjs";
import { rampLight } from "./rampLight";
import { economyGlobals, mapGlobals } from "../main/globalVariables";
import { damageCurrency } from "../main/sound";
import { EnemySphere } from "./enemyBorn";

function currencyCollide(enemy: EnemySphere, scene: Scene) {
	if (
		enemy.physicsImpostor !== null &&
    economyGlobals.currencyMesh.physicsImpostor !== null
	) {
		enemy.physicsImpostor.registerOnPhysicsCollide(
			economyGlobals.currencyMesh.physicsImpostor,
			() => {
				if (
					typeof enemy.hitPoints === "number" &&
          typeof economyGlobals.currentBalance === "number" &&
          !isNaN(enemy.hitPoints) &&
          enemy.hitPoints > 0 &&
          economyGlobals.currentBalance > 0
				) {
					economyGlobals.currentBalance -= enemy.hitPoints;

					// color
					currencyMeshColor();

					rampLight(scene, mapGlobals.skyLight, 0.6, mapGlobals.lightIntensity);
					rampLight(
						scene,
						mapGlobals.upLight,
						0.6 * 2,
						mapGlobals.lightIntensity * 2
					);

					// sound
					damageCurrency(enemy);

					enemy.hitPoints = 0;
				}
			}
		);
	}
}
export { currencyCollide };
