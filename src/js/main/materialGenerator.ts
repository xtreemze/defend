import * as BABYLON from "babylonjs";
import {
  enemyGlobals,
  mapGlobals,
  projectileGlobals,
  towerGlobals
} from "./globalVariables";

export default function generateMaterials(scene) {
  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);

  groundMaterial.wireframe = true;
  groundMaterial.diffuseColor = enemyGlobals.hitColor;
  groundMaterial.emissiveColor = enemyGlobals.hitColor;
  // groundMaterial.specularColor = enemyGlobals.livingColor;
  groundMaterial.specularColor = new BABYLON.Color3(0.68, 0.38, 0.1);
  groundMaterial.ambientColor = mapGlobals.ambientColor;
  groundMaterial.alpha = 0.5;

  const skyMaterial = new BABYLON.StandardMaterial("skyMaterial", scene);

  // skyMaterial.diffuseColor = new BABYLON.Color3(0.04, 0, 0.08);
  skyMaterial.diffuseColor = new BABYLON.Color3(0.12, 0.02, 0.19);
  skyMaterial.specularColor = new BABYLON.Color3(0.12, 0.04, 0.08);
  // skyMaterial.emissiveColor = new BABYLON.Color3(0.06, 0.02, 0.05);
  skyMaterial.ambientColor = mapGlobals.ambientColor;

  const towerMaterial = new BABYLON.StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.specularColor = towerGlobals.specularColor;
  towerMaterial.ambientColor = mapGlobals.ambientColor;

  const projectileMaterial = new BABYLON.StandardMaterial(
    "projectileMaterial",
    scene
  );
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.linkEmissiveWithDiffuse = true;

  const transparentMaterial = new BABYLON.StandardMaterial(
    "transparentMaterial",
    scene
  );
  transparentMaterial.alpha = 0;

  const enemyMaterial = new BABYLON.StandardMaterial("enemyMaterial", scene);
  enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.ambientColor = mapGlobals.ambientColor;

  const damagedMaterial = new BABYLON.StandardMaterial(
    "damagedMaterial",
    scene
  );
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.wireframe = true;
  damagedMaterial.alpha = 0.5;
  damagedMaterial.specularColor = mapGlobals.ambientColor;
  damagedMaterial.ambientColor = mapGlobals.ambientColor;

  const hitMaterial = new BABYLON.StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.specularColor = mapGlobals.sceneAmbient;
  hitMaterial.ambientColor = mapGlobals.ambientColor;
}
