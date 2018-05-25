// @ts-check

import * as BABYLON from "babylonjs";

class Tower {
  constructor(level, position = { x: -25, z: -25 }, scene) {
    this.name = `tower${level}`;
    this.levelBase = `towerBase${level}`;
    this.levelTop = `towerTop${level}`;

    this[this.levelBase] = BABYLON.MeshBuilder.CreateBox(
      this.levelBase,
      {
        size: 10
      },
      scene
    );

    this[this.levelTop] = BABYLON.MeshBuilder.CreateBox(
      this.levelTop,
      {
        size: 5
      },
      scene
    );

    this[this.levelBase].position = new BABYLON.Vector3(
      position.x,
      -5,
      position.z
    );
    this[this.levelTop].position = new BABYLON.Vector3(
      position.x,
      2.5,
      position.z
    );

    const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
    towerMaterial.diffuseColor = new BABYLON.Color3(0, 0.85, 0.85);

    this[this.levelBase].material = towerMaterial;
    this[this.levelTop].material = towerMaterial;
  }
}

export default function towers(scene) {
  const tower1 = new Tower(1, { x: -45, z: 45 });

  const tower2 = BABYLON.MeshBuilder.CreateBox(
    "tower2",
    {
      size: 5
    },
    scene
  );
  const tower3 = BABYLON.MeshBuilder.CreateBox(
    "tower3",
    {
      size: 5
    },
    scene
  );

  tower1.position = new BABYLON.Vector3(-45, 2.5, 45);
  tower2.position = new BABYLON.Vector3(45, 2.5, -45);
  tower3.position = new BABYLON.Vector3(5, 2.5, -45);

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = new BABYLON.Color3(0, 0.85, 0.85);

  tower1.material = towerMaterial;
  tower2.material = towerMaterial;
  tower3.material = towerMaterial;
}
