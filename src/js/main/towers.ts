// @ts-check

import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

/**
 * Creates an instance of tower.
 * @param [level]
 * @param [position]
 * @param [scene]
 */
class Tower {
  constructor(
    level = 1,
    position = { x: -25, z: -25 },
    scene = BABYLON.Scene.prototype
  ) {
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
            size: 2,
            height: 2,
            width: 4
          },
          scene
        );
        tower[levelTop].position = new BABYLON.Vector3(
          position.x,
          3,
          position.z
        );
        // tower[levelTop].physicsImpostor = new BABYLON.PhysicsImpostor(
        //   tower[levelTop],
        //   BABYLON.PhysicsImpostor.BoxImpostor,
        //   { mass: 0, restitution: 0.8 },
        //   scene
        // );
        tower[levelTop].material = scene.getMaterialByID("towerMaterial");
        // tower.addChild(tower[levelTop]);
        this.enemyWatch(scene, tower, levelTop);

        break;
    }
    BABYLON.Tags.AddTagsTo(tower, "tower");
  }

  /**
   * Enemys watch
   * @param [scene]
   * @param [tower]
   * @param [levelTop]
   */
  enemyWatch(
    scene = BABYLON.Scene.prototype,
    tower = BABYLON.Mesh.prototype,
    levelTop = ""
  ) {
    const rotateDelay = 200;
    // this.slowRotateTurret(scene, rotateDelay, tower, levelTop);
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

  /**
   * Rotates turret
   * @param [scene]
   * @param enemyArray
   * @param [rotateDelay]
   * @param [tower]
   * @param [levelTop]
   */
  rotateTurret(
    scene = BABYLON.Scene.prototype,
    enemyArray,
    rotateDelay = 0,
    tower = BABYLON.Mesh.prototype,
    levelTop = ""
  ) {
    if (enemyArray !== undefined && enemyArray.length > 0) {
      fire(scene, tower[levelTop], enemyArray);
    }
    scene.registerBeforeRender(() => {
      if (enemyArray[0]) {
        tower[levelTop].lookAt(
          new BABYLON.Vector3(
            enemyArray[0].position.x,
            tower[levelTop].position.y,
            enemyArray[0].position.z
          )
        );
      }
    });
  }

  /**
   * Slow Rotate turret
   * @param [scene]
   * @param enemyArray
   * @param [rotateDelay]
   * @param [tower]
   * @param [levelTop]
   */
  slowRotateTurret(
    scene = BABYLON.Scene.prototype,
    rotateDelay = 0,
    tower = BABYLON.Mesh.prototype,
    levelTop = ""
  ) {
    let enemyArray = scene.getMeshesByTags("enemy");

    tower[levelTop].rotationQuaternion = BABYLON.Quaternion.Identity();
    let lookTarget = enemyArray[0];
    let lookTargetPos = lookTarget.position.clone();

    // let lookTarget = scene.getMeshByID("ground");
    // let lookTargetPos = lookTarget.position.clone();
    let orgQuat = tower[levelTop].rotationQuaternion.clone();
    tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
    let lookQuat = tower[levelTop].rotationQuaternion.clone();
    let percent = 0;
    let percentAdd = 100;

    setInterval(() => {
      enemyArray = scene.getMeshesByTags("enemy");
      if (enemyArray !== undefined && enemyArray.length > 0) {
        lookTarget = enemyArray[0];
        lookTargetPos = lookTarget.position.clone();
        fire(scene, tower[levelTop], enemyArray);
      }
    }, rotateDelay);

    scene.registerBeforeRender(() => {
      if (enemyArray.length > 0) {
        if (lookTarget === null) {
          // lookTarget = enemyArray[0];

          lookTargetPos = lookTarget.position.clone();

          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);

          orgQuat = tower[levelTop].rotationQuaternion.clone();
          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
          lookQuat = tower[levelTop].rotationQuaternion.clone();
        }
        if (
          // Reset the rotation values when the target has moved

          BABYLON.Vector3.Distance(lookTargetPos, lookTarget.position) >
          BABYLON.Epsilon
        ) {
          orgQuat = tower[levelTop].rotationQuaternion.clone();
          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
          lookQuat = tower[levelTop].rotationQuaternion.clone();
          lookTargetPos = lookTarget.position.clone();
          percent = 0;
        }

        // Set the tower[levelTop] rotation, increase the percentage
        if (percent !== 1) {
          tower[levelTop].rotationQuaternion = BABYLON.Quaternion.Slerp(
            orgQuat,
            lookQuat,
            percent
          );
          percent += percentAdd;
          if (percent > 1) {
            percent = 1;
          }
        }
      }
    });
  }
}

/**
 * Towers generator
 * @param [scene]
 * @param [quantity]
 */
function towerGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
  new Tower(3, positionGenerator(), scene);
  for (let index = 2; index < quantity; index += 1) {
    new Tower(randomNumberRange(1, 3), positionGenerator(), scene);
  }
}
export default function towers(scene = BABYLON.Scene.prototype) {
  towerGenerator(scene, randomNumberRange(4, 25));
}
