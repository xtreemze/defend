import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Tags,
  Material,
  PhysicsImpostor,
  Ray,
  RayHelper,
  Color3,
  AbstractMesh
} from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "../utility/positionGenerator";
import randomNumberRange from "../utility/randomNumberRange";
import { onDestroy } from "../main/sound";
import {
  enemyGlobals,
  towerGlobals,
  mapGlobals,
  projectileGlobals
} from "../main/globalVariables";

class Enemy {
  constructor(level: number = 1, position: any = { x: 0, z: 0 }, scene: Scene) {
    const name = `enemy${level}` as string;
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

    this.revive(scene, position, sphereMesh, diameter, level);

    Tags.AddTagsTo(sphereMesh, "enemy");
  }

  nearTower(ray: any, scene: Scene) {
    let result = false;
    for (const direction in ray) {
      if (ray.hasOwnProperty(direction)) {
        const directionRay = ray[direction];
        //@ts-ignore
        scene.pickWithRay(directionRay, (mesh: AbstractMesh) => {
          for (let index = 0; index < towerGlobals.allTowers.length; index++) {
            const element = towerGlobals.allTowers[index];

            if (element === mesh) {
              result = true;
            }
          }
        });
      }
    }

    return result;
  }

  checkHitPoints(
    scene: Scene,
    sphereMesh: Mesh,
    loopTimer: any,
    level: number = 1 | 2 | 3
  ) {
    const enemyMaterial = scene.getMaterialByID("enemyMaterial") as Material;

    if (
      //@ts-ignore
      sphereMesh.hitPoints <= 0 ||
      sphereMesh.position.y < 0
    ) {
      const enemyPosition = sphereMesh.position.clone() as Vector3;
      const enemyRotation = sphereMesh.rotation.clone() as Vector3;
      this.destroyEnemy(sphereMesh, loopTimer, scene);
      if (
        mapGlobals.allImpostors.length < mapGlobals.impostorLimit &&
        sphereMesh.position.y > 0
      ) {
        setTimeout(() => {
          this.fragment(level, enemyPosition, enemyMaterial, enemyRotation);
        }, 5);
      }
    } else {
      //@ts-ignore
      sphereMesh.hitPoints -= enemyGlobals.decayRate * level;
    }
  }

  fragment(
    level: number = 1 | 2 | 3,
    enemyPosition: Vector3,
    enemyMaterial: Material,
    enemyRotation: Vector3
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
      fragment.material = enemyMaterial;

      const fragImpostor = new PhysicsImpostor(
        fragment,
        PhysicsImpostor.BoxImpostor,
        {
          mass: (enemyGlobals.mass * level) / (enemyGlobals.fragments * level),
          restitution: 0.5,
          friction: 0.8
        }
      ) as PhysicsImpostor;

      fragImpostor.applyImpulse(
        new Vector3(0, 2000 + enemyGlobals.mass * level * index, 0),
        fragment.getAbsolutePosition()
      );

      setTimeout(() => {
        fragment.dispose();
        fragImpostor.dispose();
        setTimeout(() => {}, 1);
      }, projectileGlobals.lifeTime * 5);
    }

    if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
      setTimeout(() => {
        mapGlobals.simultaneousSounds -= 1;
      }, mapGlobals.soundDelay);

      mapGlobals.simultaneousSounds += 1;

