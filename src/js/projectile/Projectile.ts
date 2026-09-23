import { startLife, LiveProjectileInstance } from "./startLife";
import { getGlobalProjectilePoolManager } from "./projectilePoolManager";

import { Scene, Vector3, PhysicsEngine } from "../utility/babylonOptimized";
import { projectileGlobals } from "../main/globalVariables";
import { EnemySphere } from "../enemy/enemyBorn";
import { TowerTurret } from "../tower/towerBorn";

class Projectile {
	constructor(
		originMesh: TowerTurret,
		scene: Scene,
		level: number = 1 | 2 | 3,
		nearestEnemy: EnemySphere,
		physicsEngine: PhysicsEngine,
		clonedRotation: Vector3
	) {
		const poolManager = getGlobalProjectilePoolManager();
		let projectile: LiveProjectileInstance | null = null;

		// Acquire projectile from pool
		if (level === 2 || level === 3) {
			projectile = poolManager.acquireProjectile(level as 2 | 3) as LiveProjectileInstance;
		}

		if (projectile !== null) {
			projectile.hitPoints = level * level * level * projectileGlobals.baseHitPoints;
			// Store level on instance for pool return
			(projectile as any).poolLevel = level;

			startLife(
				scene,
				originMesh,
				level,
				projectile,
				nearestEnemy,
				physicsEngine,
				clonedRotation
			);
		}
	}
}

export function impulsePhys (
	originMesh: TowerTurret,
	projectile: LiveProjectileInstance,
	level: number = 1 | 2 | 3
) {
	setTimeout(() => {
	const forwardLocal = new Vector3(
		0,
		0,
		projectileGlobals.speed * (level * level * level) * -1
	) as Vector3;
	const speed = originMesh.getDirection(forwardLocal) as Vector3;
		if (projectile.physicsImpostor !== null) {

			projectile.physicsImpostor.applyImpulse(
				speed,
				projectile.getAbsolutePosition()
			);
		}
		}, 10);
}

export default function fireProjectile (
	scene: Scene,
	originMesh: TowerTurret,
	level: number = 1 | 2 | 3,
	nearestEnemy: EnemySphere,
	physicsEngine: PhysicsEngine,
	clonedRotation: Vector3
) {
	new Projectile(originMesh, scene, level, nearestEnemy, physicsEngine, clonedRotation);
}
