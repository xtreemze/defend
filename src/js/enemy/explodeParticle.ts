import {
  Scene,
  Mesh,
  GPUParticleSystem,
  Vector3,
  Color4,
  Texture,
  ParticleSystem
} from "babylonjs";
import { createTexture } from "./flare";
function explosion(scene: Scene, projectilePosition: Vector3) {
  const node = projectilePosition;

  // const particleSystem = new GPUParticleSystem(
  //   "particles",
  //   { capacity: 200 },
  //   scene
  // ) as GPUParticleSystem;
  const particleSystem = new ParticleSystem(
    "particles",
    120,
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
  particleSystem.id = "92cd5665-5295-41ae-8a48-37f5926b3926";
  particleSystem.name = "particles";
  particleSystem.particleTexture = createTexture(scene);
  particleSystem.direction1 = new Vector3(-5, 8, 5);
  particleSystem.direction2 = new Vector3(5, 8, -5);
  particleSystem.minEmitBox = new Vector3(-1, -6, -1);
  particleSystem.maxEmitBox = new Vector3(1, 6, 1);

  particleSystem.emitter = node;
  particleSystem.start();

  setTimeout(() => {
    particleSystem.stop();
  }, 80);

  setTimeout(() => {
    particleSystem.dispose(false);
  }, 200);
}
export { explosion };
