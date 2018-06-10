import * as BABYLON from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./variables";

import * as fx from "wafxr";

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

    if (mapGlobals.simultaneousSounds < 3) {
      setTimeout(() => {
        mapGlobals.simultaneousSounds -= 1;
      }, 500);

      mapGlobals.simultaneousSounds += 1;

      const shoot = fx.play({
        volume: -1,
        sustain: 0.0611 * level,
        release: 0.1288,
        frequency: 7000 / (level / 5),
        sweep: -0.401,
        source: "square",
        vibrato: 0.4852 * level,
        vibratoFreq: 7.952 * level,
        soundX: projectile.position.x,
        soundY: projectile.position.y,
        soundZ: projectile.position.z,
        rolloff: 0.5
      });
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

    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as BABYLON.PhysicsImpostor[],
      () => {
        this.destroyProjectile(projectile, scene);
      }
    );

    // Enemies ONLY
    for (let index = 0; index < enemyGlobals.allEnemies.length; index += 1) {
      const enemy = enemyGlobals.allEnemies[index] as BABYLON.Mesh;

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor as BABYLON.PhysicsImpostor,
        () => {
          //@ts-ignore
          enemy.hitPoints -= projectile.hitPoints;

          if (mapGlobals.simultaneousSounds < 3) {
            setTimeout(() => {
              mapGlobals.simultaneousSounds -= 1;
            }, 500);

            mapGlobals.simultaneousSounds += 1;

            const damage = fx.play({
              volume: -1,
              sustain: 0.091,
              release: 0.0615,
              //@ts-ignore
              frequency: (12 / level) * (enemy.hitPoints / level),
              sweep: -0.3981,
              source: "sawtooth",
              lowpass: 4252,
              lowpassSweep: 771.2,
              compressorThreshold: -39.11,
              soundX: enemy.position.x,
              soundY: enemy.position.y,
              soundZ: enemy.position.z,
              rolloff: 0.4
            });
          }
          enemy.material = hitMaterial as BABYLON.Material;

          setTimeout(() => {
            enemy.material = enemyMaterial as BABYLON.Material;
          }, 40);
        }
      );
    }
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
