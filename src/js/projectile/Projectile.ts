import { startLife, LiveProjectileInstance } from "./startLife";

import { Scene, Vector3, PhysicsEngine } from "babylonjs";
import { projectileGlobals } from "../main/globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";
import { TowerTurret } from "../tower/towerBorn";

class Projectile {
  constructor(
    originMesh: TowerTurret,
    scene: Scene,
    level: number = 1 | 2 | 3,
    nearestEnemy: EnemySphere,
    physicsEngine: PhysicsEngine,
    clonedRotation: Vector3
  ) {
    const name = `projectile${level}` as string;
    let projectile;
    switch (level) {
      case 2:
        projectile = projectileGlobals.projectileMeshL2.createInstance(
          name
        ) as LiveProjectileInstance;
        break;
      case 3:
        projectile = projectileGlobals.projectileMeshL3.createInstance(
          name
        ) as LiveProjectileInstance;

        break;

      default:
        break;
    }
    if (projectile !== undefined) {

      projectile.hitPoints = level * level * projectileGlobals.baseHitPoints;

      startLife(
        scene,
        originMesh,
        level,
        projectile,
        nearestEnemy,
        physicsEngine,
        clonedRotation
      );
    }
  }
}

export function impulsePhys(
  originMesh: TowerTurret,
  projectile: LiveProjectileInstance,
  level: number = 1 | 2 | 3
) {
  const forwardLocal = new Vector3(
    0,
    0,
    projectileGlobals.speed * (level * level) * -1
  ) as Vector3;
  const speed = originMesh.getDirection(forwardLocal) as Vector3;
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.applyImpulse(
      speed,
      projectile.getAbsolutePosition()
    );
  }
}

export default function fireProjectile(
  scene: Scene,
  originMesh: TowerTurret,
  level: number = 1 | 2 | 3,
  nearestEnemy: EnemySphere,
  physicsEngine: PhysicsEngine,
  clonedRotation: Vector3
) {
  new Projectile(originMesh, scene, level, nearestEnemy, physicsEngine, clonedRotation);
}
