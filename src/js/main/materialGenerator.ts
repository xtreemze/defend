import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  mapGlobals,
  projectileGlobals,
  towerGlobals
} from "./variables";

export default function generateMaterials(scene) {
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  groundMaterial.wireframe = true;
  groundMaterial.diffuseColor = enemyGlobals.hitColor;
  groundMaterial.emissiveColor = enemyGlobals.hitColor;
  // groundMaterial.specularColor = enemyGlobals.livingColor;
  groundMaterial.specularColor = new BABYLON.Color3(0.68, 0.38, 0.1);
  groundMaterial.ambientColor = mapGlobals.ambientColor;
  groundMaterial.alpha = 0.5;
  groundMaterial.freeze(); // if material is immutable

  const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);

  skyMaterial.diffuseColor = new BABYLON.Color3(0.04, 0, 0.08);
  skyMaterial.specularColor = new BABYLON.Color3(0.1, 0.04, 0.08);
  skyMaterial.emissiveColor = new BABYLON.Color3(0.08, 0.03, 0.05);
  skyMaterial.ambientColor = mapGlobals.ambientColor;
  skyMaterial.freeze(); // if material is immutable

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.specularColor = towerGlobals.specularColor;
  towerMaterial.ambientColor = mapGlobals.ambientColor;
  towerMaterial.freeze(); // if material is immutable

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.linkEmissiveWithDiffuse = true;
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
  enemyMaterial.ambientColor = mapGlobals.ambientColor;
  enemyMaterial.freeze(); // if material is immutable

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.wireframe = true;
  damagedMaterial.alpha = 0.5;
  damagedMaterial.ambientColor = mapGlobals.ambientColor;
  damagedMaterial.freeze(); // if material is immutable

  const hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.ambientColor = mapGlobals.ambientColor;
  hitMaterial.freeze(); // if material is immutable
}
