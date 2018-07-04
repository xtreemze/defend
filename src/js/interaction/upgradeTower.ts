import {
  Scene,
  PointerInfo,
  PhysicsEngine,
  PointerEventTypes,
  PickingInfo
} from "babylonjs";
import { Tower } from "../tower/Tower";

function upgradeTower(scene: Scene, physicsEngine: PhysicsEngine) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as PickingInfo;

    if (pickResult.pickedMesh !== null) {
      console.log(
        pickResult.pickedMesh.name,
        pickResult.pickedMesh.position.x,
        pickResult.pickedMesh.position.z
      );
      if (pickResult.hit && pickResult.pickedMesh.name[10] === "1") {
        const samePosition = {
          x: pickResult.pickedMesh.position.x,
          z: pickResult.pickedMesh.position.z
        };

        pickResult.pickedMesh.dispose();

        const level = 2;

        setTimeout(() => {
          new Tower(level, samePosition, scene, physicsEngine) as Tower;
        }, 100);
      }
      if (
        pickResult.hit &&
        pickResult.pickedMesh.name[10] === "2" &&
        pickResult.pickedMesh.name[10] === "3"
      ) {
        const samePosition = {
          x: pickResult.pickedMesh.position.x,
          z: pickResult.pickedMesh.position.z
        };

        pickResult.pickedMesh.dispose();

        const level = 3;
        setTimeout(() => {
          new Tower(level, samePosition, scene, physicsEngine) as Tower;
        }, 100);
      }
    }
  }, PointerEventTypes._POINTERTAP);
}

export { upgradeTower };
