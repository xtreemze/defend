import * as BABYLON from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./variables";

class Projectile {
  constructor(
    level = 1,
    originMesh = BABYLON.Mesh,
    scene = BABYLON.Scene.prototype
  ) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateSphere(
      name,
      {
        diameter: 1.5,
        segments: 2
        // height: 1,
        // width: 1
      },
      scene
    );

    this.startLife(scene, originMesh, level, projectile);
  }

  startLife(
    scene = BABYLON.Scene.prototype,
    originMesh = BABYLON.MeshBuilder.CreateSphere.prototype,
    level = 1,
    projectile = BABYLON.MeshBuilder.CreateSphere.prototype
  ) {
    const forwardLocal = new BABYLON.Vector3(0, 0, 5);
    const space = originMesh.getDirection(forwardLocal);

    projectile.position = originMesh.position.subtract(space);

    projectile.hitPoints = level * 2;

    projectile.material = scene.getMaterialByID("projectileMaterial");

    // projectile.rotationQuaternion = originMesh.rotationQuaternion.clone();

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
      BABYLON.PhysicsImpostor.SphereImpostor,
      {
        mass: projectileGlobals.mass,
        restitution: projectileGlobals.restitution
      },
      scene
    );

    this.impulsePhys(scene, originMesh, projectile); // Moves the projectile with physics
    this.intersectPhys(scene, projectile); // Detects collissions with enemies

    setTimeout(() => {
      projectile.dispose();
    }, projectileGlobals.lifeTime);
  }

  intersectPhys(
    scene: any = BABYLON.Scene.prototype,
    projectile: any = BABYLON.MeshBuilder.CreateSphere.prototype
  ) {
    const engine = scene.getPhysicsEngine();

    // Enemies ONLY
    for (let index = 0; index < enemyGlobals.allEnemies.length; index += 1) {
      const enemy = enemyGlobals.allEnemies[index];

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.material = scene.getMaterialByID("hitMaterial");
          enemy.hitPoints -= projectile.hitPoints;
          setTimeout(() => {
            enemy.material = scene.getMaterialByID("enemyMaterial");
          }, 35);
        }
      );
    }

    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      engine.getImpostors(),
      () => {
        this.destroy(projectile);
      }
    );
  }

  impulsePhys(
    scene: any = BABYLON.Scene.prototype,
    originMesh: any = BABYLON.MeshBuilder.CreateSphere.prototype,
    projectile: any = BABYLON.MeshBuilder.CreateSphere.prototype
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

  destroy(projectile = BABYLON.MeshBuilder.CreateSphere.prototype) {
    projectile.hitPoints = 0;
    setTimeout(() => {
      projectile.dispose();
    }, 1);
  }
}

export default function fire(
  scene: any = BABYLON.Scene.prototype,
  originMesh: any = BABYLON.MeshBuilder.CreateSphere.prototype
) {
  if (enemyGlobals.allEnemies.length <= 12) {
    new Projectile(1, originMesh, scene);
  }
}