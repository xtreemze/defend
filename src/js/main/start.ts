// import "babylonjs-inspector";
import "./../../vendor/pep";

import * as BABYLON from "babylonjs";

import * as FX from "./../../vendor/wafxr/wafxr";
import {
  mapGlobals,
  towerGlobals,
  projectileGlobals,
  enemyGlobals
} from "./variables";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";
import materialGenerator from "./materialGenerator";

import runtime = require("offline-plugin/runtime");
runtime.install({
  onUpdating: () => {},
  onUpdateReady: () => {
    runtime.applyUpdate();
  },
  onUpdated: () => {
    window.location.reload();
  },
  onUpdateFailed: () => {}
});
class Game {
  public _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  public _scene: BABYLON.Scene;
  // private _camera: BABYLON.FreeCamera;
  // private _light: BABYLON.Light;

  constructor(canvasElement: string) {
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      doNotHandleContextLost: true
    });
    this._engine.enableOfflineSupport = false;
    this._engine.disableManifestCheck = true;
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);

    FX.setVolume(1);
    FX._tone.Master.mute = true;

    if (mapGlobals.optimizerOn) {
      const options = BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new BABYLON.SceneOptimizer(this._scene, options);

      optimizer.start();
    }

    this._scene.enablePhysics(
      new BABYLON.Vector3(0, -9.81, 0),
      new BABYLON.CannonJSPlugin()
    );

    this._scene.workerCollisions = true;

    materialGenerator(this._scene);
    map1(this._scene, this._canvas, this._engine);

    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      const cameraDirection = this._scene.activeCamera.getDirection(
        BABYLON.Vector3.Zero()
      ) as BABYLON.Vector3;
      cameraDirection.normalize();

      FX.setListenerPosition(
        this._scene.activeCamera.position.x,
        this._scene.activeCamera.position.y,
        this._scene.activeCamera.position.z
      );

      FX.setListenerAngle(-cameraDirection.y);

      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game = new Game("renderCanvas");

  game.createScene();

  game.doRender();

  window.addEventListener("load", () => {
    const body = document.getElementById("body");

    const startButton = document.createElement("button");
    body.insertBefore(startButton, game._canvas);
    startButton.innerText = `Start!`;
    startButton.id = "startButton";
    startButton.setAttribute(
      "style",
      `
  position: absolute;
  background-color: ${mapGlobals.sceneAmbient.toHexString()};
  color: ${projectileGlobals.livingColor.toHexString()};
  border-color: ${projectileGlobals.livingColor.toHexString()};
  top: 50vh;
  left: 50vw;
  width: 6rem;
  height: 3rem;
  margin-top: -1.5rem;
  margin-left: -3rem;
  border-radius: 8rem;
  font-weight: 600;
`
    );

    startButton.addEventListener("click", () => {
      towers(game._scene);
      enemies(game._scene);
      FX._tone.context.resume();
      FX._tone.Master.mute = false;
      startButton.parentNode.removeChild(startButton);
    });
  });
});
