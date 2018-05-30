import * as BABYLON from "babylonjs";
import randomNumberRange from "./randomNumberRange";

// const distance = 10; // 1 cube distance = 10m
// const time = 300; // 3 seconds
// const iterationDelay = 30; // animation resolution keep below 20
// const speed = distance / iterationDelay;

const distance = 1000; // 1 cube distance = 10m
const time = 250; // 3 seconds
const iterationDelay = 1; // animation resolution keep below 20
const speed = distance / iterationDelay;

/**
 * Enemy Find Vector with Physics
 *
 * @param {any} [enemy=BABYLON.MeshBuilder.CreateBox.prototype]
 * @param {string} [direction=""]
 */
function vector(
  enemy: any = BABYLON.MeshBuilder.CreateBox.prototype,
  direction: string = ""
) {
  switch (direction) {
    case "down":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(0, 0, speed * -1),
        enemy.getAbsolutePosition()
      );
      break;
    case "right":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(speed, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;
    case "up":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(0, 0, speed),
        enemy.getAbsolutePosition()
      );
      break;
    case "left":
      enemy.physicsImpostor.applyImpulse(
        new BABYLON.Vector3(speed * -1, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;

    default:
      break;
  }
}

/**
 * Move Enemy with AI
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
  enemy: any = {
    physicsImpostor: {},
    length: 0,
    material: BABYLON.Material,
    hitPoints: 0
  },
  direction: string = ""
) {
  vector(enemy, direction);
}

function orient(
  enemy: any = {
    physicsImpostor: {},
    length: 0,
    material: BABYLON.Material,
    hitPoints: 0
  },
  decision = { up: true, left: true, right: true, down: true },
  result: number = 1
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
 * Enemys ai
 * @param enemy
 * @param [decision]
 */
export default function enemyAi(
  enemy = BABYLON.Mesh.prototype,
  decision = { up: true, left: true, right: true, down: true }
) {
  const result = randomNumberRange(1, 4);

  orient(enemy, decision, result);
}
