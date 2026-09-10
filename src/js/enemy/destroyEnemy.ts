import { EnemySphere } from "./enemyBorn";
import { Tags, Scene } from "../utility/babylonOptimized";
import { enemyGlobals } from "../main/globalVariables";
import { enemyExplode } from "./../main/sound";
import { getGlobalImpostorLifecycleManager } from "../utility/impostorLifecycleManager";

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
		// Use batched disposal to reduce GC spikes
		if (sphereMesh.physicsImpostor !== null) {
			getGlobalImpostorLifecycleManager().queueDisposal(sphereMesh.physicsImpostor);
		}
		sphereMesh.dispose();
		if (scene) {
			enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
		}
	}, 100);
}

export { destroyEnemy };
