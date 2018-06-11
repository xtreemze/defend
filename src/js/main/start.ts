// import "babylonjs-inspector";
import "./../../vendor/pep";

import * as BABYLON from "babylonjs";
import * as fx from "../../vendor/wafxr/wafxr";
import { mapGlobals } from "./variables";

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
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

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

    this._scene.enablePhysics(
      new BABYLON.Vector3(0, -9.81, 0),
      new BABYLON.CannonJSPlugin()
      // new BABYLON.OimoJSPlugin()
    );
    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }

    this._scene.workerCollisions = true;

    materialGenerator(this._scene);
    map1(this._scene, this._canvas, this._engine);
    setTimeout(() => {
      towers(this._scene);
      enemies(this._scene);
    }, 3000);

    if (mapGlobals.optimizerOn) {
      const options = BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new BABYLON.SceneOptimizer(this._scene, options);

      optimizer.start();
    }
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      const cameraDirection = this._scene.activeCamera.getDirection(
        BABYLON.Vector3.Zero()
      ) as BABYLON.Vector3;
      fx.setListenerPosition(
        this._scene.activeCamera.position.x,
        this._scene.activeCamera.position.y,
        this._scene.activeCamera.position.z
      );

      fx.setListenerAngle(cameraDirection.y);

      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fx._tone.Master.mute = true;

  let game = new Game("renderCanvas");

  game.createScene();

  game.doRender();

  fx._tone.Master.mute = false;
  fx.setVolume(1);
});

function muting() {
  fx._tone.Master.mute = false;

  window.removeEventListener("click", window => {
    muting();
  });
}

window.addEventListener("click", window => {
  muting();
});
