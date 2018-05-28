// @ts-check

import * as BABYLON from "babylonjs";

class Projectile {
  constructor(level, originMesh, scene, enemies) {
    this.name = `projectile${level}`;
    this.level = level;

    this[this.name] = BABYLON.MeshBuilder.CreateBox(
      this.level,
      {
        size: 3,
        height: 1.5,
        width: 1.5
      },
      scene
    );

    this.startLife(scene, originMesh, level, enemies);
  }
  startLife(scene, originMesh, level, enemies) {
    this[this.name].hitPoints = level * 2;
    this[this.name].position = originMesh.position;
    this[this.name].rotation = new BABYLON.Vector3(
      originMesh.rotation.x,
      originMesh.rotation.y,
      originMesh.rotation.z
    );

    this[this.name].material = scene.getMaterialByID("projectileMaterial");

    this.impulse(scene, enemies);

    setTimeout(() => {
      this[this.name].dispose();
      const propertyArray = Object.keys(this);
      for (let index = 0; index < propertyArray.length; index += 1) {
        propertyArray[index] = null;
        delete propertyArray[index];
      }
    }, 400);
  }
  intersect(scene, enemies) {
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      if (this[this.name].intersectsMesh(enemy, false)) {
        enemy.material = scene.getMaterialByID("hitMaterial");
        setTimeout(() => {
          enemy.material = scene.getMaterialByID("enemyMaterial");
        }, 60);
        enemy.hitPoints -= this[this.name].hitPoints;

        this[this.name].hitPoints = 0;
        this[this.name].dispose();
      }
    }
  }
  impulse(scene, enemies) {
    scene.registerBeforeRender(() => {
      if (
        this[this.name].hitPoints > 0 &&
        enemies !== undefined &&
        enemies.length > 0
      ) {
        this[this.name].translate(BABYLON.Axis.Z, 5 * -1, BABYLON.Space.LOCAL);
        this.intersect(scene, enemies);
      }
    });
  }
}

export default function fire(scene, originMesh, enemies) {
  new Projectile(1, originMesh, scene, enemies);
}
