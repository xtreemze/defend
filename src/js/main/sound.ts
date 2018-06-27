import * as FX from "../../vendor/wafxr/wafxr";
import { Vector3, Mesh } from "babylonjs";

function onDestroy(enemyPosition: Vector3, level: number) {
  setTimeout(() => {
    FX.play({
      volume: -5,
      sustain: 0.64,
      release: 2,
      frequency: 1400 / level,
      sweep: -4,
      source: "pulse",
      compressorThreshold: -40,
      soundX: enemyPosition.x,
      soundY: enemyPosition.y,
      soundZ: enemyPosition.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 3);
}

function shoot(projectile: Mesh, level: number) {
  setTimeout(() => {
    FX.play({
      volume: -12,
      sustain: 0.02 * level ** 2,
      release: 0.44,
      frequency: (750 / level) * 1.5,
      sweep: -0.8,
      source: "square",
      highpass: 1920,
      lowpass: 2040,
      // bitcrush: 3,
      compressorThreshold: -40,
      soundX: projectile.position.x,
      soundY: projectile.position.y,
      soundZ: projectile.position.z,
      rolloff: 0.03
    } as FX.audioParams);
  }, 3);
}

function damage(enemy: Mesh) {
  setTimeout(() => {
    FX.play({
      volume: -5,
      sustain: 0.3,
      release: 0.15,
      //@ts-ignore
      frequency: 20000 / enemy.hitPoints + 200,
      sweep: -0.8,
      source: "square",
      // lowpass: 4252,
      // lowpassSweep: 771,
      compressorThreshold: -20,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 3);
}

export { onDestroy, shoot, damage };
