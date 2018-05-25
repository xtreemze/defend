// @ts-check

import * as BABYLON from "babylonjs";

import enemies from "./enemies";
import towers from "./towers";
import map1 from "./map1";

// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});

// CreateScene function that creates and return the scene
const createScene = function createScene() {
  const scene = new BABYLON.Scene(engine);

  enemies(scene);
  towers(scene);
  map1(scene, canvas);

  return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
  scene.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});
