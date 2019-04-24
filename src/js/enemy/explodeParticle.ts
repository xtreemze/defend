import {
	Scene,
	Vector3,
	Color4,
	ParticleSystem,
	GPUParticleSystem
} from "babylonjs";
import { createTexture } from "./flare";
import { projectileGlobals, renderGlobals } from "../main/globalVariables";

function explosion (scene: Scene, projectilePosition: Vector3, level: Number) {
	if (projectileGlobals.particleLimit > projectileGlobals.activeParticles) {
		projectileGlobals.activeParticles += 1;

		const node = projectilePosition;
		let particleSystem: ParticleSystem | GPUParticleSystem;
		if (GPUParticleSystem.IsSupported === false) {
			particleSystem = new ParticleSystem(
				"particles" + projectileGlobals.particleIndex,
				12,
				scene
			) as ParticleSystem;


		} else {

			particleSystem = new GPUParticleSystem(
				"particles" + projectileGlobals.particleIndex,
				{ capacity: 16 },
				scene
			) as GPUParticleSystem;
		}

		particleSystem.renderingGroupId = 0;
		particleSystem.emitRate = 200;
		particleSystem.updateSpeed = 0.008;
		particleSystem.minEmitPower = 4;
		// @ts-ignore
		particleSystem.maxEmitPower = 7 * level;
		particleSystem.minLifeTime = 0.2;
		particleSystem.maxLifeTime = 0.25;
		particleSystem.minSize = 0.5;
		// @ts-ignore
		particleSystem.maxSize = level;
		particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
		particleSystem.gravity = new Vector3(0, -700, 0);
		particleSystem.color1 = new Color4(1, 0.5, 0, 1);
		particleSystem.color2 = new Color4(0.75, 0.4, 0.1, 1);
		particleSystem.colorDead = new Color4(0.1, 0.08, 0.3, 1);
		particleSystem.id = "particles" + projectileGlobals.particleIndex
		particleSystem.name = "particles" + projectileGlobals.particleIndex;
		particleSystem.particleTexture = createTexture(scene);
		// @ts-ignore
		particleSystem.direction1 = new Vector3(-2.5 * level, 3 * level * level, 2.5 * level);
		// @ts-ignore
		particleSystem.direction2 = new Vector3(2.5 * level, 2 * level * level, -2.5 * level);
		particleSystem.minEmitBox = new Vector3(-2, -6, -2);
		particleSystem.maxEmitBox = new Vector3(2, 6, 2);

		particleSystem.emitter = node;

		projectileGlobals.particleIndex += 1;

		particleSystem.disposeOnStop = true;
		setTimeout(() => {
			particleSystem.stop();
			// @ts-ignore
		},  80 * level);

		setTimeout(() => {
			particleSystem.reset()
			particleSystem.dispose(false);
			projectileGlobals.activeParticles -= 1;
		}, 500);

		particleSystem.start();
	}
}
export { explosion };
