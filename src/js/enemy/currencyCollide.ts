import { Scene, Material } from "babylonjs";
import { rampLight } from "./rampLight";
import { updateEconomy } from "../gui/updateEconomy";
import {
  economyGlobals,
  materialGlobals,
  mapGlobals
} from "../main/globalVariables";
import { damageCurrency } from "../main/sound";
import { EnemySphere } from "./enemyBorn";

function currencyCollide(enemy: EnemySphere, scene: Scene) {
  if (
    enemy.physicsImpostor !== null &&
    economyGlobals.currencyMesh.physicsImpostor !== null
  ) {
    enemy.physicsImpostor.registerOnPhysicsCollide(
      economyGlobals.currencyMesh.physicsImpostor,
      () => {
        if (
          typeof enemy.hitPoints === "number" &&
          typeof economyGlobals.currentBalance === "number" &&
          !isNaN(enemy.hitPoints) &&
          enemy.hitPoints > 0 &&
          economyGlobals.currentBalance > 0
        ) {
          economyGlobals.currentBalance -= enemy.hitPoints;

          updateEconomy(scene);

          // color
          economyGlobals.currencyMesh.material = materialGlobals.damagedMaterial as Material;
          setTimeout(() => {
            economyGlobals.currencyMesh.material = materialGlobals.hitMaterial as Material;
          }, 10);

          rampLight(scene, mapGlobals.skyLight, 0.6, mapGlobals.lightIntensity);
          rampLight(
            scene,
            mapGlobals.upLight,
            0.6 * 2,
            mapGlobals.lightIntensity * 2
          );

          // sound
          damageCurrency(enemy);

          enemy.hitPoints = 0;
        }
      }
    );
  }
}

export { currencyCollide };
