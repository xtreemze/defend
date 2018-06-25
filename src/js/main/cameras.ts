import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Tools,
  Engine,
  FollowCamera
} from "babylonjs";
import {
  mapGlobals,
  renderGlobals,
  towerGlobals,
  enemyGlobals
} from "./globalVariables";
import * as FX from "./../../vendor/wafxr/wafxr";
import randomNumberRange from "./randomNumberRange";

function cameras(scene: Scene, canvas: HTMLCanvasElement, engine: Engine) {
  // Camera1
  const camera = new FollowCamera(
    "follow1",
    new BABYLON.Vector3(0, 10, -10),
    scene
  ) as FollowCamera;

  //The goal distance of camera from target
  camera.radius = 120;

  // The goal height of camera above local origin (centre) of target
  camera.heightOffset = 10;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera.rotationOffset = 0;

  //Acceleration of camera in moving from current to goal position
  camera.cameraAcceleration = 0.003;

  //The speed at which acceleration is halted
  camera.maxCameraSpeed = 8;

  // Camera 2
  const camera2 = new ArcRotateCamera(
    "3/4",
    Math.PI / 6,
    Math.PI / 3.5,
    mapGlobals.size / 6,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Camera4
  const camera4 = new FollowCamera(
    "follow2",
    new BABYLON.Vector3(0, 10, -50),
    scene
  ) as FollowCamera;

  //The goal distance of camera from target
  camera4.radius = 120;

  // The goal height of camera above local origin (centre) of target
  camera4.heightOffset = 10;

  // The goal rotation of camera around local origin (centre) of target in x y plane
  camera4.rotationOffset = 0;

  //Acceleration of camera in moving from current to goal position
  camera4.cameraAcceleration = 0.003;

  //The speed at which acceleration is halted
  camera4.maxCameraSpeed = 8;

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
  camera4.attachControl(canvas, true);

  // Upper Beta Limit
  camera2.upperBetaLimit = Math.PI / 2.01;
  camera3.upperBetaLimit = Math.PI / 2.01;

  // Upper Radius Limit
  camera2.upperRadiusLimit = mapGlobals.size / 2;
  camera3.upperRadiusLimit = mapGlobals.size / 2;

  // Lower Radius Limit
  camera2.lowerRadiusLimit = mapGlobals.size / 12;
  camera3.lowerRadiusLimit = mapGlobals.size / 12;

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
    rotateCamera(camera2);
    rotateCamera(camera3);
  }

  const allCameras = scene.cameras;

  let deltaTime = Date.now();

  scene.registerAfterRender(() => {
    if (Date.now() - deltaTime > mapGlobals.cameraCutDelay) {
      deltaTime = Date.now();

      if (
        allCameras.length > 1 &&
        enemyGlobals.allEnemies.length > 1 &&
        towerGlobals.allTowers.length > 1
      ) {
        switch (allCameras[0].name) {
          case "follow1":
            const followCamera1 = scene.getCameraByName(
              "follow1"
            ) as FollowCamera;
            followCamera1.lockedTarget =
              enemyGlobals.allEnemies[
                randomNumberRange(0, enemyGlobals.allEnemies.length)
              ];
            break;
          case "follow2":
            const followCamera2 = scene.getCameraByName(
              "follow2"
            ) as FollowCamera;
            followCamera2.lockedTarget =
              enemyGlobals.allEnemies[
                randomNumberRange(0, enemyGlobals.allEnemies.length)
              ];
            break;

          default:
            break;
        }
      } else {
        const previousCamera = allCameras.shift();
        allCameras.push(previousCamera);
      }

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
