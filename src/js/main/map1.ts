import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  towerGlobals,
  projectileGlobals,
  mapGlobals
} from "./variables";

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

  const rotateCamera = camera => {
    scene.registerBeforeRender(() => {
      camera.alpha += Math.PI / (360 * mapGlobals.rotationSpeedMultiplier);
      if (camera.alpha <= Math.PI) {
      }
    });
  };

  if (mapGlobals.rotateCameras) {
    rotateCamera(camera);
    rotateCamera(camera2);
    rotateCamera(camera3);
  }

  setInterval(() => {
    scene.setActiveCameraByName("3/4");
    setTimeout(() => {
      scene.setActiveCameraByName("closeup");

      setTimeout(() => {
        scene.setActiveCameraByName("overhead");
      }, mapGlobals.cameraCutDelay);
    }, mapGlobals.cameraCutDelay);
  }, mapGlobals.cameraCutDelay * 3);

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
    { mass: 0, restitution: 0.9 },
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

  if (mapGlobals.pipelineOn) {
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      "default", // The name of the pipeline
      false,
      scene, // The scene instance,
      [camera, camera2, camera3] // The list of cameras to be attached to
    );

    // Depth of Field
    pipeline.depthOfFieldEnabled = false;
    pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
    pipeline.depthOfField.focusDistance = 20 * 1000; // distance of the current focus point from the camera in millimeters considering 1 scene unit is 1 meter
    pipeline.depthOfField.focalLength = 400; // focal length of the camera in millimeters
    pipeline.depthOfField.fStop = 4.0; // aka F number of the camera defined in stops as it would be on a physical device

    // Antialiasing
    pipeline.samples = 2;
    pipeline.fxaaEnabled = true;

    // Sharpen
    pipeline.sharpenEnabled = true;
    pipeline.sharpen.edgeAmount = 0.4;
    pipeline.sharpen.colorAmount = 1;

    // Bloom
    pipeline.bloomEnabled = false;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;
  }
}
