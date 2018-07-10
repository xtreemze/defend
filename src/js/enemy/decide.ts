import { EnemySphere } from "./enemyBorn";
import { enemyGlobals } from "../main/globalVariables";

function decide(sphereMesh: EnemySphere) {
  const decideToMove = { up: true, left: true, right: true, down: true };
  if (sphereMesh.position.z <= enemyGlobals.boundaryLimit * -1) {
    decideToMove.down = false;
    decideToMove.up = true;
  }
  if (sphereMesh.position.z >= enemyGlobals.boundaryLimit) {
    decideToMove.up = false;
    decideToMove.down = true;
  }
  if (sphereMesh.position.x >= enemyGlobals.boundaryLimit) {
    decideToMove.right = false;
    decideToMove.left = true;
  }
  if (sphereMesh.position.x <= enemyGlobals.boundaryLimit * -1) {
    decideToMove.left = false;
    decideToMove.right = true;
  }
  return decideToMove;
}

export { decide };
