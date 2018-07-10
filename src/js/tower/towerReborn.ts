import { Scene, PhysicsEngine, PickingInfo } from "babylonjs";
import { Tower, towerBasePositions } from "../tower/Tower";
import { economyGlobals, towerGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";

function towerReborn(
  newLevel: number,
  pickResult: PickingInfo,
  scene: Scene,
  physicsEngine: PhysicsEngine,
  samePosition: Position2D
) {
  if (
    pickResult.pickedMesh !== null &&
    economyGlobals.currentBalance > towerGlobals.baseCost * newLevel
  ) {
    new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;
  }
}

export { towerReborn };
