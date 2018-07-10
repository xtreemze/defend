import { towerReborn } from "./towerReborn";

import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo,
  Tags
} from "babylonjs";
import { Position2D } from "../enemy/Enemy";
import { towerGlobals } from "../main/globalVariables";
import { towerBasePositions } from "./Tower";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer tap event is raised
  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;

    if (
      pickResult.hit &&
      pickResult.pickedMesh !== null &&
      Tags.MatchesQuery(pickResult.pickedMesh, "towerBase") &&
      pickResult.pickedMesh.name !== "ground"
    ) {
      const samePosition = {
        x: pickResult.pickedMesh.position.x,
        z: pickResult.pickedMesh.position.z
      } as Position2D;
      // determine current and previous tower level
      const currentLevel = parseInt(pickResult.pickedMesh.name[10]);

      let newLevel = 0;
      pickResult.pickedMesh.dispose();
      towerGlobals.allPositions = towerBasePositions(scene);
      if (
        towerGlobals.allPositions.find(
          existingLocation =>
            existingLocation.x === samePosition.x &&
            existingLocation.z === samePosition.z
        ) === undefined
      ) {
        switch (currentLevel) {
          case 1:
            newLevel = 2;
            towerReborn(
              newLevel,
              pickResult,
              scene,
              physicsEngine,
              samePosition
            );
            break;
          case 2:
            newLevel = 3;
            towerReborn(
              newLevel,
              pickResult,
              scene,
              physicsEngine,
              samePosition
            );
            break;
          case 3:
            newLevel = 3;
            towerReborn(
              newLevel,
              pickResult,
              scene,
              physicsEngine,
              samePosition
            );
            break;

          default:
            break;
        }
      }
    }
  }, PointerEventTypes._POINTERTAP);
}

export { upgradeTower };
