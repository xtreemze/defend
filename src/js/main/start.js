// @ts-check

import * as BABYLON from "babylonjs";

// Get the canvas DOM element
const canvas = document.getElementById("renderCanvas");
// Load the 3D engine
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});
// CreateScene function that creates and return the scene
const createScene = function createScene() {
  // Create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine);
  // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
  const camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 130, 0),
    scene
  );
  // Target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  // Attach the camera to the canvas
  camera.attachControl(canvas, false);
  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const sphereStart = BABYLON.MeshBuilder.CreateSphere(
    "sphere1",
    {
      segments: 2,
      diameter: 2
    },
    scene
  );
  const sphereEnd = BABYLON.MeshBuilder.CreateSphere(
    "sphere1",
    {
      segments: 2,
      diameter: 2
    },
    scene
  );
  // Move the sphere upward 1/2 of its height
  // sphere.position.y = 1;
  sphereStart.position = new BABYLON.Vector3(-50, 1, -50);
  sphereEnd.position = new BABYLON.Vector3(50, 1, 50);
  // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground1",
    {
      height: 100,
      width: 100,
      subdivisions: 100
    },
    scene
  );
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
