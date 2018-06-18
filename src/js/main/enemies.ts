import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import * as sounds from "./sounds";
import {
  enemyGlobals,
  towerGlobals,
  mapGlobals,
  projectileGlobals
} from "./variables";

class Enemy {
  constructor(
    level: number = 1,
    position: any = { x: 0, z: 0 },
    scene: BABYLON.Scene
  ) {
    const name = `enemy${level}` as string;
    const diameter = (level * level) as number;
    const sphereMesh = BABYLON.MeshBuilder.CreateIcoSphere(
      name,
      {
        subdivisions: level,
        radius: diameter / 2,
        updatable: false
      },
      scene
    ) as BABYLON.Mesh;

    // playNote();

    enemyGlobals.allEnemies.unshift(sphereMesh);

    this.revive(scene, position, sphereMesh, diameter, level);

    BABYLON.Tags.AddTagsTo(sphereMesh, "enemy");
  }

  nearTower(ray: any, scene: any) {
    let result = true;
    for (const direction in ray) {
      if (ray.hasOwnProperty(direction)) {
        const directionRay = ray[direction];

        scene.pickWithRay(directionRay, (mesh: BABYLON.Mesh) => {
          for (let index = 0; index < towerGlobals.allTowers.length; index++) {
            const element = towerGlobals.allTowers[index];

            if (element === mesh) {
              result = false;
            }
          }
        });
      }
    }

    return result;
  }

