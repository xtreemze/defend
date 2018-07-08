import { startLife } from "./startLife";

import { destroyProjectile } from "./destroyProjectile";

import {
  Mesh,
  Scene,
  Vector3,
  PhysicsImpostor,
  MeshBuilder,
  PhysicsEngine
} from "babylonjs";
import { projectileGlobals, mapGlobals } from "../main/globalVariables";
import { explosion } from "../enemy/explodeParticle";

class Projectile {
  constructor(
    originMesh: Mesh,
    scene: Scene,
    level: number = 1 | 2 | 3,
    nearestEnemy: Mesh,
    physicsEngine: PhysicsEngine
  ) {
    const name = `projectile${level}` as string;

    const projectile = MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as Mesh;
    projectile.isPickable = false;
    projectile.convertToUnIndexedMesh();

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

export function destroyOnCollide(
  scene: Scene,
  projectile: Mesh,
  physicsEngine: PhysicsEngine
) {
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as PhysicsImpostor[],
      (collider: PhysicsImpostor) => {
        destroyProjectile(projectile, physicsEngine);
        explosion(scene, collider.getObjectCenter());
      }
    );
  }
}

export function impulsePhys(
  originMesh: Mesh,
  projectile: Mesh,
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
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine
) {
  new Projectile(originMesh, scene, level, nearestEnemy, physicsEngine);
}
