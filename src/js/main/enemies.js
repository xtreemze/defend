// @ts-check

import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";

class Enemy {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `enemy${level}`;

    let diameter = 5;
    switch (level) {
      case 1:
      default:
      case 2:
        this[this.name] = BABYLON.MeshBuilder.CreateSphere(
          name,
          {
            segments: 3,
            diameter
          },
          scene
        );

        this[this.name].position = new BABYLON.Vector3(
          position.x,
          diameter / 2,
          position.z
        );

        break;
      case 3:
        diameter = 8;
        this[this.name] = BABYLON.MeshBuilder.CreateSphere(
          name,
          {
            segments: 3,
            diameter
          },
          scene
        );
        this[this.name].position = new BABYLON.Vector3(
          position.x,
          diameter / 2,
          position.z
        );
        break;
    }
    this[this.name].material = scene.getMaterialByID("enemyMaterial");
    this[this.name].hitPoints = level * 100;

    BABYLON.Tags.AddTagsTo(this[this.name], "enemy");

    enemyAi(this[this.name], this);

    setTimeout(() => {
      this[this.name].hitPoints = 0;
      this[this.name].dispose();
    }, 15000);
  }
  // intersectTower(scene) {
  //   let collided = false;
  //   const towers = scene.getMeshesByTags("tower");
  //   for (let index = 0; index < towers.length; index += 1) {
  //     const tower = towers[index];

  //     if (this[this.name].intersectsMesh(tower, false)) {
  //       collided = true;
  //     }
  //   }
  //   return collided;
  // }
  decide() {
    const decide = { up: true, left: true, right: true, down: true };
    if (this[this.name].position.z <= -45) {
      decide.down = false;
      decide.up = true;
    }
    if (this[this.name].position.z >= 45) {
      decide.up = false;
      decide.down = true;
    }
    if (this[this.name].position.x >= 45) {
      decide.right = false;
      decide.left = true;
    }
    if (this[this.name].position.x <= -45) {
      decide.left = false;
      decide.right = true;
    }
    return decide;
  }
}
export default function enemies(scene) {
  setInterval(() => {
    let enemy3 = new Enemy(1, { x: 25, z: 45 }, scene);
  }, 5000);

  setInterval(() => {
    let enemy4 = new Enemy(2, { x: 45, z: 45 }, scene);
  }, 10000);

  setInterval(() => {
    let enemy5 = new Enemy(3, { x: -25, z: 45 }, scene);
  }, 25000);
}
