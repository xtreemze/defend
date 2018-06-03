import { Color3 } from "./../../../node_modules/babylonjs/es6";

const projectileGlobals = {
  lifeTime: 800, // milliseconds
  speed: 4000,
  mass: 50,
  restitution: 0.1,
  baseHitPoints: 10,
  livingColor: new Color3(1, 0.4, 0.6)
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
  livingColor: new Color3(0, 1, 0.85),
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
  livingColor: new Color3(0, 0.7, 1),
  hitColor: new Color3(0.5, 0, 0.5),
  deadColor: new Color3(0.8, 0.2, 0)
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
