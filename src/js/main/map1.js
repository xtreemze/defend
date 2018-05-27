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
  camera.fov = 1;
  camera.inertia = 0.7;
  camera.speed = 8;
  camera.angularSensibility = 1200;
  camera.touchMoveSensibility = 200;
  camera.touchAngularSensibility = 13000;

  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0.3, 1, 0), scene);

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

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0.85);

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.7, 1);

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = new BABYLON.Color3(1, 0.7, 0);
}
