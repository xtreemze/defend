import * as FX from "../../vendor/wafxr/wafxr";
import { onDestroy, shoot, damage, addTower } from "./sound";
import { Vector3 } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { towerGlobals } from "./globalVariables";

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
  testMesh.hitPoints = randomNumberRange(1, 400);

  //   addTower(testMesh, randomNumberRange(1, 3));

  //   onDestroy(testMesh, randomNumberRange(1, 3));

  shoot(testMesh, randomNumberRange(1, 3));

  setTimeout(() => {
    damage(testMesh);
  }, 200);
}, 1000);
