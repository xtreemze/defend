import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import { enemyGlobals, towerGlobals } from "./variables";

class Enemy {
  constructor(
    level = 1,
    position = { x: 0, z: 0 },
    scene = BABYLON.Scene.prototype
  ) {
    const name = `enemy${level}`;

    const diameter = level * 1.5;

    const sphereMesh = BABYLON.MeshBuilder.CreateSphere(
      name,
      {
        segments: 3,
        diameter: diameter
      },
      scene
    );

    this.revive(scene, position, sphereMesh, diameter, level);

    BABYLON.Tags.AddTagsTo(sphereMesh, "enemy");
  }

  checkHitPoints(
    scene: any = BABYLON.Scene.prototype,
    sphereMesh: any,
    loopTimer: any
  ) {
    if (sphereMesh.hitPoints <= 0 || sphereMesh.position.y < -3) {
      this.destroy(sphereMesh, loopTimer);
    } else if (
      sphereMesh.hitPoints < enemyGlobals.deadHitPoints &&
      sphereMesh.material !== scene.getMaterialByID("damagedMaterial")
    ) {
      sphereMesh.material = scene.getMaterialByID("damagedMaterial");
      sphereMesh.physicsImpostor.setLinearVelocity(
        new BABYLON.Vector3(0, enemyGlobals.jumpForce, 0)
      );
    } else {
      sphereMesh.hitPoints -= enemyGlobals.decayRate;
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
        restitution: enemyGlobals.restitution
      },
      scene
    );

    const loopTimer = setInterval(() => {
      if (
        sphereMesh.position.y > diameter / 2.5 &&
        sphereMesh.position.y < diameter * 1.2 &&
        sphereMesh.hitPoints > enemyGlobals.deadHitPoints
      ) {
        enemyAi(sphereMesh, this.decide(sphereMesh));
      }
      this.checkHitPoints(scene, sphereMesh, loopTimer);
    }, enemyGlobals.decisionRate);
  }

  destroy(
    sphereMesh = {
      hitPoints: 0,
      dispose: function dispose() {}
    },
    loopTimer
  ) {
    clearInterval(loopTimer);
    sphereMesh.hitPoints = 0;
    setTimeout(() => {
      sphereMesh.dispose();
    }, 1);
  }

  decide(sphereMesh = BABYLON.Mesh.prototype) {
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
}

function enemyGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
  for (let index = 0; index < quantity; index += 1) {
    let newLocation = positionGenerator();
    while (
      enemyGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      ) &&
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
      randomNumberRange(2, 3),
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
  enemyGenerator(scene, 5);

  setInterval(() => {
    if (enemyGlobals.allEnemies.length < enemyGlobals.limit) {
      enemyGenerator(scene, randomNumberRange(2, 5));
    }
  }, enemyGlobals.generationRate);
}
