// @ts-check

import * as BABYLON from "babylonjs";
import fire from "./projectiles";

class Tower {
  constructor(level = 1, position = { x: -25, z: -25 }, scene) {
    this.name = `tower${level}`;
    this.levelTop = `towerTop${level}`;

    this[this.name] = BABYLON.MeshBuilder.CreateBox(
      this.name,
      {
        size: 10,
        height: 1
      },
      scene
    );
    this[this.name].position = new BABYLON.Vector3(position.x, 0.5, position.z);

    this[this.name].material = scene.getMaterialByID("towerMaterial");

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        this[this.levelTop] = BABYLON.MeshBuilder.CreateBox(
          this.levelTop,
          {
            size: 6,
            height: 2.5,
            width: 5
          },
          scene
        );
        this[this.levelTop].position = new BABYLON.Vector3(
          position.x,
          3,
          position.z
        );
        this[this.levelTop].material = scene.getMaterialByID("towerMaterial");

        this.enemyWatch(scene);

        break;
    }
    BABYLON.Tags.AddTagsTo(this[this.name], "tower");
  }

  enemyWatch(scene) {
    setInterval(() => {
      this.rotateTurret(scene, scene.getMeshesByTags("enemy"));
    }, 100);
  }
  rotateTurret(scene, enemyArray) {
    if (enemyArray !== undefined && enemyArray.length > 0) {
      fire(scene, this[this.levelTop], enemyArray);
    }

    if (enemyArray[0]) {
      const { y } = this[this.levelTop].position;
      this[this.levelTop].lookAt(
        new BABYLON.Vector3(
          enemyArray[0].position.x,
          y,
          enemyArray[0].position.z
        )
      );
    }
  }
}

export default function towers(scene) {
  new Tower(1, { x: -45, z: 45 }, scene);
  new Tower(2, { x: 45, z: -45 }, scene);
  new Tower(3, { x: 5, z: 45 }, scene);
}
