import { towerReborn } from "./towerReborn";

import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo,
  Tags
} from "babylonjs";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer tap event is raised
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
      } else if (currentLevel === 2) {
        newLevel = 3;
      } else if (currentLevel === 3) {
      }
      towerReborn(newLevel, pickResult, scene, physicsEngine);
    }
  }, PointerEventTypes._POINTERTAP);
}

export { upgradeTower };
