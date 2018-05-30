// @ts-check

import * as BABYLON from "babylonjs";
import randomNumberRange from "./randomNumberRange";

const distance = 10; // 1 cube distance = 10m
const time = 300; // 3 seconds
const iterationDelay = 30; // animation resolution keep below 20
const speed = distance / iterationDelay;

function vector(enemy = BABYLON.Mesh.prototype, direction = "") {
  switch (direction) {
    case "down":
      enemy.translate(BABYLON.Axis.Z, speed * -1, BABYLON.Space.LOCAL);
      break;
    case "right":
      enemy.translate(BABYLON.Axis.X, speed, BABYLON.Space.LOCAL);
      break;
    case "up":
      enemy.translate(BABYLON.Axis.Z, speed, BABYLON.Space.LOCAL);
      break;
    case "left":
      enemy.translate(BABYLON.Axis.X, speed * -1, BABYLON.Space.LOCAL);
      break;

    default:
      break;
  }
}

function move(enemy = BABYLON.Mesh.prototype, direction = "") {
  let delay = 0;

  for (let iterations = 0; iterations < iterationDelay; iterations += 1) {
    setTimeout(() => {
      vector(enemy, direction);
    }, delay);
    delay += time / iterationDelay;
  }
}

function orient(enemy = BABYLON.Mesh.prototype, decision: any, result = 1) {
  switch (result) {
    case 1:
      if (decision.down) {
        move(enemy, "down");
      } else if (decision.right) {
        move(enemy, "right");
      } else if (decision.up) {
        move(enemy, "up");
      } else if (decision.left) {
        move(enemy, "left");
      }
      break;
    case 2:
      if (decision.up) {
        move(enemy, "up");
      } else if (decision.right) {
        move(enemy, "right");
      } else if (decision.left) {
        move(enemy, "left");
      } else if (decision.down) {
        move(enemy, "down");
      }
      break;
    case 3:
      if (decision.left) {
        move(enemy, "left");
      } else if (decision.up) {
        move(enemy, "up");
      } else if (decision.down) {
        move(enemy, "down");
      } else if (decision.right) {
        move(enemy, "right");
      }
      break;
    case 4:
      if (decision.right) {
        move(enemy, "right");
      } else if (decision.left) {
        move(enemy, "left");
      } else if (decision.up) {
        move(enemy, "up");
      } else if (decision.down) {
        move(enemy, "down");
      }
      break;

    default:
      break;
  }
}

export default function enemyAi(enemy: any, decision: object) {
  const result = randomNumberRange(1, 4);

  orient(enemy, decision, result);
}
