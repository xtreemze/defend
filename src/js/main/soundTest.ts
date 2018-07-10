import * as FX from "../../vendor/wafxr/wafxr";
import {
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
} from "./sound";
import { Vector3 } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { towerGlobals, enemyGlobals } from "./globalVariables";

FX.setVolume(1);
FX._tone.Master.mute = false;

const testMesh = {} as any;
testMesh.position = Vector3.Zero();

FX.setListenerPosition(
  testMesh.position.x,
  testMesh.position.y,
  testMesh.position.z
);

// FX._tone.Listener.setOrientation(
//   -cameraDirection.x,
//   -cameraDirection.y,
//   -cameraDirection.z,
//   cameraUp.x,
//   cameraUp.y,
//   cameraUp.z
// );

setInterval(() => {
  towerGlobals.allTowers.length = randomNumberRange(1, 50);
  testMesh.hitPoints = randomNumberRange(1, enemyGlobals.baseHitPoints * 3);

  shoot(testMesh, randomNumberRange(1, 3));

  setTimeout(() => {
    // damage(testMesh);
    // onDestroy(testMesh, randomNumberRange(1, 3));
    // addTower(testMesh, randomNumberRange(1, 3));
    // removeTower(testMesh, randomNumberRange(1, 3));
    // defeated();
    // victory();
    enemyExplode(testMesh, randomNumberRange(1, 3));
    // damageCurrency(testMesh);
    // newWave();
  }, 200);
}, 1400);
