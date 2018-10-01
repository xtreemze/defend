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
import { removeTower } from "../main/sound";
import { currencyMeshColor } from "../enemy/currencyMeshColor";
import { createBaseInstance } from "./indicatorInstance";

function newTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;
    let newLocation: Position2D = {
      x: 0,
      z: 0
    };

    if (
      pickResult.pickedPoint !== null &&
      pickResult.pickedMesh !== null &&
      pickResult.hit &&
      pickResult.pickedMesh.name === "ground"
    ) {
      if (!Tags.MatchesQuery(pickResult.pickedMesh, "towerBase")) {
        // if ground object is clicked, position changes to match the grid

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
      }
      const level = 1;
      // check if a tower already exists at the position
      if (
        economyGlobals.currentBalance > towerGlobals.baseCost &&
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

      if (economyGlobals.currentBalance <= towerGlobals.baseCost) {
        // When a tower is requested but balance is insuficient
        createBaseInstance(newLocation);
        // color
        currencyMeshColor();

        removeTower(economyGlobals.currencyMesh, 1); // sound
      }
    }
  }, PointerEventTypes.POINTERTAP);
}

export { newTower };
