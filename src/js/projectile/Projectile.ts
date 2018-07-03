import {
  Mesh,
  Scene,
  Vector3,
  Material,
  PhysicsImpostor,
  MeshBuilder,
  PhysicsEngine
} from "babylonjs";
import {
  projectileGlobals,
  mapGlobals,
  economyGlobals
} from "../main/globalVariables";
import { shoot, damage } from "../main/sound";
import { explosion } from "../enemy/explodeParticle";
import { updateEconomy } from "../gui/currency";

class Projectile {
  constructor(
    originMesh: Mesh,
    scene: Scene,
    level: number = 1 | 2 | 3,
    nearestEnemy: Mesh,
    physicsEngine: PhysicsEngine,
    nearestEnemyImpostor: PhysicsImpostor
  ) {
    const name = `projectile${level}` as string;

    const projectile = MeshBuilder.CreateBox(name, {
      size: level,
      height: level / 4,
      width: level / 2,
      updatable: false
    }) as Mesh;

    projectile.convertToUnIndexedMesh();

    startLife(
      scene,
      originMesh,
      level,
      projectile,
      nearestEnemy,
      physicsEngine,
      nearestEnemyImpostor
    );
  }
}

function startLife(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  projectile: Mesh,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine,
  enemyImpostor: PhysicsImpostor
) {
  const projectileMaterial = scene.getMaterialByID(
    "projectileMaterial"
  ) as Material;
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

  mapGlobals.allImpostors.unshift(projectile.physicsImpostor) as number;

  const clonedRotation = originMesh.rotation.clone();

  projectile.rotation.copyFrom(clonedRotation);

  hitEffect(scene, projectile, nearestEnemy, enemyImpostor); // Detects collissions with enemies
  destroyOnCollide(scene, projectile, physicsEngine); // Detects collissions with enemies
  impulsePhys(originMesh, projectile, level); // Moves the projectile with physics

  if (mapGlobals.projectileSounds < mapGlobals.projectileSoundLimit) {
    setTimeout(() => {
      mapGlobals.projectileSounds -= 1;
    }, mapGlobals.soundDelay);

    mapGlobals.projectileSounds += 1;

    if (mapGlobals.soundOn) shoot(projectile, level);
  }
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

function hitEffect(
  scene: Scene,
  projectile: Mesh,
  enemy: Mesh,
  enemyImpostor: PhysicsImpostor
) {
  const hitMaterial = scene.getMaterialByID("damagedMaterial") as Material;
  const enemyMaterial = scene.getMaterialByID("hitMaterial") as Material;
  if (projectile.physicsImpostor !== null) {
    projectile.physicsImpostor.registerOnPhysicsCollide(enemyImpostor, () => {
      //@ts-ignore
      enemy.hitPoints -= projectile.hitPoints;

      enemy.material = hitMaterial as Material;
      //@ts-ignore
      if (enemy.hitPoints > 0) {
      //@ts-ignore
      economyGlobals.currentBalance += projectile.hitPoints;
      updateEconomy(scene);
      }
      setTimeout(() => {
        enemy.material = enemyMaterial as Material;
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
    });
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
  setTimeout(() => {
    if (projectile.physicsImpostor !== null) {
      projectile.physicsImpostor.applyImpulse(
        speed,
        projectile.getAbsolutePosition()
      );
    }
    }, 1);
}

function destroyProjectile(projectile: Mesh, physicsEngine: PhysicsEngine) {
  projectile.setEnabled(false);

  //@ts-ignore
  projectile.hitPoints = 0;

  setTimeout(() => {
    mapGlobals.allImpostors = [];
    //@ts-ignore
    delete projectile.hitPoints;
    if (projectile.physicsImpostor !== null) {
      projectile.physicsImpostor.dispose();
    }
    projectile.dispose();
    mapGlobals.allImpostors = physicsEngine.getImpostors() as PhysicsImpostor[];
  }, 1);
}

export default function fireProjectile(
  scene: Scene,
  originMesh: Mesh,
  level: number = 1 | 2 | 3,
  nearestEnemy: Mesh,
  physicsEngine: PhysicsEngine,
  nearestEnemyImpostor: PhysicsImpostor
) {
  new Projectile(
    originMesh,
    scene,
    level,
    nearestEnemy,
    physicsEngine,
    nearestEnemyImpostor
  );
}
