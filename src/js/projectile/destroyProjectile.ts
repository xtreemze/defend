import { PhysicsImpostor, PhysicsEngine, Tags } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { LiveProjectileInstance } from "./startLife";

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
			projectile.physicsImpostor.dispose();
			mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
		}
		projectile.dispose();
	}, 30);
}
