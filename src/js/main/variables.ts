import { Color3 } from "babylonjs";

const projectileGlobals = {
  lifeTime: 800, // milliseconds
  speed: 4000,
  mass: 50,
  restitution: 0.1,
  baseHitPoints: 10,
  livingColor: new Color3(1, 0.5, 0.94)
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
  livingColor: new Color3(0.05, 0.62, 0.41),
  range: 50
};

const enemyGlobals = {
  minNumber: 3, // for one generation
  maxNumber: 4, // for one generation
  limit: 12,
  generationRate: 8000, // milliseconds
  decisionRate: 100, // milliseconds
  decayRate: 1, // hitpoints per decision
  baseHitPoints: 200,
  deadHitPoints: 30,
  originHeight: 160,
  speed: 15000,
  mass: 1000,
  restitution: 0.3,
  jumpForce: 8,
  allEnemies: [],
  occupiedSpaces: [],
  boundaryLimit: 45, // meters
  livingColor: new Color3(0.1, 0.8, 1),
  hitColor: new Color3(0.2, 0, 0.3),
  deadColor: new Color3(0.7, 0.1, 0.05)
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
  lightIntensity: 1.8,
  ambientColor: new BABYLON.Color3(0.1, 0.5, 0.3),
  sceneAmbient: new BABYLON.Color3(0.1, 0.1, 0.3)
};

const renderGlobals = {
  pipelineOn: true,
  glow: true,
  sharpenning: false,
  antialiasing: false,
  depthOfField: false,
  bloom: false
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
