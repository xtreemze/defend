import { LiveProjectile } from "./startLife";
import { destroyProjectile } from "./destroyProjectile";
import { Scene, PhysicsImpostor, PhysicsEngine } from "babylonjs";
import { mapGlobals } from "../main/globalVariables";
import { explosion } from "../enemy/explodeParticle";

function destroyOnCollide(
  scene: Scene,
  projectile: LiveProjectile,
  physicsEngine: PhysicsEngine,
  projectileLifetime: number
) {
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as PhysicsImpostor[],
      (collider: PhysicsImpostor) => {
        explosion(scene, collider.getObjectCenter());
        clearTimeout(projectileLifetime);
        setTimeout(() => {
          destroyProjectile(projectile, physicsEngine);
        }, 3);
      }
    );
  }
}

export { destroyOnCollide };
