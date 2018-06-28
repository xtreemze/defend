import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Tools,
  Engine,
  Camera
} from "babylonjs";
import {
  mapGlobals,
  renderGlobals,
  towerGlobals,
  enemyGlobals
} from "./globalVariables";
import * as FX from "../../vendor/wafxr/wafxr";
import randomNumberRange from "../utility/randomNumberRange";

function cameras(scene: Scene, canvas: HTMLCanvasElement, engine: Engine) {
  // Camera1
  const camera = new ArcRotateCamera(
    "follow1",
    Math.PI / 4,
    Math.PI / 2.15,
    mapGlobals.size / 5,
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

  // Camera4
  const camera4 = new ArcRotateCamera(
    "arcFollow1",
    Math.PI / 2,
    Math.PI / 12,
    mapGlobals.size / 6,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Camera 3
  const camera3 = new ArcRotateCamera(
    "closeup",
    Math.PI / 1,
    Math.PI / 2.15,
    mapGlobals.size / 8,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Attach Control
  camera.attachControl(canvas, true);
  camera2.attachControl(canvas, true);
  camera3.attachControl(canvas, true);
  camera4.attachControl(canvas, true);
  // Attach Control
  camera.upperRadiusLimit = mapGlobals.size / 3;
  camera2.upperRadiusLimit = mapGlobals.size / 3;
  camera3.upperRadiusLimit = mapGlobals.size / 3;
  camera4.upperRadiusLimit = mapGlobals.size / 3;

  const rotateCamera = (camera: ArcRotateCamera) => {
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
    rotateCamera(camera4);
  }

  scene.registerBeforeRender(() => {
    const activeCamera = scene.activeCamera as Camera;
    const cameraDirection = activeCamera.getForwardRay().direction as Vector3;
    const cameraUp = activeCamera.upVector as Vector3;

    FX.setListenerPosition(
      activeCamera.position.x,
      activeCamera.position.y,
      activeCamera.position.z
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
        const rotateCamera = allCameras[0] as ArcRotateCamera;
        rotateCamera.lockedTarget =
          enemyGlobals.allEnemies[
            randomNumberRange(0, enemyGlobals.allEnemies.length)
          ];
      } else {
        const previousCamera = allCameras.shift() as Camera;
        allCameras.push(previousCamera);
      }

      scene.setActiveCameraByID(allCameras[0].id);

      const previousCamera = allCameras.shift() as Camera;
      allCameras.push(previousCamera);
      const activeCamera = scene.activeCamera as Camera;
      activeCamera.inertia = 0;
      setTimeout(() => {
        activeCamera.inertia = 0.9;
      }, 100);
    }
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
