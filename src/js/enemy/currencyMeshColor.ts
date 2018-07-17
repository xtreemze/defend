import { Material } from "babylonjs";
import { economyGlobals, materialGlobals } from "../main/globalVariables";
export function currencyMeshColor() {
  economyGlobals.currencyMesh.material = materialGlobals.damagedMaterial as Material;
  setTimeout(() => {
    economyGlobals.currencyMesh.material = materialGlobals.hitMaterial as Material;
  }, 10);
}
