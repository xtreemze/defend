import { Vector3, Mesh, PhysicsImpostor } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { enemyGlobals } from "../main/globalVariables";

function vector(
  enemy: Mesh,
  direction: string = "",
  sphereMeshImpostor: PhysicsImpostor
) {
  switch (direction) {
    case "down":
      sphereMeshImpostor.applyImpulse(
        new Vector3(0, 0, enemyGlobals.speed * -1),
        enemy.getAbsolutePosition()
      );
      break;
    case "right":
      sphereMeshImpostor.applyImpulse(
        new Vector3(enemyGlobals.speed, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;
    case "up":
      sphereMeshImpostor.applyImpulse(
        new Vector3(0, 0, enemyGlobals.speed),
        enemy.getAbsolutePosition()
      );
      break;
    case "left":
      sphereMeshImpostor.applyImpulse(
        new Vector3(enemyGlobals.speed * -1, 0, 0),
        enemy.getAbsolutePosition()
      );
      break;

    default:
      break;
  }
}

function orient(
  enemy: Mesh,
  decision = { up: true, left: true, right: true, down: true },
  result: number = 1,
  sphereMeshImpostor: PhysicsImpostor
) {
  if (sphereMeshImpostor !== null) {
    switch (result) {
      case 1:
        if (decision.down) {
          vector(enemy, "down", sphereMeshImpostor);
        } else if (decision.right) {
          vector(enemy, "right", sphereMeshImpostor);
        } else if (decision.up) {
          vector(enemy, "up", sphereMeshImpostor);
        } else if (decision.left) {
          vector(enemy, "left", sphereMeshImpostor);
        }
        break;
      case 2:
        if (decision.up) {
          vector(enemy, "up", sphereMeshImpostor);
        } else if (decision.right) {
          vector(enemy, "right", sphereMeshImpostor);
        } else if (decision.left) {
          vector(enemy, "left", sphereMeshImpostor);
        } else if (decision.down) {
          vector(enemy, "down", sphereMeshImpostor);
        }
        break;
      case 3:
        if (decision.left) {
          vector(enemy, "left", sphereMeshImpostor);
        } else if (decision.up) {
          vector(enemy, "up", sphereMeshImpostor);
        } else if (decision.down) {
          vector(enemy, "down", sphereMeshImpostor);
        } else if (decision.right) {
          vector(enemy, "right", sphereMeshImpostor);
        }
        break;
      case 4:
        if (decision.right) {
          vector(enemy, "right", sphereMeshImpostor);
        } else if (decision.left) {
          vector(enemy, "left", sphereMeshImpostor);
        } else if (decision.up) {
          vector(enemy, "up", sphereMeshImpostor);
        } else if (decision.down) {
          vector(enemy, "down", sphereMeshImpostor);
        }
        break;

      default:
        break;
    }
  }
}

export default function enemyAi(
  enemy: Mesh,
  decision = { up: true, left: true, right: true, down: true }
) {
  const result = randomNumberRange(1, 4);
  if (enemy.physicsImpostor !== null) {
    orient(enemy, decision, result, enemy.physicsImpostor);
  }
}
