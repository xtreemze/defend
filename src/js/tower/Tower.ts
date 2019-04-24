import { towerBorn, TowerTurret } from "./towerBorn";
import {
	Scene,
	Mesh,
	PhysicsEngine,
	Ray,
	Tags,
	PhysicsImpostor,
	Vector3
} from "babylonjs";
import { addTower } from "../main/sound";
import { towerGlobals, projectileGlobals } from "../main/globalVariables";
import { Position2D } from "../enemy/Enemy";
import { EnemySphere } from "../enemy/enemyBorn";

class Tower {
	constructor(
		level: number = 1 | 2 | 3,
		position: Position2D = { x: -25, z: -25 },
		scene: Scene,
		physicsEngine: PhysicsEngine
	) {
		const name = `towerLevel${level}Index${towerGlobals.index}` as string;
		towerGlobals.index += 1;
		let tower = towerGlobals.towerBaseMesh.clone(
			name, undefined, true, false
		) as Mesh;

		tower.physicsImpostor = new PhysicsImpostor(
			tower,
			PhysicsImpostor.BoxImpostor,
			{ mass: 0, restitution: towerGlobals.restitution }
		) as PhysicsImpostor;


		Tags.AddTagsTo(tower, "towerBase");

		towerBorn(scene, tower, position, level, physicsEngine);
		addTower(tower, level);
		towerGlobals.allPositions = towerBasePositions(scene);
	}
}

function towerBasePositions(scene: Scene) {
	let positionalArray: Position2D[] = [];
	scene.getMeshesByTags("towerBase", towerBaseMesh => {
		const towerLocation = {
			x: towerBaseMesh.position.x,
			z: towerBaseMesh.position.z
		} as Position2D;
		positionalArray.push(towerLocation);
	});
	return positionalArray;
}

function shotClearsTower(scene: Scene, ray: Ray, intendedEnemy: Mesh) {
	let result = false as boolean;
	const hit = scene.pickWithRay(ray);

	if (
		hit &&
		hit.pickedMesh === intendedEnemy &&
		!Tags.MatchesQuery(intendedEnemy, "obstacle")
	) {
		result = true as boolean;
	}
	return true as boolean;
}

function rotateTurret(
	nearestEnemy: EnemySphere,
	towerTurret: Mesh,
	level: number
) {
	const impostor = nearestEnemy.physicsImpostor as PhysicsImpostor;

	const enemyVelocity = impostor.getLinearVelocity() as Vector3;

	const towerEnemyDistance = Vector3.Distance(
		nearestEnemy.position,
		towerTurret.position
	);

	const projectileTime =
		(towerEnemyDistance /
			(projectileGlobals.mass *
				(level * level) *
				(projectileGlobals.speed * (level * level)))) *
		(towerGlobals.lookAheadRatio * level * level +
			level * towerGlobals.lookAheadRatio);

	const newPosition = nearestEnemy.position.add(
		new Vector3(
			enemyVelocity.x * projectileTime,
			enemyVelocity.y * projectileTime + level + level / 3,
			enemyVelocity.z * projectileTime
		)
	);
	if (newPosition.y < level + level / 3) {
		newPosition.y = level + level / 3;
	}
	towerTurret.lookAt(newPosition);

	return towerTurret.rotation.clone();
}

function destroyTower(
	scene: Scene,
	baseMesh: Mesh,
	pillarMesh?: Mesh,
	turretMesh?: TowerTurret,
	flashMesh?: Mesh
): void {
	Tags.RemoveTagsFrom(baseMesh, "towerBase");
	// baseMesh.setEnabled(false);

	towerGlobals.allPositions = towerBasePositions(scene);
	baseMesh.onDisposeObservable.clear();
	towerGlobals.allTowers = [];
	if (pillarMesh && turretMesh && flashMesh) {
		if (baseMesh.physicsImpostor !== null) {
			baseMesh.physicsImpostor.dispose();
		}
		if (towerGlobals.raysOn) {
			turretMesh.turretRayHelper.dispose();
		}
		if (pillarMesh.physicsImpostor !== null) {
			pillarMesh.physicsImpostor.dispose();
		}
		// pillarMesh.setEnabled(false);
		pillarMesh.dispose();

		// turretMesh.setEnabled(false);
		delete turretMesh.ray;
		turretMesh.dispose();

		// flashMesh.setEnabled(false);
		flashMesh.dispose();
	}


	towerGlobals.allTowers = scene.getMeshesByTags("tower" && "towerBase");
}

export {
	Tower,
	destroyTower,
	towerBasePositions,
	shotClearsTower,
	rotateTurret
};
