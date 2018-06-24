// import "babylonjs-inspector";
import "./../../vendor/pep";
import {
  Engine,
  Scene,
  Vector3,
  SceneOptimizer,
  SceneOptimizerOptions,
  CannonJSPlugin
} from "babylonjs";

import * as FX from "./../../vendor/wafxr/wafxr";
import { mapGlobals } from "./globalVariables";

import { map } from "./map";

import runtime = require("offline-plugin/runtime");

import { titleScreen } from "./titleScreen";
import { cameras } from "./cameras";
import { generateMaterials } from "./materialGenerator";
import { renderPipeline } from "./renderPipeline";
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
  public canvas: HTMLCanvasElement;
  public engine: Engine;
  public scene: Scene;

  constructor(canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true, {
      // preserveDrawingBuffer: true,
      // stencil: true,
      // doNotHandleContextLost: true
    });
    // this.engine.enableOfflineSupport = false;
    // this.engine.disableManifestCheck = true;
  }

  createScene(): void {
    this.scene = new Scene(this.engine);

    FX.setVolume(1);
    FX._tone.Master.mute = true;

    if (mapGlobals.optimizerOn) {
      const options = SceneOptimizerOptions.HighDegradationAllowed();
      const optimizer = new SceneOptimizer(this.scene, options);

      optimizer.start();
    }

    this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    this.scene.workerCollisions = true;

    generateMaterials(this.scene);
    map(this.scene);
    cameras(this.scene, this.canvas, this.engine);

    if (mapGlobals.diagnosticsOn) {
      this.scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    // Run the render loop.
    this.engine.runRenderLoop(() => {
      const cameraDirection = this.scene.activeCamera.getForwardRay()
        .direction as Vector3;
      const cameraUp = this.scene.activeCamera.upVector as Vector3;

      FX.setListenerPosition(
        this.scene.activeCamera.position.x,
        this.scene.activeCamera.position.y,
        this.scene.activeCamera.position.z
      );

      FX._tone.Listener.setOrientation(
        -cameraDirection.x,
        -cameraDirection.y,
        -cameraDirection.z,
        cameraUp.x,
        cameraUp.y,
        cameraUp.z
      );

      this.scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this.engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  let game = new Game("renderCanvas");

  game.createScene();

  game.doRender();

  renderPipeline(game.scene);

  window.addEventListener("load", () => {
    titleScreen(game.scene, game.canvas);
  });
});
