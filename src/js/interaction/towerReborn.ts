import { Scene, PhysicsEngine, PickingInfo } from "babylonjs";
import { Tower, towerBasePositions } from "../tower/Tower";
import { economyGlobals, towerGlobals } from "../main/globalVariables";

function towerReborn(
  newLevel: number,
  pickResult: PickingInfo,
  scene: Scene,
  physicsEngine: PhysicsEngine
) {
  if (
    pickResult.pickedMesh !== null &&
    economyGlobals.currentBalance > towerGlobals.baseCost * newLevel
  ) {
    pickResult.pickedMesh.dispose();
    const samePosition = {
      x: pickResult.pickedMesh.position.x,
      z: pickResult.pickedMesh.position.z
    };
    towerGlobals.allPositions = towerBasePositions(scene);
    if (
      towerGlobals.allPositions.find(
        existingLocation =>
          existingLocation.x === samePosition.x &&
          existingLocation.z === samePosition.z
      ) === undefined
    ) {
      new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;
    }
  }
}

export { towerReborn };
