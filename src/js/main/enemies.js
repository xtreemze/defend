// @ts-check

import * as BABYLON from "babylonjs";

class Enemy {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `enemy${level}`;
    this.hitPoints = level * 100;

    const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
    enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1);

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
  }
}
export default function enemies(scene) {
  const enemy1 = new Enemy(1, { x: 25, z: 45 }, scene);
  const enemy2 = new Enemy(2, { x: 45, z: 45 }, scene);
  const enemy3 = new Enemy(3, { x: -25, z: 45 }, scene);
  const enemy4 = new Enemy(2, { x: 5, z: 5 }, scene);
}
