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
        // attack: 0.01,
        // sustain: 0.012,
        release: 0.25,
        decay: 0.05,
        frequency: 880 / (level * 1.5),
        sweep: -0.15,
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
        volume: 35,
        // attack: 0.02,
        // sustain: 0.03,
        release: 0.05,
        // decay: 0.3,

        frequency: enemy.hitPoints / 220 + 100, // sweep: -0.1,
        // highpass: 100,
        // lowpass: 3000,
        source: "triangle",
        // vibrato: 0.3,
        // vibratoFreq: 20,
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
      volume: 35,
      release: 0.8,
      // decay: 0.2,
      frequency: (enemyGlobals.baseHitPoints * 3 - enemy.hitPoints) / 100 + 100,
      sweep: -0.5,
      source: "sine",
      repeat: 9,
      highpass: 200,
      // vibrato: 0.6,
      // vibratoFreq: 20,
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
        volume: 40,
        sustain: 0.2,
        release: 0.8,
        decay: 1,
        frequency: 100 / level + 100,
        sweep: -0.3,
        source: "sine",
        repeat: 6,
        highpass: 200,
        // vibrato: 0.8,
        // vibratoFreq: 10,
        // pulseWidth: 0.5,
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
      volume: 15,
      decay: 0.8,
      // attack: 0.9,
      // sustain: 0.025,
      release: 0.9,
      frequency: 70,
      highpass: 150,
      sweep: 0.5,
      source: "sine"
      // pulseWidth: 0.5
      // repeat: 2.5
      // soundX: 0,
      // soundY: 0,
      // soundZ: 0,
      // rolloff: 0.5
    } as FX.audioParams);
  }
}

function addTower(tower: Mesh, level: number) {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: 40,
      sustain: 0.1,
      // release: 0.2,
      frequency: 200 / level + towerGlobals.allTowers.length * 3,
      sweep: 0.125,
      repeat: 9,
      highpass: 100,
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
      volume: 40,
      sustain: 0.1,
      // release: 0.2,
      frequency: 200 / level + towerGlobals.allTowers.length * 3,
      sweep: -0.5,
      repeat: 9,
      highpass: 100,
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
      volume: -5,
      // decay: 1,
      attack: 1,
      sustain: 0.08,
      release: 1,
      frequency: 800,
      sweep: -0.4,
      highpass: 100,
      source: "sine",
      pulseWidth: 0.5,
      repeat: 6,
      // soundX: 0,
      // soundY: 0,
      // soundZ: 0,
      rolloff: 0.5
    } as FX.audioParams);
  }
}

function victory() {
  if (mapGlobals.soundOn) {
    FX.play({
      volume: -5,
      // decay: 0.8,
      attack: 0.8,
      sustain: 0.12,
      release: 1,
      frequency: 574,
      sweep: 0.4,
      highpass: 100,
      source: "sine",
      pulseWidth: 0.5,
      repeat: 8,
      // soundX: 0,
      // soundY: 0,
      // soundZ: 0,
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
