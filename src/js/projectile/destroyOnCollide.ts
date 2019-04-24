import { LiveProjectileInstance } from "./startLife";
import { destroyProjectile } from "./destroyProjectile";
import { Scene, PhysicsImpostor, PhysicsEngine } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { explosion } from "../enemy/explodeParticle";

function destroyOnCollide(
	scene: Scene,
	projectile: LiveProjectileInstance,
	physicsEngine: PhysicsEngine,
	projectileExpires: any,
	level: Number
) {
	if (projectile.physicsImpostor !== null) {
		projectile.physicsImpostor.registerOnPhysicsCollide(
			mapGlobals.allImpostors as PhysicsImpostor[],
			(collider: PhysicsImpostor) => {
				explosion(scene, collider.getObjectCenter(), level);
				// clearTimeout(projectileLifetime);
				projectile.unregisterAfterWorldMatrixUpdate(projectileExpires);
				destroyProjectile(projectile, physicsEngine);

			}
		);
	}
}

export { destroyOnCollide };
