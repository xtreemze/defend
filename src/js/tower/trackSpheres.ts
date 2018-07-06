import {
  Scene,
  Vector3,
  Mesh,
  PhysicsImpostor,
  PhysicsEngine
} from "babylonjs";
import fireProjectile from "../projectile/Projectile";
import {
  towerGlobals,
  enemyGlobals,
  mapGlobals
} from "../main/globalVariables";
import { rotateTurret, shotClearsTower } from "./Tower";
function trackSpheres(
  scene: Scene,
  tower: Mesh,
  towerTurret: Mesh,
  flash: Mesh,
  ray: any,
  level: number = 1 | 2 | 3,
  physicsEngine: PhysicsEngine
) {
  let deltaTime = Date.now();
  tower.registerBeforeRender(() => {
    if (
      enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit
    ) {
      const enemyDistances = [] as any;
      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const enemy = enemyGlobals.allEnemies[index];
        if (
          enemy.position.y <= towerGlobals.range * 3 &&
          enemy.position.y > 0 &&
          //@ts-ignore
          enemy.hitPoints >= enemyGlobals.deadHitPoints &&
          Vector3.Distance(towerTurret.position, enemy.position) <=
            towerGlobals.range * 3
        ) {
          enemyDistances.push([
            Vector3.Distance(towerTurret.position, enemy.position),
            enemy
          ]);
        }
      }
      if (enemyDistances.length > 0) {
        const nearestEnemy = enemyDistances.sort()[0][1] as Mesh;
        const nearestEnemyImpostor = nearestEnemy.getPhysicsImpostor() as PhysicsImpostor;
        rotateTurret(nearestEnemy, towerTurret);
        if (
          Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
          towerGlobals.shoot &&
          shotClearsTower(scene, ray, nearestEnemy)
        ) {
          deltaTime = Date.now();
          setTimeout(() => {
            flash.setEnabled(false);
          }, 30);
          flash.setEnabled(true);
          setTimeout(() => {
            fireProjectile(
              scene,
              towerTurret,
              level,
              nearestEnemy,
              physicsEngine,
              nearestEnemyImpostor
            );
          }, 1);
        }
      }
    }
  });
}

export { trackSpheres };