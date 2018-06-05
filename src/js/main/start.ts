// import "babylonjs-inspector";
import "./../../vendor/pep";

import * as BABYLON from "babylonjs";
// import OIMO from "oimo";
// import CANNON from "cannon";
//    import * as  BABYLON from  'babylonjs';

import { enemyGlobals, mapGlobals } from "./variables";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";
import materialGenerator from "./materialGenerator";

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FreeCamera;
  private _light: BABYLON.Light;

  constructor(canvasElement: string) {
    // Create canvas and engine.
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      doNotHandleContextLost: true
    });
    this._engine.enableOfflineSupport = false;
  }

  createScene(): void {
    // Create a basic BJS Scene object.
    this._scene = new BABYLON.Scene(this._engine);

    this._scene.enablePhysics(
      new BABYLON.Vector3(0, -9.81, 0)
      // new BABYLON.CannonJSPlugin()
      // new BABYLON.OimoJSPlugin()
    );
    if (mapGlobals.diagnosticsOn) {
      this._scene.debugLayer.show({ popup: true, initialTab: 2 });
    }

    if (mapGlobals.optimizerOn) {
      const options = BABYLON.SceneOptimizerOptions.LowDegradationAllowed();
      const optimizer = new BABYLON.SceneOptimizer(this._scene, options);

      optimizer.start();
    }
    materialGenerator(this._scene);
    map1(this._scene, this._canvas, this._engine);
    towers(this._scene);
    enemies(this._scene);
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Create the game using the 'renderCanvas'.
  let game = new Game("renderCanvas");

  // Create the scene.
  game.createScene();

  // Start render loop.
  game.doRender();
});
