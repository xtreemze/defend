import * as FX from "../../vendor/wafxr/wafxr";
import { Mesh } from "babylonjs";
import { towerGlobals, mapGlobals, enemyGlobals } from "./globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";
const third = 1 / 3;
function shoot(originMesh: Mesh, level: number) {
  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 36,
        release: 0.04,
        frequency: 920 / (level * 1.4),
        sweep: -third,
        source: "triangle",
        highpass: 860,
        lowpass: 4200,
        soundX: originMesh.position.x,
        soundY: originMesh.position.y,
        soundZ: originMesh.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function damage(enemy: EnemySphere) {
  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 24,
        release: 0.01,
        frequency: enemy.hitPoints / 220 + 220,
        highpass: 720,
        lowpass: 3200,
        sweep: -0.15,
        source: "triangle",
        soundX: enemy.position.x,
        soundY: enemy.position.y,
        soundZ: enemy.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function damageCurrency(enemy: EnemySphere) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 32,
        release: 0.8,
        frequency:
          (enemyGlobals.baseHitPoints * 3 - enemy.hitPoints) / 120 + 120,
        sweep: -0.5,
        source: "sine",
        repeat: 9,
        highpass: 300,
        lowpass: 4400,
        soundX: enemy.position.x,
        soundY: enemy.position.y,
        soundZ: enemy.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function enemyExplode(enemy: EnemySphere, level: number) {
  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 34,
        sustain: 0.25,
        release: 0.8,
        decay: 0.2,
        frequency: 440 / level + 100,
        sweep: -0.3,
        source: "sine",
        repeat: 6,
        highpass: 880,
        lowpass: 4400,
        soundX: enemy.position.x,
        soundY: enemy.position.y,
        soundZ: enemy.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function newWave() {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;
    if (mapGlobals.soundOn) {
      FX.play({
        volume: 20,
        decay: 0.25,
        release: 0.8,
        frequency: 100,
        highpass: 540,
        lowpass: 2000,
        sweep: 1.8,
        source: "sine"
      } as FX.audioParams);
    }
  }
}

function addTower(tower: Mesh, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;
    if (mapGlobals.soundOn) {
      FX.play({
        volume: 33,
        sustain: 0.1,
        frequency: 450 / level + towerGlobals.allTowers.length * 3,
        sweep: 0.125,
        repeat: 9,
        highpass: 680,
        lowpass: 3000,
        source: "sine",
        soundX: tower.position.x,
        soundY: tower.position.y,
        soundZ: tower.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function removeTower(tower: Mesh, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;
    if (mapGlobals.soundOn) {
      FX.play({
        volume: 31,
        sustain: 0.1,
        frequency: 730 / 2 + towerGlobals.allTowers.length + 80 * level,
        sweep: -0.5,
        repeat: 9,
        highpass: 490,
        lowpass: 2200,
        source: "sine",
        soundX: tower.position.x,
        soundY: tower.position.y,
        soundZ: tower.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function defeated() {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: -12,
      attack: 1,
      sustain: 0.08,
      release: 1,
      frequency: 800,
      sweep: -0.4,
      highpass: 100,
      source: "sine",
      pulseWidth: 0.5,
      repeat: 6,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

function victory() {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: -12,
      attack: 0.8,
      sustain: 0.12,
      release: 1,
      frequency: 574,
      sweep: 0.4,
      highpass: 100,
      source: "sine",
      pulseWidth: 0.5,
      repeat: 8,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

export {
  shoot,
  damage,
  addTower,
  removeTower,
  damageCurrency,
  defeated,
  victory,
  newWave,
  enemyExplode
};
