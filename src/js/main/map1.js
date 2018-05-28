// @ts-check

import * as BABYLON from "babylonjs";

export default function map1(scene, canvas) {
  // Camera1
  const camera = new BABYLON.UniversalCamera(
    "overhead",
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

  // Camera 2

  const camera2 = new BABYLON.UniversalCamera(
    "3/4",
    new BABYLON.Vector3(100, 100, 100),
    scene
  );
  camera2.setTarget(BABYLON.Vector3.Zero());
  camera2.attachControl(canvas, false);
  camera2.fov = 1;
  camera2.inertia = 0.7;
  camera2.speed = 8;
  camera2.angularSensibility = 1200;
  camera2.touchMoveSensibility = 200;
  camera2.touchAngularSensibility = 13000;

  // Camera 3

  const camera3 = new BABYLON.UniversalCamera(
    "closeup",
    new BABYLON.Vector3(25, 50, 75),
    scene
  );
  camera3.setTarget(BABYLON.Vector3.Zero());
  camera3.attachControl(canvas, false);
  camera3.fov = 1;
  camera3.inertia = 0.7;
  camera3.speed = 8;
  camera3.angularSensibility = 1200;
  camera3.touchMoveSensibility = 200;
  camera3.touchAngularSensibility = 13000;

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
  ground.freezeWorldMatrix(); // freeze ground

  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  ground.material = groundMaterial;
  groundMaterial.wireframe = true;
  groundMaterial.freeze(); // if material is immutable

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0.85);
  towerMaterial.freeze(); // if material is immutable

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
  projectileMaterial.freeze(); // if material is immutable

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.diffuseColor = new BABYLON.Color3(0, 0.7, 1);
  enemyMaterial.freeze(); // if material is immutable

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.2, 0);
  damagedMaterial.freeze(); // if material is immutable
}
