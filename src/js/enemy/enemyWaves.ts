
import { Scene } from "babylonjs";
import { newWave } from "../main/sound";
import {
	enemyGlobals,
	economyGlobals,
	//   mapGlobals
} from "../main/globalVariables";
import { waves } from "./waves";
import { enemyGenerator } from "./Enemy";
import { destroyEnemy } from "./destroyEnemy";

const newEnemyWave = (scene: Scene) => {
	let deltaTime = Date.now() - enemyGlobals.generationRate;

	const checkEnemyY = setInterval(() => {
		if (economyGlobals.restartMessage === false && enemyGlobals.allEnemies.length > 0) {
			enemyGlobals.allEnemies.forEach((enemy: any) => {
				if (enemy.position.y < -5) {
					enemy.hitPoints = 0;
						destroyEnemy(enemy, scene);

						enemy.dispose();
				}
			});
		} else if (economyGlobals.restartMessage === true) {
			clearInterval(checkEnemyY);
		}
	}, 5000);
	if (economyGlobals.restartMessage === false) {
		scene.registerAfterRender(() => enemyGeneration(deltaTime, scene));
	}
};

const enemyGeneration = (deltaTime: number, scene: Scene): void => {
	const now = Date.now()
	if (
		now - deltaTime > enemyGlobals.generationRate &&
		enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
		economyGlobals.restartMessage === false &&
		enemyGlobals.currentWave < waves.length
	) {
		deltaTime = now - enemyGlobals.generationRate;

			newWave(); // sound for new wave




		// Generate enemies for the wave

		enemyGenerator(
			scene,
			waves[enemyGlobals.currentWave][0],
			1,
			waves[enemyGlobals.currentWave][3]
		);

		enemyGenerator(
			scene,
			waves[enemyGlobals.currentWave][1],
			2,
			waves[enemyGlobals.currentWave][3]
		);

		enemyGenerator(
			scene,
			waves[enemyGlobals.currentWave][2],
			3,
			waves[enemyGlobals.currentWave][3]
		);

		enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");

		if (enemyGlobals.currentWave >= waves.length) {
			scene.unregisterAfterRender(() => enemyGeneration(deltaTime, scene));
		}
		localStorage.setItem("currentLevel", `${enemyGlobals.currentWave}`);
		enemyGlobals.currentWave += 1;

		if (enemyGlobals.currentWave > economyGlobals.bestLevel) {
			economyGlobals.bestTime = Date.now() - economyGlobals.startTime;
			economyGlobals.bestLevel = enemyGlobals.currentWave;
			localStorage.setItem("bestTime", `${economyGlobals.bestTime}`);
			localStorage.setItem("bestLevel", `${economyGlobals.bestLevel}`);
		}
	}
};

export { newEnemyWave };
