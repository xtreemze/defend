import { startLife, LiveProjectile } from "./startLife";


import {
  Scene,
  Vector3,
  MeshBuilder,
  PhysicsEngine
} from "babylonjs";
import { projectileGlobals } from "../main/globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";
import { TowerTurret } from "../tower/towerBorn";

class Projectile {
  constructor(
    originMesh: TowerTurret,
    scene: Scene,
    level: number = 1 | 2 | 3,
    nearestEnemy: EnemySphere,
    physicsEngine: PhysicsEngine
  ) {
    const name = `projectile${level}` as string;

    const projectile = MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as LiveProjectile;

    projectile.isPickable = false;
    projectile.convertToUnIndexedMesh();

    projectile.hitPoints = (level + level) * projectileGlobals.baseHitPoints;

    startLife(
      scene,
      originMesh,
      level,
      projectile,
      nearestEnemy,
      physicsEngine
    );
  }
}

export function impulsePhys(
  originMesh: TowerTurret,
  projectile: LiveProjectile,
  level: number = 1 | 2 | 3
) {
  const forwardLocal = new Vector3(
    0,
    0,
    projectileGlobals.speed * level * -1
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
  physicsEngine: PhysicsEngine
) {
  new Projectile(originMesh, scene, level, nearestEnemy, physicsEngine);
}
