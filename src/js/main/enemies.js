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

  return sphereStart;
}
