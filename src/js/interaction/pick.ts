import { Scene, PointerInfo, PhysicsEngine } from "babylonjs";
import { Tower } from "../tower/Tower";
import { towerGlobals, economyGlobals } from "../main/globalVariables";
import randomNumberRange from "../utility/randomNumberRange";

function newTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as any;
    if (pickResult.hit && pickResult.pickedMesh.name === "ground") {
      let newLocation: { x: number; y: number; z: number } = {
        x: 0,
        y: 0,
        z: 0
      };

      // if the click hits the ground object, we change the impact position

      if (pickResult.pickedPoint.x > 0) {
        newLocation.x =
          pickResult.pickedPoint.x + 5 - (pickResult.pickedPoint.x % 10);
      } else {
        newLocation.x =
          pickResult.pickedPoint.x - 5 - (pickResult.pickedPoint.x % 10);
      }
      newLocation.y = 5 / 2;

      if (pickResult.pickedPoint.z > 0) {
        newLocation.z =
          pickResult.pickedPoint.z + 5 - (pickResult.pickedPoint.z % 10);
      } else {
        newLocation.z =
          pickResult.pickedPoint.z - 5 - (pickResult.pickedPoint.z % 10);
      }
      const level = randomNumberRange(1, 3);
      if (
        towerGlobals.occupiedSpaces.find(
          existingLocation =>
            existingLocation[0] === newLocation.x &&
            existingLocation[1] === newLocation.z
        ) === undefined &&
        economyGlobals.currentBalance >= level * 10
      ) {
        towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

        new Tower(
          level,
          {
            x: towerGlobals.occupiedSpaces[0][0],
            z: towerGlobals.occupiedSpaces[0][1]
          },
          scene,
          physicsEngine
        ) as Tower;
      }
    }
  }, BABYLON.PointerEventTypes._POINTERTAP);
}

export { newTower };