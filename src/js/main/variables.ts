import { Color3 } from "babylonjs";

const projectileGlobals = {
  lifeTime: 800, // milliseconds
  speed: 4000,
  mass: 50,
  restitution: 0,
  baseHitPoints: 5,
  livingColor: new Color3(1, 0.5, 0.2)
};

const towerGlobals = {
  minNumber: 6,
  maxNumber: 25,
  rateOfFire: 200, // milliseconds between each shot,
  height: 2,
  mass: 0,
  restitution: 0.1,
  baseHitPoints: 0,
  allTowers: [],
  occupiedSpaces: [],
  specularColor: new Color3(0.19, 0.05, 0.08),
  livingColor: new Color3(0.09, 0.57, 0.42),
  range: 25,
  shoot: true,
  raysOn: false
};

const enemyGlobals = {
  minNumber: 3, // for one generation
  maxNumber: 4, // for one generation
  limit: 12,
  originHeight: 80,
  generationRate: 8000, // milliseconds
  decisionRate: 200, // milliseconds
  speed: 23000,
  mass: 5000,
  restitution: 0.1,
  jumpForce: 40,
  friction: 1,
  decayRate: 1, // hitpoints per decision
  baseHitPoints: 200,
  deadHitPoints: 30,
  allEnemies: [],
  occupiedSpaces: [],
  boundaryLimit: 35, // meters
  livingColor: new Color3(0.1, 0.8, 1),
  hitColor: new Color3(0.2, 0, 0.3),
  deadColor: new Color3(0.7, 0.1, 0.05),
  rayHelpers: false
};

const mapGlobals = {
  diagnosticsOn: false,
  demoSphere: false,
  optimizerOn: false,
  cameraCutDelay: 3000,
  rotateCameras: true,
  rotationSpeedMultiplier: 16, // higher is sloewr
  allImpostors: [],
  impostorLimit: 100,
  lightIntensity: 0.79,
  ambientColor: new BABYLON.Color3(0.2, 0.2, 0.2),
  sceneAmbient: new BABYLON.Color3(0.01, 0.0, 0.2)
};

const renderGlobals = {
  pipelineOn: true,
  glow: true,
  glowIntensity: 2.8,
  sharpenning: false,
  antialiasing: false,
  depthOfField: false,
  bloom: false,
  screenshot: false
};

const allMaterials = {};

//@ts-ignore
window.globals = {
  projectileGlobals,
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  renderGlobals
};

export {
  projectileGlobals,
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  renderGlobals
};
