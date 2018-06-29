import { revive } from "./revive";

import { Scene, Vector3, MeshBuilder, Mesh, PhysicsImpostor } from "babylonjs";
import fire from "../projectile/Projectile";
import positionGenerator from "../utility/positionGenerator";
import randomNumberRange from "../utility/randomNumberRange";

import {
  towerGlobals,
  enemyGlobals,
  mapGlobals
} from "../main/globalVariables";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position = { x: -25, z: -25 },
    scene: Scene
  ) {
    const name = `tower${towerGlobals.towerIndex}` as string;
    towerGlobals.towerIndex += 1;
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
    revive(scene, tower, position, level);
  }
}

function rayClearsTower(scene: any, ray: any, tower: Mesh) {
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

export function enemyWatch(
  scene: Scene,
  tower: Mesh,
  towerTurret: Mesh,
  flash: Mesh,
  ray: any,
  level: number = 1 | 2 | 3
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
          rayClearsTower(scene, ray, tower)
        ) {
          enemyDistances.push([
            Vector3.Distance(towerTurret.position, enemy.position),
            [enemy]
          ]);
        }
      }
      if (enemyDistances.length > 0) {
        rotateTurret(enemyDistances.sort()[0][1][0], towerTurret);

        if (
          Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
          towerGlobals.shoot
        ) {
          deltaTime = Date.now();
          setTimeout(() => {
            flash.setEnabled(false);
          }, 4);

          flash.setEnabled(true);

          setTimeout(() => {
            fire(scene, towerTurret, level);
          }, 1);
        }
      }
    }
  });
}

function towerGenerator(scene: Scene, quantity: number = 0) {
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
    scene
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
      scene
    ) as Tower;
  }
}

export function destroyTower(
  scene: Scene,
  baseMesh: Mesh,
  pillarMesh?: Mesh,
  turretMesh?: Mesh,
  flashMesh?: Mesh
) {
  setTimeout(() => {
    const baseMeshImpostor = baseMesh.getPhysicsImpostor() as PhysicsImpostor;
    baseMeshImpostor.dispose();
    towerGlobals.allTowers = [];
    baseMesh.dispose();
    if (pillarMesh && turretMesh && flashMesh) {
      pillarMesh.dispose();
      turretMesh.dispose();
      flashMesh.dispose();
    }

    towerGlobals.allTowers = scene.getMeshesByTags("tower");
  }, 1);
}

function towers(scene: Scene) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber)
  );
}

export { towers, Tower };
