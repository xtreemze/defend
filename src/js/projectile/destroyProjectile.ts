import { PhysicsImpostor, PhysicsEngine, Tags } from "../utility/babylonOptimized";
import { mapGlobals } from "../main/globalVariables";
import { LiveProjectileInstance } from "./startLife";
import { getGlobalImpostorLifecycleManager } from "../utility/impostorLifecycleManager";

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
		projectile.dispose();
	}, 30);
}
