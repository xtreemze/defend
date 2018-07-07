import {
  Mesh,
  Scene,
  Vector3,
  Material,
  PhysicsImpostor,
  MeshBuilder,
  PhysicsEngine,
  Tags
} from "babylonjs";
import {
  projectileGlobals,
  mapGlobals,
  economyGlobals,
  materialGlobals
} from "../main/globalVariables";
import { shoot, damage } from "../main/sound";
import { explosion } from "../enemy/explodeParticle";
import { updateEconomy } from "../gui/updateEconomy";

class Projectile {
  constructor(
    originMesh: Mesh,
    scene: Scene,
    level: number = 1 | 2 | 3,
    nearestEnemy: Mesh,
    physicsEngine: PhysicsEngine
  ) {
    const name = `projectile${level}` as string;

    const projectile = MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as Mesh;
    projectile.isPickable = false;
    projectile.convertToUnIndexedMesh();

    startLife(
      scene,
      originMesh,
      level,
      projectile,
      nearestEnemy,
      physicsEngine
    );
  }
}

function startLife(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  projectile: Mesh,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine
) {
  const projectileMaterial = materialGlobals.projectileMaterial;
  const forwardLocal = new Vector3(0, 0, 5);
  const space = originMesh.getDirection(forwardLocal) as Vector3;

  projectile.position = originMesh.position.subtract(space) as Vector3;
  //@ts-ignore
  projectile.hitPoints = (level +
    level * projectileGlobals.baseHitPoints) as number;
  projectile.material = projectileMaterial as Material;

  // For Physics
  projectile.physicsImpostor = new PhysicsImpostor(
    projectile,
    PhysicsImpostor.BoxImpostor,
    {
      mass: projectileGlobals.mass * level,
      restitution: projectileGlobals.restitution,
      friction: 1
    },
    scene
  ) as PhysicsImpostor;

  mapGlobals.allImpostors.unshift(projectile.physicsImpostor);

  const clonedRotation = originMesh.rotation.clone();

  projectile.rotation.copyFrom(clonedRotation);

  hitEffect(scene, projectile, nearestEnemy); // Detects collissions with enemies
  destroyOnCollide(scene, projectile, physicsEngine); // Detects collissions with enemies
  impulsePhys(originMesh, projectile, level); // Moves the projectile with physics

  setTimeout(() => {
    destroyProjectile(projectile, physicsEngine);
  }, projectileGlobals.lifeTime);
}

function destroyOnCollide(
  scene: Scene,
  projectile: Mesh,
  physicsEngine: PhysicsEngine
) {
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      mapGlobals.allImpostors as PhysicsImpostor[],
      (collider: PhysicsImpostor) => {
        destroyProjectile(projectile, physicsEngine);
        explosion(scene, collider.getObjectCenter());
      }
    );
  }
}

function hitEffect(scene: Scene, projectile: Mesh, enemy: Mesh) {
  if (projectile.physicsImpostor !== null && enemy.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(
      enemy.physicsImpostor,
      () => {
        //@ts-ignore
        enemy.hitPoints -= projectile.hitPoints;

        enemy.material = materialGlobals.damagedMaterial;
        //@ts-ignore
        if (enemy.hitPoints > 0) {
          //@ts-ignore
          economyGlobals.currentBalance += projectile.hitPoints;
          updateEconomy(scene);
        } else {
          //@ts-ignore
          enemy.hitPoints = 0;
        }
        setTimeout(() => {
          enemy.material = materialGlobals.hitMaterial;
        }, 30);

        if (
          mapGlobals.simultaneousSounds < mapGlobals.soundLimit &&
          //@ts-ignore
          enemy.hitPoints > 0
        ) {
          setTimeout(() => {
            mapGlobals.simultaneousSounds -= 1;
          }, mapGlobals.soundDelay);

          mapGlobals.simultaneousSounds += 1;

          if (mapGlobals.soundOn) damage(enemy);
        }
      }
    );
  }
}

function impulsePhys(
  originMesh: Mesh,
  projectile: Mesh,
  level: number = 1 | 2 | 3
) {
  const forwardLocal = new Vector3(
    0,
    0,
    projectileGlobals.speed * level * -1
  ) as Vector3;
  const speed = originMesh.getDirection(forwardLocal) as Vector3;
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.applyImpulse(
      speed,
      projectile.getAbsolutePosition()
    );
  }
}

function destroyProjectile(projectile: Mesh, physicsEngine: PhysicsEngine) {
  projectile.setEnabled(false);

  //@ts-ignore
  projectile.hitPoints = 0;
  Tags.RemoveTagsFrom(projectile, "projectile");
  //@ts-ignore
  delete projectile.hitPoints;
  setTimeout(() => {
    projectile.dispose();
    if (projectile.physicsImpostor !== null) {
      projectile.physicsImpostor.dispose();
    }
    setTimeout(() => {
      mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
    }, 4);
  }, 1);
}

export default function fireProjectile(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine
) {
  new Projectile(originMesh, scene, level, nearestEnemy, physicsEngine);
}
