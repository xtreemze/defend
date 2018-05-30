import * as BABYLON from "babylonjs";
import enemyAi from "./enemyAi";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

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
      sphereMesh.hitPoints < 50 &&
      sphereMesh.material !== scene.getMaterialByID("damagedMaterial")
    ) {
      sphereMesh.material = scene.getMaterialByID("damagedMaterial");
    } else {
      sphereMesh.hitPoints -= 4;
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
    sphereMesh.hitPoints = level * 100;
    sphereMesh.material = scene.getMaterialByID("enemyMaterial");

    sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphereMesh,
      BABYLON.PhysicsImpostor.SphereImpostor,
      // BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 2000, restitution: 0.4 },
      scene
    );

    const loopTimer = setInterval(() => {
      if (
        sphereMesh.position.y > diameter / 2 &&
        sphereMesh.position.y < diameter
      ) {
        enemyAi(sphereMesh, this.decide(sphereMesh));
      }
      this.checkHitPoints(scene, sphereMesh, loopTimer);
    }, 500);
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

  /**
   * Decides enemy
   * @param sphereMesh
   * @returns
   */
  decide(sphereMesh = BABYLON.Mesh.prototype) {
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
  new Enemy(randomNumberRange(1, 3), positionGenerator(), scene);
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
