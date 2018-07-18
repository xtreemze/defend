// import "babylonjs-inspector";
import "../../vendor/manup.js";
import "./../../vendor/pep";
import {
  Engine,
  Scene,
  Vector3,
  SceneOptimizer,
  SceneOptimizerOptions,
  CannonJSPlugin,
  PhysicsEngine
} from "babylonjs";

import * as FX from "../../vendor/wafxr/wafxr";
import { mapGlobals } from "./globalVariables";
import { map } from "./map";

import runtime = require("offline-plugin/runtime");

import { titleScreen } from "../gui/titleScreen";
// import { cameras } from "./cameras";
import { arcCamera } from "./arcCamera";
import { generateMaterials } from "../utility/materialGenerator";
import { renderPipeline } from "./renderPipeline";
import { createProjectileInstances } from "../projectile/createProjectileInstance";
import {
  createTowerBaseInstance,
  createTurretInstanceL2,
  createTurretInstanceL3
} from "../tower/createTowerInstance";

function sw() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../../sw2.js")
      .then(function() {
        console.log("Service Worker registered successfully");
      })
      .catch(function() {
        console.log("Service worker registration failed");
      });
  }
}

sw();

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
    this.engine = new Engine(
      this.canvas,
      false,
      {
        // preserveDrawingBuffer: true,
        // stencil: true,
        // doNotHandleContextLost: true
      },
      true
    );
    this.engine.enableOfflineSupport = false;
    this.engine.disableManifestCheck = true;
  }

  createScene(): void {
    this.scene = new Scene(this.engine);
    this.scene.autoClear = false; // Color buffer
    this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    if (mapGlobals.optimizerOn) {
      // const originalGenerationRate = enemyGlobals.generationRate;
      // const originalTowerLifetime = towerGlobals.lifeTime;
      SceneOptimizer.OptimizeAsync(
        this.scene,
        SceneOptimizerOptions.LowDegradationAllowed(55),
        function() {
          // On success
        },
        function() {
          // FPS target not reached
        }
      );
    }

    FX.setVolume(1);
    FX._tone.Master.mute = true;

    this.scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin());

    this.scene.workerCollisions = true;

    generateMaterials(this.scene);
    map(this.scene);
    createTowerBaseInstance();
    createTurretInstanceL2(this.scene);
    createTurretInstanceL3(this.scene);
    createProjectileInstances();

    arcCamera(this.scene, this.canvas);

    if (mapGlobals.diagnosticsOn) {
      this.scene.debugLayer.show({ popup: true, initialTab: 2 });
    }

    this.scene.cleanCachedTextureBuffer();
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

  const physicsEngine = game.scene.getPhysicsEngine() as PhysicsEngine;
  if (game.scene.getPhysicsEngine() !== null) {
    titleScreen(game.scene, game.canvas, physicsEngine);
  }

  renderPipeline(game.scene);

  game.doRender();
});
