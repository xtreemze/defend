import {
	MeshBuilder,
	Material,
	Mesh,
	PhysicsImpostor,
	Vector3,
	CSG,
	Scene
} from "babylonjs";
import { materialGlobals, towerGlobals } from "../main/globalVariables";
import { TowerTurret } from "./towerBorn";

function createTowerBaseInstance() {
	towerGlobals.towerBaseMesh = MeshBuilder.CreateBox("towerBaseMesh", {
		size: 10,
		height: towerGlobals.height,
		updatable: false
	}) as Mesh;

	towerGlobals.towerBaseMesh.convertToUnIndexedMesh();
	towerGlobals.towerBaseMesh.material = materialGlobals.towerMaterial as Material;
	towerGlobals.towerBaseMesh.physicsImpostor = new PhysicsImpostor(
		towerGlobals.towerBaseMesh,
		PhysicsImpostor.BoxImpostor,
		{ mass: 0, restitution: towerGlobals.restitution }
	) as PhysicsImpostor;
	towerGlobals.towerBaseMesh.setEnabled(false);
}

function createTurretInstanceL2(scene: Scene) {
	const level = 2;

	const outerTurret = MeshBuilder.CreateBox("outerTurret", {
		size: towerGlobals.height * level,
		height: (towerGlobals.height * level) / level,
		width: towerGlobals.height * level,
		updatable: false
	}) as Mesh;
	const innerTurret = MeshBuilder.CreateBox("innerTurret", {
		size: towerGlobals.height * level * 0.8,
		height: (towerGlobals.height * level) / level,
		width: (towerGlobals.height * level) / 1.5,
		updatable: false
	}) as Mesh;
	innerTurret.position = new Vector3(
		0,
		0,
		-0.1 * (towerGlobals.height * level)
	) as Vector3;
	const outerCSG = CSG.FromMesh(outerTurret);
	const innterCSG = CSG.FromMesh(innerTurret);
	innerTurret.dispose();
	outerTurret.dispose();
	const towerCSG = outerCSG.subtract(innterCSG);
	towerGlobals.turretMeshL2 = towerCSG.toMesh(
		"turretTower2",
		null,
		scene,
		false
	) as Mesh;

	towerGlobals.turretMeshL2.isPickable = false;
	towerGlobals.turretMeshL2.convertToUnIndexedMesh();
	towerGlobals.turretMeshL2.material = materialGlobals.towerMaterial as Material;

	towerGlobals.turretMeshL2.setEnabled(false);
}

function createTurretInstanceL3(scene: Scene) {
	const level = 3;

	const outerTurret = MeshBuilder.CreateBox("outerTurret", {
		size: towerGlobals.height * level,
		height: (towerGlobals.height * level) / level,
		width: towerGlobals.height * level,
		updatable: false
	}) as Mesh;
	const innerTurret = MeshBuilder.CreateBox("innerTurret", {
		size: towerGlobals.height * level * 0.8,
		height: (towerGlobals.height * level) / level,
		width: (towerGlobals.height * level) / 1.5,
		updatable: false
	}) as Mesh;
	innerTurret.position = new Vector3(
		0,
		0,
		-0.1 * (towerGlobals.height * level)
	) as Vector3;
	const outerCSG = CSG.FromMesh(outerTurret);
	const innterCSG = CSG.FromMesh(innerTurret);
	innerTurret.dispose();
	outerTurret.dispose();
	const towerCSG = outerCSG.subtract(innterCSG);
	towerGlobals.turretMeshL3 = towerCSG.toMesh(
		"turretTower3",
		null,
		scene,
		false
	) as Mesh;

	towerGlobals.turretMeshL3.isPickable = false;
	towerGlobals.turretMeshL3.convertToUnIndexedMesh();
	towerGlobals.turretMeshL3.material = materialGlobals.towerMaterial as Material;

	towerGlobals.turretMeshL3.setEnabled(false);
}

export {
	createTowerBaseInstance,
	createTurretInstanceL2,
	createTurretInstanceL3
};
