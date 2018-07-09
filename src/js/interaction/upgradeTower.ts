import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo,
  Tags
} from "babylonjs";
import { Tower, towerBasePositions, destroyTower } from "../tower/Tower";
import { economyGlobals, towerGlobals } from "../main/globalVariables";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;

    if (
      pickResult.hit &&
      pickResult.pickedMesh !== null &&
      pickResult.pickedMesh.name.match(/tower*/) &&
      Tags.MatchesQuery(pickResult.pickedMesh, "towerBase") &&
      pickResult.pickedMesh.name !== "ground"
    ) {
      // determine current and previous tower level
      const currentLevel = parseInt(pickResult.pickedMesh.name[10]);

      let newLevel = 0;
      if (currentLevel === 1) {
        newLevel = 2;
      } else if (currentLevel === 2 || currentLevel === 3) {
        newLevel = 3;
      }

      if (economyGlobals.currentBalance > towerGlobals.baseCost * newLevel) {
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
  }, PointerEventTypes._POINTERTAP);
}

export { upgradeTower };
