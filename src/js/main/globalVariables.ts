import {
	Color3,
	PhysicsImpostor,
	Mesh,
	GroundMesh,
	HemisphericLight,
	DirectionalLight
} from "babylonjs";
import { Position2D } from "../enemy/Enemy";
import { LiveProjectileInstance } from "../projectile/startLife";

const mapGlobals = {
	optimizerOn: true,
	diagnosticsOn: false,
	demoSphere: false,
	size: 260, // map radius
	allImpostors: [] as PhysicsImpostor[],
	impostorLimit: 80, // keep low for mobile device limits
	lightIntensity: 0.70,
	simultaneousSounds: 0, // sounds currently playing for projectiles
	soundDelay: 60,
	soundLimit: 1, // simultaneous sound limit
	projectileSounds: 0, // sounds currently playing for projectiles
	projectileSoundLimit: 1, // simultaneous sound limit for projectiles
	ambientColor: new Color3(0.22, 0.26, 0.2) as Color3,
	sceneAmbient: new Color3(0.01, 0.0, 0.26) as Color3,
	soundOn: false,
	groundMesh: {} as GroundMesh,
	atmosphereMesh: {} as Mesh,
	skyLight: {} as HemisphericLight,
	upLight: {} as DirectionalLight
};

const projectileGlobals = {
	projectileMeshL2: {} as any | LiveProjectileInstance,
	projectileMeshL3: {} as any | LiveProjectileInstance,
	lifeTime: 1100, // milliseconds
	speed: 3320,
	mass: 30,
	baseHitPoints: 220,
	livingColor: new Color3(1, 0.5, 0.2) as Color3,
	activeParticles: 0,
	particleLimit: 1,
	particleIndex: 0
};

const towerGlobals = {
	turretMeshL2: {} as Mesh,
	turretMeshL3: {} as Mesh,
	towerBaseMesh: {} as Mesh,
	indicator: {} as Mesh,
	lookAheadRatio: 1600,
	rateOfFire: 26, // milliseconds between each shot,
	height: 3,
	mass: 0,
	restitution: 0,
	baseHitPoints: 10000,
	baseCost: 3000,
	allTowers: [] as Mesh[],
	occupiedSpaces: [] as any[],
	specularColor: new Color3(0.3, 0.071, 0.1),
	livingColor: new Color3(0.1, 0.64, 0.4),
	range: 45,
	shoot: true,
	raysOn: false,
	lifeTime: 25000,
	index: 0,
	disposeTime: 4000, // chance to keep towers before dispose
	allPositions: [] as Position2D[]
};

const enemyGlobals = {
	enemyMeshL1: {} as Mesh,
	enemyMeshL2: {} as Mesh,
	enemyMeshL3: {} as Mesh,
	minNumber: 1, // for one generation
	maxNumber: 8, // for one generation
	limit: 0, // wait for this enemy count before next wave
	originHeight: 40,
	generationRate: 8000, // milliseconds
	decisionRate: 110, // milliseconds
	speed: 7400,
	mass: 5400,
	restitution: 0.08,
	jumpForce: 80,
	friction: 0.8,
	decayRate: 20, // hitpoints per decision
	initialDecayRate: 20, // hitpoints per decision
	baseHitPoints: 15000,
	deadHitPoints: 0,
	fragments: 1,
	allEnemies: [] as Mesh[],
	occupiedSpaces: [] as any[],
	boundaryLimit: 2.5, // meters
	livingColor: new Color3(0.1, 0.76, 0.93),
	hitColor: new Color3(0.2, 0, 0.3),
	deadColor: new Color3(0.7, 0.1, 0.05),
	rayHelpers: false,
	index: 0,
	currentWave: 0
};

const economyGlobals = {
	bestLevel: 0,
	startTime: Date.now(),
	bestTime: Date.now(),
	rampUpValue: 800,
	energyRecoveryRatio: 0.14,
	initialBalance: 30000,
	maxBalance: 30000,
	currentBalance: 1,
	restartMessage: false as boolean,
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
	],
	guiString: ""
};

const renderGlobals = {
	gpuParticles: true,
	pipelineOn: true,
	glow: true,
	glowIntensity: 2.7,
	sharpenning: false,
	antialiasing: false,
	depthOfField: false,
	bloom: false,
	screenshot: false
};

const materialGlobals = {} as any;

// @ts-ignore
// window.globals = {
//   projectileGlobals,
//   towerGlobals,
//   enemyGlobals,
//   mapGlobals,
//   renderGlobals,
//   economyGlobals
// };

export {
	projectileGlobals,
	towerGlobals,
	enemyGlobals,
	mapGlobals,
	renderGlobals,
	economyGlobals,
	materialGlobals
};
