import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  towerGlobals,
  projectileGlobals,
  mapGlobals,
  renderGlobals
} from "./variables";

export default function map1(scene: any = BABYLON.Scene, canvas, engine) {
  const groundMaterial = scene.getMaterialByID("groundMaterial");
  const projectileMaterial = scene.getMaterialByID("projectileMaterial");
  const transparentMaterial = scene.getMaterialByID("transparentMaterial");
  const damagedMaterial = scene.getMaterialByID("damagedMaterial");
  const hitMaterial = scene.getMaterialByID("hitMaterial");
  const enemyMaterial = scene.getMaterialByID("enemyMaterial");
  const towerMaterial = scene.getMaterialByID("towerMaterial");
  const skyMaterial = scene.getMaterialByID("skyMaterial");

  // Camera1
  const camera = new BABYLON.ArcRotateCamera(
    "overhead",
    Math.PI / 3,
    Math.PI / 14,
    mapGlobals.size / 4,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Camera 2
  const camera2 = new BABYLON.ArcRotateCamera(
    "3/4",
    Math.PI / 6,
    Math.PI / 3.5,
    mapGlobals.size / 4,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Camera 3
  const camera3 = new BABYLON.ArcRotateCamera(
    "closeup",
    Math.PI / 1,
    Math.PI / 2.1,
    60,
    BABYLON.Vector3.Zero(),
    scene
  );

  // Attach Control
  camera.attachControl(canvas, true);
  camera2.attachControl(canvas, true);
  camera3.attachControl(canvas, true);

  // Upper Beta Limit
  camera.upperBetaLimit = Math.PI / 2;
  camera2.upperBetaLimit = Math.PI / 2;
  camera3.upperBetaLimit = Math.PI / 2;

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

  const skyLight = new BABYLON.HemisphericLight(
    "skyLight",
    new BABYLON.Vector3(1, -1.05, 0),
    scene
  );

  const upLight = new BABYLON.DirectionalLight(
    "upLight",
    new BABYLON.Vector3(0.5, -1.2, -0.5),
    scene
  );

  upLight.intensity = mapGlobals.lightIntensity * 2;
  upLight.diffuse = new BABYLON.Color3(0.82, 0.89, 0.94);
  // upLight.groundColor = new BABYLON.Color3(0.05, 0, 0.18);

  skyLight.intensity = mapGlobals.lightIntensity;
  skyLight.diffuse = new BABYLON.Color3(0.82, 0.89, 0.94);
  skyLight.groundColor = new BABYLON.Color3(0.05, 0, 0.18);

  scene.ambientColor = mapGlobals.sceneAmbient;

  const atmosphere = BABYLON.MeshBuilder.CreateIcoSphere(
    "atmosphere",
    {
      radius: mapGlobals.size / 2,
      subdivisions: 5,
      updatable: false
    },
    scene
  );
  atmosphere.flipFaces(true);
  atmosphere.freezeWorldMatrix(); // freeze ground

  atmosphere.material = skyMaterial;

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    {
      height: mapGlobals.size,
      width: mapGlobals.size,
      subdivisions: mapGlobals.size / 10,
      updatable: false
    },
    scene
  );

  ground.material = groundMaterial;
  ground.freezeWorldMatrix(); // freeze ground

  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9, friction: 1 },
    scene
  );

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
    pipeline.bloomWeight = 0.9;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.9;
  }

  // Glow
  if (renderGlobals.glow) {
    const glowLayer = new BABYLON.GlowLayer("glow", scene, {
      // mainTextureFixedSize: 32,
      // blurKernelSize: 8,
      // mainTextureSamples: 2
      mainTextureRatio: 0.2
    });

    glowLayer.intensity = renderGlobals.glowIntensity;
    // glowLayer.addIncludedOnlyMesh(projectile);
    glowLayer.addExcludedMesh(ground);
    glowLayer.addExcludedMesh(atmosphere);
  }
  if (mapGlobals.demoSphere) {
    const demoSphere = BABYLON.MeshBuilder.CreateSphere(
      "demoSphere",
      {
        segments: 6,
        diameter: 20,
        updatable: false
      },
      scene
    );
    demoSphere.position = new BABYLON.Vector3(0, 40, 0);
    demoSphere.material = groundMaterial;
  }
  if (renderGlobals.screenshot) {
    setTimeout(() => {
      var imgNm = 0;
      scene.registerAfterRender(function() {
        if (imgNm++ < 50) {
          BABYLON.Tools.CreateScreenshot(engine, camera3, 1024);
        }
      });
    }, 6000);
  }
}
