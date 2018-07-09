import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo,
  Tags
} from "babylonjs";
import { Tower } from "../tower/Tower";
import { towerGlobals, economyGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";

function newTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;

    if (
      pickResult.pickedPoint !== null &&
      pickResult.pickedMesh !== null &&
      economyGlobals.currentBalance > towerGlobals.baseCost
    ) {
      if (
        pickResult.hit &&
        pickResult.pickedMesh.name === "ground" &&
        !Tags.MatchesQuery(pickResult.pickedMesh, "towerBase")
      ) {
        let newLocation: Position2D = {
          x: 0,
          z: 0
        };

        // if the click hits the ground object, position changes to match the grid

        if (pickResult.pickedPoint.x > 0) {
          newLocation.x = Math.round(
            pickResult.pickedPoint.x + 5 - (pickResult.pickedPoint.x % 10)
          );
        } else {
          newLocation.x = Math.round(
            pickResult.pickedPoint.x - 5 - (pickResult.pickedPoint.x % 10)
          );
        }

        if (pickResult.pickedPoint.z > 0) {
          newLocation.z = Math.round(
            pickResult.pickedPoint.z + 5 - (pickResult.pickedPoint.z % 10)
          );
        } else {
          newLocation.z = Math.round(
            pickResult.pickedPoint.z - 5 - (pickResult.pickedPoint.z % 10)
          );
        }
        const level = 1;

        if (
          towerGlobals.allPositions.find(
            existingLocation =>
              existingLocation.x === newLocation.x &&
              existingLocation.z === newLocation.z
          ) === undefined &&
          economyGlobals.occupiedSpaces.find(
            existingLocation =>
              existingLocation[0] === newLocation.x &&
              existingLocation[1] === newLocation.z
          ) === undefined
        ) {
          new Tower(
            level,
            { x: newLocation.x, z: newLocation.z },
            scene,
            physicsEngine
          ) as Tower;
        }
      }
    }
  }, PointerEventTypes._POINTERTAP);
}

export { newTower };
