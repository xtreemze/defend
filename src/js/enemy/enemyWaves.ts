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
  console.log("happen");

  if (
    Date.now() - deltaTime > enemyGlobals.generationRate &&
    enemyGlobals.allEnemies.length <= enemyGlobals.limit
  ) {
    deltaTime = Date.now();
    newWave(); // sound for new wave

    enemyGlobals.currentWave += 1;

    updateEconomy(scene); // update GUI to reflect new wave number

    // Generate enemies for the wave
    //@ts-ignore
    enemyGenerator(scene, waves[enemyGlobals.currentWave][0], 1);
    //@ts-ignore
    enemyGenerator(scene, waves[enemyGlobals.currentWave][1], 2);
    //@ts-ignore
    enemyGenerator(scene, waves[enemyGlobals.currentWave][2], 3);

    setTimeout(() => {
      console.log("enemyGlobals.limit", enemyGlobals.allEnemies);
      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
      if (economyGlobals.restartMessage === true) {
        scene.unregisterAfterRender(wave(scene, deltaTime));
      }
    }, 2);
  }
};

export { enemyWaves };
