import { destroyProjectile } from "./destroyProjectile";
import { hitEffect } from "./hitEffect";
import {
	Mesh,
	Scene,
	Vector3,
	PhysicsImpostor,
	PhysicsEngine,
	InstancedMesh
} from "babylonjs";
import { projectileGlobals, mapGlobals } from "../main/globalVariables";
import { impulsePhys } from "./Projectile";
import { destroyOnCollide } from "./destroyOnCollide";
import { EnemySphere } from "../enemy/enemyBorn";
import { TowerTurret } from "../tower/towerBorn";

interface LiveProjectile extends Mesh {
  hitPoints: number;
}

interface LiveProjectileInstance extends InstancedMesh {
  hitPoints: number;
}
export function startLife(
	scene: Scene,
	originMesh: TowerTurret,
	level: number = 1 | 2 | 3,
	projectile: LiveProjectileInstance,
	nearestEnemy: EnemySphere,
	physicsEngine: PhysicsEngine,
	clonedRotation: Vector3
) {
//   projectile.rotation = clonedRotation;
	const forwardLocal = new Vector3(0, 0, 5);
	const space = originMesh.getDirection(forwardLocal) as Vector3;
	projectile.position = originMesh.position.subtract(space) as Vector3;
	// projectile.position = originMesh.position as Vector3;

	// For Physics
	projectile.physicsImpostor = new PhysicsImpostor(
		projectile,
		PhysicsImpostor.BoxImpostor,
		{
			mass: projectileGlobals.mass * (level * level),
			restitution: 0,
			friction: 0
		},
		scene
	) as PhysicsImpostor;

	projectile.rotation = clonedRotation;
	setTimeout(() => {

		impulsePhys(originMesh, projectile, level); // Moves the projectile with physics
	}, 60);

	mapGlobals.allImpostors.unshift(projectile.physicsImpostor);

	const deltaTime = Date.now();

	const projectileExpires = () => {
		if (Date.now() - deltaTime > projectileGlobals.lifeTime) {
			projectile.unregisterAfterWorldMatrixUpdate(projectileExpires);
			destroyProjectile(projectile, physicsEngine);
		}
	};

	projectile.registerAfterWorldMatrixUpdate(projectileExpires);

	projectile.setEnabled(true);
	hitEffect(projectile, nearestEnemy); // Detects collissions with enemies and applies hitpoint effects
	destroyOnCollide(scene, projectile, physicsEngine, projectileExpires); // Detects collissions with enemies
}

export { LiveProjectile, LiveProjectileInstance };
