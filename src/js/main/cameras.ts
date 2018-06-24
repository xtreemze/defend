import { Scene, ArcRotateCamera, Vector3, Tools, Engine } from "babylonjs";
import { mapGlobals, renderGlobals } from "./globalVariables";
import * as FX from "./../../vendor/wafxr/wafxr";

function cameras(scene: Scene, canvas: HTMLCanvasElement, engine: Engine) {
  // Camera1
  const camera = new ArcRotateCamera(
    "overhead",
    Math.PI / 3,
    Math.PI / 14,
    mapGlobals.size / 6,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Camera 2
  const camera2 = new ArcRotateCamera(
    "3/4",
    Math.PI / 6,
    Math.PI / 3.5,
    mapGlobals.size / 6,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Camera 3
  const camera3 = new ArcRotateCamera(
    "closeup",
    Math.PI / 1,
    Math.PI / 2.1,
    mapGlobals.size / 12,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Attach Control
  camera.attachControl(canvas, true);
  camera2.attachControl(canvas, true);
  camera3.attachControl(canvas, true);

  // Upper Beta Limit
  camera.upperBetaLimit = Math.PI / 2.01;
  camera2.upperBetaLimit = Math.PI / 2.01;
  camera3.upperBetaLimit = Math.PI / 2.01;

  // Upper Radius Limit
  camera.upperRadiusLimit = mapGlobals.size / 2;
  camera2.upperRadiusLimit = mapGlobals.size / 2;
  camera3.upperRadiusLimit = mapGlobals.size / 2;

  // Lower Radius Limit
  camera.lowerRadiusLimit = mapGlobals.size / 12;
  camera2.lowerRadiusLimit = mapGlobals.size / 12;
  camera3.lowerRadiusLimit = mapGlobals.size / 12;

  camera.panningDistanceLimit = mapGlobals.size / 5;
  camera2.panningDistanceLimit = mapGlobals.size / 5;
  camera3.panningDistanceLimit = mapGlobals.size / 5;

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

  let deltaTime = Date.now();

  scene.registerAfterRender(() => {
    if (Date.now() - deltaTime > mapGlobals.cameraCutDelay) {
      deltaTime = Date.now();
      scene.setActiveCameraByID(allCameras[0].id);
      const previousCamera = allCameras.shift();
      allCameras.push(previousCamera);
      scene.activeCamera.inertia = 0;
      setTimeout(() => {
        scene.activeCamera.inertia = 0.9;
      }, 100);
    }

    const cameraDirection = allCameras[0].getForwardRay().direction as Vector3;
    const cameraUp = allCameras[0].upVector as Vector3;

    FX.setListenerPosition(
      allCameras[0].position.x,
      allCameras[0].position.y,
      allCameras[0].position.z
    );

    FX._tone.Listener.setOrientation(
      -cameraDirection.x,
      -cameraDirection.y,
      -cameraDirection.z,
      cameraUp.x,
      cameraUp.y,
      cameraUp.z
    );
  });

  if (renderGlobals.screenshot) {
    setTimeout(() => {
      var imgNm = 0;
      scene.registerAfterRender(function() {
        if (imgNm++ < 50) {
          Tools.CreateScreenshot(engine, camera3, 1024);
        }
      });
    }, 6000);
  }
}

export { cameras };
