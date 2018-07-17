import { PhysicsImpostor, PhysicsEngine, Tags } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { LiveProjectile, LiveProjectileInstance } from "./startLife";

export function destroyProjectile(
  projectile: LiveProjectileInstance,
  physicsEngine: PhysicsEngine
) {
  projectile.setEnabled(false);

  projectile.hitPoints = 0;
  Tags.RemoveTagsFrom(projectile, "projectile");

  delete projectile.hitPoints;
  setTimeout(() => {
    projectile.dispose();
    if (projectile.physicsImpostor !== null) {
      projectile.physicsImpostor.dispose();
    }
    mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
  }, 1);
}
