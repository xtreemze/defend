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
    if (enemy.hitPoints > 0) {
      //@ts-ignore
      economyGlobals.currentBalance -= enemy.hitPoints;
    }
    currencyMesh.material = hitMaterial as Material;
    //@ts-ignore
    enemy.hitPoints = 0;
    updateEconomy(scene);

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

      if (mapGlobals.soundOn) damage(currencyMesh);
    }
  });
}

export { currencyCollide };
