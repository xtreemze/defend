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
        if (
          typeof enemy.hitPoints === "number" &&
          typeof projectile.hitPoints === "number"
        ) {
          // hitpoints
          enemy.hitPoints -= projectile.hitPoints;
          economyGlobals.currentBalance +=
            projectile.hitPoints * economyGlobals.energyRecoveryRatio;

          if (economyGlobals.currentBalance > economyGlobals.maxBalance) {
            economyGlobals.currentBalance = economyGlobals.maxBalance;
          }
          updateEconomy(scene);
        }

        // color
        setTimeout(() => {
          enemy.material = materialGlobals.hitMaterial;
        }, 20);
        enemy.material = materialGlobals.damagedMaterial;

        // sound
        damage(enemy);
      }
    );
  }
}
