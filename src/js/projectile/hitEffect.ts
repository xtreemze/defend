import { Scene } from "babylonjs";
import {
  mapGlobals,
  economyGlobals,
  materialGlobals
} from "../main/globalVariables";
import { damage } from "../main/sound";
import { updateEconomy } from "../gui/updateEconomy";
import { EnemySphere } from "../enemy/enemyBorn";
import { LiveProjectile } from "./startLife";

export function hitEffect(
  scene: Scene,
  projectile: LiveProjectile,
  enemy: EnemySphere
) {
  if (
    projectile.physicsImpostor !== null &&
    enemy.physicsImpostor !== null &&
    typeof projectile.hitPoints === "number" &&
    typeof enemy.hitPoints === "number" &&
    typeof economyGlobals.currentBalance === "number" &&
    !isNaN(projectile.hitPoints)
  ) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      enemy.physicsImpostor,
      () => {
        // hitpoints
        enemy.hitPoints -= projectile.hitPoints;
        setTimeout(() => {
          enemy.material = materialGlobals.hitMaterial;
        }, 20);
        enemy.material = materialGlobals.damagedMaterial;

        economyGlobals.currentBalance += projectile.hitPoints;

        // color
        updateEconomy(scene);

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