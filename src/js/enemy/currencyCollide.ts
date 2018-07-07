import { PhysicsImpostor, Mesh, Scene, Material } from "babylonjs";
import { updateEconomy } from "../gui/updateEconomy";
import {
  mapGlobals,
  economyGlobals,
  materialGlobals
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
        //@ts-ignore
        if (enemy.hitPoints > 0 && economyGlobals.currentBalance > 0) {
          //@ts-ignore
          economyGlobals.currentBalance -= enemy.hitPoints;

          //@ts-ignore
          enemy.hitPoints = 0;
          updateEconomy(scene);

          economyGlobals.currencyMesh.material = materialGlobals.damagedMaterial as Material;
          setTimeout(() => {
            economyGlobals.currencyMesh.material = materialGlobals.hitMaterial as Material;
          }, 30);

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
