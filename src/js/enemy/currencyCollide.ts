import { Mesh, Scene, Material } from "babylonjs";
import { updateEconomy } from "../gui/updateEconomy";
import {
  mapGlobals,
  economyGlobals,
  materialGlobals,
  enemyGlobals
} from "../main/globalVariables";
import { damageCurrency } from "../main/sound";

function currencyCollide(enemy: Mesh, scene: Scene) {
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
          enemy.hitPoints > 0 &&
          economyGlobals.currentBalance > 0
        ) {
          economyGlobals.currentBalance -= enemy.hitPoints;

          updateEconomy(scene);

          enemy.hitPoints = 0;
          economyGlobals.currencyMesh.material = materialGlobals.damagedMaterial as Material;
          setTimeout(() => {
            economyGlobals.currencyMesh.material = materialGlobals.hitMaterial as Material;
          }, 20);

          // sound
          if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
            setTimeout(() => {
              mapGlobals.simultaneousSounds -= 1;
            }, mapGlobals.soundDelay);

            mapGlobals.simultaneousSounds += 1;

            if (mapGlobals.soundOn) {
              damageCurrency(economyGlobals.currencyMesh);
            }
          }
        }
      }
    );
  }
}

export { currencyCollide };
