import { PhysicsImpostor, Mesh, Scene, Material } from "babylonjs";
import { updateEconomy } from "../gui/currency";
import { mapGlobals, economyGlobals } from "../main/globalVariables";
import { damage } from "../main/sound";

function currencyCollide(
  enemy: Mesh,
  scene: Scene,
  enemyImpostor: PhysicsImpostor,
  currencyMesh: Mesh,
  currencyMeshImpostor: PhysicsImpostor
) {
  const enemyMaterial = scene.getMaterialByID("hitMaterial");
  const hitMaterial = scene.getMaterialByName("damagedMaterial");

  enemyImpostor.registerOnPhysicsCollide(currencyMeshImpostor, () => {
    //@ts-ignore
    if (enemy.hitPoints > 0 && economyGlobals.currentBalance > 0) {
      //@ts-ignore
      economyGlobals.currentBalance -= enemy.hitPoints;
    }
    //@ts-ignore
    enemy.hitPoints = 0;
      updateEconomy(scene);

      currencyMesh.material = hitMaterial as Material;
      setTimeout(() => {
        currencyMesh.material = enemyMaterial as Material;
      }, 30);

    if (
      mapGlobals.simultaneousSounds < mapGlobals.soundLimit &&
      //@ts-ignore
      enemy.hitPoints > 0
    ) {
      setTimeout(() => {
        mapGlobals.simultaneousSounds -= 1;
      }, mapGlobals.soundDelay);

      mapGlobals.simultaneousSounds += 1;

      if (mapGlobals.soundOn) {
        // @ts-ignore
        currencyMesh.hitPoints = economyGlobals.currentBalance / 5000;

        damage(currencyMesh);
      }
    }
  });
}

export { currencyCollide };
