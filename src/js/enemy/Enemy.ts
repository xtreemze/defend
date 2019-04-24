import { enemyBorn, EnemySphere } from "./enemyBorn";

import {
	Vector3,
	MeshBuilder,
	Mesh,
	Tags,
	PhysicsImpostor,
	Scene,
	Material
} from "babylonjs";
import {
	enemyGlobals,
	projectileGlobals,
	materialGlobals,
	economyGlobals
} from "../main/globalVariables";
import positionGenerator from "../utility/positionGenerator";

interface Position2D {
	x: number;
	z: number;
}

class Enemy {
	constructor(level: number, position: Position2D, scene: Scene) {
		const name = `enemyLevel${level}Index${enemyGlobals.index}` as string;
		enemyGlobals.index += 1;
		const diameter = (level * level + 5) as number;
		const sphereMesh = MeshBuilder.CreateIcoSphere(
			name,
			{
				subdivisions: level,
				radius: diameter / 2,
				updatable: false
			},
			scene
		) as EnemySphere;
		sphereMesh.isPickable = false;

		// sphereMesh.convertToUnIndexedMesh();
		// enemyGlobals.allEnemies.unshift(sphereMesh);

		enemyBorn(scene, position, sphereMesh, diameter, level);

		Tags.AddTagsTo(sphereMesh, "enemy");
	}
}

function fragment(
	level: number = 1 | 2 | 3,
	enemyPosition: Vector3,
	enemyRotation: Vector3,
	enemyLinearVelocity: Vector3,
	enemyAngularVelocity: Vector3,
	isBlue?: Boolean
) {
	for (let index = 1; index <= enemyGlobals.fragments * level; index++) {
		const fragment = MeshBuilder.CreateBox("enemyFragment" + index, {
			size: (level * level + 5) / 1.5 / (enemyGlobals.fragments * level)
		}) as Mesh;
		fragment.position = new Vector3(
			enemyPosition.x,
			enemyPosition.y / level + ((level * level + 5) / level) * index,
			enemyPosition.z
		);
		fragment.rotation = new Vector3(
			enemyRotation.x * index * 0.1,
			enemyRotation.y * index * 0.1,
			enemyRotation.z * index * 0.1
		);

		fragment.physicsImpostor = new PhysicsImpostor(
			fragment,
			PhysicsImpostor.BoxImpostor,
			{
				mass: (enemyGlobals.mass * level) / (enemyGlobals.fragments * level),
				restitution: enemyGlobals.restitution,
				friction: 0.6
			}
		) as PhysicsImpostor;

		fragment.physicsImpostor.setLinearVelocity(enemyLinearVelocity);
		fragment.physicsImpostor.setAngularVelocity(enemyAngularVelocity);
		if (!isBlue) {

			fragment.material = materialGlobals.damagedMaterial as Material;
		} else {
			fragment.material = materialGlobals.enemyMaterial as Material;

		}

		fragment.isPickable = false;
		fragment.convertToUnIndexedMesh();

		// let deltaTime = Date.now();
		const disposeFragment = () => {
			// if (Date.now() - deltaTime > projectileGlobals.lifeTime * 2) {
			setTimeout(() => {

				fragment.unregisterAfterRender(disposeFragment);
				fragment.setEnabled(false);

				// setTimeout(() => {

					if (fragment.physicsImpostor !== null) {
						fragment.physicsImpostor.dispose();
					}
					fragment.dispose();
				// }, 10);
				// }
			}, projectileGlobals.lifeTime * 6);
		};
		fragment.registerAfterRender(disposeFragment);
	}
}

function enemyGenerator(
	scene: Scene,
	quantity = 1,
	level = 1,
	waveOrigin = -1
) {
	for (let index = 0; index < quantity; index += 1) {
		let newLocation = positionGenerator(waveOrigin);
		if (
			enemyGlobals.occupiedSpaces.find(
				existingLocation =>
					existingLocation[0] === newLocation.x &&
					existingLocation[1] === newLocation.z
			) &&
			economyGlobals.occupiedSpaces.find(
				existingLocation =>
					existingLocation[0] === newLocation.x &&
					existingLocation[1] === newLocation.z
			)
		) {
			newLocation = positionGenerator(waveOrigin);
		} else {
			newLocation = positionGenerator(waveOrigin);
		}

		enemyGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

		new Enemy(
			level,
			{
				x: enemyGlobals.occupiedSpaces[0][0],
				z: enemyGlobals.occupiedSpaces[0][1]
			},
			scene
		) as Enemy;
	}
}

export { Enemy, Position2D, enemyGenerator, fragment };
