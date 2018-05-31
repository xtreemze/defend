import { Color3 } from "babylonjs";

const towerGlobals = {
  minNumber: 6,
  maxNumber: 25,
  rateOfFire: 200, // milliseconds between each shot
  mass: 0,
  baseHitPoints: 0,
  occupiedSpaces: [],
  livingColor: new BABYLON.Color3(0, 1, 0.85)
};

const enemyGlobals = {
  minNumber: 3,
  maxNumber: 4,
  generationRate: 5000, // milliseconds
  lifeTime: 15000, // milliseconds
  decisionRate: 200, // milliseconds
  decayRate: 1, // hitpoints per decision
  baseHitPoints: 100,
  deadHitPoints: 30,
  originHeight: 180,
  mass: 2000,
  restitution: 0.2,
  speed: 10000,
  jumpForce: 10,
  allEnemies: [],
  occupiedSpaces: [],
  boundaryLimit: 15, // meters
  livingColor: new BABYLON.Color3(0, 0.7, 1),
  hitColor: new BABYLON.Color3(0.5, 0, 0.5),
  deadColor: new BABYLON.Color3(0.9, 0.2, 0)
};

const projectileGlobals = {
  lifeTime: 500, // milliseconds
  mass: 20,
  restitution: 0,
  baseHitPoints: 20,
  speed: 1200,
  livingColor: new BABYLON.Color3(1, 1, 1)
};

export { towerGlobals, enemyGlobals, projectileGlobals };
