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
				volume: 9,
				sustain: 0.04,
				release: 0.02,
				frequency: 920 / (level * 1.25),
				sweep: -third,
				source: "triangle",
				highpass: 360,
				// lowpass: 7000,
				soundX: originMesh.position.x,
				soundY: originMesh.position.y,
				soundZ: originMesh.position.z,
				rolloff: 0.05
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
				volume: 9,
				sustain: 0.02,
				release: 0.02,
				frequency: (enemy.hitPoints / 80) + 300,
				highpass: 60,
				// lowpass: 15000,
				sweep: -0.15,
				source: "triangle",
				soundX: enemy.position.x,
				soundY: enemy.position.y,
				soundZ: enemy.position.z,
				rolloff: 0.05
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
				volume: 8,
				release: 0.8,
				frequency:
          (enemyGlobals.baseHitPoints * 3 - enemy.hitPoints) / 120 + 120,
				sweep: -0.5,
				source: "sine",
				repeat: 9,
				highpass: 200,
				// lowpass: 4000,
				soundX: enemy.position.x,
				soundY: enemy.position.y,
				soundZ: enemy.position.z,
				rolloff: 0.05
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
				volume: 8,
				sustain: 0.1,
				release: 0.8,
				decay: 0.2,
				frequency: 440 / level + 100,
				sweep: -0.3,
				source: "sine",
				repeat: 6,
				highpass: 80,
				// lowpass: 4000,
				soundX: enemy.position.x,
				soundY: enemy.position.y,
				soundZ: enemy.position.z,
				rolloff: 0.05
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
				volume: 15,
				decay: 0.15,
				release: 0.4,
				frequency: 96 + enemyGlobals.currentWave,
				highpass: 420,
				// lowpass: 6000,
				sweep: 1.8,
				source: "sine",
				rolloff: 0.05
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
				volume: 6,
				sustain: 0.03,
				frequency: 450 / level + towerGlobals.allTowers.length * 3,
				sweep: 0.125,
				repeat: 9,
				// highpass: 80,
				// lowpass: 4000,
				source: "sine",
				soundX: tower.position.x,
				soundY: tower.position.y,
				soundZ: tower.position.z,
				rolloff: 0.05
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
				volume: 6,
				sustain: 0.3,
				frequency: 730 / 2 + towerGlobals.allTowers.length + 80 * level,
				sweep: -0.5,
				repeat: 9,
				// highpass: 80,
				// lowpass: 4000,
				source: "sine",
				soundX: tower.position.x,
				soundY: tower.position.y,
				soundZ: tower.position.z,
				rolloff: 0.05
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
			highpass: 200,
			source: "sine",
			pulseWidth: 0.5,
			repeat: 6,
			rolloff: 0.05
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
			highpass: 200,
			source: "sine",
			pulseWidth: 0.5,
			repeat: 8
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
