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

import * as FX from "../../vendor/wafxr/wafxr";
import { mapGlobals, towerGlobals, enemyGlobals } from "./globalVariables";

import { map } from "./map";

import runtime = require("offline-plugin/runtime");

import { titleScreen } from "../gui/titleScreen";
// import { cameras } from "./cameras";
import { arcCamera } from "./arcCamera";
import { generateMaterials } from "../utility/materialGenerator";
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
  public scene!: Scene;

  constructor(canvasElement: string) {
    this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this.engine = new Engine(this.canvas, true, {
      // preserveDrawingBuffer: true,
      // stencil: true,
      // doNotHandleContextLost: true
    });
    this.engine.enableOfflineSupport = false;
    this.engine.disableManifestCheck = true;
  }

  createScene(): void {
    this.scene = new Scene(this.engine);
    // this.scene.autoClear = false; // Color buffer
    // this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    if (mapGlobals.optimizerOn) {
      // const originalGenerationRate = enemyGlobals.generationRate;
      // const originalTowerLifetime = towerGlobals.lifeTime;
      SceneOptimizer.OptimizeAsync(
        this.scene,
        SceneOptimizerOptions.ModerateDegradationAllowed(55),
        function() {
          // On success
          // towerGlobals.shoot = true;
          // enemyGlobals.generationRate = originalGenerationRate;
          // towerGlobals.lifeTime = originalTowerLifetime;
        },
        function() {
          // FPS target not reached
          // towerGlobals.shoot = false;
          // enemyGlobals.generationRate = originalGenerationRate * 10;
          // towerGlobals.lifeTime = originalTowerLifetime / 5;
        }
      );
    }

    FX.setVolume(1);
    FX._tone.Master.mute = true;

    this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    this.scene.workerCollisions = true;

    generateMaterials(this.scene);
    map(this.scene);

    // cameras(this.scene, this.canvas, this.engine);
    arcCamera(this.scene, this.canvas, this.engine);

    if (mapGlobals.diagnosticsOn) {
      this.scene.debugLayer.show({ popup: true, initialTab: 2 });
    }
  }

  doRender(): void {
    // Run the render loop.
    this.engine.runRenderLoop(() => {
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
    titleScreen(game.scene, game.canvas, game.scene.getPhysicsEngine());
  });
});
