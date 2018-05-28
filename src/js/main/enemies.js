// @ts-check

import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";

class Enemy {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `enemy${level}`;
    this.level = level;
    this.diameter = 5 + level;

    this[this.name] = BABYLON.MeshBuilder.CreateSphere(
      name,
      {
        segments: 3,
        diameter: this.diameter
      },
      scene
    );
    this.revive(scene, position);

    BABYLON.Tags.AddTagsTo(this[this.name], "enemy");

    this.loopTimer = setInterval(() => {
      this.checkHitPoints(scene);
      enemyAi(this[this.name], this.decide());
    }, 300);
  }

  checkHitPoints(scene) {
    if (this[this.name].hitPoints <= 0) {
      this.destroy();
    } else if (
      this[this.name].hitPoints < 50 &&
      this[this.name].material !== scene.getMaterialByID("damagedMaterial")
    ) {
      this[this.name].material = scene.getMaterialByID("damagedMaterial");
    } else {
      this[this.name].hitPoints -= 1;
    }
  }

  revive(scene, position) {
    this[this.name].position = new BABYLON.Vector3(
      position.x,
      this.diameter / 2,
      position.z
    );
    this[this.name].hitPoints = this.level * 100;
    this[this.name].material = scene.getMaterialByID("enemyMaterial");
  }
  destroy() {
    this[this.name].hitPoints = 0;
    clearInterval(this.loopTimer);
    this[this.name].dispose();

    const propertyArray = Object.keys(this);
    for (let index = 0; index < propertyArray.length; index += 1) {
      propertyArray[index] = null;
      delete propertyArray[index];
    }
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
  // new Enemy(1, { x: 0, z: 0 }, scene);
  // new Enemy(2, { x: 0, z: 0 }, scene);
  // new Enemy(3, { x: 0, z: 0 }, scene);

  setInterval(() => {
    new Enemy(1, { x: 5, z: 5 }, scene);
  }, 5000);

  setInterval(() => {
    new Enemy(1, { x: 5, z: 5 }, scene);
  }, 10000);

  setInterval(() => {
    new Enemy(3, { x: 5, z: 5 }, scene);
  }, 25000);
}
