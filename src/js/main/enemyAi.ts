import * as BABYLON from "babylonjs";
import randomNumberRange from "./randomNumberRange";
import { enemyGlobals } from "./variables";

function vector(enemy: BABYLON.Mesh, direction: string = "") {
  switch (direction) {
    case "down":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(0, 0, enemyGlobals.speed * -1),
        enemy.getAbsolutePosition()
      );
      break;
    case "right":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(enemyGlobals.speed, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;
    case "up":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(0, 0, enemyGlobals.speed),
        enemy.getAbsolutePosition()
      );
      break;
    case "left":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(enemyGlobals.speed * -1, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;

    default:
      break;
  }
}

function orient(
  enemy: BABYLON.Mesh,
  decision = { up: true, left: true, right: true, down: true },
  result: number = 1
) {
  switch (result) {
    case 1:
      if (decision.down) {
        vector(enemy, "down");
      } else if (decision.right) {
        vector(enemy, "right");
      } else if (decision.up) {
        vector(enemy, "up");
      } else if (decision.left) {
        vector(enemy, "left");
      }
      break;
    case 2:
      if (decision.up) {
        vector(enemy, "up");
      } else if (decision.right) {
        vector(enemy, "right");
      } else if (decision.left) {
        vector(enemy, "left");
      } else if (decision.down) {
        vector(enemy, "down");
      }
      break;
    case 3:
      if (decision.left) {
        vector(enemy, "left");
      } else if (decision.up) {
        vector(enemy, "up");
      } else if (decision.down) {
        vector(enemy, "down");
      } else if (decision.right) {
        vector(enemy, "right");
      }
      break;
    case 4:
      if (decision.right) {
        vector(enemy, "right");
      } else if (decision.left) {
        vector(enemy, "left");
      } else if (decision.up) {
        vector(enemy, "up");
      } else if (decision.down) {
        vector(enemy, "down");
      }
      break;

    default:
      break;
  }
}

export default function enemyAi(
  enemy: BABYLON.Mesh,
  decision = { up: true, left: true, right: true, down: true }
) {
  const result = randomNumberRange(1, 4);

  orient(enemy, decision, result);
}
