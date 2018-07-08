import { enemyBorn } from "./enemyBorn";

import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Tags,
  Material,
  PhysicsImpostor
} from "babylonjs";
import positionGenerator from "../utility/positionGenerator";
import { newWave } from "../main/sound";
import {
  enemyGlobals,
  towerGlobals,
  mapGlobals,
  projectileGlobals,
  materialGlobals
} from "../main/globalVariables";
import { waves } from "./waves";
import { updateEconomy } from "../gui/updateEconomy";

class Enemy {
  constructor(level: number = 1, position: any = { x: 0, z: 0 }, scene: Scene) {
    const name = `enemyLevel${level}Index${enemyGlobals.index}` as string;
    enemyGlobals.index += 1;
    const diameter = (level * level + 5) as number;
    const sphereMesh = MeshBuilder.CreateIcoSphere(
      name,
      {
        subdivisions: level,
        radius: diameter / 2,
        updatable: false
      },
      scene
    ) as Mesh;

    sphereMesh.convertToUnIndexedMesh();
    enemyGlobals.allEnemies.unshift(sphereMesh);

    enemyBorn(scene, position, sphereMesh, diameter, level);

    Tags.AddTagsTo(sphereMesh, "enemy");
  }
}

export function checkHitPoints(
  scene: Scene,
  sphereMesh: Mesh,
  level: number = 1 | 2 | 3,
  hitPointsMeter: Mesh
) {
  if (
    (sphereMesh.physicsImpostor !== null &&
      //@ts-ignore
      sphereMesh.hitPoints <= 0) ||
    (sphereMesh.position.y < 0 && sphereMesh.physicsImpostor !== null)
  ) {
    const enemyPosition = sphereMesh.position.clone() as Vector3;
    const enemyRotation = sphereMesh.rotation.clone() as Vector3;
    const enemyLinearVelocity = sphereMesh.physicsImpostor.getLinearVelocity() as Vector3;
    const enemyAngularVelocity = sphereMesh.physicsImpostor.getAngularVelocity() as Vector3;
    if (
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit &&
      sphereMesh.position.y > 0
    ) {
      setTimeout(() => {
        fragment(
          level,
          enemyPosition,
          enemyRotation,
          enemyLinearVelocity,
          enemyAngularVelocity
        );
      }, 1);
    }
    destroyEnemy(sphereMesh, scene);
  } else {
    //@ts-ignore
    sphereMesh.hitPoints -= enemyGlobals.decayRate * level;

    const scaleRate =
      //@ts-ignore
      1 / ((level * enemyGlobals.baseHitPoints) / sphereMesh.hitPoints);

    //@ts-ignore
    hitPointsMeter.scaling = new BABYLON.Vector3(
      scaleRate,
      scaleRate,
      scaleRate
    );
  }
}

function fragment(
  level: number = 1 | 2 | 3,
  enemyPosition: Vector3,
  enemyRotation: Vector3,
  enemyLinearVelocity: Vector3,
  enemyAngularVelocity: Vector3
) {
  for (let index = 1; index <= enemyGlobals.fragments * level; index++) {
    const fragment = MeshBuilder.CreateBox("enemyFragment" + index, {
      size: (level * level + 5) / 1.5 / (enemyGlobals.fragments * level)
    }) as Mesh;
    fragment.position = new Vector3(
      enemyPosition.x,
      enemyPosition.y / level + ((level * level + 5) / level) * index,
      enemyPosition.z
    );
    fragment.rotation = new Vector3(
      enemyRotation.x * index * 0.1,
      enemyRotation.y * index * 0.1,
      enemyRotation.z * index * 0.1
    );
    fragment.material = materialGlobals.hitMaterial;

    fragment.physicsImpostor = new PhysicsImpostor(
      fragment,
      PhysicsImpostor.BoxImpostor,
      {
        mass: (enemyGlobals.mass * level) / (enemyGlobals.fragments * level),
        restitution: 0.5,
        friction: 0.8
      }
    ) as PhysicsImpostor;

    fragment.physicsImpostor.setLinearVelocity(enemyLinearVelocity);
    fragment.physicsImpostor.setAngularVelocity(enemyAngularVelocity);

    setTimeout(() => {
      fragment.dispose();
      if (fragment.physicsImpostor !== null) {
        fragment.physicsImpostor.dispose();
      }
      setTimeout(() => {}, 1);
    }, projectileGlobals.lifeTime);
  }
}

function destroyEnemy(sphereMesh: Mesh, scene: Scene) {
  enemyGlobals.occupiedSpaces.pop();
  //@ts-ignore
  sphereMesh.hitPoints = 0;

  //@ts-ignore
  delete sphereMesh.hitPoints;

  if (sphereMesh.physicsImpostor !== null) {
    sphereMesh.physicsImpostor.dispose();
  }
  Tags.RemoveTagsFrom(sphereMesh, "enemy");

  setTimeout(() => {
    sphereMesh.dispose();
    setTimeout(() => {
      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
    }, 4);
  }, 1);
}

export function decide(sphereMesh: Mesh) {
  const decideToMove = { up: true, left: true, right: true, down: true };
  if (sphereMesh.position.z <= enemyGlobals.boundaryLimit * -1) {
    decideToMove.down = false;
    decideToMove.up = true;
  }
  if (sphereMesh.position.z >= enemyGlobals.boundaryLimit) {
    decideToMove.up = false;
    decideToMove.down = true;
  }
  if (sphereMesh.position.x >= enemyGlobals.boundaryLimit) {
    decideToMove.right = false;
    decideToMove.left = true;
  }
  if (sphereMesh.position.x <= enemyGlobals.boundaryLimit * -1) {
    decideToMove.left = false;
    decideToMove.right = true;
  }
  return decideToMove;
}

function enemyGenerator(scene: Scene, quantity = 1, level = 1) {
  for (let index = 0; index < quantity; index += 1) {
    let newLocation = positionGenerator();
    while (
      enemyGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      ) ||
      towerGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      )
    ) {
      newLocation = positionGenerator();
    }

    enemyGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

    new Enemy(
      level,
      {
        x: enemyGlobals.occupiedSpaces[0][0],
        z: enemyGlobals.occupiedSpaces[0][1]
      },
      scene
    ) as Enemy;
  }
}

function enemies(scene: Scene) {
  let deltaTime = Date.now() - enemyGlobals.generationRate;

  scene.registerAfterRender(() => {
    if (
      Date.now() - deltaTime > enemyGlobals.generationRate &&
      enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
      mapGlobals.allImpostors.length <= mapGlobals.impostorLimit
    ) {
      enemyGlobals.currentWave += 1;
      newWave();
      updateEconomy(scene);
      deltaTime = Date.now();
      setTimeout(() => {
        //@ts-ignore
        enemyGenerator(scene, waves[enemyGlobals.currentWave][0], 1);
        //@ts-ignore
        enemyGenerator(scene, waves[enemyGlobals.currentWave][1], 2);
        //@ts-ignore
        enemyGenerator(scene, waves[enemyGlobals.currentWave][2], 3);
        enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
      }, 2);
    }
  });
}

export { enemies, Enemy };
