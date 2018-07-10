import * as FX from "../../vendor/wafxr/wafxr";
import { Vector3, Mesh } from "babylonjs";
import { towerGlobals, mapGlobals } from "./globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";

function onDestroy(enemyPosition: Vector3, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 40,
          attack: 0.01,
          sustain: 0.02,
          release: 0.8,
          frequency: 500 / level,
          sweep: -0.3,
          source: "sine",
          highpass: 100,
          lowpass: 10000,
          soundX: enemyPosition.x,
          soundY: enemyPosition.y,
          soundZ: enemyPosition.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
    }
  }
}

function shoot(originMesh: Mesh, level: number) {
  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 0.8,
          sustain: 0.02,
          release: 0.4,
          decay: 0.02,
          frequency: (800 / level) * 1.2,
          sweep: -0.8,
          source: "square",
          highpass: 800,
          lowpass: 3700,
          soundX: originMesh.position.x,
          soundY: originMesh.position.y,
          soundZ: originMesh.position.z,
          rolloff: 0.03
        } as FX.audioParams);
      }, 1);
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
      setTimeout(() => {
        FX.play({
          volume: 35,
          attack: 0.1,
          release: 0.35,
          frequency: enemy.hitPoints / 100 + 200,
          sweep: -0.1,
          highpass: 100,
          lowpass: 5000,
          source: "triangle",
          vibrato: 0.5,
          vibratoFreq: 20,
          soundX: enemy.position.x,
          soundY: enemy.position.y,
          soundZ: enemy.position.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
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
      setTimeout(() => {
        FX.play({
          volume: 50,
          release: 0.1,
          decay: 0.2,
          frequency: enemy.hitPoints / 200 + 90,
          sweep: -0.4,
          source: "sine",
          vibrato: 0.6,
          vibratoFreq: 20,
          soundX: enemy.position.x,
          soundY: enemy.position.y,
          soundZ: enemy.position.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
    }
  }
}

function enemyExplode(enemy: EnemySphere, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 50,
          release: 0.2,
          decay: 0.3,
          frequency: 300 / level,
          sweep: 0.2,
          source: "sine",
          vibrato: 0.8,
          vibratoFreq: 10,
          soundX: enemy.position.x,
          soundY: enemy.position.y,
          soundZ: enemy.position.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
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
      setTimeout(() => {
        FX.play({
          volume: 30,
          decay: 0.8,
          attack: 0.9,
          sustain: 0.025,
          release: 0.5,
          frequency: 70,
          lowpass: 1500,
          highpass: 150,
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
  }
}

function addTower(tower: Mesh, level: number) {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 50,
          sustain: 0.05,
          release: 0.4,
          frequency: 200 / level + towerGlobals.allTowers.length * 3,
          sweep: 0.5,
          repeat: 12,
          source: "sine",
          soundX: tower.position.x,
          soundY: tower.position.y,
          soundZ: tower.position.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
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
      setTimeout(() => {
        FX.play({
          volume: 50,
          sustain: 0.05,
          release: 0.2,
          frequency: 200 / level + towerGlobals.allTowers.length * 3,
          sweep: -0.5,
          repeat: 12,
          source: "sine",
          soundX: tower.position.x,
          soundY: tower.position.y,
          soundZ: tower.position.z,
          rolloff: 0.3
        } as FX.audioParams);
      }, 1);
    }
  }
}

function defeated() {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 1,
          decay: 1,
          attack: 1,
          sustain: 0.03,
          release: 0.8,
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
  }
}

function victory() {
  if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
    setTimeout(() => {
      mapGlobals.simultaneousSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.simultaneousSounds += 1;

    if (mapGlobals.soundOn) {
      setTimeout(() => {
        FX.play({
          volume: 1,
          decay: 0.8,
          attack: 0.8,
          sustain: 0.1,
          release: 0.8,
          frequency: 574,
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
  }
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
  newWave,
  enemyExplode
};
