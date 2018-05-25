// @ts-check

import * as BABYLON from "babylonjs";

export default function enemies(scene) {
  const enemy1 = BABYLON.MeshBuilder.CreateSphere(
    "enemy1",
    {
      segments: 3,
      diameter: 5
    },
    scene
  );
  const enemy2 = BABYLON.MeshBuilder.CreateSphere(
    "enemy2",
    {
      segments: 2,
      diameter: 5
    },
    scene
  );
  const enemy3 = BABYLON.MeshBuilder.CreateSphere(
    "enemy3",
    {
      segments: 2,
      diameter: 5
    },
    scene
  );
  // Move the sphere upward
  enemy1.position = new BABYLON.Vector3(-45, 2.5, -45);
  enemy2.position = new BABYLON.Vector3(45, 2.5, 45);
  enemy3.position = new BABYLON.Vector3(45, 2.5, 45);

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1);

  enemy1.material = enemyMaterial;
  enemy2.material = enemyMaterial;
  enemy3.material = enemyMaterial;

  const enemyMove = new BABYLON.Animation(
    "enemyMove",
    "position",
    2,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keys = [];

  keys.push({ frame: 0, value: new BABYLON.Vector3(45, 2.5, 45) });
  keys.push({ frame: 50, value: new BABYLON.Vector3(-45, 2.5, -45) });
  keys.push({ frame: 100, value: new BABYLON.Vector3(45, 2.5, 45) });

  enemyMove.setKeys(keys);

  enemy1.animations = [];
  enemy1.animations.push(enemyMove);

  enemy2.animations = [];
  enemy2.animations.push(enemyMove);

  enemy3.animations = [];
  enemy3.animations.push(enemyMove);

  scene.beginAnimation(enemy1, 0, 100, true);
  //   scene.beginAnimation(enemy2, 100, 0, true);
  //   scene.beginAnimation(enemy3, 1, 100, true);
}
