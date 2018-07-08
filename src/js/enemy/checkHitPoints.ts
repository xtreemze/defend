import { Scene, Vector3, Mesh } from "babylonjs";
import { enemyGlobals, mapGlobals } from "../main/globalVariables";
import { fragment, destroyEnemy } from "./Enemy";

function checkHitPoints(
  scene: Scene,
  sphereMesh: Mesh,
  level: number = 1 | 2 | 3,
  hitPointsMeter: Mesh
) {
  if (
    (sphereMesh.physicsImpostor !== null &&
      //@ts-ignore
      sphereMesh.hitPoints <= 0) ||
    (sphereMesh.position.y < 0 && sphereMesh.physicsImpostor !== null)
  ) {
    const enemyPosition = sphereMesh.position.clone() as Vector3;
    const enemyRotation = sphereMesh.rotation.clone() as Vector3;
    const enemyLinearVelocity = sphereMesh.physicsImpostor.getLinearVelocity() as Vector3;
    const enemyAngularVelocity = sphereMesh.physicsImpostor.getAngularVelocity() as Vector3;
    if (
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit &&
      sphereMesh.position.y > 0
    ) {
      setTimeout(() => {
        fragment(
          level,
          enemyPosition,
          enemyRotation,
          enemyLinearVelocity,
          enemyAngularVelocity
        );
      }, 1);
    }
    destroyEnemy(sphereMesh, scene);
  } else {
    //@ts-ignore
    sphereMesh.hitPoints -= enemyGlobals.decayRate * level;
    const scaleRate =
      //@ts-ignore
      1 / ((level * enemyGlobals.baseHitPoints) / sphereMesh.hitPoints);
    //@ts-ignore
    hitPointsMeter.scaling = new BABYLON.Vector3(
      scaleRate,
      scaleRate,
      scaleRate
    );
  }
}
export { checkHitPoints };
