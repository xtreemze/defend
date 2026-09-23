import { PhysicsImpostor, PhysicsEngine, Tags } from "../utility/babylonOptimized";
import { mapGlobals, projectileGlobals } from "../main/globalVariables";
import { LiveProjectileInstance } from "./startLife";
import { getGlobalImpostorLifecycleManager } from "../utility/impostorLifecycleManager";
import { getGlobalProjectilePoolManager } from "./projectilePoolManager";

export function destroyProjectile(
	projectile: LiveProjectileInstance,
	physicsEngine: PhysicsEngine
) {

	projectile.hitPoints = 0;
	Tags.RemoveTagsFrom(projectile, "projectile");

	delete projectile.hitPoints;
	projectile.setEnabled(false);
	setTimeout(() => {
		if (projectile.physicsImpostor !== null) {
			// Use batched disposal to reduce GC spikes
			getGlobalImpostorLifecycleManager().queueDisposal(projectile.physicsImpostor);
			mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
		}

		// Return projectile to pool instead of disposing
		const poolManager = getGlobalProjectilePoolManager();
		const level = (projectile as any).poolLevel || 2;
		poolManager.releaseProjectile(projectile, level as 2 | 3);
	}, 30);
}
