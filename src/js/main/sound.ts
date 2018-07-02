import * as FX from "../../vendor/wafxr/wafxr";
import { Vector3, Mesh } from "babylonjs";
import { enemyGlobals, towerGlobals } from "./globalVariables";

function onDestroy(enemyPosition: Vector3, level: number) {
  setTimeout(() => {
    FX.play({
      volume: -5,
      sustain: 0.8,
      release: 0.7,
      frequency: (10000 / level) * 2,
      sweep: -1.8,
      source: "pulse",
      highpass: 180,
      lowpass: 13000,
      compressorThreshold: -10,
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
      volume: -14,
      sustain: 0.04,
      release: 0.5,
      frequency: (760 / level) * 1.45,
      sweep: -0.8,
      source: "square",
      highpass: 1600,
      lowpass: 2250,
      // bitcrush: 3,
      // compressorThreshold: -10,
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
      volume: -6,
      sustain: 0.0662,
      release: 0.1115,
      //@ts-ignore
      frequency: (683.6 / enemy.hitPoints) * 180,
      sweep: -0.6421,
      source: "sawtooth",
      vibrato: 0.4973,
      vibratoFreq: 29.63,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 3);
}

function addTower(tower: Mesh, level: number) {
  setTimeout(() => {
    FX.play({
      volume: -4,
      sustain: 0.0794,
      release: 0.3501,
      frequency: 604.3 / level + towerGlobals.allTowers.length * 6,
      sweep: 0.5565,
      repeat: 11.78,
      source: "sawtooth",
      soundX: tower.position.x,
      soundY: tower.position.y,
      soundZ: tower.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 3);
}

export { onDestroy, shoot, damage, addTower };
