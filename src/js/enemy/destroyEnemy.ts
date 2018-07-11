import { EnemySphere } from "./enemyBorn";
import { Tags, Scene } from "babylonjs";
import { enemyGlobals } from "../main/globalVariables";
import { enemyExplode } from "./../main/sound";

function destroyEnemy(sphereMesh: EnemySphere, scene: Scene, level?: number) {
  enemyGlobals.occupiedSpaces.pop();
  // sound
  if (level) {
    enemyExplode(sphereMesh, level);
  }
  delete sphereMesh.hitPoints;
  if (sphereMesh.physicsImpostor !== null) {
    sphereMesh.physicsImpostor.dispose();
  }
  Tags.RemoveTagsFrom(sphereMesh, "enemy");
  setTimeout(() => {
    sphereMesh.dispose();
    enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
  }, 1);
}

export { destroyEnemy };
