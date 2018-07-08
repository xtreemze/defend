import { Mesh, Scene } from "babylonjs";
import {
  mapGlobals,
  economyGlobals,
  materialGlobals
} from "../main/globalVariables";
import { damage } from "../main/sound";
import { updateEconomy } from "../gui/updateEconomy";
export function hitEffect(scene: Scene, projectile: Mesh, enemy: Mesh) {
  if (projectile.physicsImpostor !== null && enemy.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      enemy.physicsImpostor,
      () => {
        // hitpoints
        //@ts-ignore
        enemy.hitPoints -= projectile.hitPoints;
        enemy.material = materialGlobals.damagedMaterial;

        //@ts-ignore
        economyGlobals.currentBalance += projectile.hitPoints;

        // color
        updateEconomy(scene);
        setTimeout(() => {
          enemy.material = materialGlobals.hitMaterial;
        }, 20);

        // sound
        if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
          setTimeout(() => {
            mapGlobals.simultaneousSounds -= 1;
          }, mapGlobals.soundDelay);
          mapGlobals.simultaneousSounds += 1;
          if (mapGlobals.soundOn) damage(enemy);
        }
      }
    );
  }
}
