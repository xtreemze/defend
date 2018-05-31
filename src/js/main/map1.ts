import * as BABYLON from "babylonjs";
import { enemyGlobals, towerGlobals, projectileGlobals } from "./variables";

export default function map1(scene = BABYLON.Scene.prototype, canvas) {
  // Camera1
  const camera = new BABYLON.ArcRotateCamera(
    "overhead",
    0,
    0,
    200,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, false);
  // camera.fov = 1;
  // camera.inertia = 0.7;
  // camera.speed = 8;

  // Camera 2

  const camera2 = new BABYLON.ArcRotateCamera(
    "3/4",
    Math.PI / 3,
    Math.PI / 3,
    200,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera2.attachControl(canvas, false);
  // camera2.fov = 1;
  // camera2.inertia = 0.7;
  // camera2.speed = 8;

  // Camera 3

  const camera3 = new BABYLON.ArcRotateCamera(
    "closeup",
    Math.PI / 1,
    Math.PI / 5,
    120,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera3.attachControl(canvas, false);
  // camera3.fov = 1;
  // camera3.inertia = 0.7;
  // camera3.speed = 8;

  const rotateCamera = camera => {
    scene.registerBeforeRender(() => {
      camera.alpha += Math.PI / (360 * 9);
      if (camera.alpha <= Math.PI) {
      } else {
        // camera.alpha = Math.PI / 360;
      }
    });
  };

  rotateCamera(camera);
  rotateCamera(camera2);
  rotateCamera(camera3);

  const camDuration = 3000;
  setInterval(() => {
    scene.setActiveCameraByName("3/4");
    setTimeout(() => {
      scene.setActiveCameraByName("closeup");

      setTimeout(() => {
        scene.setActiveCameraByName("overhead");
      }, camDuration);
    }, camDuration);
  }, camDuration * 3);

  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0.3, 1, 0), scene);

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    {
      height: 100,
      width: 100,
      subdivisions: 10
    },
    scene
  );
  ground.freezeWorldMatrix(); // freeze ground

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.5 },
    scene
  );

  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  ground.material = groundMaterial;
  groundMaterial.wireframe = true;
  groundMaterial.freeze(); // if material is immutable

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.freeze(); // if material is immutable

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.diffuseColor = projectileGlobals.livingColor;
  projectileMaterial.freeze(); // if material is immutable

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.freeze(); // if material is immutable

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.freeze(); // if material is immutable

  const hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.freeze(); // if material is immutable
}
