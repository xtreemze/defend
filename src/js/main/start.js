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
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 130, 0),
    scene
  );
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, false);
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  enemies(scene);
  towers(scene);
  map1(scene);

  // Return the created scene
  return scene;
};
// call the createScene function
const scene = createScene();
// run the render loop
engine.runRenderLoop(() => {
  scene.render();
});
// the canvas/window resize event handler
window.addEventListener("resize", () => {
  engine.resize();
});
