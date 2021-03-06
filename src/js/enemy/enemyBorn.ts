import { Scene, Vector3, MeshBuilder, Mesh, PhysicsImpostor } from "babylonjs";
import enemyAi from "./enemyAi";
import {
	enemyGlobals,
	mapGlobals,
	materialGlobals,
} from "../main/globalVariables";
import { currencyCollide } from "./currencyCollide";
import { Position2D } from "./Enemy";
import { decide } from "./decide";
import { checkHitPoints } from "./checkHitPoints";
import randomNumberRange from "../utility/randomNumberRange";

interface EnemySphere extends Mesh {
	hitPoints: number;
}

function enemyBorn (
	scene: Scene,
	position: Position2D,
	sphereMesh: EnemySphere,
	diameter: number,
	level: number = 1 | 2 | 3
) {
	const enemyMass = (enemyGlobals.mass * level * level) as number;

	sphereMesh.hitPoints = level * level * enemyGlobals.baseHitPoints + level * 440;

	const hitPointsMeter = MeshBuilder.CreateIcoSphere(
		name + "hitPointMeter",

		{ subdivisions: level, radius: diameter / 2 },
		scene
	) as Mesh;

	hitPointsMeter.isPickable = false;
	hitPointsMeter.parent = sphereMesh;

	sphereMesh.position = new Vector3(
		position.x,
		(diameter / 2) * (enemyGlobals.originHeight + randomNumberRange(0, 8)),
		position.z
	);

	sphereMesh.physicsImpostor = new PhysicsImpostor(
		sphereMesh,
		PhysicsImpostor.SphereImpostor,
		{
			mass: enemyMass,
			restitution: enemyGlobals.restitution - (level * level) / 10,
			friction: enemyGlobals.friction
		},
		scene
	) as PhysicsImpostor;

	mapGlobals.allImpostors.unshift(sphereMesh.physicsImpostor);

	// sphereMesh.physicsImpostor.applyImpulse(
	// 	new Vector3(0, -enemyGlobals.mass * 50 * level * level, 0),
	// 	sphereMesh.getAbsolutePosition()
	// );
	sphereMesh.physicsImpostor.setLinearVelocity(
		new Vector3(0, -20, 0)
	);

	sphereMesh.material = materialGlobals.hitMaterial;
	hitPointsMeter.material = materialGlobals.enemyMaterial;

	let deltaTime = Date.now();

	sphereMesh.registerBeforeRender(() => {
		const now = Date.now()
		const positionY = sphereMesh.position.y;
		if (now - deltaTime > enemyGlobals.decisionRate) {
			deltaTime = now;
			if (
				positionY > diameter / 2.5 &&
				positionY < diameter
			) {
				enemyAi(sphereMesh, decide(sphereMesh), level);
			}

			checkHitPoints(scene, sphereMesh, level, hitPointsMeter);
		}
	});
	currencyCollide(sphereMesh, scene, level);
}

export { EnemySphere, enemyBorn };
