import { Scene, Vector3, Mesh, PhysicsEngine, Ray } from "babylonjs";
import fireProjectile from "../projectile/Projectile";
import {
  towerGlobals,
  enemyGlobals,
  mapGlobals
} from "../main/globalVariables";
import { rotateTurret, shotClearsTower } from "./Tower";
import { shoot } from "../main/sound";
import { TowerTurret } from "./towerBorn";
import { EnemySphere } from "../enemy/enemyBorn";

function trackSpheres(
  scene: Scene,
  tower: Mesh,
  towerTurret: TowerTurret,
  flash: Mesh,
  ray: Ray,
  level: number = 1 | 2 | 3,
  physicsEngine: PhysicsEngine
) {
  let deltaTime = Date.now();
  tower.registerAfterRender(() => {
    if (enemyGlobals.allEnemies.length > 0) {
      const enemyDistances = [] as any[];
      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const enemy = enemyGlobals.allEnemies[index] as EnemySphere;
        if (
          enemy.position.y <= towerGlobals.range * level &&
          enemy.position.y > 0 &&
          enemy.hitPoints >= enemyGlobals.deadHitPoints &&
          Vector3.Distance(towerTurret.position, enemy.position) <=
            towerGlobals.range * level
        ) {
          enemyDistances.push([
            Vector3.Distance(towerTurret.position, enemy.position),
            enemy
          ]);
        }
      }
      if (enemyDistances.length > 0) {
        const nearestEnemy = enemyDistances.sort()[0][1] as EnemySphere;
        rotateTurret(nearestEnemy, towerTurret);
        if (
          Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
          towerGlobals.shoot &&
          shotClearsTower(scene, ray, nearestEnemy)
        ) {
          deltaTime = Date.now();
          setTimeout(() => {
            flash.setEnabled(false);
          }, 20);
          flash.setEnabled(true);

          shoot(flash, level);

          setTimeout(() => {
            fireProjectile(
              scene,
              towerTurret,
              level,
              nearestEnemy,
              physicsEngine
            );
          }, 1);
        }
      }
    }
  });
}

export { trackSpheres };
