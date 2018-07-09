import { Scene, Material } from "babylonjs";
import { newWave } from "../main/sound";
import {
  enemyGlobals,
  economyGlobals,
  mapGlobals,
  materialGlobals
} from "../main/globalVariables";
import { waves } from "./waves";
import { updateEconomy } from "../gui/updateEconomy";
import { enemyGenerator } from "./Enemy";

const enemyWaves = (scene: Scene) => {
  let deltaTime = Date.now() - enemyGlobals.generationRate;

  scene.registerAfterRender(() => {
    if (
      Date.now() - deltaTime > enemyGlobals.generationRate &&
      enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
      economyGlobals.restartMessage === false
    ) {
      deltaTime = Date.now() - enemyGlobals.generationRate;
      newWave(); // sound for new wave

      // Color change on new wave
      // mapGlobals.atmosphereMesh.material = materialGlobals.hitMaterial as Material;
      // setTimeout(() => {
      //   mapGlobals.atmosphereMesh.material = materialGlobals.skyMaterial as Material;
      // }, 20);

      enemyGlobals.currentWave += 1;

      updateEconomy(scene); // update GUI to reflect new wave number

      // Generate enemies for the wave

      enemyGenerator(scene, waves[enemyGlobals.currentWave][0], 1);

      enemyGenerator(scene, waves[enemyGlobals.currentWave][1], 2);

      enemyGenerator(scene, waves[enemyGlobals.currentWave][2], 3);

      setTimeout(() => {
        enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
        // if (economyGlobals.restartMessage === true) {
        //   scene.unregisterAfterRender(wave(scene, deltaTime));
        // }
      }, 1);
    }
  });
};

export { enemyWaves };
