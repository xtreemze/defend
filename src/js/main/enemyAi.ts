import * as BABYLON from "babylonjs";
import randomNumberRange from "./randomNumberRange";
import { enemyGlobals } from "./variables";

/**
 * Enemy Find Vector with Physics for Movement
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
