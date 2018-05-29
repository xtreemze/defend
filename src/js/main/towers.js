// @ts-check

import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

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

    this[this.name].physicsImpostor = new BABYLON.PhysicsImpostor(
      this[this.name],
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.8 },
      scene
    );

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
            width: 4
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
    const rotateDelay = 200;
    setInterval(() => {
      this.rotateTurret(scene, scene.getMeshesByTags("enemy"), rotateDelay);
    }, rotateDelay);
  }
  rotateTurret(scene, enemyArray, rotateDelay) {
    if (enemyArray !== undefined && enemyArray.length > 0) {
      fire(scene, this[this.levelTop], enemyArray);
    }
    scene.registerBeforeRender(() => {
      if (enemyArray[0]) {
        const { y } = this[this.levelTop].position;
        this[this.levelTop].lookAt(
          new BABYLON.Vector3(
            enemyArray[0].position.x,
            enemyArray[0].position.y,
            enemyArray[0].position.z
          )
        );
      }
    });
  }
}

function towerGenerator(scene, quantity) {
  new Tower(3, positionGenerator(), scene);
  for (let index = 2; index < quantity; index += 1) {
    new Tower(randomNumberRange(1, 3), positionGenerator(), scene);
  }
}
export default function towers(scene) {
  towerGenerator(scene, randomNumberRange(4, 25));
}
