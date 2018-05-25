// @ts-check

import * as BABYLON from "babylonjs";

export default function map1(scene) {
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground1",
    {
      height: 100,
      width: 100,
      subdivisions: 10
    },
    scene
  );
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  ground.material = groundMaterial;
  groundMaterial.wireframe = true;
}
