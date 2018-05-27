// @ts-check

import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";

class Enemy {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `enemy${level}`;
    this.hitPoints = level * 100;

    const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
    enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.7, 1);

    let diameter = 5;
    switch (level) {
      case 1:
      default:
      case 2:
        this[this.name] = BABYLON.MeshBuilder.CreateSphere(
          this.name,
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
          this.name,
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
    this[this.name].material = enemyMaterial;
    BABYLON.Tags.AddTagsTo(this[this.name], "enemy");

    enemyAi(this[this.name], this, scene);
  }
  intersect(enemy, scene) {
    const projectiles = scene.getMeshesByID("projectile");
    const towers = scene.getMeshesByID("tower");
    for (let index = 0; index < projectiles.length; index += 1) {
      const projectile = projectiles[index];
      if (enemy.intersectsMesh(projectile, false)) {
        console.log("collide");
        this.hitPoints -= enemy.hitPoints;
        if (this.hitPoints === 0) {
          this.destroy();
        }
      }
    }
    for (let index = 0; index < towers.length; index += 1) {
      const tower = towers[index];
      console.log(tower);
      if (enemy.intersectsMesh(tower, false)) {
        console.log("collide");
      }
    }
  }
  decide(scene) {
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
  destroy() {
    this[this.name].dispose();
  }
}
export default function enemies(scene) {
  const enemy1 = new Enemy(1, { x: 25, z: 45 }, scene);
  const enemy2 = new Enemy(2, { x: 45, z: 45 }, scene);
  const enemy3 = new Enemy(3, { x: -25, z: 45 }, scene);
  const enemy4 = new Enemy(2, { x: 5, z: 5 }, scene);
}
