import * as BABYLON from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./variables";
import * as sounds from "./sounds";

class Projectile {
  constructor(
    originMesh: BABYLON.Mesh,
    scene: BABYLON.Scene,
    level: number = 1 | 2 | 3
  ) {
    const name = `projectile${level}` as string;

    const projectile = BABYLON.MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as BABYLON.Mesh;

    this.startLife(scene, originMesh, level, projectile);
  }

  startLife(
    scene: BABYLON.Scene,
    originMesh: BABYLON.Mesh,
    level: number = 1 | 2 | 3,
    projectile: BABYLON.Mesh
  ) {
    const projectileMaterial = scene.getMaterialByID(
      "projectileMaterial"
    ) as BABYLON.Material;
    const forwardLocal = new BABYLON.Vector3(0, 0, 5);
    const space = originMesh.getDirection(forwardLocal) as BABYLON.Vector3;

    projectile.position = originMesh.position.subtract(
      space
    ) as BABYLON.Vector3;
    //@ts-ignore
    projectile.hitPoints = (level +
      level * projectileGlobals.baseHitPoints) as number;
    projectile.material = projectileMaterial as BABYLON.Material;

    // For Physics
    projectile.physicsImpostor = new BABYLON.PhysicsImpostor(
      projectile,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: projectileGlobals.mass * level,
        restitution: projectileGlobals.restitution,
        friction: 1
      },
      scene
    ) as BABYLON.PhysicsImpostor;

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

      sounds.shoot(projectile, level);
    }
    setTimeout(() => {
      this.destroyProjectile(projectile, scene);
    }, projectileGlobals.lifeTime);
  }

  intersectPhys(
    scene: BABYLON.Scene,
    projectile: BABYLON.Mesh,
    level: number = 1 | 2 | 3
  ) {
    const hitMaterial = scene.getMaterialByID(
      "hitMaterial"
    ) as BABYLON.Material;
    const enemyMaterial = scene.getMaterialByID(
      "enemyMaterial"
    ) as BABYLON.Material;

    // Enemies ONLY
    for (let index = 0; index < enemyGlobals.allEnemies.length; index += 1) {
      const enemy = enemyGlobals.allEnemies[index] as BABYLON.Mesh;

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor as BABYLON.PhysicsImpostor,
        () => {
          //@ts-ignore
          enemy.hitPoints -= projectile.hitPoints;

          if (
            mapGlobals.simultaneousSounds < mapGlobals.soundLimit &&
            //@ts-ignore
            enemy.hitPoints > 0
          ) {
            setTimeout(() => {
              mapGlobals.simultaneousSounds -= 1;
            }, mapGlobals.soundDelay);

            mapGlobals.simultaneousSounds += 1;

            sounds.damage(enemy);
          }
          enemy.material = hitMaterial as BABYLON.Material;

          setTimeout(() => {
            enemy.material = enemyMaterial as BABYLON.Material;
          }, 40);
        }
      );
    }

    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as BABYLON.PhysicsImpostor[],
      () => {
        setTimeout(() => {
          this.destroyProjectile(projectile, scene);
        }, 1);
      }
    );
  }

  impulsePhys(
    originMesh: BABYLON.Mesh,
    projectile: BABYLON.Mesh,
    level: number = 1 | 2 | 3
  ) {
    const forwardLocal = new BABYLON.Vector3(
      0,
      0,
      projectileGlobals.speed * level * -1
    ) as BABYLON.Vector3;
    const speed = originMesh.getDirection(forwardLocal) as BABYLON.Vector3;
    projectile.physicsImpostor.applyImpulse(
      speed,
      projectile.getAbsolutePosition()
    );
  }

  destroyProjectile(projectile: BABYLON.Mesh, scene: BABYLON.Scene) {
    projectile.setEnabled(false);
    setTimeout(() => {
      mapGlobals.allImpostors = [];
      projectile.physicsImpostor.dispose();
      //@ts-ignore
      projectile.hitPoints = 0;
      //@ts-ignore
      delete projectile.hitPoints;
      projectile.dispose();

      const physicsEngine = scene.getPhysicsEngine() as BABYLON.PhysicsEngine;

      mapGlobals.allImpostors = physicsEngine.getImpostors() as BABYLON.PhysicsImpostor[];
    }, 1);
  }
}

export default function fire(
  scene: BABYLON.Scene,
  originMesh: BABYLON.Mesh,
  level: number = 1 | 2 | 3
) {
  new Projectile(originMesh, scene, level);
}
