import { Scene, ArcRotateCamera, Vector3, Engine, Camera } from "babylonjs";
import { mapGlobals } from "./globalVariables";
import * as FX from "../../vendor/wafxr/wafxr";

function arcCamera(scene: Scene, canvas: HTMLCanvasElement, engine: Engine) {
  // Camera1
  const camera = new ArcRotateCamera(
    "arc",
    0,
    Math.PI / 8,
    mapGlobals.size / 1.8,
    Vector3.Zero(),
    scene
  ) as ArcRotateCamera;

  // Attach Control
  camera.attachControl(canvas, true);

  // Attach Control
  camera.upperRadiusLimit = mapGlobals.size * 3;
  camera.lowerRadiusLimit = mapGlobals.size / 6;

  camera.upperBetaLimit = Math.PI / 2;

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
}

export { arcCamera };
