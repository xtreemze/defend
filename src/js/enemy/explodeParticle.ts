import { Scene, Vector3, Color4, ParticleSystem } from "babylonjs";
import { createTexture } from "./flare";
import { projectileGlobals } from "../main/globalVariables";
function explosion(scene: Scene, projectilePosition: Vector3) {
  if (projectileGlobals.particleLimit > projectileGlobals.activeParticles) {
    projectileGlobals.activeParticles += 1;

    const node = projectilePosition;

    const particleSystem = new ParticleSystem(
      "particles" + projectileGlobals.particleIndex,
      30,
      scene
    ) as ParticleSystem;

    particleSystem.renderingGroupId = 0;
    particleSystem.emitRate = 20;
    particleSystem.updateSpeed = 0.01;
    particleSystem.minEmitPower = 6;
    particleSystem.maxEmitPower = 18;
    particleSystem.minLifeTime = 0.09;
    particleSystem.maxLifeTime = 0.4;
    particleSystem.minSize = 3;
    particleSystem.maxSize = 4;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
    particleSystem.gravity = new Vector3(0, -600, 0);
    particleSystem.color1 = new Color4(1, 0.5, 0, 1);
    particleSystem.color2 = new Color4(0.75, 0.4, 0.1, 1);
    particleSystem.colorDead = new Color4(0.1, 0.08, 0.3, 1);
    particleSystem.id = "projectileGlobals.particleIndex";
    particleSystem.name = "particles" + projectileGlobals.particleIndex;
    particleSystem.particleTexture = createTexture(scene);
    particleSystem.direction1 = new Vector3(-5, 8, 5);
    particleSystem.direction2 = new Vector3(5, 8, -5);
    particleSystem.minEmitBox = new Vector3(-1, -6, -1);
    particleSystem.maxEmitBox = new Vector3(1, 6, 1);

    particleSystem.emitter = node;

    projectileGlobals.particleIndex += 1;

    particleSystem.start();
    setTimeout(() => {
      particleSystem.stop();
    }, 80);

    setTimeout(() => {
      particleSystem.dispose();
      projectileGlobals.activeParticles -= 1;
    }, 220);
  }
}
export { explosion };
