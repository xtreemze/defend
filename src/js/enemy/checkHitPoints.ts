import { Scene, Vector3, Mesh } from "babylonjs";
import { enemyGlobals } from "../main/globalVariables";
import { fragment, destroyEnemy } from "./Enemy";
import { EnemySphere } from "./enemyBorn";

function checkHitPoints(
  scene: Scene,
  sphereMesh: EnemySphere,
  level: number = 1 | 2 | 3,
  hitPointsMeter: Mesh
) {
  if (
    sphereMesh.physicsImpostor !== null &&
    (sphereMesh.hitPoints <= enemyGlobals.deadHitPoints ||
      sphereMesh.position.y < 0)
  ) {
    const enemyPosition = sphereMesh.position.clone() as Vector3;
    const enemyRotation = sphereMesh.rotation.clone() as Vector3;
    const enemyLinearVelocity = sphereMesh.physicsImpostor.getLinearVelocity() as Vector3;
    const enemyAngularVelocity = sphereMesh.physicsImpostor.getAngularVelocity() as Vector3;

    setTimeout(() => {
      fragment(
        level,
        enemyPosition,
        enemyRotation,
        enemyLinearVelocity,
        enemyAngularVelocity
      );
    }, 1);

    destroyEnemy(sphereMesh, scene);
  } else {
    sphereMesh.hitPoints -= enemyGlobals.decayRate * level;
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
