import {
  Mesh,
  Scene,
  Vector3,
  Material,
  PhysicsImpostor,
  MeshBuilder,
  PhysicsEngine
} from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./globalVariables";
import { shoot, damage } from "./sound";
import { explosion } from "./explodeParticle";

class Projectile {
  constructor(originMesh: Mesh, scene: Scene, level: number = 1 | 2 | 3) {
    const name = `projectile${level}` as string;

    const projectile = MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as Mesh;

    this.startLife(scene, originMesh, level, projectile);
  }

  startLife(
    scene: Scene,
    originMesh: Mesh,
    level: number = 1 | 2 | 3,
    projectile: Mesh
  ) {
    const projectileMaterial = scene.getMaterialByID(
      "projectileMaterial"
    ) as Material;
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

    mapGlobals.allImpostors.unshift(projectile.physicsImpostor) as number;

    const clonedRotation = originMesh.rotation.clone();

    projectile.rotation.copyFrom(clonedRotation);

    this.intersectPhys(scene, projectile); // Detects collissions with enemies
    this.impulsePhys(originMesh, projectile, level); // Moves the projectile with physics

    if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
      setTimeout(() => {
        mapGlobals.projectileSounds -= 1;
      }, mapGlobals.soundDelay);

      mapGlobals.projectileSounds += 1;

      shoot(projectile, level);
    }
    setTimeout(() => {
      this.destroyProjectile(projectile, scene);
    }, projectileGlobals.lifeTime);
  }

  intersectPhys(scene: Scene, projectile: Mesh) {
    const hitMaterial = scene.getMaterialByID("hitMaterial") as Material;
    const enemyMaterial = scene.getMaterialByID("enemyMaterial") as Material;

    // Enemies ONLY
    for (let index = 0; index < enemyGlobals.allEnemies.length; index += 1) {
      const enemy = enemyGlobals.allEnemies[index] as Mesh;

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor as PhysicsImpostor,
        (collider: PhysicsImpostor) => {
          //@ts-ignore
          enemy.hitPoints -= projectile.hitPoints;
          enemy.material = hitMaterial as Material;

          explosion(scene, collider.getObjectCenter());
          setTimeout(() => {
            enemy.material = enemyMaterial as Material;
          }, 40);

          if (
            mapGlobals.simultaneousSounds < mapGlobals.soundLimit &&
            //@ts-ignore
            enemy.hitPoints > 0
          ) {
            setTimeout(() => {
              mapGlobals.simultaneousSounds -= 1;
            }, mapGlobals.soundDelay);

            mapGlobals.simultaneousSounds += 1;

            damage(enemy);
          }
        }
      );
    }

    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as PhysicsImpostor[],
      () => {
        this.destroyProjectile(projectile, scene);
      }
    );
  }

  impulsePhys(originMesh: Mesh, projectile: Mesh, level: number = 1 | 2 | 3) {
    const forwardLocal = new Vector3(
      0,
      0,
      projectileGlobals.speed * level * -1
    ) as Vector3;
    const speed = originMesh.getDirection(forwardLocal) as Vector3;
    projectile.physicsImpostor.applyImpulse(
      speed,
      projectile.getAbsolutePosition()
    );
  }

  destroyProjectile(projectile: Mesh, scene: Scene) {
    const physicsEngine = scene.getPhysicsEngine() as PhysicsEngine;

    projectile.setEnabled(false);

    //@ts-ignore
    projectile.hitPoints = 0;

    setTimeout(() => {
      mapGlobals.allImpostors = [];
      //@ts-ignore
      delete projectile.hitPoints;
      projectile.physicsImpostor.dispose();

      projectile.dispose();

      mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
    }, 1);
  }
}

export default function fire(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3
) {
  new Projectile(originMesh, scene, level);
}
