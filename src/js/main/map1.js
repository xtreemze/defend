// @ts-check

import * as BABYLON from "babylonjs";

export default function map1(scene, canvas) {
  const camera = new BABYLON.UniversalCamera(
    "camera1",
    new BABYLON.Vector3(0, 200, 0),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);

  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0.1, 1, 0),
    scene
  );

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
