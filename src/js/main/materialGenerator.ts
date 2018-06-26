import { Color3, StandardMaterial } from "babylonjs";
import {
  enemyGlobals,
  mapGlobals,
  projectileGlobals,
  towerGlobals
} from "./globalVariables";

function generateMaterials(scene) {
  const groundMaterial = new StandardMaterial("groundMaterial", scene);

  groundMaterial.wireframe = true;
  groundMaterial.diffuseColor = enemyGlobals.hitColor;
  groundMaterial.emissiveColor = enemyGlobals.hitColor;
  groundMaterial.specularColor = new Color3(0.68, 0.38, 0.1);
  groundMaterial.ambientColor = mapGlobals.ambientColor;
  groundMaterial.alpha = 0.5;

  const skyMaterial = new StandardMaterial("skyMaterial", scene);

  skyMaterial.diffuseColor = new Color3(0.12, 0.02, 0.19);
  skyMaterial.specularColor = new Color3(0.12, 0.04, 0.08);
  skyMaterial.ambientColor = mapGlobals.ambientColor;

  const towerMaterial = new StandardMaterial("towerMaterial", scene);
  towerMaterial.diffuseColor = towerGlobals.livingColor;
  towerMaterial.specularColor = towerGlobals.specularColor;
  towerMaterial.ambientColor = mapGlobals.ambientColor;

  const projectileMaterial = new StandardMaterial("projectileMaterial", scene);
  projectileMaterial.emissiveColor = projectileGlobals.livingColor;
  projectileMaterial.linkEmissiveWithDiffuse = true;

  const transparentMaterial = new StandardMaterial(
    "transparentMaterial",
    scene
  );
  transparentMaterial.alpha = 0;

  const enemyMaterial = new StandardMaterial("enemyMaterial", scene);
  enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.ambientColor = mapGlobals.ambientColor;

  const damagedMaterial = new StandardMaterial("damagedMaterial", scene);
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.wireframe = true;
  damagedMaterial.alpha = 0.5;
  damagedMaterial.specularColor = mapGlobals.ambientColor;
  damagedMaterial.ambientColor = mapGlobals.ambientColor;

  const hitMaterial = new StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.specularColor = mapGlobals.sceneAmbient;
  hitMaterial.ambientColor = mapGlobals.ambientColor;
}

export { generateMaterials };
