import { Color3, PhysicsImpostor, Mesh } from "babylonjs";

const mapGlobals = {
  diagnosticsOn: false,
  demoSphere: false,
  size: 1200, // map radius
  optimizerOn: false,
  cameraCutDelay: 3000,
  rotateCameras: true,
  rotationSpeedMultiplier: 16, // higher is slower camera rotation
  allImpostors: [] as PhysicsImpostor[],
  impostorLimit: 100, // keep low for mobile device limits
  lightIntensity: 0.79,
  simultaneousSounds: 0,
  soundDelay: 170,
  soundLimit: 3,
  projectileSounds: 0, // Sounds currently playing
  projectileSoundLimit: 1, // Simultaneous sound limit
  ambientColor: new Color3(0.2, 0.2, 0.2),
  sceneAmbient: new Color3(0.01, 0.0, 0.2)
};

const projectileGlobals = {
  lifeTime: 2000, // milliseconds
  speed: 5000,
  mass: 20,
  restitution: 0,
  baseHitPoints: 10,
  livingColor: new Color3(1, 0.5, 0.2)
};

const towerGlobals = {
  minNumber: mapGlobals.size / 90,
  maxNumber: mapGlobals.size / 25,
  rateOfFire: 200, // milliseconds between each shot,
  height: 2,
  mass: 0,
  restitution: 0,
  baseHitPoints: 0,
  allTowers: [] as Mesh[],
  occupiedSpaces: [] as any[],
  specularColor: new Color3(0.19, 0.05, 0.08),
  livingColor: new Color3(0.09, 0.57, 0.42),
  range: 25,
  shoot: true,
  raysOn: false
};

const enemyGlobals = {
  minNumber: mapGlobals.size / 300, // for one generation
  maxNumber: mapGlobals.size / 30, // for one generation
  limit: mapGlobals.size / 10,
  originHeight: 80,
  generationRate: 8000, // milliseconds
  decisionRate: 200, // milliseconds
  speed: 8000,
  mass: 2000,
  restitution: 0.1,
  jumpForce: 60,
  friction: 1,
  decayRate: 1, // hitpoints per decision
  baseHitPoints: 200,
  deadHitPoints: 0,
  fragments: 1,
  allEnemies: [] as Mesh[],
  occupiedSpaces: [] as any[],
  boundaryLimit: mapGlobals.size / 10, // meters
  livingColor: new Color3(0.1, 0.8, 1),
  hitColor: new Color3(0.2, 0, 0.3),
  deadColor: new Color3(0.7, 0.1, 0.05),
  rayHelpers: false
};

const renderGlobals = {
  pipelineOn: true,
  glow: true,
  glowIntensity: 2.8,
  sharpenning: false,
  antialiasing: false,
  depthOfField: false,
  bloom: true,
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
