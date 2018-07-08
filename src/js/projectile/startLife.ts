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

export function startLife(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  projectile: Mesh,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine
) {
  const projectileMaterial = materialGlobals.projectileMaterial;
  const forwardLocal = new Vector3(0, 0, 5);
  const space = originMesh.getDirection(forwardLocal) as Vector3;
  projectile.position = originMesh.position.subtract(space) as Vector3;
  //@ts-ignore
  projectile.hitPoints = (level +
    level * projectileGlobals.baseHitPoints) as number;
  projectile.material = projectileMaterial as Material;
  // For Physics
  projectile.physicsImpostor = new PhysicsImpostor(
    projectile,
    PhysicsImpostor.BoxImpostor,
    {
      mass: projectileGlobals.mass * level,
      restitution: projectileGlobals.restitution,
      friction: 1
    },
    scene
  ) as PhysicsImpostor;
  mapGlobals.allImpostors.unshift(projectile.physicsImpostor);
  const clonedRotation = originMesh.rotation.clone();
  projectile.rotation.copyFrom(clonedRotation);
  hitEffect(scene, projectile, nearestEnemy); // Detects collissions with enemies
  destroyOnCollide(scene, projectile, physicsEngine); // Detects collissions with enemies
  impulsePhys(originMesh, projectile, level); // Moves the projectile with physics
  setTimeout(() => {
    destroyProjectile(projectile, physicsEngine);
  }, projectileGlobals.lifeTime);
}
