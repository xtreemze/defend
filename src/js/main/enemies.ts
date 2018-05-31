import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import { enemyGlobals } from "./variables";

/**
 * Creates an instance of enemy.
 * @param [level]
 * @param [position]
 * @param [scene]
 */
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

    // const sphereMesh = BABYLON.MeshBuilder.CreateBox(
    //   name,
    //   {
    //     size: diameter
    //     // height: 2.5,
    //     // width: 4
    //   },
    //   scene
    // );

    this.revive(scene, position, sphereMesh, diameter, level);

    BABYLON.Tags.AddTagsTo(sphereMesh, "enemy");
  }

  /**
   * Checks hit points and height. Destroys items when hitpoints and height conditions are met
   * @param [scene]
   * @param sphereMesh
   * @param [loopTimer]
   */
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

  /**
   * Revives enemy
   * @param [scene]
   * @param [position]
   * @param sphereMesh
   * @param [diameter]
   * @param [level]
   */
  revive(
    scene: any = BABYLON.Scene.prototype,
    position: any = { x: 0, z: 0 },
    sphereMesh: any,
    diameter: number = 0,
    level: number = 1
  ) {
    sphereMesh.position = new BABYLON.Vector3(
      position.x,
      (diameter / 2) * 8,
      position.z
    );
    sphereMesh.hitPoints = level * enemyGlobals.baseHitPoints;
    sphereMesh.material = scene.getMaterialByID("enemyMaterial");

    sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphereMesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      // BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: enemyGlobals.mass, restitution: 0.4 },
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

  /**
   * Destroys enemy
   * @param [sphereMesh]
   * @param loopTimer
   */
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

  /**
   * Decides enemy
   * @param sphereMesh
   * @returns
   */
  decide(sphereMesh = BABYLON.Mesh.prototype) {
    const limit = 15;
    const decide = { up: true, left: true, right: true, down: true };
    if (sphereMesh.position.z <= limit * -1) {
      decide.down = false;
      decide.up = true;
    }
    if (sphereMesh.position.z >= limit) {
      decide.up = false;
      decide.down = true;
    }
    if (sphereMesh.position.x >= limit) {
      decide.right = false;
      decide.left = true;
    }
    if (sphereMesh.position.x <= limit * -1) {
      decide.left = false;
      decide.right = true;
    }
    return decide;
  }
}

/**
 * Enemy generator
 * @param [scene]
 * @param [quantity]
 */
function enemyGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
  let newLocation = positionGenerator();

  for (let index = 0; index < quantity; index += 1) {
    let newLocation = positionGenerator();

    while (
      enemyGlobals.occupiedSpaces.find(existingLocation => {
        return existingLocation === newLocation;
      }) !== undefined
    ) {
      newLocation = positionGenerator();
    }
    enemyGlobals.occupiedSpaces.unshift(newLocation);
    new Enemy(randomNumberRange(2, 3), enemyGlobals.occupiedSpaces[0], scene);
  }

  enemyGlobals.occupiedSpaces = [];
}

export default function enemies(scene = BABYLON.Scene.prototype) {
  enemyGenerator(scene, 5);

  setInterval(() => {
    enemyGenerator(scene, randomNumberRange(2, 5));
  }, enemyGlobals.generationRate);
}
