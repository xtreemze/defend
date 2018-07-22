import { Scene, Vector3, MeshBuilder, Mesh, PhysicsImpostor } from "babylonjs";
import enemyAi from "./enemyAi";
import {
  enemyGlobals,
  mapGlobals,
  materialGlobals,
  projectileGlobals
} from "../main/globalVariables";
import { currencyCollide } from "./currencyCollide";
import { Position2D } from "./Enemy";
import { destroyEnemy } from "./destroyEnemy";
import { decide } from "./decide";
import { checkHitPoints } from "./checkHitPoints";

interface EnemySphere extends Mesh {
  hitPoints: number;
}

function enemyBorn(
  scene: Scene,
  position: Position2D,
  sphereMesh: EnemySphere,
  diameter: number,
  level: number = 1 | 2 | 3
) {
  const enemyMass = (enemyGlobals.mass * level * level) as number;

  sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;

  const hitPointsMeter = MeshBuilder.CreateIcoSphere(
    name + "hitPointMeter",

    { subdivisions: level, radius: diameter / 2 },
    scene
  ) as Mesh;

  hitPointsMeter.isPickable = false;
  hitPointsMeter.parent = sphereMesh;

  sphereMesh.position = new Vector3(
    position.x,
    (diameter / 2) * enemyGlobals.originHeight,
    position.z
  );

  sphereMesh.physicsImpostor = new PhysicsImpostor(
    sphereMesh,
    PhysicsImpostor.SphereImpostor,
    {
      mass: enemyMass,
      restitution: enemyGlobals.restitution,
      friction: enemyGlobals.friction
    },
    scene
  ) as PhysicsImpostor;

  mapGlobals.allImpostors.unshift(sphereMesh.physicsImpostor);

  sphereMesh.material = materialGlobals.hitMaterial;
  hitPointsMeter.material = materialGlobals.enemyMaterial;

  let deltaTime = Date.now();

  sphereMesh.registerAfterRender(() => {
    if (Date.now() - deltaTime > enemyGlobals.decisionRate) {
      deltaTime = Date.now();
      if (
        sphereMesh.position.y < 0 &&
        sphereMesh.hitPoints < enemyGlobals.baseHitPoints * level
      ) {
        destroyEnemy(sphereMesh, scene, level);
      } else if (
        sphereMesh.position.y > diameter / 2.5 &&
        sphereMesh.position.y < diameter &&
        sphereMesh.hitPoints > projectileGlobals.baseHitPoints
      ) {
        enemyAi(sphereMesh, decide(sphereMesh), level);
      }

      checkHitPoints(scene, sphereMesh, level, hitPointsMeter);
    }
  });
  currencyCollide(sphereMesh, scene);
}

export { EnemySphere, enemyBorn };
