import { MeshBuilder, Material } from "babylonjs";
import { projectileGlobals, materialGlobals } from "../main/globalVariables";
import { LiveProjectile } from "./startLife";

function createProjectileInstances() {
  projectileGlobals.projectileMeshL2 = MeshBuilder.CreateBox(
    "projectileInstanceLevel2",
    {
      size: 2,
      height: 2 / 4,
      width: 2 / 2,
      updatable: false
    }
  ) as LiveProjectile;
  projectileGlobals.projectileMeshL2.hitPoints =
    2 * 2 * projectileGlobals.baseHitPoints;
  projectileGlobals.projectileMeshL2.material = materialGlobals.projectileMaterial as Material;
  projectileGlobals.projectileMeshL2.convertToUnIndexedMesh();
  projectileGlobals.projectileMeshL2.setEnabled(false);

  projectileGlobals.projectileMeshL3 = MeshBuilder.CreateBox(
    "projectileInstanceLevel3",
    {
      size: 3,
      height: 3 / 4,
      width: 3 / 2,
      updatable: false
    }
  ) as LiveProjectile;
  projectileGlobals.projectileMeshL3.hitPoints =
    3 * 3 * projectileGlobals.baseHitPoints;
  projectileGlobals.projectileMeshL3.material = materialGlobals.projectileMaterial as Material;
  projectileGlobals.projectileMeshL3.convertToUnIndexedMesh();
  projectileGlobals.projectileMeshL3.setEnabled(false);
}

export { createProjectileInstances };
