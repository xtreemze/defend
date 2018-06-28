import { MeshBuilder, Mesh, Scene, PointerInfo } from "babylonjs";
import { Tower } from "./../tower/Tower";
import { enemyGlobals, towerGlobals } from "./../main/globalVariables";
import randomNumberRange from "../utility/randomNumberRange";

function pick(scene: Scene) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    const pickResult = evt.pickInfo as any;
    // if the click hits the ground object, we change the impact position
    if (pickResult.hit) {
      const point = MeshBuilder.CreateBox(
        "picked",
        { size: 10, height: 5, width: 10, depth: 10 },
        scene
      ) as Mesh;

      console.log(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

      point.position.x =
        pickResult.pickedPoint.x - (pickResult.pickedPoint.x % 10) + 5;
      point.position.y = 5 / 2;
      point.position.z =
        pickResult.pickedPoint.z - (pickResult.pickedPoint.z % 10) + 5;
      console.log("processed", point.position.x, point.position.z);

      setTimeout(() => {
        point.dispose();
      }, 3000);
    }
  }, BABYLON.PointerEventTypes._POINTERTAP);
}

function newTower(scene: Scene) {
  //When pointer down event is raised

  scene.onPointerObservable.add(function(evt: PointerInfo) {
    let newLocation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    const pickResult = evt.pickInfo as any;
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

    if (
      towerGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      ) === undefined
    ) {
      towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);
      new Tower(
        randomNumberRange(1, 3),
        {
          x: towerGlobals.occupiedSpaces[0][0],
          z: towerGlobals.occupiedSpaces[0][1]
        },
        scene
      ) as Tower;
    }
  }, BABYLON.PointerEventTypes._POINTERTAP);
}

export { pick, newTower };
