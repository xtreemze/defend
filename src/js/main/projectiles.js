// @ts-check

import * as BABYLON from "babylonjs";

const life = 500;

class Projectile {
  constructor(level, originMesh, scene, enemies) {
    this.name = `projectile${level}`;
    this.level = level;

    this[this.name] = BABYLON.MeshBuilder.CreateBox(
      this.level,
      {
        size: 2,
        height: 1.5,
        width: 1.5
      },
      scene
    );

    this.startLife(scene, originMesh, level, enemies);
  }
  startLife(scene, originMesh, level, enemies) {
    this[this.name].position.copyFrom(originMesh.position);
    this[this.name].rotation.copyFrom(originMesh.rotation);

    this[this.name].hitPoints = level * 2;

    this[this.name].material = scene.getMaterialByID("projectileMaterial");

    // For Physics
    this[this.name].physicsImpostor = new BABYLON.PhysicsImpostor(
      this[this.name],
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 50, restitution: 0.7 },
      scene
    );

    this.impulsePhys(scene, enemies, originMesh); // Moves the projectile with physics
    this.intersectPhys(scene, enemies); // Detects collissions with enemies
    this.intersectPhys(scene, scene.getMeshesByTags("ground")); // Detects collissions with enemies

    setTimeout(() => {
      this[this.name].dispose();
      const propertyArray = Object.keys(this);
      for (let index = 0; index < propertyArray.length; index += 1) {
        propertyArray[index] = null;
        delete propertyArray[index];
      }
    }, life);
  }

  intersectPhys(scene, enemies) {
    // Enemies ONLY
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      this[this.name].physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.material = scene.getMaterialByID("hitMaterial");
          setTimeout(() => {
            enemy.material = scene.getMaterialByID("enemyMaterial");
          }, 60);
          enemy.hitPoints -= this[this.name].hitPoints;
          this.destroy();
        }
      );
    }
  }

  impulsePhys(scene, enemies, originMesh) {
    const forwardLocal = new BABYLON.Vector3(0, 0, -180);
    const speed = originMesh.getDirection(forwardLocal);
    this[this.name].physicsImpostor.setLinearVelocity(speed);
  }

  destroy() {
    this[this.name].hitPoints = 0;
    setTimeout(() => {
      this[this.name].dispose();
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
