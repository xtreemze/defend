import * as BABYLON from "babylonjs";
import { projectileGlobals } from "./variables";

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

    // Glow Layer
    // const glowLayer = new BABYLON.GlowLayer("glow", scene, {
    // mainTextureFixedSize: 1024,
    // blurKernelSize: 64,
    // mainTextureSamples: 4
    // });
    // glowLayer.intensity = 0.5;

    // glowLayer.addIncludedOnlyMesh(projectile);

    // For Physics
    projectile.physicsImpostor = new BABYLON.PhysicsImpostor(
      projectile,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: projectileGlobals.mass,
        restitution: projectileGlobals.restitution
      },
      scene
    );

    this.impulsePhys(scene, enemies, originMesh, projectile); // Moves the projectile with physics
    this.intersectPhys(scene, enemies, projectile); // Detects collissions with enemies

    setTimeout(() => {
      projectile.dispose();
    }, projectileGlobals.lifeTime);
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
    scene: any = BABYLON.Scene.prototype,
    enemies: any = BABYLON.MeshBuilder.CreateBox.prototype,
    projectile: any = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    // Enemies ONLY
    for (let index = 0; index < enemies.length; index += 1) {
      const enemy = enemies[index];

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.material = scene.getMaterialByID("hitMaterial");
          enemy.hitPoints -= projectile.hitPoints;
          this.destroy(projectile);
          setTimeout(() => {
            enemy.material = scene.getMaterialByID("enemyMaterial");
          }, 35);
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
    scene: any = BABYLON.Scene.prototype,
    enemies: any = { length: 0 },
    originMesh: any = BABYLON.MeshBuilder.CreateBox.prototype,
    projectile: any = BABYLON.MeshBuilder.CreateBox.prototype
  ) {
    const forwardLocal = new BABYLON.Vector3(
      0,
      0,
      projectileGlobals.speed * -1
    );
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
  scene: any = BABYLON.Scene.prototype,
  originMesh: any = BABYLON.MeshBuilder.CreateBox.prototype,
  enemyArray
) {
  new Projectile(1, originMesh, scene, enemyArray);
}
