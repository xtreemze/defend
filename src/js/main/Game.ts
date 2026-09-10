// import "babylonjs-inspector";
import "./../../vendor/pep";
import {
	Engine,
	Scene,
	Vector3,
	SceneOptimizer,
	SceneOptimizerOptions,
	CannonJSPlugin,
	PhysicsEngine
} from "babylonjs";

import * as FX from "../../vendor/wafxr/wafxr";
import { mapGlobals, enemyGlobals, renderGlobals, projectileGlobals, towerGlobals } from "./globalVariables";
import { map } from "./map";
import { detectDeviceCapabilities } from "../utility/deviceDetection";
import { getGlobalPerformanceMonitor } from "../utility/performanceMonitor";

import { titleScreen } from "../gui/titleScreen";
import { arcCamera } from "./arcCamera";
import { generateMaterials } from "../utility/materialGenerator";
import { renderPipeline } from "./renderPipeline";
import { createProjectileInstances } from "../projectile/createProjectileInstance";
import {
	createTowerBaseInstance,
	createTurretInstanceL2,
	createTurretInstanceL3
} from "../tower/createTowerInstance";
import { createIndicatorInstance } from "../tower/indicatorInstance";

class Game {
	public canvas: HTMLCanvasElement;
	public engine: Engine;
	public scene!: Scene;

	constructor(canvasElement: string) {
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
		this.engine = new Engine(
			this.canvas,
			false,
			{
				// preserveDrawingBuffer: true,
				// stencil: true,
				// doNotHandleContextLost: true
			},
			false
		);
		this.engine.enableOfflineSupport = false;
		this.engine.disableManifestCheck = true;
	}

	createScene(): void {
		this.scene = new Scene(this.engine);
		// this.scene.autoClear = false; // Color buffer
		// this.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

		// Apply device-specific settings
		const deviceCap = detectDeviceCapabilities();
		mapGlobals.impostorLimit = deviceCap.impostorLimit;
		projectileGlobals.particleLimit = Math.ceil(deviceCap.maxParticles / 10);
		enemyGlobals.fragments = deviceCap.enemyFragments;

		if (mapGlobals.optimizerOn) {
			// Aggressive FPS targeting based on device capability
			// Mobile: 45 FPS, Desktop: 55 FPS (higher than default 30)
			const targetFPS = deviceCap.quality === "high" ? 55 :
			                  deviceCap.quality === "medium" ? 48 : 45;

			// const originalGenerationRate = enemyGlobals.generationRate;
			// const originalTowerLifetime = towerGlobals.lifeTime;
			SceneOptimizer.OptimizeAsync(
				this.scene,
				SceneOptimizerOptions.LowDegradationAllowed(targetFPS),
				function () {
					// On success - increase quality when FPS target is achieved
					mapGlobals.soundOn = true;
					enemyGlobals.fragments = deviceCap.enemyFragments;
					// Scale particles based on device quality
					projectileGlobals.particleLimit =
						deviceCap.quality === "high" ? Math.ceil(deviceCap.maxParticles / 3) :
						deviceCap.quality === "medium" ? Math.ceil(deviceCap.maxParticles / 5) :
						Math.ceil(deviceCap.maxParticles / 8);
				},
				function () {
					// FPS target not reached - gracefully degrade quality
					mapGlobals.soundOn = false;
					enemyGlobals.fragments = 0;
					projectileGlobals.particleLimit = 1;

					// Adaptive quality reduction based on device tier
					if (deviceCap.quality === "high") {
						// High-end device: reduce some features but keep most
						enemyGlobals.generationRate = 10000;
						towerGlobals.rateOfFire = 30;
						mapGlobals.impostorLimit = Math.floor(deviceCap.impostorLimit * 0.75);
					} else if (deviceCap.quality === "medium") {
						// Medium device: more aggressive reduction
						enemyGlobals.generationRate = 11000;
						towerGlobals.rateOfFire = 40;
						mapGlobals.impostorLimit = Math.floor(deviceCap.impostorLimit * 0.6);
					} else {
						// Low-end device: significant reduction
						enemyGlobals.generationRate = 12000;
						towerGlobals.rateOfFire = 50;
						mapGlobals.impostorLimit = Math.floor(deviceCap.impostorLimit * 0.5);
					}
				}
			);
		}

		FX.setVolume(1);
		FX._tone.Master.mute = true;
		// FX._tone.context.latencyHint = "fastest";
		// FX._tone.Transport.start("+0.5");
		const gravity = -20;
		// const gravity = -9.81;
		// const gravity = -9.81 * 2;
		this.scene.enablePhysics(new Vector3(0, gravity, 0), new CannonJSPlugin());

		this.scene.workerCollisions = false;

		generateMaterials(this.scene);
		map(this.scene);

		createIndicatorInstance();
		createTowerBaseInstance();
		createTurretInstanceL2(this.scene);
		createTurretInstanceL3(this.scene);
		createProjectileInstances();

		arcCamera(this.scene, this.canvas);

		if (mapGlobals.diagnosticsOn) {
			this.scene.debugLayer.show({ popup: true, initialTab: 2 });
		}

		// this.scene.cleanCachedTextureBuffer();
	}

	doRender(): void {
		// Performance monitoring
		const perfMonitor = getGlobalPerformanceMonitor();
		perfMonitor.start();

		// Run the render loop.
		this.engine.runRenderLoop(() => {
			perfMonitor.update();
			this.scene.render();
		});

		// Log performance stats every 10 seconds
		setInterval(() => {
			perfMonitor.logStats();
		}, 10000);

		// The canvas/window resize event handler.
		window.addEventListener("resize", () => {
			this.engine.resize();
		});
	}
}

window.addEventListener("DOMContentLoaded", () => {
	let game = new Game("renderCanvas");

	game.createScene();

	const physicsEngine = game.scene.getPhysicsEngine() as PhysicsEngine;
	if (physicsEngine !== null) {
		titleScreen(game.scene, game.canvas, physicsEngine);
	}

	renderPipeline(game.scene);

	game.doRender();
});
