// @ts-check

import * as BABYLON from "babylonjs";

const life = 500;

class Projectile {
  constructor(
    level = 1,
    originMesh = BABYLON.Mesh,
    scene = BABYLON.Scene.prototype,
    enemies: any
  ) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 2,
        height: 1.5,
        width: 1.5
      },
      scene
    );

    this.startLife(scene, originMesh, level, enemies, projectile);
  }
  startLife(
    scene = BABYLON.Scene.prototype,
    originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
    level = 1,
    enemies: any,
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
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

  intersectPhys(
    scene = BABYLON.Scene.prototype,
    enemies: any,
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
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

  impulsePhys(
    scene = BABYLON.Scene.prototype,
    enemies: any,
    originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    const forwardLocal = new BABYLON.Vector3(0, 0, -180);
    const speed = originMesh.getDirection(forwardLocal);
    projectile.physicsImpostor.setLinearVelocity(speed);
  }

  destroy(projectile = BABYLON.MeshBuilder.CreateBox.prototype) {
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

export default function fire(
  scene = BABYLON.Scene.prototype,
  originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
  enemies: any
) {
  new Projectile(1, originMesh, scene, enemies);
}
