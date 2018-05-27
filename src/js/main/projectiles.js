// @ts-check

import * as BABYLON from "babylonjs";

class Projectile {
  constructor(level, originMesh, scene) {
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
    this[this.name].hitPoints = level * 2;
    this[this.name].position = originMesh.position;
    this[this.name].rotation = new BABYLON.Vector3(
      originMesh.rotation.x,
      originMesh.rotation.y,
      originMesh.rotation.z
    );

    this[this.name].material = scene.getMaterialByID("projectileMaterial");

    this.impulse(scene);

    setTimeout(() => {
      this[this.name].dispose();
      const propertyArray = Object.keys(this);
      for (let index = 0; index < propertyArray.length; index += 1) {
        delete propertyArray[index];
      }
    }, 800);
  }
  intersect(scene) {
    const enemies = scene.getMeshesByTags("enemy");
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      if (this[this.name].intersectsMesh(enemy, false)) {
        enemy.hitPoints -= this[this.name].hitPoints;
        if (enemy.hitPoints === 0) {
          enemy.dispose();
        } else if (enemy.hitPoints < 50) {
          enemy.material = scene.getMaterialByID("damagedMaterial");
        }
        this[this.name].hitPoints = 0;
        this[this.name].dispose();
      }
    }
  }
  impulse(scene) {
    scene.registerAfterRender(() => {
      if (this[this.name].hitPoints > 0) {
        this[this.name].translate(BABYLON.Axis.Z, 3 * -1, BABYLON.Space.LOCAL);
        this.intersect(scene);
      }
    });
  }
}

export default function fire(scene, originMesh) {
  const projectile = new Projectile(1, originMesh, scene);
}
