import { LiveProjectile } from "./startLife";
import { destroyProjectile } from "./destroyProjectile";
import { Scene, PhysicsImpostor, PhysicsEngine } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { explosion } from "../enemy/explodeParticle";

function destroyOnCollide(
  scene: Scene,
  projectile: LiveProjectile,
  physicsEngine: PhysicsEngine,
  projectileExpires: any
) {
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as PhysicsImpostor[],
      (collider: PhysicsImpostor) => {
        explosion(scene, collider.getObjectCenter());
        // clearTimeout(projectileLifetime);
        projectile.unregisterAfterRender(projectileExpires);
        destroyProjectile(projectile, physicsEngine);
      }
    );
  }
}

export { destroyOnCollide };
