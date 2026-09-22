import {
	Scene,
	Vector3,
	Color4,
	ParticleSystem,
	GPUParticleSystem
} from "../utility/babylonOptimized";
import { projectileGlobals, renderGlobals } from "../main/globalVariables";
import { getGlobalParticlePoolManager } from "../utility/particlePoolManager";

function explosion (scene: Scene, projectilePosition: Vector3, level: Number) {
	if (projectileGlobals.particleLimit > projectileGlobals.activeParticles) {
		projectileGlobals.activeParticles += 1;

		const poolManager = getGlobalParticlePoolManager(scene);
		const particleSystem = poolManager.getParticleSystem(level as number);

		if (!particleSystem) {
			projectileGlobals.activeParticles -= 1;
			return;
		}

		particleSystem.emitter = projectilePosition;
		particleSystem.start();

		// Schedule stop and release back to pool
		setTimeout(() => {
			particleSystem.stop();
		}, 80 * (level as number));

		setTimeout(() => {
			poolManager.releaseParticleSystem(particleSystem);
			projectileGlobals.activeParticles -= 1;
		}, 500);
	}
}
export { explosion };