      if (mapGlobals.soundOn) onDestroy(enemyPosition, level);
    }
  }

  makeRays(sphereMesh: Mesh) {
    const ray = {
      up: new Ray(
        sphereMesh.getAbsolutePosition(),
        new Vector3(0, 0, 1),
        20
      ) as Ray,
      down: new Ray(
        sphereMesh.getAbsolutePosition(),
        new Vector3(0, 0, -1),
        20
      ) as Ray,
      left: new Ray(
        sphereMesh.getAbsolutePosition(),
        new Vector3(-1, 0, 0),
        20
      ) as Ray,
      right: new Ray(
        sphereMesh.getAbsolutePosition(),
        new Vector3(1, 0, 0),
        20
      ) as Ray
    };

    return ray;
  }

  makeHelpers(ray: any, scene: Scene) {
    let helpers = [] as RayHelper[];

    const rayHelper1 = new RayHelper(ray.up) as RayHelper;
    rayHelper1.show(scene, new Color3(1, 1, 0.1));

    const rayHelper2 = new RayHelper(ray.down) as RayHelper;
    rayHelper2.show(scene, new Color3(0.5, 1, 0.5));

    const rayHelper3 = new RayHelper(ray.left) as RayHelper;
    rayHelper3.show(scene, new Color3(1, 1, 0.1));

    const rayHelper4 = new RayHelper(ray.right) as RayHelper;
    rayHelper4.show(scene, new Color3(0.5, 1, 0.5));

    helpers.push(rayHelper1, rayHelper2, rayHelper3, rayHelper4);

    return helpers;
  }

  destroyHelpers(helpers: RayHelper[]) {
    for (let index = 0; index < helpers.length; index++) {
      const rayHelper = helpers[index];
      rayHelper.dispose();
    }
  }

  revive(
    scene: Scene,
    position: any = { x: 0, z: 0 },
    sphereMesh: Mesh,
    diameter: number = 0,
    level: number = 1 | 2 | 3
  ) {
    sphereMesh.position = new Vector3(
      position.x,
      (diameter / 2) * enemyGlobals.originHeight,
      position.z
    );

    //@ts-ignore
    sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;
    sphereMesh.material = scene.getMaterialByID("enemyMaterial");

    sphereMesh.physicsImpostor = new PhysicsImpostor(
      sphereMesh,
      PhysicsImpostor.SphereImpostor,
      {
        mass: enemyGlobals.mass * level,
        restitution: enemyGlobals.restitution,
        friction: enemyGlobals.friction
      },
      scene
    );
    mapGlobals.allImpostors.unshift(sphereMesh.physicsImpostor);

    const ray = this.makeRays(sphereMesh);

    if (enemyGlobals.rayHelpers) {
      const helpers = this.makeHelpers(ray, scene);
      setTimeout(() => {
        this.destroyHelpers(helpers);
      }, 25000);
    }

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
          enemyAi(sphereMesh, this.decide(sphereMesh, scene, ray));
        }
        this.checkHitPoints(scene, sphereMesh, loopTimer, level);
      }
    });
  }

  destroyEnemy(sphereMesh: Mesh, loopTimer: any, scene: Scene) {
    clearInterval(loopTimer);
    loopTimer = null;
    //@ts-ignore
    sphereMesh.hitPoints = 0;
    //@ts-ignore
    delete sphereMesh.hitPoints;

    setTimeout(() => {
      const sphereMeshImpostor = sphereMesh.getPhysicsImpostor() as PhysicsImpostor;
      sphereMeshImpostor.dispose();
      enemyGlobals.allEnemies = [];
      sphereMesh.dispose();

      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
    }, 1);
  }

  decide(sphereMesh: Mesh, scene: Scene, ray: any) {
    const decideToMove = { up: true, left: true, right: true, down: true };
    if (sphereMesh.position.z <= enemyGlobals.boundaryLimit * -1 && this.nearTower(ray.up, scene) === false) {
      decideToMove.down = false;
      decideToMove.up = true;
    }
    if (
      sphereMesh.position.z >= enemyGlobals.boundaryLimit &&
      this.nearTower(ray.down, scene) === false
    ) {
      decideToMove.up = false;
      decideToMove.down = true;
    }
    if (
      sphereMesh.position.x >= enemyGlobals.boundaryLimit &&
      this.nearTower(ray.left, scene) === false
    ) {
      decideToMove.right = false;
      decideToMove.left = true;
    }
    if (
      sphereMesh.position.x <= enemyGlobals.boundaryLimit * -1 &&
      this.nearTower(ray.right, scene) === false
    ) {
      decideToMove.left = false;
      decideToMove.right = true;
    }
    return decideToMove;
  }
}

function enemyGenerator(scene: Scene, quantity: number = 0) {
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
      randomNumberRange(1, 3),
      {
        x: enemyGlobals.occupiedSpaces[0][0],
        z: enemyGlobals.occupiedSpaces[0][1]
      },
      scene
    ) as Enemy;

    if (enemyGlobals.occupiedSpaces.length > enemyGlobals.limit) {
      enemyGlobals.occupiedSpaces.pop();
    }
  }
}

function enemies(scene: Scene) {
  enemyGenerator(scene, enemyGlobals.minNumber);

  let deltaTime = Date.now();

  scene.registerAfterRender(() => {
    if (
      Date.now() - deltaTime > enemyGlobals.generationRate &&
      enemyGlobals.allEnemies.length <
        enemyGlobals.limit - enemyGlobals.maxNumber &&
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit
    ) {
      deltaTime = Date.now();
      enemyGenerator(scene, randomNumberRange(2, 5));
    }
  });
}

export {enemies, Enemy}