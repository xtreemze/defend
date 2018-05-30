// @ts-check

import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

class Enemy {
  constructor(
    level = 1,
    position = { x: 0, z: 0 },
    scene = BABYLON.Scene.prototype
  ) {
    const name = `enemy${level}`;

    const diameter = 4 + level;

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

    const loopTimer = setInterval(() => {
      this.checkHitPoints(scene, sphereMesh, loopTimer);
      enemyAi(sphereMesh, this.decide(sphereMesh));
    }, 300);
  }

  checkHitPoints(scene: any, sphereMesh: any, loopTimer: any) {
    if (sphereMesh.hitPoints <= 0) {
      this.destroy(sphereMesh, loopTimer);
    } else if (
      sphereMesh.hitPoints < 50 &&
      sphereMesh.material !== scene.getMaterialByID("damagedMaterial")
    ) {
      sphereMesh.material = scene.getMaterialByID("damagedMaterial");
    } else {
      sphereMesh.hitPoints -= 4;
    }
  }

  revive(
    scene = BABYLON.Scene.prototype,
    position = { x: 0, z: 0 },
    sphereMesh: any,
    diameter = 0,
    level = 1
  ) {
    sphereMesh.position = new BABYLON.Vector3(
      position.x,
      diameter / 2,
      position.z
    );
    sphereMesh.hitPoints = level * 100;
    sphereMesh.material = scene.getMaterialByID("enemyMaterial");

    sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphereMesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 0, restitution: 0.8 },
      scene
    );
  }
  destroy(sphereMesh: any, loopTimer: any) {
    sphereMesh.hitPoints = 0;
    clearInterval(loopTimer);
    sphereMesh.dispose();

    const propertyArray = Object.keys(this);
    for (let index = 0; index < propertyArray.length; index += 1) {
      propertyArray[index] = null;
      delete propertyArray[index];
    }
  }

  decide(sphereMesh: BABYLON.Mesh) {
    const decide = { up: true, left: true, right: true, down: true };
    if (sphereMesh.position.z <= -45) {
      decide.down = false;
      decide.up = true;
    }
    if (sphereMesh.position.z >= 45) {
      decide.up = false;
      decide.down = true;
    }
    if (sphereMesh.position.x >= 45) {
      decide.right = false;
      decide.left = true;
    }
    if (sphereMesh.position.x <= -45) {
      decide.left = false;
      decide.right = true;
    }
    return decide;
  }
}

function enemyGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
  new Enemy(1, positionGenerator(), scene);
  for (let index = 2; index < quantity; index += 1) {
    new Enemy(randomNumberRange(1, 3), positionGenerator(), scene);
  }
}

export default function enemies(scene = BABYLON.Scene.prototype) {
  enemyGenerator(scene, 2);

  setInterval(() => {
    enemyGenerator(scene, 2);
  }, 1000);
}
