import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo
} from "babylonjs";
import { Tower } from "../tower/Tower";
import { economyGlobals, towerGlobals } from "../main/globalVariables";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;

    if (
      pickResult.hit &&
      pickResult.pickedMesh !== null &&
      pickResult.pickedMesh.material !== null &&
      pickResult.pickedMesh.name.match(/tower*/)
    ) {
      const currentLevel = parseInt(pickResult.pickedMesh.name[10]);
      let newLevel = 0;
      const samePosition = {
        x: pickResult.pickedMesh.position.x,
        z: pickResult.pickedMesh.position.z
      };

      if (currentLevel === 1) {
        newLevel = 2;
      } else {
        newLevel = 3;
      }
      if (economyGlobals.currentBalance > towerGlobals.baseCost * newLevel) {
        pickResult.pickedMesh.dispose();
        new Tower(newLevel, samePosition, scene, physicsEngine) as Tower;
      }
    }
  }, PointerEventTypes._POINTERTAP);
}

export { upgradeTower };
