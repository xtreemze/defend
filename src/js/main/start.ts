// @ts-check
import "babylonjs-inspector";
import "./../../vendor/pep";

import * as BABYLON from "babylonjs";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";

// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");
// Load the 3D engine
// @ts-ignore
const engine = new BABYLON.Engine(canvas, true, {
  // deterministicLockstep: true,
  // lockstepMaxSteps: 4
});

// CreateScene function that creates and return the scene
const createScene = function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.debugLayer.show({ popup: true, initialTab: 2 });
  // const options = BABYLON.SceneOptimizerOptions.LowDegradationAllowed();
  // const optimizer = new BABYLON.SceneOptimizer(scene, options);

  // optimizer.start();
  scene.enablePhysics();

  map1(scene, canvas);
  towers(scene);
  enemies(scene);

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

// @ts-ignore
window.scene = scene;
