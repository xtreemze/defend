import { Mesh, PhysicsImpostor, PhysicsEngine, Tags } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { LiveProjectile } from "./startLife";
export function destroyProjectile(
  projectile: LiveProjectile,
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
    setTimeout(() => {
      mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
    }, 4);
  }, 1);
}
