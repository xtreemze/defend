import { towerBorn, TowerTurret } from "./towerBorn";
import {
  Scene,
  Mesh,
  PhysicsEngine,
  Ray,
  Tags,
  PhysicsImpostor,
  Vector3
} from "babylonjs";
import { addTower } from "../main/sound";
import { towerGlobals, projectileGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";
import { EnemySphere } from "../enemy/enemyBorn";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position: Position2D = { x: -25, z: -25 },
    scene: Scene,
    physicsEngine: PhysicsEngine
  ) {
    const name = `towerLevel${level}Index${towerGlobals.index}` as string;
    towerGlobals.index += 1;
    let tower = towerGlobals.towerBaseMesh.clone(
      name,
      undefined,
      undefined,
      true
    ) as Mesh;

    Tags.AddTagsTo(tower, "towerBase");

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
  return true as boolean;
}

function rotateTurret(
  nearestEnemy: EnemySphere,
  towerTurret: Mesh,
  level: number
) {
  const impostor = nearestEnemy.physicsImpostor as PhysicsImpostor;

  const enemyVelocity = impostor.getLinearVelocity() as Vector3;

  const towerEnemyDistance = Vector3.Distance(
    nearestEnemy.position,
    towerTurret.position
  );

  const projectileTime =
    (towerEnemyDistance /
      (projectileGlobals.mass *
        (level * level) *
        (projectileGlobals.speed * (level * level)))) *
    50000;

  const newPosition = nearestEnemy.position.add(
    new Vector3(
      enemyVelocity.x * projectileTime,
      enemyVelocity.y * projectileTime,
      enemyVelocity.z * projectileTime
    )
  );
  if (newPosition.y < 3) {
    newPosition.y = 3;
  }
  towerTurret.lookAt(newPosition);
}

function destroyTower(
  scene: Scene,
  baseMesh: Mesh,
  pillarMesh?: Mesh,
  turretMesh?: TowerTurret,
  flashMesh?: Mesh
): void {
  Tags.RemoveTagsFrom(baseMesh, "towerBase");
  baseMesh.setEnabled(false);

  towerGlobals.allPositions = towerBasePositions(scene);
  baseMesh.onDisposeObservable.clear();
  towerGlobals.allTowers = [];
  if (pillarMesh && turretMesh && flashMesh) {
    pillarMesh.setEnabled(false);
    turretMesh.setEnabled(false);
    flashMesh.setEnabled(false);
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
