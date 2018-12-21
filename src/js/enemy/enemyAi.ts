import { Vector3 } from "babylonjs";
import randomNumberRange from "../utility/randomNumberRange";
import { enemyGlobals } from "../main/globalVariables";
import { EnemySphere } from "./enemyBorn";

function vector(enemy: EnemySphere, direction: string = "", level: number) {
	if (enemy.physicsImpostor !== null) {
		const speed = enemyGlobals.speed * level;

		switch (direction) {
		case "down":
			enemy.physicsImpostor.applyImpulse(
				new Vector3(0, 0, speed * -1),
				enemy.getAbsolutePosition()
			);
			break;
		case "right":
			enemy.physicsImpostor.applyImpulse(
				new Vector3(speed, 0, 0),
				enemy.getAbsolutePosition()
			);
			break;
		case "up":
			enemy.physicsImpostor.applyImpulse(
				new Vector3(0, 0, speed),
				enemy.getAbsolutePosition()
			);
			break;
		case "left":
			enemy.physicsImpostor.applyImpulse(
				new Vector3(speed * -1, 0, 0),
				enemy.getAbsolutePosition()
			);
			break;

		default:
			break;
		}
	}
}

function orient(
	enemy: EnemySphere,
	decision = { up: true, left: true, right: true, down: true },
	result: number = 1,
	level: number
) {
	if (enemy.physicsImpostor !== null) {
		switch (result) {
		case 1:
			if (decision.down) {
				vector(enemy, "down", level);
			} else if (decision.right) {
				vector(enemy, "right", level);
			} else if (decision.up) {
				vector(enemy, "up", level);
			} else if (decision.left) {
				vector(enemy, "left", level);
			}
			break;
		case 2:
			if (decision.up) {
				vector(enemy, "up", level);
			} else if (decision.right) {
				vector(enemy, "right", level);
			} else if (decision.left) {
				vector(enemy, "left", level);
			} else if (decision.down) {
				vector(enemy, "down", level);
			}
			break;
		case 3:
			if (decision.left) {
				vector(enemy, "left", level);
			} else if (decision.up) {
				vector(enemy, "up", level);
			} else if (decision.down) {
				vector(enemy, "down", level);
			} else if (decision.right) {
				vector(enemy, "right", level);
			}
			break;
		case 4:
			if (decision.right) {
				vector(enemy, "right", level);
			} else if (decision.left) {
				vector(enemy, "left", level);
			} else if (decision.up) {
				vector(enemy, "up", level);
			} else if (decision.down) {
				vector(enemy, "down", level);
			}
			break;

		default:
			break;
		}
	}
}

export default function enemyAi(
	enemy: EnemySphere,
	decision = { up: true, left: true, right: true, down: true },
	level: number
) {
	const result = randomNumberRange(1, 4);
	if (enemy.physicsImpostor !== null) {
		orient(enemy, decision, result, level);
	}
}
