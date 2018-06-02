import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  towerGlobals,
  projectileGlobals,
  mapGlobals,
  renderGlobals
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

  // Camera 2
  const camera2 = new BABYLON.ArcRotateCamera(
    "3/4",
    Math.PI / 3,
    Math.PI / 3,
    200,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Camera 3
  const camera3 = new BABYLON.ArcRotateCamera(
    "closeup",
    Math.PI / 1,
    Math.PI / 5,
    120,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Attach Control
  camera.attachControl(canvas, true);
  camera2.attachControl(canvas, true);
  camera3.attachControl(canvas, true);

  // Upper Beta Limit
  camera.upperBetaLimit = Math.PI / 2.2;
  camera2.upperBetaLimit = Math.PI / 2.2;
  camera3.upperBetaLimit = Math.PI / 2.2;

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

  const allCameras = scene.cameras;

  setInterval(() => {
    scene.setActiveCameraByID(allCameras[0].id);
    const previousCamera = allCameras.shift();
    allCameras.push(previousCamera);
    scene.activeCamera.inertia = 0;
    setTimeout(() => {
      scene.activeCamera.inertia = 0.9;
    }, 100);
  }, mapGlobals.cameraCutDelay);

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
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.freeze(); // if material is immutable

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.freeze(); // if material is immutable

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.wireframe = true;
  damagedMaterial.freeze(); // if material is immutable

  const hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.freeze(); // if material is immutable

  if (renderGlobals.pipelineOn) {
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      "default", // The name of the pipeline
      false,
      scene, // The scene instance,
      [camera, camera2, camera3] // The list of cameras to be attached to
    );

    // Depth of Field
    pipeline.depthOfFieldEnabled = renderGlobals.depthOfField;
    pipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
    pipeline.depthOfField.focusDistance = 20 * 1000; // distance of the current focus point from the camera in millimeters considering 1 scene unit is 1 meter
    pipeline.depthOfField.focalLength = 400; // focal length of the camera in millimeters
    pipeline.depthOfField.fStop = 4.0; // aka F number of the camera defined in stops as it would be on a physical device

    // Antialiasing
    pipeline.samples = 4;
    pipeline.fxaaEnabled = renderGlobals.antialiasing;

    // Sharpen
    pipeline.sharpenEnabled = renderGlobals.sharpenning;
    pipeline.sharpen.edgeAmount = 0.3;
    pipeline.sharpen.colorAmount = 1;

    // Bloom
    pipeline.bloomEnabled = renderGlobals.bloom;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.3;
    pipeline.bloomKernel = 32;
    pipeline.bloomScale = 0.5;
  }

  // Glow
  if (renderGlobals.glow) {
    const glowLayer = new BABYLON.GlowLayer("glow", scene, {
      mainTextureFixedSize: 128,
      blurKernelSize: 8,
      mainTextureSamples: 2
    });

    glowLayer.intensity = 0.8;
    // glowLayer.addIncludedOnlyMesh(projectile);
  }
}
