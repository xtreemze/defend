import { towerBorn } from "./towerBorn";

import { Scene, MeshBuilder, Mesh, PhysicsEngine, Ray } from "babylonjs";
import positionGenerator from "../utility/positionGenerator";
import randomNumberRange from "../utility/randomNumberRange";
import { addTower } from "../main/sound";
import { towerGlobals, economyGlobals } from "../main/globalVariables";
import { updateEconomy } from "../gui/updateEconomy";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position = { x: -25, z: -25 },
    scene: Scene,
    physicsEngine: PhysicsEngine
  ) {
    economyGlobals.currentBalance -= level * towerGlobals.baseCost;

    updateEconomy(scene);

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
    towerBorn(scene, tower, position, level, physicsEngine);
    addTower(tower, level);
  }
}

export function shotClearsTower(scene: Scene, ray: Ray, intendedEnemy: Mesh) {
  let result = false as boolean;
  const hit = scene.pickWithRay(ray);

  if (hit && hit.pickedMesh === intendedEnemy) {
    result = true as boolean;
  }
  return result as boolean;
}

export function rotateTurret(sortedDistances: any, towerTurret: Mesh) {
  towerTurret.lookAt(sortedDistances.position);
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

  // baseMesh.dispose();
  towerGlobals.allTowers = [];
  if (pillarMesh && turretMesh && flashMesh) {
    if (towerGlobals.raysOn) {
      //@ts-ignore
      turretMesh.turretRayHelper.dispose();
    }
    pillarMesh.dispose();
    //@ts-ignore
    delete turretMesh.ray;
    turretMesh.dispose();
    flashMesh.dispose();
    if (pillarMesh.physicsImpostor !== null) {
      pillarMesh.physicsImpostor.dispose();
    }
  }

  if (baseMesh.physicsImpostor !== null) {
    baseMesh.physicsImpostor.dispose();
  }

  setTimeout(() => {

    towerGlobals.allTowers = scene.getMeshesByTags("tower");
  }, 10);
  towerGlobals.occupiedSpaces.pop();
}

function towers(scene: Scene, physicsEngine: PhysicsEngine) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber),
    physicsEngine
  );
}

export { towers, Tower, destroyTower };
