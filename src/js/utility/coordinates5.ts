import { Vector3 } from "babylonjs";

function processCoordinates(pickedCoordinates: Vector3) {
  return {
    x: (Math.round(pickedCoordinates.x / 5) * 5) as number,
    y: 0 as number,
    z: (Math.round(pickedCoordinates.z / 5) * 5) as number
  };
}
