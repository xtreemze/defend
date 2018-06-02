import * as BABYLON from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./variables";

class Projectile {
  constructor(
    level = 1,
    originMesh = BABYLON.Mesh,
    scene = BABYLON.Scene.prototype
  ) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        // diameter: 1.2,
        size: 1.8,
        // segments: 1,
        height: 0.7,
        width: 0.7
      },
      scene
    );

    const flash = BABYLON.MeshBuilder.CreateSphere(
      name,
      {
        diameter: 4,
        segments: 1
      },
      scene
    );



    //@ts-ignore
    this.startLife(scene, originMesh, level, projectile, flash);
  }

  startLife(
    scene: any = BABYLON.Scene.prototype,
    originMesh: any = BABYLON.Mesh.prototype,
    level: number = 1,
    projectile: any = BABYLON.Mesh.prototype,
    flash: any = BABYLON.Mesh.prototype
  ) {
    const forwardLocal = new BABYLON.Vector3(0, 0, 6);
    const space = originMesh.getDirection(forwardLocal);

    const flashLocal = new BABYLON.Vector3(0, 0, 2.5);
    const flashSpace = originMesh.getDirection(flashLocal);

    flash.position = originMesh.position.subtract(flashSpace);
    flash.material = scene.getMaterialByID("projectileMaterial");
    flash.rotation = originMesh.rotation.clone();

    projectile.position = originMesh.position.subtract(space);

    //@ts-ignore
    projectile.hitPoints = level * 2;
    projectile.material = scene.getMaterialByID("projectileMaterial");

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

    const clonedRotation = originMesh.rotationQuaternion.clone();
    projectile.rotationQuaternion.copyFrom(clonedRotation);
    // projectile.rotationQuaternion.copyFrom(originMesh.rotation);

    this.impulsePhys(scene, originMesh, projectile); // Moves the projectile with physics

    this.intersectPhys(scene, projectile); // Detects collissions with enemies

    setTimeout(() => {
      flash.dispose();
    }, 10);

    setTimeout(() => {
      this.destroy(projectile);
    }, projectileGlobals.lifeTime);
  }

  intersectPhys(
    scene: any = BABYLON.Scene.prototype,
    projectile: any = BABYLON.MeshBuilder.CreateSphere.prototype,
  ) {
    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors,
      () => {
        this.destroy(projectile);
      }
    );

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
