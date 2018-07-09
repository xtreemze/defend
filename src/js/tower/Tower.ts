import { towerBorn, TowerTurret } from "./towerBorn";
import { Scene, MeshBuilder, Mesh, PhysicsEngine, Ray, Tags } from "babylonjs";
import { addTower } from "../main/sound";
import { towerGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position: Position2D = { x: -25, z: -25 },
    scene: Scene,
    physicsEngine: PhysicsEngine
  ) {
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

    Tags.AddTagsTo(tower, "towerBase");
    tower.convertToUnIndexedMesh();
    towerBorn(scene, tower, position, level, physicsEngine);
    addTower(tower, level);
    towerGlobals.allPositions = towerBasePositions(scene);
  }
}

function towerBasePositions(scene: Scene) {
  let positionalArray: Position2D[] = [];
  scene.getMeshesByTags("towerBase", towerBaseMesh => {
    const towerLocation = {
      x: towerBaseMesh.position.x,
      z: towerBaseMesh.position.z
    } as Position2D;
    positionalArray.push(towerLocation);
  });
  return positionalArray;
}

function shotClearsTower(scene: Scene, ray: Ray, intendedEnemy: Mesh) {
  let result = false as boolean;
  const hit = scene.pickWithRay(ray);

  if (
    hit &&
    hit.pickedMesh === intendedEnemy &&
    !Tags.MatchesQuery(intendedEnemy, "obstacle")
  ) {
    result = true as boolean;
  }
  return result as boolean;
}

function rotateTurret(sortedDistances: any, towerTurret: Mesh) {
  towerTurret.lookAt(sortedDistances.position);
}

function destroyTower(
  scene: Scene,
  baseMesh: Mesh,
  pillarMesh?: Mesh,
  turretMesh?: TowerTurret,
  flashMesh?: Mesh
): void {
  Tags.RemoveTagsFrom(baseMesh, "towerBase");
  towerGlobals.allPositions = towerBasePositions(scene);
  baseMesh.onDisposeObservable.clear();
  towerGlobals.allTowers = [];
  if (pillarMesh && turretMesh && flashMesh) {
    if (towerGlobals.raysOn) {
      turretMesh.turretRayHelper.dispose();
    }
    pillarMesh.dispose();

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

  towerGlobals.allTowers = scene.getMeshesByTags("tower" && "towerBase");
}

export {
  Tower,
  destroyTower,
  towerBasePositions,
  shotClearsTower,
  rotateTurret
};
