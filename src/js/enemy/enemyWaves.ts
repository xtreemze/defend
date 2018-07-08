import { Scene } from "babylonjs";
import { newWave } from "../main/sound";
import {
  enemyGlobals,
  mapGlobals,
  economyGlobals
} from "../main/globalVariables";
import { waves } from "./waves";
import { updateEconomy } from "../gui/updateEconomy";
import { enemyGenerator } from "./Enemy";

const enemyWaves = (scene: Scene) => {
  let deltaTime = Date.now() - enemyGlobals.generationRate;
  scene.registerAfterRender(wave(scene, deltaTime));
};

const wave = (scene: Scene, deltaTime: number): any => {
  if (
    Date.now() - deltaTime > enemyGlobals.generationRate &&
    enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
    mapGlobals.allImpostors.length <= mapGlobals.impostorLimit
  ) {
    enemyGlobals.currentWave += 1;

    newWave(); // sound for new wave
    updateEconomy(scene); // update GUI to reflect new wave number

    // Generate enemies for the wave
    setTimeout(() => {
      //@ts-ignore
      enemyGenerator(scene, waves[enemyGlobals.currentWave][0], 1);
      //@ts-ignore
      enemyGenerator(scene, waves[enemyGlobals.currentWave][1], 2);
      //@ts-ignore
      enemyGenerator(scene, waves[enemyGlobals.currentWave][2], 3);
      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
    }, 2);

    deltaTime = Date.now();
  }
  if (economyGlobals.restartMessage === true) {
    scene.unregisterAfterRender(wave(scene, deltaTime));
  }
};

export { enemyWaves };
