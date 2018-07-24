import { Color3, StandardMaterial, Scene, Material } from "babylonjs";
import {
  enemyGlobals,
  mapGlobals,
  projectileGlobals,
  towerGlobals,
  materialGlobals
} from "../main/globalVariables";

function generateMaterials(scene: Scene) {
  const groundMaterial = new StandardMaterial("groundMaterial", scene);

  groundMaterial.wireframe = true;
  groundMaterial.diffuseColor = enemyGlobals.hitColor;
  groundMaterial.emissiveColor = enemyGlobals.hitColor;
  groundMaterial.specularColor = new Color3(0.68, 0.38, 0.1);
  groundMaterial.ambientColor = mapGlobals.ambientColor;
  groundMaterial.alpha = 0.3;

  const skyMaterial = new StandardMaterial("skyMaterial", scene);

  skyMaterial.diffuseColor = new Color3(0.11, 0.02, 0.19);
  skyMaterial.specularColor = new Color3(0.09, 0.05, 0.05);
  skyMaterial.ambientColor = mapGlobals.sceneAmbient;

  const towerMaterial = new StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.specularColor = towerGlobals.specularColor;
  towerMaterial.ambientColor = mapGlobals.ambientColor;

  const projectileMaterial = new StandardMaterial("projectileMaterial", scene);
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.linkEmissiveWithDiffuse = true;

  const enemyMaterial = new StandardMaterial("enemyMaterial", scene);
  // enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.ambientColor = mapGlobals.ambientColor;
  enemyMaterial.specularColor = mapGlobals.ambientColor;

  const damagedMaterial = enemyMaterial.clone("damagedMaterial");
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  // damagedMaterial.alpha = 0.9;

  const instanceMaterial = damagedMaterial.clone("instanceMaterial");
  instanceMaterial.alpha = 0.6;

  const hitMaterial = enemyMaterial.clone("hitMaterial") as StandardMaterial;
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.specularColor = new Color3(0.68, 0.38, 0.1);
  hitMaterial.emissiveColor = enemyGlobals.hitColor;
  hitMaterial.wireframe = true;
  hitMaterial.alpha = 0.99;

  groundMaterial.freeze();
  towerMaterial.freeze();
  projectileMaterial.freeze();
  skyMaterial.freeze();
  enemyMaterial.freeze();
  damagedMaterial.freeze();
  instanceMaterial.freeze();
  hitMaterial.freeze();

  materialGlobals.groundMaterial = groundMaterial;
  materialGlobals.towerMaterial = towerMaterial;
  materialGlobals.projectileMaterial = projectileMaterial;
  materialGlobals.skyMaterial = skyMaterial;
  materialGlobals.enemyMaterial = enemyMaterial;
  materialGlobals.damagedMaterial = damagedMaterial;
  materialGlobals.instanceMaterial = instanceMaterial;
  materialGlobals.hitMaterial = hitMaterial;
}

export { generateMaterials };
