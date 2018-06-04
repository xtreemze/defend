import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  mapGlobals,
  projectileGlobals,
  towerGlobals
} from "./variables";

let materials = {};

export default function generateMaterials(scene) {
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  groundMaterial.wireframe = true;
  groundMaterial.diffuseColor = enemyGlobals.hitColor;
  groundMaterial.emissiveColor = enemyGlobals.hitColor;
  groundMaterial.freeze(); // if material is immutable

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.freeze(); // if material is immutable

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.linkEmissiveWithDiffuse = true;
  // projectileMaterial.alpha = 0.9;
  projectileMaterial.freeze(); // if material is immutable

  const transparentMaterial = new BABYLON.StandardMaterial(
    "transparentMaterial",
    scene
  );
  transparentMaterial.alpha = 0;
  transparentMaterial.freeze(); // if material is immutable

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.freeze(); // if material is immutable

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.wireframe = true;
  damagedMaterial.alpha = 0.5;
  damagedMaterial.freeze(); // if material is immutable

  const hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.freeze(); // if material is immutable

  materials = {
    groundMaterial,
    projectileMaterial,
    transparentMaterial,
    damagedMaterial,
    hitMaterial,
    towerMaterial,
    enemyMaterial
  };
}

export { materials };
