import { Scene, Vector3, MeshBuilder, Mesh, PhysicsImpostor } from "babylonjs";
import enemyAi from "./enemyAi";
import {
  enemyGlobals,
  mapGlobals,
  materialGlobals
} from "../main/globalVariables";
import { currencyCollide } from "./currencyCollide";
import { decide, Position2D, destroyEnemy } from "./Enemy";
import { checkHitPoints } from "./checkHitPoints";

interface EnemySphere extends Mesh {
  hitPoints: number;
}

export function enemyBorn(
  scene: Scene,
  position: Position2D,
  sphereMesh: EnemySphere,
  diameter: number,
  level: number = 1 | 2 | 3
) {
  sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;
  const hitPointsMeter = MeshBuilder.CreateIcoSphere(
    name + "hitPointMeter",

    { subdivisions: level, radius: diameter / 2 },
    scene
  ) as Mesh;
  hitPointsMeter.parent = sphereMesh;
  sphereMesh.position = new Vector3(
    position.x,
    (diameter / 2) * enemyGlobals.originHeight,
    position.z
  );
  sphereMesh.material = materialGlobals.hitMaterial;
  hitPointsMeter.material = materialGlobals.enemyMaterial;

  sphereMesh.physicsImpostor = new PhysicsImpostor(
    sphereMesh,
    PhysicsImpostor.SphereImpostor,
    {
      mass: enemyGlobals.mass * level,
      restitution: enemyGlobals.restitution,
      friction: enemyGlobals.friction
    },
    scene
  ) as PhysicsImpostor;
  mapGlobals.allImpostors.unshift(sphereMesh.physicsImpostor);
  let deltaTime = Date.now();
  sphereMesh.registerAfterRender(() => {
    if (sphereMesh.position.y < 0) {
      destroyEnemy(sphereMesh, scene);
    }
    if (Date.now() - deltaTime > enemyGlobals.decisionRate) {
      deltaTime = Date.now();
      if (
        sphereMesh.position.y > diameter / 2.5 &&
        sphereMesh.position.y < diameter &&
        sphereMesh.hitPoints > enemyGlobals.deadHitPoints
      ) {
        enemyAi(sphereMesh, decide(sphereMesh));
      }

      checkHitPoints(scene, sphereMesh, level, hitPointsMeter);
    }
  });
  currencyCollide(sphereMesh, scene);
}

export { EnemySphere };
