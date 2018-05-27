// @ts-check

import * as BABYLON from "babylonjs";

const distance = 10; // 1 cube distance = 10m
const time = 120; // 3 seconds
const iterationDelay = 30; // animation resolution keep below 20
const speed = distance / iterationDelay;

/**
 * Returns a random interger from a given range.
 * @param {number} Min
 * @param {number} Max
 * @returns {number}
 */
function randomNumberRange(Min, Max) {
  return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

function vector(enemy, direction) {
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

function move(enemy, direction) {
  let delay = 0;
  for (let iterations = 0; iterations < iterationDelay; iterations += 1) {
    setTimeout(() => {
      vector(enemy, direction);
    }, delay);
    delay += time / iterationDelay;
  }
}

function orient(enemy, decision, result) {
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

export default function enemyAi(enemy, enemyClass) {
  let result = 1;

  const numberTimer = setInterval(() => {
    result = randomNumberRange(1, 4);
  }, time * 3);
  const orientTimer = setInterval(() => {
    orient(enemy, enemyClass.decide(), result);

    if (enemy.hitPoints < 0) {
      clearInterval(numberTimer);
      clearInterval(orientTimer);
      enemy.dispose();
    }
  }, time);

  setTimeout(() => {
    clearInterval(numberTimer);
    clearInterval(orientTimer);
  }, 15000);
}
