import { revive } from "./revive";

import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  PhysicsImpostor,
  PhysicsEngine,
  Material
} from "babylonjs";
import fireProjectile from "../projectile/Projectile";
import positionGenerator from "../utility/positionGenerator";
import randomNumberRange from "../utility/randomNumberRange";
import { addTower } from "../main/sound";
import {
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  economyGlobals
} from "../main/globalVariables";
import { updateEconomy } from "../gui/currency";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position = { x: -25, z: -25 },
    scene: Scene,
    physicsEngine: PhysicsEngine
  ) {

    economyGlobals.currentBalance -= (level * 300);

    updateEconomy(scene);

    const currencyMesh = scene.getMeshByName("currencyTower") as Mesh;
    const towerMaterial = scene.getMaterialByName("towerMaterial") as Material;
    const hitMaterial = scene.getMaterialByName("hitMaterial") as Material;

    currencyMesh.material = towerMaterial as Material;

    setTimeout(() => {
      currencyMesh.material = hitMaterial as Material;
    }, 20);

    const name = `towerLevel${level}Index${towerGlobals.index}` as string;
    towerGlobals.index += 1;
    let tower = MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: towerGlobals.height,
        updatable: false
      },
      scene
    ) as Mesh;

    tower.convertToUnIndexedMesh();
    revive(scene, tower, position, level, physicsEngine);
    addTower(tower, level);
  }
}

function shotClearsTower(scene: any, ray: any, tower: Mesh) {
  let result = false as boolean;
  scene.pickWithRay(ray, (mesh: Mesh) => {
    for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
      const element = towerGlobals.allTowers[index];

      if (element === mesh && mesh !== tower) {
        result = true as boolean;
      }
    }
  });
  return result as boolean;
}

function rotateTurret(sortedDistances: any, towerTurret: Mesh) {
  towerTurret.lookAt(sortedDistances.position);
}

function trackSpheres(
  scene: Scene,
  tower: Mesh,
  towerTurret: Mesh,
  flash: Mesh,
  ray: any,
  level: number = 1 | 2 | 3,
  physicsEngine: PhysicsEngine
) {
  let deltaTime = Date.now();

  tower.registerBeforeRender(() => {
    if (
      enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit
    ) {
      const enemyDistances = [] as any;
      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const enemy = enemyGlobals.allEnemies[index];

        if (
          enemy.position.y <= towerGlobals.range * 3 &&
          enemy.position.y > 0 &&
          //@ts-ignore
          enemy.hitPoints >= enemyGlobals.deadHitPoints &&
          Vector3.Distance(towerTurret.position, enemy.position) <=
            towerGlobals.range * 3 &&
          shotClearsTower(scene, ray, tower)
        ) {
          enemyDistances.push([
            Vector3.Distance(towerTurret.position, enemy.position),
            enemy
          ]);
        }
      }
      if (enemyDistances.length > 0) {
        const nearestEnemy = enemyDistances.sort()[0][1] as Mesh;
        const nearestEnemyImpostor = nearestEnemy.getPhysicsImpostor() as PhysicsImpostor;

        rotateTurret(nearestEnemy, towerTurret);

        if (
          Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
          towerGlobals.shoot
        ) {
          deltaTime = Date.now();
          setTimeout(() => {
            flash.setEnabled(false);
          }, 30);

          flash.setEnabled(true);

          setTimeout(() => {
            fireProjectile(
              scene,
              towerTurret,
              level,
              nearestEnemy,
              physicsEngine,
              nearestEnemyImpostor
            );
          }, 5);
        }
      }
    }
  });
}

function towerGenerator(
  scene: Scene,
  quantity: number = 0,
  physicsEngine: PhysicsEngine
) {
  let newLocation = positionGenerator();

  while (
    towerGlobals.occupiedSpaces.find(
      existingLocation =>
        existingLocation[0] === newLocation.x &&
        existingLocation[1] === newLocation.z
    ) !== undefined
  ) {
    newLocation = positionGenerator();
  }
  towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

  new Tower(
    3,
    {
      x: towerGlobals.occupiedSpaces[0][0],
      z: towerGlobals.occupiedSpaces[0][1]
    },
    scene,
    physicsEngine
  ) as Tower;

  for (let index = 2; index < quantity; index += 1) {
    let newLocation = positionGenerator();

    while (
      towerGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      ) !== undefined
    ) {
      newLocation = positionGenerator();
    }
    towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

    new Tower(
      randomNumberRange(1, 3),
      {
        x: towerGlobals.occupiedSpaces[0][0],
        z: towerGlobals.occupiedSpaces[0][1]
      },
      scene,
      physicsEngine
    ) as Tower;
  }
}

function destroyTower(
  scene: Scene,
  baseMesh: Mesh,
  pillarMesh?: Mesh,
  turretMesh?: Mesh,
  flashMesh?: Mesh
): any {
  baseMesh.onDisposeObservable.clear();
  if (baseMesh.physicsImpostor !== null) {
    baseMesh.physicsImpostor.dispose();
  }
  // baseMesh.dispose();
  towerGlobals.allTowers = [];
  if (pillarMesh && turretMesh && flashMesh) {
    pillarMesh.dispose();
    turretMesh.dispose();
    flashMesh.dispose();
  }

  towerGlobals.allTowers = scene.getMeshesByTags("tower");
  towerGlobals.occupiedSpaces.pop();
}

function towers(scene: Scene, physicsEngine: PhysicsEngine) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber),
    physicsEngine
  );
}

export { towers, Tower, trackSpheres, destroyTower };
