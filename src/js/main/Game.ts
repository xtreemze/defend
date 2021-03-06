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
import { mapGlobals, enemyGlobals, renderGlobals, projectileGlobals } from "./globalVariables";
import { map } from "./map";

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
		if (mapGlobals.optimizerOn) {
			// const originalGenerationRate = enemyGlobals.generationRate;
			// const originalTowerLifetime = towerGlobals.lifeTime;
			SceneOptimizer.OptimizeAsync(
				this.scene,
				// SceneOptimizerOptions.HighDegradationAllowed(62),
				// SceneOptimizerOptions.ModerateDegradationAllowed(60),
				SceneOptimizerOptions.LowDegradationAllowed(30),
				function () {
					// On success
					mapGlobals.soundOn = true;
					enemyGlobals.fragments = 1;
					projectileGlobals.particleLimit = 3;
				},
				function () {
					// FPS target not reached
					mapGlobals.soundOn = false;
					enemyGlobals.fragments = 0;
					projectileGlobals.particleLimit = 1;
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
		// Run the render loop.
		this.engine.runRenderLoop(() => {
			this.scene.render();
		});

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
