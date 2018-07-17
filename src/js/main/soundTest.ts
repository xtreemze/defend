import * as FX from "../../vendor/wafxr/wafxr";
import {
  shoot,
  damage,
  addTower,
  removeTower,
  damageCurrency,
  defeated,
  victory,
  newWave,
  enemyExplode
} from "./sound";
import { Vector3, Mesh } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { towerGlobals, enemyGlobals, mapGlobals } from "./globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";

FX.setVolume(1);

const testMesh = {} as EnemySphere;
testMesh.position = new Vector3(0, 5, 0);

const listener = {} as Mesh;
listener.position = new Vector3(0, 100, 100);

FX.setListenerPosition(
  listener.position.x,
  listener.position.y,
  listener.position.z
);

// FX._tone.Listener.setOrientation(
//   -cameraDirection.x,
//   -cameraDirection.y,
//   -cameraDirection.z,
//   cameraUp.x,
//   cameraUp.y,
//   cameraUp.z
// );

// Enable sound
mapGlobals.soundOn = true;
FX._tone.context.resume();
FX._tone.Master.mute = false;

setInterval(() => {
  towerGlobals.allTowers.length = randomNumberRange(1, 50);
  testMesh.hitPoints = randomNumberRange(1, enemyGlobals.baseHitPoints * 3);

  shoot(testMesh, randomNumberRange(1, 3));

  setTimeout(() => {
    // damage(testMesh);
    // addTower(testMesh, randomNumberRange(1, 3));
    // removeTower(testMesh, randomNumberRange(1, 3));
    defeated();
    // victory();
    // enemyExplode(testMesh, randomNumberRange(1, 3));
    // damageCurrency(testMesh);
    // newWave();
  }, 500);
}, 2000);
