// @ts-check

import * as BABYLON from "babylonjs";

class Tower {
  constructor(level = 1, position = { x: -25, z: -25 }, scene) {
    this.name = `tower${level}`;
    this.levelBase = `towerBase${level}`;
    this.levelTop = `towerTop${level}`;

    this[this.levelBase] = BABYLON.MeshBuilder.CreateBox(
      this.levelBase,
      {
        size: 10,
        height: 1
      },
      scene
    );
    this[this.levelBase].position = new BABYLON.Vector3(
      position.x,
      0.5,
      position.z
    );

    const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
    towerMaterial.diffuseColor = new BABYLON.Color3(0, 0.85, 0.85);

    this[this.levelBase].material = towerMaterial;

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        this[this.levelTop] = BABYLON.MeshBuilder.CreateBox(
          this.levelTop,
          {
            size: 6,
            height: 2.5,
            width: 5
          },
          scene
        );
        this[this.levelTop].position = new BABYLON.Vector3(
          position.x,
          3,
          position.z
        );
        this[this.levelTop].material = towerMaterial;
        break;
    }
  }
}

export default function towers(scene) {
  const tower1 = new Tower(1, { x: -45, z: 45 });
  const tower2 = new Tower(2, { x: 45, z: -45 });
  const tower3 = new Tower(3, { x: 5, z: 45 });
}
