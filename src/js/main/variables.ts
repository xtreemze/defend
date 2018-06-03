import { Color3 } from "babylonjs";

const projectileGlobals = {
  lifeTime: 800, // milliseconds
  speed: 5000,
  mass: 60,
  restitution: 0,
  baseHitPoints: 40,
  livingColor: new BABYLON.Color3(1, 0.4, 0.6)
};

const towerGlobals = {
  minNumber: 6,
  maxNumber: 25,
  rateOfFire: 200, // milliseconds between each shot,
  height: 2,
  mass: 0,
  restitution: 0,
  baseHitPoints: 0,
  allTowers: [],
  occupiedSpaces: [],
  livingColor: new BABYLON.Color3(0, 1, 0.85),
  range: 50
};

const enemyGlobals = {
  minNumber: 3, // for one generation
  maxNumber: 4, // for one generation
  limit: 12,
  generationRate: 10000, // milliseconds
  decisionRate: 200, // milliseconds
  decayRate: 0.7, // hitpoints per decision
  baseHitPoints: 100,
  deadHitPoints: 25,
  originHeight: 160,
  speed: 6000,
  mass: 1000,
  restitution: 0.3,
  jumpForce: 8,
  allEnemies: [],
  occupiedSpaces: [],
  boundaryLimit: 15, // meters
  livingColor: new BABYLON.Color3(0, 0.7, 1),
  hitColor: new BABYLON.Color3(0.5, 0, 0.5),
  deadColor: new BABYLON.Color3(0.8, 0.2, 0)
};

const mapGlobals = {
  diagnosticsOn: false,
  optimizerOn: false,
  cameraCutDelay: 3000,
  rotateCameras: true,
  rotationSpeedMultiplier: 9,
  allImpostors: [],
  impostorLimit: 100
};

const renderGlobals = {
  pipelineOn: true,
  glow: true,
  sharpenning: false,
  antialiasing: false,
  depthOfField: false,
  bloom: false
};

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
