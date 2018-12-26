import {
	Scene,
	Vector3,
	Color4,
	ParticleSystem,
	GPUParticleSystem
} from "babylonjs";
import { createTexture } from "./flare";
import { projectileGlobals, renderGlobals } from "../main/globalVariables";
function explosion(scene: Scene, projectilePosition: Vector3) {
	if (projectileGlobals.particleLimit > projectileGlobals.activeParticles) {
		projectileGlobals.activeParticles += 1;

		const node = projectilePosition;
		let particleSystem: any;
		if (renderGlobals.gpuParticles) {
			particleSystem = new ParticleSystem(
				"particles" + projectileGlobals.particleIndex,
				30,
				scene
			) as ParticleSystem;


		} else {

			particleSystem = new GPUParticleSystem(
				"particles" + projectileGlobals.particleIndex,
				{ capacity: 20 },
				scene
			) as GPUParticleSystem;
		}


		particleSystem.renderingGroupId = 0;
		particleSystem.emitRate = 170;
		particleSystem.updateSpeed = 0.008;
		particleSystem.minEmitPower = 7;
		particleSystem.maxEmitPower = 15;
		particleSystem.minLifeTime = 0.3;
		particleSystem.maxLifeTime = 0.38;
		particleSystem.minSize = 0.7;
		particleSystem.maxSize = 1.9;
		particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
		particleSystem.gravity = new Vector3(0, -700, 0);
		particleSystem.color1 = new Color4(1, 0.5, 0, 1);
		particleSystem.color2 = new Color4(0.75, 0.4, 0.1, 1);
		particleSystem.colorDead = new Color4(0.1, 0.08, 0.3, 1);
		particleSystem.id = "projectileGlobals.particleIndex";
		particleSystem.name = "particles" + projectileGlobals.particleIndex;
		particleSystem.particleTexture = createTexture(scene);
		particleSystem.direction1 = new Vector3(-5, 6, 5);
		particleSystem.direction2 = new Vector3(5, 5, -5);
		particleSystem.minEmitBox = new Vector3(-2, -6, -2);
		particleSystem.maxEmitBox = new Vector3(2, 6, 2);

		particleSystem.emitter = node;

		projectileGlobals.particleIndex += 1;

		particleSystem.start();
		setTimeout(() => {
			particleSystem.stop();
		}, 100);

		setTimeout(() => {
			particleSystem.dispose();
			projectileGlobals.activeParticles -= 1;
		}, 500);
	}
}
export { explosion };
