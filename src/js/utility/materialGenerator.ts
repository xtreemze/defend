import { Color3, StandardMaterial, Scene } from "babylonjs";
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
  groundMaterial.alpha = 0.1;

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
  // enemyMaterial.wireframe = true;
  enemyMaterial.diffuseColor = enemyGlobals.livingColor;
  enemyMaterial.ambientColor = mapGlobals.ambientColor;
  enemyMaterial.specularColor = mapGlobals.ambientColor;

  const damagedMaterial = new StandardMaterial("damagedMaterial", scene);
  damagedMaterial.diffuseColor = enemyGlobals.deadColor;
  damagedMaterial.specularColor = mapGlobals.ambientColor;
  damagedMaterial.ambientColor = mapGlobals.ambientColor;
  // damagedMaterial.alpha = 0.9;

  const hitMaterial = new StandardMaterial("hitMaterial", scene);
  hitMaterial.diffuseColor = enemyGlobals.hitColor;
  hitMaterial.specularColor = mapGlobals.sceneAmbient;
  hitMaterial.ambientColor = mapGlobals.ambientColor;
  hitMaterial.specularColor = new Color3(0.68, 0.38, 0.1);
  hitMaterial.emissiveColor = enemyGlobals.hitColor;
  hitMaterial.wireframe = true;
  hitMaterial.alpha = 0.98;

  groundMaterial.freeze();
  towerMaterial.freeze();
  projectileMaterial.freeze();
  transparentMaterial.freeze();
  skyMaterial.freeze();
  enemyMaterial.freeze();
  damagedMaterial.freeze();
  hitMaterial.freeze();

  materialGlobals.groundMaterial = groundMaterial;
  materialGlobals.towerMaterial = towerMaterial;
  materialGlobals.projectileMaterial = projectileMaterial;
  materialGlobals.transparentMaterial = transparentMaterial;
  materialGlobals.skyMaterial = skyMaterial;
  materialGlobals.enemyMaterial = enemyMaterial;
  materialGlobals.damagedMaterial = damagedMaterial;
  materialGlobals.hitMaterial = hitMaterial;
}

export { generateMaterials };
