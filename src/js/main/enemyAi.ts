import * as BABYLON from "babylonjs";
import randomNumberRange from "./randomNumberRange";

const distance = 10; // 1 cube distance = 10m
const time = 300; // 3 seconds
const iterationDelay = 30; // animation resolution keep below 20
const speed = distance / iterationDelay;

/**
 * Find Enemy Vector
 *
 * @param {any} [enemy=BABYLON.MeshBuilder.CreateBox.prototype]
 * @param {string} [direction=""]
 */
function vector(
  enemy = BABYLON.MeshBuilder.CreateBox.prototype,
  direction = ""
) {
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

/**
 * Move Enemy
 *
 * @param {any} [enemy={
 *     physicsImpostor: {},
 *     length: 0,
 *     material: BABYLON.Material,
 *     hitPoints: 0
 *   }]
 * @param {string} [direction=""]
 */
function move(
  enemy = {
    physicsImpostor: {},
    length: 0,
    material: BABYLON.Material,
    hitPoints: 0
  },
  direction = ""
) {
  let delay = 0;

  for (let iterations = 0; iterations < iterationDelay; iterations += 1) {
    setTimeout(() => {
      vector(enemy, direction);
    }, delay);
    delay += time / iterationDelay;
  }
}

/**
 * Orient Enemy
 *
 * @param {any} [enemy={
 *     physicsImpostor: {},
 *     length: 0,
 *     material: BABYLON.Material,
 *     hitPoints: 0
 *   }]
 * @param {boolean} [decision={ up: true, left: true, right: true, down: true }]
 * @param {number} [result=1]
 */
function orient(
  enemy = {
    physicsImpostor: {},
    length: 0,
    material: BABYLON.Material,
    hitPoints: 0
  },
  decision = { up: true, left: true, right: true, down: true },
  result = 1
) {
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
/**
 * Enemy AI
 *
 * @export
 * @param {any} [enemy={
 *     physicsImpostor: {},
 *     length: 0,
 *     material: BABYLON.Material,
 *     hitPoints: 0
 *   }]
 * @param {boolean} [decision={ up: true, left: true, right: true, down: true }]
 */
export default function enemyAi(
  enemy = {
    physicsImpostor: {},
    length: 0,
    material: BABYLON.Material,
    hitPoints: 0
  },
  decision = { up: true, left: true, right: true, down: true }
) {
  const result = randomNumberRange(1, 4);

  orient(enemy, decision, result);
}
