// @ts-check

import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
class Enemy {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `enemy${level}`;
    this.level = level;
    this.diameter = 4 + level;

    this[this.name] = BABYLON.MeshBuilder.CreateSphere(
      name,
      {
        segments: 3,
        diameter: this.diameter
      },
      scene
    );
    this.revive(scene, position);

    BABYLON.Tags.AddTagsTo(this[this.name], "enemy");

    this.loopTimer = setInterval(() => {
      this.checkHitPoints(scene);
      enemyAi(this[this.name], this.decide());
    }, 300);
  }

  checkHitPoints(scene) {
    if (this[this.name].hitPoints <= 0) {
      this.destroy();
    } else if (
      this[this.name].hitPoints < 50 &&
      this[this.name].material !== scene.getMaterialByID("damagedMaterial")
    ) {
      this[this.name].material = scene.getMaterialByID("damagedMaterial");
    } else {
      this[this.name].hitPoints -= 4;
    }
  }

  revive(scene, position) {
    this[this.name].position = new BABYLON.Vector3(
      position.x,
      this.diameter / 2,
      position.z
    );
    this[this.name].hitPoints = this.level * 100;
    this[this.name].material = scene.getMaterialByID("enemyMaterial");

    this[this.name].physicsImpostor = new BABYLON.PhysicsImpostor(
      this[this.name],
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 0, restitution: 0.8 },
      scene
    );
  }

  destroy() {
    this[this.name].hitPoints = 0;
    clearInterval(this.loopTimer);
    this[this.name].dispose();

    const propertyArray = Object.keys(this);
    for (let index = 0; index < propertyArray.length; index += 1) {
      propertyArray[index] = null;
      delete propertyArray[index];
    }
  }

  decide() {
    const decide = { up: true, left: true, right: true, down: true };
    if (this[this.name].position.z <= -45) {
      decide.down = false;
      decide.up = true;
    }
    if (this[this.name].position.z >= 45) {
      decide.up = false;
      decide.down = true;
    }
    if (this[this.name].position.x >= 45) {
      decide.right = false;
      decide.left = true;
    }
    if (this[this.name].position.x <= -45) {
      decide.left = false;
      decide.right = true;
    }
    return decide;
  }
}

function enemyGenerator(scene, quantity) {
  new Enemy(1, positionGenerator(), scene);
  for (let index = 2; index < quantity; index += 1) {
    new Enemy(randomNumberRange(1, 3), positionGenerator(), scene);
  }
}

export default function enemies(scene) {
  enemyGenerator(scene, 2);

  setInterval(() => {
    enemyGenerator(scene, 2);
  }, 1000);
}
