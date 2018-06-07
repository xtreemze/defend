import * as BABYLON from "babylonjs";
import { projectileGlobals, enemyGlobals, mapGlobals } from "./variables";

class Projectile {
  constructor(
    level = 1,
    originMesh = BABYLON.Mesh,
    scene = BABYLON.Scene.prototype
  ) {
    const name = `projectile${level}`;

    const projectile = BABYLON.MeshBuilder.CreateBox(name, {
      size: 2,
      height: 0.5,
      width: 1,
      updatable: false
    });

    this.startLife(scene, originMesh, level, projectile);
  }

  startLife(
    scene: any = BABYLON.Scene.prototype,
    originMesh: any = BABYLON.Mesh.prototype,
    level: number = 1,
    projectile: any = BABYLON.Mesh.prototype
  ) {
    const projectileMaterial = scene.getMaterialByID("projectileMaterial");
    const forwardLocal = new BABYLON.Vector3(0, 0, 5);
    const space = originMesh.getDirection(forwardLocal);

    projectile.position = originMesh.position.subtract(space);

    //@ts-ignore
    projectile.hitPoints = level * projectileGlobals.baseHitPoints;
    projectile.material = projectileMaterial;

    // For Physics
    projectile.physicsImpostor = new BABYLON.PhysicsImpostor(
      projectile,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: projectileGlobals.mass,
        restitution: projectileGlobals.restitution,
        friction: 1
      },
      scene
    );
    mapGlobals.allImpostors.unshift(projectile.physicsImpostor);

    const clonedRotation = originMesh.rotation.clone();

    projectile.rotation.copyFrom(clonedRotation);

    this.intersectPhys(scene, projectile); // Detects collissions with enemies
    this.impulsePhys(scene, originMesh, projectile); // Moves the projectile with physics

    setTimeout(() => {
      this.destroyProjectile(projectile, scene);
    }, projectileGlobals.lifeTime);
  }

  intersectPhys(
    scene: any = BABYLON.Scene.prototype,
    projectile: any = BABYLON.Mesh.prototype
  ) {
    const hitMaterial = scene.getMaterialByID("hitMaterial");
    const enemyMaterial = scene.getMaterialByID("enemyMaterial");

    // Destroy when projectile hits any physics object
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors,
      () => {
        this.destroyProjectile(projectile, scene);
      }
    );

    // Enemies ONLY
    for (let index = 0; index < enemyGlobals.allEnemies.length; index += 1) {
      const enemy = enemyGlobals.allEnemies[index];

      projectile.physicsImpostor.registerOnPhysicsCollide(
        enemy.physicsImpostor,
        () => {
          enemy.hitPoints -= projectile.hitPoints;

          enemy.material = hitMaterial;
          setTimeout(() => {
            enemy.material = enemyMaterial;
          }, 60);
        }
      );
    }
  }

  impulsePhys(
    scene: any = BABYLON.Scene,
    originMesh: any = BABYLON.Mesh,
    projectile: any = BABYLON.Mesh
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

  destroyProjectile(
    projectile: any = BABYLON.Mesh,
    scene: any = BABYLON.Scene
  ) {
    setTimeout(() => {
      mapGlobals.allImpostors = [];
      projectile.physicsImpostor.dispose();

      projectile.hitPoints = 0;

      delete projectile.hitPoints;
      projectile.dispose();

      const physicsEngine = scene.getPhysicsEngine();

      mapGlobals.allImpostors = physicsEngine.getImpostors();
    }, 1);
  }
}

export default function fire(
  scene: any = BABYLON.Scene.prototype,
  originMesh: any = BABYLON.Mesh.prototype
) {
  new Projectile(1, originMesh, scene);
}
