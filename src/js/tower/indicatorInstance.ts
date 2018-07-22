import { MeshBuilder, Material, Mesh, InstancedMesh, Vector3 } from "babylonjs";
import { materialGlobals, towerGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";

function createIndicatorInstance() {
  towerGlobals.indicator = MeshBuilder.CreateBox("towerBaseMesh", {
    size: 10.02,
    height: towerGlobals.height * 2,
    updatable: false
  }) as Mesh;

  towerGlobals.indicator.convertToUnIndexedMesh();
  towerGlobals.indicator.material = materialGlobals.instanceMaterial as Material;
  towerGlobals.indicator.isPickable = false;
  towerGlobals.indicator.setEnabled(false);
}

function createBaseInstance(position: Position2D) {
  const instance = towerGlobals.indicator.createInstance(name) as InstancedMesh;
  instance.position = new Vector3(
    position.x,
    towerGlobals.height,
    position.z
  ) as Vector3;

  setTimeout(() => {
    instance.setEnabled(false);
  }, 100);
  setTimeout(() => {
    instance.setEnabled(true);
  }, 200);
  setTimeout(() => {
    instance.setEnabled(false);
  }, 300);
  setTimeout(() => {
    instance.setEnabled(true);
  }, 400);

  setTimeout(() => {
    instance.dispose();
  }, 500);
}

export { createIndicatorInstance, createBaseInstance };
