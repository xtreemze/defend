// @ts-check

import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

class Tower {
  constructor(level = 1, position = { x: -25, z: -25 }, scene) {
    const name = `tower${level}`;
    const levelTop = `towerTop${level}`;

    const tower = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: 1
      },
      scene
    );
    tower.position = new BABYLON.Vector3(position.x, 0.5, position.z);

    tower.physicsImpostor = new BABYLON.PhysicsImpostor(
      tower,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0.8 },
      scene
    );

    tower.material = scene.getMaterialByID("towerMaterial");

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        tower[levelTop] = BABYLON.MeshBuilder.CreateBox(
          levelTop,
          {
            size: 6,
            height: 2.5,
            width: 4
          },
          scene
        );
        tower[levelTop].position = new BABYLON.Vector3(
          position.x,
          3,
          position.z
        );
        tower[levelTop].material = scene.getMaterialByID("towerMaterial");

        this.enemyWatch(scene, tower, levelTop);

        break;
    }
    BABYLON.Tags.AddTagsTo(tower, "tower");
  }

  enemyWatch(scene, tower, levelTop) {
    const rotateDelay = 200;
    setInterval(() => {
      this.rotateTurret(
        scene,
        scene.getMeshesByTags("enemy"),
        rotateDelay,
        tower,
        levelTop
      );
    }, rotateDelay);
  }

  rotateTurret(scene, enemyArray, rotateDelay, tower, levelTop) {
    if (enemyArray !== undefined && enemyArray.length > 0) {
      fire(scene, tower[levelTop], enemyArray);
    }
    scene.registerBeforeRender(() => {
      if (enemyArray[0]) {
        tower[levelTop].lookAt(
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
