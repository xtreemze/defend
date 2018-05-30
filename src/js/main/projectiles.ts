import * as BABYLON from "babylonjs";

const life = 500; // How long the enemies live in milliseconds

/**
 * Creates an instance of Projectile.
 * @param {number} [level=1]
 * @param {any} [originMesh=BABYLON.Mesh]
 * @param {any} [scene=BABYLON.Scene.prototype]
 * @param {any} [enemy={
 *       physicsImpostor: {},
 *       length: 0,
 *       material: BABYLON.material,
 *       hitPoints: 0
 *     }]
 * @memberof Projectile
 */
class Projectile {
  constructor(
    level = 1,
    originMesh = BABYLON.Mesh,
    scene = BABYLON.Scene.prototype,
    enemies = [
      {
        physicsImpostor: {},
        length: 0,
        material: BABYLON.Material,
        hitPoints: 0
      }
    ]
  ) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 1.5,
        height: 1,
        width: 1
      },
      scene
    );

    this.startLife(scene, originMesh, level, enemies, projectile);
  }

  /**
   * Starts life
   * @param [scene]
   * @param [originMesh]
   * @param [level]
   * @param [enemies]
   * @param [projectile]
   */
  startLife(
    scene = BABYLON.Scene.prototype,
    originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
    level = 1,
    enemies = [
      {
        physicsImpostor: {},
        length: 0,
        material: BABYLON.Material,
        hitPoints: 0
      }
    ],
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    projectile.position.copyFrom(originMesh.position);
    projectile.rotation.copyFrom(originMesh.rotation);

    projectile.hitPoints = level * 2;

    projectile.material = scene.getMaterialByID("projectileMaterial");

    // For Physics
    projectile.physicsImpostor = new BABYLON.PhysicsImpostor(
      projectile,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 10, restitution: 0.5 },
      scene
    );

    this.impulsePhys(scene, enemies, originMesh, projectile); // Moves the projectile with physics
    this.intersectPhys(scene, enemies, projectile); // Detects collissions with enemies

    setTimeout(() => {
      projectile.dispose();
    }, life);
  }

  /**
   * Intersect with Physics
   *
   * @param {any} [scene=BABYLON.Scene.prototype]
   * @param {any} [enemies=[
   *       {
   *         physicsImpostor: {},
   *         length: 0,
   *         material: BABYLON.material,
   *         hitPoints: 0
   *       }
   *     ]]
   * @param {any} [projectile=BABYLON.MeshBuilder.CreateBox.prototype]
   * @memberof Projectile
   */
  intersectPhys(
    scene = BABYLON.Scene.prototype,
    enemies = BABYLON.MeshBuilder.CreateBox.prototype,
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    // Enemies ONLY
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.material = scene.getMaterialByID("hitMaterial");
          setTimeout(() => {
            enemy.hitPoints -= projectile.hitPoints;
            this.destroy(projectile);
            enemy.material = scene.getMaterialByID("enemyMaterial");
          }, 40);
        }
      );
    }
  }

  /**
   * Impulse with Physics
   *
   * @param {any} [scene=BABYLON.Scene.prototype]
   * @param {any} enemies
   * @param {any} [originMesh=BABYLON.MeshBuilder.CreateBox.prototype]
   * @param {any} [projectile=BABYLON.MeshBuilder.CreateBox.prototype]
   * @memberof Projectile
   */
  impulsePhys(
    scene = BABYLON.Scene.prototype,
    enemies = { length: 0 },
    originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
    projectile = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    const forwardLocal = new BABYLON.Vector3(0, 1200, 0);
    const speed = originMesh.getDirection(forwardLocal);
    projectile.physicsImpostor.applyImpulse(
      speed,
      projectile.getAbsolutePosition()
    );
  }

  /**
   * Destroys projectile
   * @param [projectile]
   */
  destroy(projectile = BABYLON.MeshBuilder.CreateBox.prototype) {
    projectile.hitPoints = 0;
    setTimeout(() => {
      projectile.dispose();
    }, 1);
  }
}

/**
 * Fire Projectiles
 *
 * @export
 * @param {any} [scene=BABYLON.Scene.prototype]
 * @param {any} [originMesh=BABYLON.MeshBuilder.CreateBox.prototype]
 * @param {any} [enemies=[
 *     {
 *       physicsImpostor: {},
 *       length: 0,
 *       material: BABYLON.material,
 *       hitPoints: 0
 *     }
 *   ]]
 */
export default function fire(
  scene = BABYLON.Scene.prototype,
  originMesh = BABYLON.MeshBuilder.CreateBox.prototype,
  enemies = [
    {
      physicsImpostor: {},
      length: 0,
      material: BABYLON.Material,
      hitPoints: 0
    }
  ]
) {
  new Projectile(1, originMesh, scene, enemies);
}
