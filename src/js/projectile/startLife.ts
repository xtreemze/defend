import { destroyProjectile } from "./destroyProjectile";
import { hitEffect } from "./hitEffect";
import {
  Mesh,
  Scene,
  Vector3,
  Material,
  PhysicsImpostor,
  PhysicsEngine
} from "babylonjs";
import {
  projectileGlobals,
  mapGlobals,
  materialGlobals
} from "../main/globalVariables";
import { destroyOnCollide, impulsePhys } from "./Projectile";
import { EnemySphere } from "../enemy/enemyBorn";
import { TowerTurret } from "../tower/towerBorn";

interface LiveProjectile extends Mesh {
  hitPoints: number;
}

export function startLife(
  scene: Scene,
  originMesh: TowerTurret,
  level: number = 1 | 2 | 3,
  projectile: LiveProjectile,
  nearestEnemy: EnemySphere,
  physicsEngine: PhysicsEngine
) {
  const projectileMaterial = materialGlobals.projectileMaterial;
  const forwardLocal = new Vector3(0, 0, 5);
  const space = originMesh.getDirection(forwardLocal) as Vector3;
  projectile.position = originMesh.position.subtract(space) as Vector3;

  projectile.material = projectileMaterial as Material;
  // For Physics
  projectile.physicsImpostor = new PhysicsImpostor(
    projectile,
    PhysicsImpostor.BoxImpostor,
    {
      mass: projectileGlobals.mass * level,
      restitution: 0,
      friction: 0
    },
    scene
  ) as PhysicsImpostor;

  hitEffect(scene, projectile, nearestEnemy); // Detects collissions with enemies and applies hitpoint effects

  mapGlobals.allImpostors.unshift(projectile.physicsImpostor);
  const clonedRotation = originMesh.rotation.clone();
  projectile.rotation.copyFrom(clonedRotation);

  const projectileLifetime = setTimeout(() => {
    destroyProjectile(projectile, physicsEngine);
  }, projectileGlobals.lifeTime);

  destroyOnCollide(scene, projectile, physicsEngine, projectileLifetime); // Detects collissions with enemies

  impulsePhys(originMesh, projectile, level); // Moves the projectile with physics
}

export { LiveProjectile };
