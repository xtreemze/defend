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
  sphereMesh.setEnabled(false);
  delete sphereMesh.hitPoints;
  Tags.RemoveTagsFrom(sphereMesh, "enemy");
  setTimeout(() => {
    sphereMesh.dispose();
    if (sphereMesh.physicsImpostor !== null) {
      sphereMesh.physicsImpostor.dispose();
    }
    enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
  }, 10);
}

export { destroyEnemy };
