// @ts-check

import * as BABYLON from "babylonjs";

export default function enemies(scene) {
  const sphereStart = BABYLON.MeshBuilder.CreateSphere(
    "sphereStart",
    {
      segments: 3,
      diameter: 5
    },
    scene
  );
  const sphereEnd = BABYLON.MeshBuilder.CreateSphere(
    "sphereEnd",
    {
      segments: 2,
      diameter: 5
    },
    scene
  );
  // Move the sphere upward
  sphereStart.position = new BABYLON.Vector3(-45, 2.5, -45);
  sphereEnd.position = new BABYLON.Vector3(45, 2.5, 45);

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.5, 1);

  sphereStart.material = enemyMaterial;
  sphereEnd.material = enemyMaterial;

  const enemyMove = new BABYLON.Animation(
    "enemyMove",
    "position",
    2,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR2,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  const keys = [];

  //   keys.push({ frame: 0, value: new BABYLON.Vector3(45, 2.5, 45) });
  //   keys.push({ frame: 50, value: new BABYLON.Vector3(-45, 2.5, -45) });
  //   keys.push({ frame: 100, value: new BABYLON.Vector3(45, 2.5, 45) });

  keys.push({ frame: 0, value: new BABYLON.Vector2(45, 45) });
  keys.push({ frame: 50, value: new BABYLON.Vector2(-45, -45) });
  keys.push({ frame: 100, value: new BABYLON.Vector2(45, 45) });

  enemyMove.setKeys(keys);

  sphereStart.animations = [];
  sphereStart.animations.push(enemyMove);

  scene.beginAnimation(sphereStart, 0, 100, true);
}
