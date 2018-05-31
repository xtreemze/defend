const towerGlobals = {
  minNumber: 6,
  maxNumber: 25,
  rateOfFire: 200, // milliseconds between each shot
  mass: 0,
  baseHitPoints: 0,
  occupiedSpaces: []
};

const enemyGlobals = {
  minNumber: 3,
  maxNumber: 4,
  generationRate: 5000, // milliseconds
  lifeTime: 15000, // milliseconds
  decisionRate: 200, // milliseconds
  decayRate: 4, // hitpoints per decision
  baseHitPoints: 100,
  deadHitPoints: 30,
  mass: 2000,
  speed: 10000,
  jumpForce: 10,
  allEnemies: [],
  occupiedSpaces: []
};

const projectileGlobals = {
  lifeTime: 500, // milliseconds
  mass: 20,
  baseHitPoints: 20,
  speed: 1200
};

export { towerGlobals, enemyGlobals, projectileGlobals };
