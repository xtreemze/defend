import { Scene, Vector3, Mesh } from "babylonjs";
import { enemyGlobals } from "../main/globalVariables";
import { fragment } from "./Enemy";
import { destroyEnemy } from "./destroyEnemy";
import { EnemySphere } from "./enemyBorn";

function checkHitPoints(
	scene: Scene,
	sphereMesh: EnemySphere,
	level: number = 1 | 2 | 3,
	hitPointsMeter: Mesh
) {
	if (
		sphereMesh.physicsImpostor !== null &&
    sphereMesh.hitPoints <= enemyGlobals.deadHitPoints || sphereMesh.position.y < -12 * level && sphereMesh.physicsImpostor !== null
	) {

		const enemyPosition = sphereMesh.position.clone() as Vector3;
		const enemyRotation = sphereMesh.rotation.clone() as Vector3;
		const enemyLinearVelocity = sphereMesh.physicsImpostor.getLinearVelocity() as Vector3;
		const enemyAngularVelocity = sphereMesh.physicsImpostor.getAngularVelocity() as Vector3;

		fragment(
			level,
			enemyPosition,
			enemyRotation,
			enemyLinearVelocity,
			enemyAngularVelocity,
		);

		destroyEnemy(sphereMesh, scene, level);
	} else {
		sphereMesh.hitPoints -= enemyGlobals.decayRate;
		const scaleRate =
      1 / ((level * enemyGlobals.baseHitPoints) / sphereMesh.hitPoints);

		hitPointsMeter.scaling = new BABYLON.Vector3(
			scaleRate,
			scaleRate,
			scaleRate
		);
	}
}
export { checkHitPoints };
