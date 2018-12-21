import { Material } from "babylonjs";
import { economyGlobals, materialGlobals } from "../main/globalVariables";
export function currencyMeshColor() {
	setTimeout(() => {
		economyGlobals.currencyMesh.material = materialGlobals.hitMaterial as Material;
	}, 50);
	economyGlobals.currencyMesh.material = materialGlobals.damagedMaterial as Material;
}
