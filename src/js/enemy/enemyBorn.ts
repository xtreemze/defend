import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Material,
  PhysicsImpostor
} from "babylonjs";
import enemyAi from "./enemyAi";
import { enemyGlobals, mapGlobals } from "../main/globalVariables";
import { currencyCollide } from "./currencyCollide";
import { decide, checkHitPoints } from "./Enemy";
export function enemyBorn(
  scene: Scene,
  position: any = { x: 0, z: 0 },
  sphereMesh: Mesh,
  diameter: number = 0,
  level: number = 1 | 2 | 3
) {
  const currencyMesh = scene.getMeshByName("currencyTower") as Mesh;
  const currencyMeshImpostor = currencyMesh.getPhysicsImpostor() as PhysicsImpostor;
  //@ts-ignore
  sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;
  const hitPointsMeter = MeshBuilder.CreateIcoSphere(
    name + "hitPointMeter",
    //@ts-ignore
    { subdivisions: level, radius: diameter / 2 },
    scene
  ) as Mesh;
  hitPointsMeter.parent = sphereMesh;
  sphereMesh.position = new Vector3(
    position.x,
    (diameter / 2) * enemyGlobals.originHeight,
    position.z
  );
  sphereMesh.material = scene.getMaterialByID("hitMaterial") as Material;
  hitPointsMeter.material = scene.getMaterialByID("enemyMaterial") as Material;
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
  const loopTimer = sphereMesh.registerAfterRender(() => {
    if (Date.now() - deltaTime > enemyGlobals.decisionRate) {
      deltaTime = Date.now();
      if (
        sphereMesh.position.y > diameter / 2.5 &&
        sphereMesh.position.y < diameter * 1 &&
        //@ts-ignore
        sphereMesh.hitPoints > enemyGlobals.deadHitPoints
      ) {
        enemyAi(sphereMesh, decide(sphereMesh));
      }
      checkHitPoints(scene, sphereMesh, loopTimer, level, hitPointsMeter);
    }
  });
  currencyCollide(
    sphereMesh,
    scene,
    sphereMesh.physicsImpostor,
    currencyMesh,
    currencyMeshImpostor
  );
}
