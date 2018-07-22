import * as FX from "../../vendor/wafxr/wafxr";
import { Mesh } from "babylonjs";
import { towerGlobals, mapGlobals, enemyGlobals } from "./globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";

function shoot(originMesh: Mesh, level: number) {
  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 30,
        release: 0.25,
        decay: 0.03,
        frequency: 880 / (level * 1.5),
        sweep: -0.12,
        source: "triangle",
        highpass: 880,
        lowpass: 4800,
        soundX: originMesh.position.x,
        soundY: originMesh.position.y,
        soundZ: originMesh.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function damage(enemy: EnemySphere) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);
    mapGlobals.simultaneousSounds += 1;
    if (mapGlobals.soundOn) {
      FX.play({
        volume: 25,
        release: 0.05,
        frequency: enemy.hitPoints / 220 + 200,
        highpass: 500,
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
  if (mapGlobals.soundOn) {
    FX.play({
      volume: 32,
      release: 0.8,
      frequency: (enemyGlobals.baseHitPoints * 3 - enemy.hitPoints) / 100 + 100,
      sweep: -0.5,
      source: "sine",
      repeat: 9,
      highpass: 300,
      soundX: enemy.position.x,
      soundY: enemy.position.y,
      soundZ: enemy.position.z,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

function enemyExplode(enemy: EnemySphere, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      FX.play({
        volume: 30,
        sustain: 0.2,
        release: 0.8,
        decay: 1,
        frequency: 400 / level + 100,
        sweep: -0.3,
        source: "sine",
        repeat: 6,
        highpass: 200,
        soundX: enemy.position.x,
        soundY: enemy.position.y,
        soundZ: enemy.position.z,
        rolloff: 0.5
      } as FX.audioParams);
    }
  }
}

function newWave() {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: 5,
      decay: 0.8,
      release: 0.9,
      frequency: 200,
      highpass: 200,
      sweep: 0.5,
      source: "sine"
    } as FX.audioParams);
  }
}

function addTower(tower: Mesh, level: number) {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: 38,
      sustain: 0.1,
      frequency: 400 / level + towerGlobals.allTowers.length * 3,
      sweep: 0.125,
      repeat: 9,
      highpass: 200,
      lowpass: 4000,
      source: "sine",
      soundX: tower.position.x,
      soundY: tower.position.y,
      soundZ: tower.position.z,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

function removeTower(tower: Mesh, level: number) {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: 38,
      sustain: 0.1,
      frequency: 400 / level + towerGlobals.allTowers.length * 3,
      sweep: -0.5,
      repeat: 9,
      highpass: 200,
      lowpass: 4000,
      source: "sine",
      soundX: tower.position.x,
      soundY: tower.position.y,
      soundZ: tower.position.z,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

function defeated() {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: -8,
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
      volume: -8,
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
