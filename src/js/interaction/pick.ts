import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo
} from "babylonjs";
import { Tower } from "../tower/Tower";
import { towerGlobals, economyGlobals } from "../main/globalVariables";

function newTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;
    if (
      pickResult.pickedPoint !== null &&
      pickResult.pickedMesh !== null &&
      economyGlobals.currentBalance > towerGlobals.baseCost
    ) {
      if (pickResult.hit && pickResult.pickedMesh.name === "ground") {
        let newLocation: { x: number; y: number; z: number } = {
          x: 0,
          y: 0,
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
        newLocation.y = 5 / 2;

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

        new Tower(
          level,
          { x: newLocation.x, z: newLocation.z },
          scene,
          physicsEngine
        ) as Tower;
      }
    }
  }, PointerEventTypes._POINTERTAP);
}

export { newTower };
