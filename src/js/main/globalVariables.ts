import { Color3, PhysicsImpostor, Mesh, GroundMesh } from "babylonjs";
import { Position2D } from "../enemy/Enemy";

const mapGlobals = {
  diagnosticsOn: false,
  demoSphere: false,
  size: 200, // map radius
  optimizerOn: true,
  cameraCutDelay: 4200,
  rotateCameras: false,
  rotationSpeedMultiplier: 16, // higher is slower camera rotation
  allImpostors: [] as PhysicsImpostor[],
  impostorLimit: 100, // keep low for mobile device limits
  lightIntensity: 0.79,
  simultaneousSounds: 0, // sounds currently playing for projectiles
  soundDelay: 100,
  soundLimit: 2, // simultaneous sound limit
  projectileSounds: 0, // sounds currently playing for projectiles
  projectileSoundLimit: 1, // simultaneous sound limit for projectiles
  ambientColor: new Color3(0.2, 0.2, 0.2) as Color3,
  sceneAmbient: new Color3(0.01, 0.0, 0.2) as Color3,
  soundOn: false,
  groundMesh: {} as GroundMesh,
  atmosphereMesh: {} as Mesh
};

const projectileGlobals = {
  lifeTime: 2000, // milliseconds
  speed: 12000,
  mass: 100,
  baseHitPoints: 80,
  livingColor: new Color3(1, 0.5, 0.2) as Color3,
  activeParticles: 0,
  particleLimit: 2,
  particleIndex: 0
};

const towerGlobals = {
  minNumber: mapGlobals.size / 90,
  maxNumber: mapGlobals.size / 25,
  rateOfFire: 170, // milliseconds between each shot,
  height: 3,
  mass: 0,
  restitution: 0,
  baseHitPoints: 10000,
  baseCost: 3000,
  allTowers: [] as Mesh[],
  occupiedSpaces: [] as any[],
  specularColor: new Color3(0.19, 0.05, 0.08),
  livingColor: new Color3(0.09, 0.57, 0.42),
  range: 45,
  shoot: true,
  raysOn: false,
  lifeTime: 40000,
  index: 0,
  disposeTime: 6000, // chance to keep towers before dispose
  allPositions: [] as Position2D[]
};

const enemyGlobals = {
  minNumber: 1, // for one generation
  maxNumber: 8, // for one generation
  limit: 0, // wait for this enemy count before next wave
  originHeight: 3,
  generationRate: 8000, // milliseconds
  decisionRate: 100, // milliseconds
  speed: 20000,
  mass: 7000,
  restitution: 0.3,
  jumpForce: 60,
  friction: 1,
  decayRate: 25, // hitpoints per decision
  initialDecayRate: 25, // hitpoints per decision
  baseHitPoints: 10000,
  deadHitPoints: 0,
  fragments: 1,
  allEnemies: [] as Mesh[],
  occupiedSpaces: [] as any[],
  boundaryLimit: 2, // meters
  livingColor: new Color3(0.1, 0.8, 1),
  hitColor: new Color3(0.2, 0, 0.3),
  deadColor: new Color3(0.7, 0.1, 0.05),
  rayHelpers: false,
  index: 0,
  currentWave: 0
};

const economyGlobals = {
  initialBalance: 30000,
  currentBalance: 1,
  maxBalance: 200000,
  restartMessage: false,
  bankSize: 40,
  defeats: 0,
  victories: 0,
  currencyMesh: {} as Mesh,
  currencyMeter: {} as Mesh,
  occupiedSpaces: [
    [-15, -15],
    [-15, -5],
    [-15, 5],
    [-15, 15],
    [-5, 15],
    [-5, 5],
    [-5, -5],
    [-5, -15],
    [5, -15],
    [5, -5],
    [5, 5],
    [5, 15],
    [15, 15],
    [15, 5],
    [15, -5],
    [15, -15]
  ]
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

const materialGlobals = {} as any;

// @ts-ignore
window.globals = {
  projectileGlobals,
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  renderGlobals,
  economyGlobals
};

export {
  projectileGlobals,
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  renderGlobals,
  economyGlobals,
  materialGlobals
};
