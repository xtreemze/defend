// @ts-check

import * as BABYLON from "babylonjs";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";

// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  // preserveDrawingBuffer: true,
  // stencil: true
});

// CreateScene function that creates and return the scene
const createScene = function createScene() {
  const scene = new BABYLON.Scene(engine);
  const options = new BABYLON.SceneOptimizerOptions();
  const optimizer = new BABYLON.SceneOptimizer(scene, options);

  optimizer.start();
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

window.scene = scene;
