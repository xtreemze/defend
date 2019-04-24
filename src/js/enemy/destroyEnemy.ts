import { EnemySphere } from "./enemyBorn";
import { Tags, Scene } from "babylonjs";
import { enemyGlobals } from "../main/globalVariables";
import { enemyExplode } from "./../main/sound";

function destroyEnemy(sphereMesh: EnemySphere, scene?: Scene, level?: number) {
	// sound
	if (level) {
		enemyExplode(sphereMesh, level);
	}
	enemyGlobals.occupiedSpaces.pop();
	sphereMesh.setEnabled(false);
	delete sphereMesh.hitPoints;
	setTimeout(() => {
		Tags.RemoveTagsFrom(sphereMesh, "enemy");
		if (sphereMesh.physicsImpostor !== null) {
			sphereMesh.physicsImpostor.dispose();
		}
		sphereMesh.dispose();
		if (scene) {

			enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
		}
	}, 100);
}

export { destroyEnemy };
