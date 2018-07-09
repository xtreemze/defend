import { Vector3 } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { enemyGlobals } from "../main/globalVariables";
import { EnemySphere } from "./enemyBorn";

function vector(enemy: EnemySphere, direction: string = "") {
  if (enemy.physicsImpostor !== null) {
    switch (direction) {
      case "down":
        enemy.physicsImpostor.applyImpulse(
          new Vector3(0, 0, enemyGlobals.speed * -1),
          enemy.getAbsolutePosition()
        );
        break;
      case "right":
        enemy.physicsImpostor.applyImpulse(
          new Vector3(enemyGlobals.speed, 0, 0),
          enemy.getAbsolutePosition()
        );
        break;
      case "up":
        enemy.physicsImpostor.applyImpulse(
          new Vector3(0, 0, enemyGlobals.speed),
          enemy.getAbsolutePosition()
        );
        break;
      case "left":
        enemy.physicsImpostor.applyImpulse(
          new Vector3(enemyGlobals.speed * -1, 0, 0),
          enemy.getAbsolutePosition()
        );
        break;

      default:
        break;
    }
  }
}

function orient(
  enemy: EnemySphere,
  decision = { up: true, left: true, right: true, down: true },
  result: number = 1
) {
  if (enemy.physicsImpostor !== null) {
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
}

export default function enemyAi(
  enemy: EnemySphere,
  decision = { up: true, left: true, right: true, down: true }
) {
  const result = randomNumberRange(1, 4);
  if (enemy.physicsImpostor !== null) {
    orient(enemy, decision, result);
  }
}
