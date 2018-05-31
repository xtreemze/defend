// import "babylonjs-inspector";
import "./../../vendor/pep";

// import * as BABYLON from "./../../../node_modules/babylonjs/es6";
import * as BABYLON from "babylonjs";

import { enemyGlobals } from "./variables";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";

// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");

// Load the 3D engine
//@ts-ignore
const engine = new BABYLON.Engine(canvas, true, {
  deterministicLockstep: true,
  lockstepMaxSteps: 4
});

// CreateScene function that creates and return the scene
const createScene = function createScene() {
  const scene = new BABYLON.Scene(engine);
  // scene.enablePhysics();
  scene.enablePhysics(
    new BABYLON.Vector3(0, -9.81, 0)
    // new BABYLON.CannonJSPlugin()
  );

  scene.debugLayer.show({ popup: true, initialTab: 2 });
  // const options = BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
  // const optimizer = new BABYLON.SceneOptimizer(scene, options);

  // optimizer.start();

  map1(scene, canvas);
  enemies(scene);
  towers(scene);

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

//@ts-ignore
window.scene = scene;

scene.registerBeforeRender(() => {
  enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
});
