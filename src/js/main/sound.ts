import * as FX from "../../vendor/wafxr/wafxr";
import { Vector3, Mesh } from "babylonjs";
import { towerGlobals } from "./globalVariables";

function onDestroy(enemyPosition: Vector3, level: number) {
  setTimeout(() => {
    FX.play({
      volume: 30,
      attack: 0.3,
      sustain: 0.7,
      release: 0.7,
      frequency: (10000 / level) * 2,
      sweep: -1.8,
      source: "pulse",
      highpass: 200,
      lowpass: 13000,
      compressorThreshold: -10,
      soundX: enemyPosition.x,
      soundY: enemyPosition.y,
      soundZ: enemyPosition.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

function shoot(projectile: Mesh, level: number) {
  setTimeout(() => {
    FX.play({
      volume: 12,
      sustain: 0.04,
      release: 0.5,
      frequency: (760 / level) * 1.45,
      sweep: -0.8,
      source: "square",
      highpass: 1600,
      lowpass: 3650,
      // bitcrush: 3,
      // compressorThreshold: -10,
      soundX: projectile.position.x,
      soundY: projectile.position.y,
      soundZ: projectile.position.z,
      rolloff: 0.03
    } as FX.audioParams);
  }, 1);
}

function damage(enemy: Mesh) {
  setTimeout(() => {
    FX.play({
      volume: 30,
      attack: 0.1,
      sustain: 0.0662,
      release: 0.1115,

      frequency: (500 * enemy.hitPoints) / 800,
      sweep: -0.6421,
      source: "sawtooth",
      vibrato: 0.5,
      vibratoFreq: 30,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  });
}

function damageCurrency(enemy: Mesh) {
  setTimeout(() => {
    FX.play({
      volume: 50,
      sustain: 0.0662 * 2,
      release: 0.1115 * 3,

      frequency: (1000 * enemy.hitPoints) / 4,
      sweep: -0.7 / 2,
      source: "triangle",
      vibrato: 0.5 / 2,
      vibratoFreq: 30,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  });
}

function newWave() {
  setTimeout(() => {
    FX.play({
      volume: 4,
      decay: 0.8,
      attack: 0.9,
      sustain: 0.025,
      release: 0.5,
      frequency: 70,
      sweep: 0.3,
      source: "triangle",
      pulseWidth: 0.5,
      repeat: 2.5,
      soundX: 0,
      soundY: 0,
      soundZ: 0,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

function addTower(tower: Mesh, level: number) {
  setTimeout(() => {
    FX.play({
      volume: 30,
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
  }, 1);
}

function removeTower(tower: Mesh, level: number) {
  setTimeout(() => {
    FX.play({
      volume: 30,
      sustain: 0.0794 / 3,
      release: 0.3501 / 2,
      frequency: 604.3 / level + towerGlobals.allTowers.length * 4,
      sweep: -0.5565,
      repeat: 11.78 * 3,
      source: "sawtooth",
      soundX: tower.position.x,
      soundY: tower.position.y,
      soundZ: tower.position.z,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

function defeated() {
  setTimeout(() => {
    FX.play({
      volume: 1,
      decay: 1,
      attack: 1,
      sustain: 0.05,
      release: 0.5,
      frequency: 800,
      sweep: -0.4,
      source: "triangle",
      pulseWidth: 0.5,
      repeat: 6,
      soundX: 0,
      soundY: 0,
      soundZ: 0,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

function victory() {
  setTimeout(() => {
    FX.play({
      volume: 1,
      decay: 1,
      attack: 0.5,
      sustain: 0.05,
      release: 0.3,
      frequency: 700,
      sweep: 0.4,
      source: "triangle",
      pulseWidth: 0.5,
      repeat: 8,
      soundX: 0,
      soundY: 0,
      soundZ: 0,
      rolloff: 0.3
    } as FX.audioParams);
  }, 1);
}

export {
  onDestroy,
  shoot,
  damage,
  addTower,
  removeTower,
  damageCurrency,
  defeated,
  victory,
  newWave
};
