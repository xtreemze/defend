import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import { enemyGlobals, towerGlobals, mapGlobals } from "./variables";
import { playNote, shootAudio } from "./sound";

class Enemy {
  constructor(
    level = 1,
    position = { x: 0, z: 0 },
    scene = BABYLON.Scene.prototype
  ) {
    const name = `enemy${level}`;
    const diameter = level * level;
    const sphereMesh = BABYLON.MeshBuilder.CreateIcoSphere(
      name,
      {
        subdivisions: 1,
        radius: diameter / 2,
        updatable: false
      },
      scene
    );
    playNote();
    enemyGlobals.allEnemies.unshift(sphereMesh);

    this.revive(scene, position, sphereMesh, diameter, level);

    BABYLON.Tags.AddTagsTo(sphereMesh, "enemy");

    const alien = new BABYLON.Sound(
      "alien",
      "https://raw.githubusercontent.com/xtreemze/defend/master/src/audio/alien.wav",
      scene,
      null,
      {
        loop: false,
        autoplay: true,
        volume: 0.5,
        distanceModel: "exponential",
        rolloffFactor: 0.1
      }
    );

    // Sound will now follow the box mesh position
    alien.attachToMesh(sphereMesh);
  }

  nearTower(ray, scene) {
    let result = true;
    for (const direction in ray) {
      if (ray.hasOwnProperty(direction)) {
        const directionRay = ray[direction];

        scene.pickWithRay(directionRay, mesh => {
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
    scene: any = BABYLON.Scene.prototype,
    sphereMesh: any,
    loopTimer: any
  ) {
    const damagedMaterial = scene.getMaterialByID("damagedMaterial");

    if (
      sphereMesh.hitPoints <= 0 ||
      sphereMesh.position.y < towerGlobals.range * -1
    ) {
      this.destroyEnemy(sphereMesh, loopTimer, scene);
    } else if (
      sphereMesh.hitPoints < enemyGlobals.deadHitPoints &&
      sphereMesh.material !== damagedMaterial
    ) {
      sphereMesh.material = damagedMaterial;
      sphereMesh.physicsImpostor.setLinearVelocity(
        new BABYLON.Vector3(0, enemyGlobals.jumpForce, 0)
      );
    } else {
      sphereMesh.hitPoints -= enemyGlobals.decayRate;
    }
  }

  makeRays(sphereMesh, scene) {
    const ray = {
      up: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(0, 0, 1),
        20
      ),
      down: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(0, 0, -1),
        20
      ),
      left: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(-1, 0, 0),
        20
      ),
      right: new BABYLON.Ray(
        sphereMesh.getAbsolutePosition(),
        new BABYLON.Vector3(1, 0, 0),
        20
      )
    };

    return ray;
  }

  makeHelpers(ray, scene) {
    let helpers = [];
    const rayHelper1 = new BABYLON.RayHelper(ray.up);
    rayHelper1.show(scene, new BABYLON.Color3(1, 1, 0.1));

    const rayHelper2 = new BABYLON.RayHelper(ray.down);
    rayHelper2.show(scene, new BABYLON.Color3(0.5, 1, 0.5));

    const rayHelper3 = new BABYLON.RayHelper(ray.left);
    rayHelper3.show(scene, new BABYLON.Color3(1, 1, 0.1));

    const rayHelper4 = new BABYLON.RayHelper(ray.right);
    rayHelper4.show(scene, new BABYLON.Color3(0.5, 1, 0.5));
    helpers.push(rayHelper1, rayHelper2, rayHelper3, rayHelper4);

    return helpers;
  }

  destroyHelpers(helpers) {
    for (let index = 0; index < helpers.length; index++) {
      const rayHelper = helpers[index];
      rayHelper.dispose();
    }
  }

  revive(
    scene: any = BABYLON.Scene.prototype,
    position: any = { x: 0, z: 0 },
    sphereMesh: any,
    diameter: number = 0,
    level: number = 1
  ) {
    sphereMesh.position = new BABYLON.Vector3(
      position.x,
      (diameter / 2) * enemyGlobals.originHeight,
      position.z
    );

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

    const ray = this.makeRays(sphereMesh, scene);

    if (enemyGlobals.rayHelpers) {
      const helpers = this.makeHelpers(ray, scene);
      setTimeout(() => {
        this.destroyHelpers(helpers);
      }, 25000);
    }

    const loopTimer = setInterval(() => {
      if (
        sphereMesh.position.y > diameter / 2.5 &&
        sphereMesh.position.y < diameter * 1 &&
        sphereMesh.hitPoints > enemyGlobals.deadHitPoints
      ) {
        enemyAi(sphereMesh, this.decide(sphereMesh, scene, ray));
      }
      this.checkHitPoints(scene, sphereMesh, loopTimer);
    }, enemyGlobals.decisionRate);
  }

  destroyEnemy(
    sphereMesh: any = BABYLON.Mesh,
    loopTimer,
    scene: any = BABYLON.Scene
  ) {
    shootAudio();
    clearInterval(loopTimer);

    sphereMesh.hitPoints = 0;
    delete sphereMesh.hitPoints;

    setTimeout(() => {
      enemyGlobals.allEnemies = [];
      sphereMesh.physicsImpostor.dispose();
      sphereMesh.dispose();

      enemyGlobals.allEnemies = scene.getMeshesByTags("enemy");
    }, 1);
  }

  decide(sphereMesh = BABYLON.Mesh.prototype, scene, ray) {
    const decideToMove = { up: true, left: true, right: true, down: true };
    if (
      sphereMesh.position.z <= enemyGlobals.boundaryLimit * -1 &&
      this.nearTower(ray.up, scene) === false
    ) {
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

function enemyGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
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
    );

    if (enemyGlobals.occupiedSpaces.length > enemyGlobals.limit) {
      enemyGlobals.occupiedSpaces.pop();
    }
  }
}

export default function enemies(scene = BABYLON.Scene.prototype) {
  enemyGenerator(scene, enemyGlobals.minNumber);

  setInterval(() => {
    if (
      enemyGlobals.allEnemies.length <
        enemyGlobals.limit - enemyGlobals.maxNumber &&
      mapGlobals.allImpostors.length < mapGlobals.impostorLimit
    ) {
      enemyGenerator(scene, randomNumberRange(2, 5));
    }
  }, enemyGlobals.generationRate);
}
