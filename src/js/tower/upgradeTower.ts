import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo,
  Tags,
  Material
} from "babylonjs";
import { Position2D } from "../enemy/Enemy";
import {
  towerGlobals,
  economyGlobals,
  materialGlobals
} from "../main/globalVariables";
import { towerBasePositions, Tower } from "./Tower";
import { removeTower } from "../main/sound";
import { currencyMeshColor } from "../enemy/currencyMeshColor";
import { createBaseInstance } from "./indicatorInstance";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer tap event is raised
  scene.onPointerObservable.add(function(evt: PointerInfo) {
    let currentLevel = 0;
    const pickResult = evt.pickInfo as PickingInfo;
    if (pickResult.pickedMesh !== null) {
      currentLevel = parseInt(pickResult.pickedMesh.name[10]);
    }
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
      if (
        economyGlobals.currentBalance >
        towerGlobals.baseCost * (currentLevel + 1)
      ) {
        pickResult.pickedMesh.dispose();
        let newLevel = 0;
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
              new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;
              break;
            case 2:
              newLevel = 3;
              new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;
              break;
            case 3:
              newLevel = 3;
              new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;

              break;

            default:
              break;
          }
        }
      } else if (
        economyGlobals.currentBalance <=
        towerGlobals.baseCost * (currentLevel + 1)
      ) {
        createBaseInstance(samePosition);
        // color when insufficient funds
        currencyMeshColor();

        // sound when insufficient funds
        removeTower(economyGlobals.currencyMesh, currentLevel + 1);
      }
    }
  }, PointerEventTypes.POINTERTAP);
}

export { upgradeTower };
