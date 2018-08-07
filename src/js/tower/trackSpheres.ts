import { Scene, Vector3, Mesh, PhysicsEngine, Ray } from "babylonjs";
import fireProjectile from "../projectile/Projectile";
import { towerGlobals, enemyGlobals } from "../main/globalVariables";
import { rotateTurret } from "./Tower";
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
  tower.registerBeforeRender(async () => {
    const enemyNumber = enemyGlobals.allEnemies.length;
    if (enemyNumber > 0) {
      const enemyDistances = new Array() as any[];
      for (let index = 0; index < enemyNumber; index++) {
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
      await enemyDistances.sort();
      if (enemyDistances.length > 0) {
        const nearestEnemy = enemyDistances[0][1] as EnemySphere;
        const clonedRotation = (await rotateTurret(
          nearestEnemy,
          towerTurret,
          level
        )) as Vector3; // track the enemy spheres
        if (
          Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
          towerGlobals.shoot
          //  &&           shotClearsTower(scene, ray, nearestEnemy)
        ) {
          deltaTime = Date.now();

          shoot(flash, level);

          setTimeout(() => {
            flash.visibility = 0;
          }, 15);
          flash.visibility = 1;
          setTimeout(() => {
            fireProjectile(
              scene,
              towerTurret,
              level,
              nearestEnemy,
              physicsEngine,
              clonedRotation
            );
          }, 100);
        }
      }
    }
  });
}

export { trackSpheres };
