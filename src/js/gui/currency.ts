import { updateEconomy } from "./updateEconomy";

import {
	economyGlobals,
	enemyGlobals,
	materialGlobals,
} from "../main/globalVariables";
import {
	MeshBuilder,
	Scene,
	Mesh,
	PhysicsImpostor,
	Tags
} from "babylonjs";

function displayEconomy(scene: Scene) {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

	const canvasParent = canvas.parentNode as Node;

	const currentBalance = document.createElement("div") as HTMLDivElement;
	currentBalance.id = "currentBalance";
	currentBalance.innerText = economyGlobals.currentBalance.toString();
	currentBalance.setAttribute("style", `
    position: absolute;
    color: ${enemyGlobals.livingColor.toHexString()};
    top: 1.5rem;
    left: 2rem;
    text-align: left;
    font-weight: 600;
    font-family: 'Titillium Web', sans-serif;
    font-size: 1.2rem;
    user-select: none;
    line-height: 1.3rem;
        `);

	canvasParent.insertBefore(currentBalance, canvas);

	const currencyTower = MeshBuilder.CreateBox(
		"currencyTower",
		{
			width: economyGlobals.bankSize,
			depth: economyGlobals.bankSize,
			height: economyGlobals.bankSize / 12,
			updatable: false
		},
		scene
	) as Mesh;

	economyGlobals.currencyMesh = currencyTower;

	Tags.AddTagsTo(currencyTower, "obstacle");

	const hitPointsMeter = MeshBuilder.CreateBox(
		"currencyMeter",
		{
			width: economyGlobals.bankSize,
			depth: economyGlobals.bankSize,
			height: economyGlobals.bankSize / 12,
			updatable: false
		},
		scene
	) as Mesh;

	economyGlobals.currencyMeter = hitPointsMeter;

	hitPointsMeter.isPickable = false;

	currencyTower.position.y += economyGlobals.bankSize / 24;
	hitPointsMeter.parent = currencyTower;

	hitPointsMeter.visibility = 0;

	currencyTower.isPickable = false;
	currencyTower.freezeWorldMatrix();
	currencyTower.convertToUnIndexedMesh();

	currencyTower.physicsImpostor = new PhysicsImpostor(
		currencyTower,
		PhysicsImpostor.BoxImpostor,
		{
			mass: 0,
			restitution: 0,
			friction: 1
		},
		scene
	) as PhysicsImpostor;

	currencyTower.material = materialGlobals.hitMaterial;
	hitPointsMeter.material = materialGlobals.enemyMaterial;

	rampUp(scene);

	scene.registerBeforeRender(() => {
		updateEconomy(scene);
	});

	hitPointsMeter.visibility = 1;
}

function rampUp(scene: Scene) {
	economyGlobals.currentBalance = 0;

	scene.registerBeforeRender(function interval1() {
		economyGlobals.currentBalance += economyGlobals.rampUpValue;

		if (
			economyGlobals.currentBalance >= economyGlobals.initialBalance
			 ||
      economyGlobals.currentBalance <= 0
		) {
			scene.unregisterBeforeRender(interval1);
		}
	});
}
export { displayEconomy, rampUp };