  checkHitPoints(
    scene: BABYLON.Scene,
    sphereMesh: BABYLON.Mesh,
    loopTimer: any,
    level: number = 1 | 2 | 3
  ) {
    const enemyMaterial = scene.getMaterialByID(
      "enemyMaterial"
    ) as BABYLON.Material;

    if (
      //@ts-ignore
      sphereMesh.hitPoints <= 0 ||
      sphereMesh.position.y < 0
    ) {
      const enemyPosition = sphereMesh.position.clone() as BABYLON.Vector3;
      const enemyRotation = sphereMesh.rotation.clone() as BABYLON.Vector3;
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
    enemyPosition: BABYLON.Vector3,
    enemyMaterial: BABYLON.Material,
    enemyRotation: BABYLON.Vector3
  ) {
    if (mapGlobals.simultaneousSounds < mapGlobals.soundLimit) {
      setTimeout(() => {
        mapGlobals.simultaneousSounds -= 1;
      }, mapGlobals.soundDelay);

      mapGlobals.simultaneousSounds += 1;

      sounds.onDestroy(enemyPosition, level);
    }
    for (let index = 1; index <= enemyGlobals.fragments * level; index++) {
      const fragment = BABYLON.MeshBuilder.CreateBox("enemyFragment" + index, {
        size: (level * level) / 1.5 / (enemyGlobals.fragments * level)
      }) as BABYLON.Mesh;
      fragment.position = new BABYLON.Vector3(
        enemyPosition.x,
        enemyPosition.y / level + ((level * level) / level) * index,
        enemyPosition.z
      );
      fragment.rotation = new BABYLON.Vector3(
        enemyRotation.x * index * 0.1,
        enemyRotation.y * index * 0.1,
        enemyRotation.z * index * 0.1
      );
      fragment.material = enemyMaterial;

      const fragImpostor = new BABYLON.PhysicsImpostor(
        fragment,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {
          mass: (enemyGlobals.mass * level) / (enemyGlobals.fragments * level),
          restitution: 0.5,
          friction: 0.8
        }
      ) as BABYLON.PhysicsImpostor;

      fragImpostor.applyImpulse(
        new BABYLON.Vector3(0, 2000 + enemyGlobals.mass * level * index, 0),
        fragment.getAbsolutePosition()
      );

      setTimeout(() => {
        fragment.dispose();
        fragImpostor.dispose();
        setTimeout(() => {}, 1);
      }, projectileGlobals.lifeTime * 5);
    }
  }

  makeRays(sphereMesh: BABYLON.Mesh) {
    const ray = {
      up: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(0, 0, 1),
        20
      ) as BABYLON.Ray,
      down: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(0, 0, -1),
        20
      ) as BABYLON.Ray,
      left: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(-1, 0, 0),
        20
      ) as BABYLON.Ray,
      right: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(1, 0, 0),
        20
      ) as BABYLON.Ray
    };

    return ray;
  }

  makeHelpers(ray: any, scene: BABYLON.Scene) {
    let helpers = [] as BABYLON.RayHelper[];

    const rayHelper1 = new BABYLON.RayHelper(ray.up) as BABYLON.RayHelper;
    rayHelper1.show(scene, new BABYLON.Color3(1, 1, 0.1));

    const rayHelper2 = new BABYLON.RayHelper(ray.down) as BABYLON.RayHelper;
    rayHelper2.show(scene, new BABYLON.Color3(0.5, 1, 0.5));

    const rayHelper3 = new BABYLON.RayHelper(ray.left) as BABYLON.RayHelper;
    rayHelper3.show(scene, new BABYLON.Color3(1, 1, 0.1));

    const rayHelper4 = new BABYLON.RayHelper(ray.right) as BABYLON.RayHelper;
    rayHelper4.show(scene, new BABYLON.Color3(0.5, 1, 0.5));

    helpers.push(rayHelper1, rayHelper2, rayHelper3, rayHelper4);

    return helpers;
  }

  destroyHelpers(helpers: BABYLON.RayHelper[]) {
    for (let index = 0; index < helpers.length; index++) {
      const rayHelper = helpers[index];
      rayHelper.dispose();
    }
  }

  revive(
    scene: BABYLON.Scene,
    position: any = { x: 0, z: 0 },
    sphereMesh: BABYLON.Mesh,
    diameter: number = 0,
    level: number = 1 | 2 | 3
  ) {
    sphereMesh.position = new BABYLON.Vector3(
      position.x,
      (diameter / 2) * enemyGlobals.originHeight,
      position.z
    );

    //@ts-ignore
    sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;
    sphereMesh.material = scene.getMaterialByID("enemyMaterial");

    sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphereMesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
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

    const loopTimer = scene.registerAfterRender(() => {
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

  destroyEnemy(
    sphereMesh: any = BABYLON.Mesh,
    loopTimer: any,
    scene: any = BABYLON.Scene
  ) {
    // clearInterval(loopTimer);
    loopTimer = null;

    sphereMesh.hitPoints = 0;
    delete sphereMesh.hitPoints;

    setTimeout(() => {
      enemyGlobals.allEnemies = [];
      sphereMesh.physicsImpostor.dispose();
      sphereMesh.dispose();

      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
    }, 22);
  }

  decide(sphereMesh: BABYLON.Mesh, scene: BABYLON.Scene, ray: any) {
    const decideToMove = { up: true, left: true, right: true, down: true };
    if (
      sphereMesh.position.z <= enemyGlobals.boundaryLimit * -1 &&
      this.nearTower(ray.up, scene)
    ) {
      decideToMove.down = false;
      decideToMove.up = true;
    }
    if (
      sphereMesh.position.z >= enemyGlobals.boundaryLimit &&
      this.nearTower(ray.down, scene)
    ) {
      decideToMove.up = false;
      decideToMove.down = true;
    }
    if (
      sphereMesh.position.x >= enemyGlobals.boundaryLimit &&
      this.nearTower(ray.left, scene)
    ) {
      decideToMove.right = false;
      decideToMove.left = true;
    }
    if (
      sphereMesh.position.x <= enemyGlobals.boundaryLimit * -1 &&
      this.nearTower(ray.right, scene)
    ) {
      decideToMove.left = false;
      decideToMove.right = true;
    }
    return decideToMove;
  }
}

function enemyGenerator(scene: BABYLON.Scene, quantity: number = 0) {
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

export default function enemies(scene: BABYLON.Scene) {
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
