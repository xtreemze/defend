// @ts-check

import * as BABYLON from "babylonjs";

const life = 500;

class Projectile {
  constructor(level = 1, originMesh, scene, enemies) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateBox(
      level,
      {
        size: 2,
        height: 1.5,
        width: 1.5
      },
      scene
    );

    this.startLife(scene, originMesh, level, enemies, projectile);
  }
  startLife(scene, originMesh, level = 1, enemies, projectile) {
    projectile.position.copyFrom(originMesh.position);
    projectile.rotation.copyFrom(originMesh.rotation);

    projectile.hitPoints = level * 2;

    projectile.material = scene.getMaterialByID("projectileMaterial");

    // For Physics
    projectile.physicsImpostor = new BABYLON.PhysicsImpostor(
      projectile,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 50, restitution: 0.7 },
      scene
    );

    this.impulsePhys(scene, enemies, originMesh, projectile); // Moves the projectile with physics
    this.intersectPhys(scene, enemies, projectile); // Detects collissions with enemies

    setTimeout(() => {
      projectile.dispose();
      const propertyArray = Object.keys(this);
      for (let index = 0; index < propertyArray.length; index += 1) {
        propertyArray[index] = null;
        delete propertyArray[index];
      }
    }, life);
  }

  intersectPhys(scene, enemies, projectile) {
    // Enemies ONLY
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.material = scene.getMaterialByID("hitMaterial");
          setTimeout(() => {
            enemy.material = scene.getMaterialByID("enemyMaterial");
          }, 60);
          enemy.hitPoints -= projectile.hitPoints;
          this.destroy(projectile);
        }
      );
    }
  }

  impulsePhys(scene, enemies, originMesh, projectile) {
    const forwardLocal = new BABYLON.Vector3(0, 0, -180);
    const speed = originMesh.getDirection(forwardLocal);
    projectile.physicsImpostor.setLinearVelocity(speed);
  }

  destroy(projectile) {
    projectile.hitPoints = 0;
    setTimeout(() => {
      projectile.dispose();
    }, 1);

    const propertyArray = Object.keys(this);
    for (let index = 0; index < propertyArray.length; index += 1) {
      propertyArray[index] = null;
      delete propertyArray[index];
    }
  }
}

export default function fire(scene, originMesh, enemies) {
  new Projectile(1, originMesh, scene, enemies);
}
