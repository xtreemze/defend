import {
	Color3,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3
} from "babylonjs";
import { economyGlobals } from "../main/globalVariables";

type EnergyFlowPhase = "falling" | "streaming" | "pooling";

interface EnergyFlowPacket {
	value: number;
	mesh: Mesh;
	phase: EnergyFlowPhase;
	verticalVelocity: number;
	age: number;
	wobble: number;
	blockedSeconds: number;
	routeChanges: number;
}

interface FlowObstacle {
	x: number;
	z: number;
	halfExtent: number;
}

const MAX_ACTIVE_PACKETS = 64;
const MIN_PACKETS_PER_HIT = 3;
const MAX_PACKETS_PER_HIT = 6;
const GROUND_Y = 0.42;
const INTAKE_RADIUS = 3.2;
const FALL_GRAVITY = 17;
const BASE_STREAM_SPEED = 8;
const TOWER_HALF_EXTENT = 5.35;
const FLOW_CLEARANCE = 0.45;
const FLOW_PROBE_DISTANCE = 1.4;
const POOL_AFTER_BLOCKED_SECONDS = 0.35;
const POOL_RETRY_SECONDS = 0.18;

const SPILL_OFFSETS = [
	new Vector3(-0.8, 0.4, -0.4),
	new Vector3(0.7, 0.8, -0.2),
	new Vector3(-0.3, 1.0, 0.7),
	new Vector3(0.9, 0.5, 0.6),
	new Vector3(-1.0, 0.7, 0.3),
	new Vector3(0.2, 1.2, -0.9)
];

let activeScene: Scene | undefined;
let flowMaterial: StandardMaterial | undefined;
let updateRegistered = false;
let packetIndex = 0;
const packets: EnergyFlowPacket[] = [];

function energyFlowPrototypeEnabled(): boolean {
	return (
		typeof window !== "undefined" &&
		window.location.search.indexOf("energyFlow=1") !== -1
	);
}

function packetScale(value: number): number {
	return Math.max(0.7, Math.min(1.6, 0.55 + Math.sqrt(value) / 18));
}

function resizePacket(packet: EnergyFlowPacket): void {
	const scale = packetScale(packet.value);
	packet.mesh.scaling = new Vector3(scale, scale * 0.72, scale);
}

function setPoolingScale(packet: EnergyFlowPacket): void {
	const scale = packetScale(packet.value);
	packet.mesh.scaling = new Vector3(scale * 1.35, scale * 0.34, scale * 1.35);
}

function getFlowMaterial(scene: Scene): StandardMaterial {
	if (flowMaterial === undefined) {
		flowMaterial = new StandardMaterial("energyFlowPrototypeMaterial", scene);
		flowMaterial.diffuseColor = new Color3(0.1, 0.76, 0.93);
		flowMaterial.emissiveColor = new Color3(0.04, 0.36, 0.46);
		flowMaterial.specularColor = new Color3(0.15, 0.9, 1);
		flowMaterial.alpha = 0.9;
	}
	return flowMaterial;
}

function clearPackets(): void {
	while (packets.length > 0) {
		const packet = packets.pop() as EnergyFlowPacket;
		packet.mesh.dispose();
	}
}

function inTransitEnergy(): number {
	let value = 0;
	packets.forEach(packet => {
		value += packet.value;
	});
	return value;
}

function prototypeStats() {
	let poolingPackets = 0;
	let blockedEnergy = 0;
	let routeChanges = 0;
	packets.forEach(packet => {
		if (packet.phase === "pooling") {
			poolingPackets += 1;
			blockedEnergy += packet.value;
		}
		routeChanges += packet.routeChanges;
	});

	return {
		activePackets: packets.length,
		inTransitEnergy: inTransitEnergy(),
		poolingPackets,
		blockedEnergy,
		routeChanges
	};
}

function ensureScene(scene: Scene): void {
	if (activeScene !== scene) {
		if (activeScene !== undefined && updateRegistered) {
			activeScene.unregisterBeforeRender(updateEnergyFlow);
		}
		clearPackets();
		activeScene = scene;
		flowMaterial = undefined;
		updateRegistered = false;
	}

	if (!updateRegistered) {
		scene.registerBeforeRender(updateEnergyFlow);
		updateRegistered = true;
	}

	if (typeof window !== "undefined") {
		(window as any).__defendEnergyFlowPrototype = {
			stats: prototypeStats
		};
	}
}

function nearestPacket(position: Vector3): EnergyFlowPacket | undefined {
	let nearest: EnergyFlowPacket | undefined;
	let nearestDistance = Number.MAX_VALUE;

	packets.forEach(packet => {
		const dx = packet.mesh.position.x - position.x;
		const dz = packet.mesh.position.z - position.z;
		const distance = dx * dx + dz * dz;
		if (distance < nearestDistance) {
			nearestDistance = distance;
			nearest = packet;
		}
	});

	return nearest;
}

function mergeIntoExistingPacket(position: Vector3, value: number): void {
	const packet = nearestPacket(position);
	if (packet !== undefined) {
		packet.value += value;
		if (packet.phase === "pooling") {
			setPoolingScale(packet);
		} else {
			resizePacket(packet);
		}
	}
}

function createPacket(
	scene: Scene,
	origin: Vector3,
	value: number,
	index: number
): void {
	const mesh = MeshBuilder.CreateSphere(
		`energyFlowPrototype${packetIndex}`,
		{
			diameter: 0.9,
			segments: 4,
			updatable: false
		},
		scene
	) as Mesh;
	packetIndex += 1;

	const offset = SPILL_OFFSETS[index % SPILL_OFFSETS.length];
	mesh.position = origin.clone();
	mesh.position.x += offset.x;
	mesh.position.y += offset.y;
	mesh.position.z += offset.z;
	mesh.material = getFlowMaterial(scene);
	mesh.isPickable = false;

	const packet: EnergyFlowPacket = {
		value,
		mesh,
		phase: "falling",
		verticalVelocity: 2.5 + (index % 3) * 0.8,
		age: 0,
		wobble: index * 1.7,
		blockedSeconds: 0,
		routeChanges: 0
	};
	resizePacket(packet);
	packets.push(packet);
}

function spawnRecoveredEnergy(
	scene: Scene,
	origin: Vector3,
	value: number
): void {
	if (value <= 0) {
		return;
	}

	ensureScene(scene);

	const availableCapacity = Math.max(
		0,
		economyGlobals.maxBalance -
			economyGlobals.currentBalance -
			inTransitEnergy()
	);
	const acceptedValue = Math.min(value, availableCapacity);
	if (acceptedValue <= 0) {
		return;
	}

	const availableSlots = MAX_ACTIVE_PACKETS - packets.length;
	if (availableSlots <= 0) {
		mergeIntoExistingPacket(origin, acceptedValue);
		return;
	}

	const desiredPackets = Math.max(
		MIN_PACKETS_PER_HIT,
		Math.min(MAX_PACKETS_PER_HIT, Math.ceil(acceptedValue / 150))
	);
	const packetCount = Math.min(desiredPackets, availableSlots);
	const valuePerPacket = acceptedValue / packetCount;
	let remainingValue = acceptedValue;

	for (let index = 0; index < packetCount; index += 1) {
		const packetValue =
			index === packetCount - 1 ? remainingValue : valuePerPacket;
		remainingValue -= packetValue;
		createPacket(scene, origin, packetValue, index);
	}
}

function collectPacket(packet: EnergyFlowPacket): void {
	economyGlobals.currentBalance = Math.min(
		economyGlobals.maxBalance,
		economyGlobals.currentBalance + packet.value
	);
	packet.mesh.dispose();
}

function updateFallingPacket(packet: EnergyFlowPacket, deltaSeconds: number): void {
	packet.verticalVelocity -= FALL_GRAVITY * deltaSeconds;
	packet.mesh.position.y += packet.verticalVelocity * deltaSeconds;
	packet.mesh.position.x += Math.sin(packet.age * 4 + packet.wobble) * deltaSeconds * 0.8;
	packet.mesh.position.z += Math.cos(packet.age * 3 + packet.wobble) * deltaSeconds * 0.8;

	if (packet.mesh.position.y <= GROUND_Y) {
		packet.mesh.position.y = GROUND_Y;
		packet.verticalVelocity = 0;
		packet.phase = "streaming";
		packet.mesh.scaling.y *= 0.72;
	}
}

function flowObstacles(scene: Scene): FlowObstacle[] {
	const obstacles: FlowObstacle[] = [];
	scene.getMeshesByTags("towerBase", towerBaseMesh => {
		obstacles.push({
			x: towerBaseMesh.position.x,
			z: towerBaseMesh.position.z,
			halfExtent: TOWER_HALF_EXTENT + FLOW_CLEARANCE
		});
	});
	return obstacles;
}

function containingObstacle(
	x: number,
	z: number,
	obstacles: FlowObstacle[]
): FlowObstacle | undefined {
	for (let index = 0; index < obstacles.length; index += 1) {
		const obstacle = obstacles[index];
		if (
			Math.abs(x - obstacle.x) <= obstacle.halfExtent &&
			Math.abs(z - obstacle.z) <= obstacle.halfExtent
		) {
			return obstacle;
		}
	}
	return undefined;
}

function pointIsBlocked(x: number, z: number, obstacles: FlowObstacle[]): boolean {
	return containingObstacle(x, z, obstacles) !== undefined;
}

function normalizedDirection(dx: number, dz: number): { x: number; z: number } {
	const length = Math.sqrt(dx * dx + dz * dz);
	if (length <= 0.0001) {
		return { x: 0, z: 0 };
	}
	return { x: dx / length, z: dz / length };
}

function rotateDirection(
	direction: { x: number; z: number },
	cosine: number,
	sine: number
): { x: number; z: number } {
	return {
		x: direction.x * cosine - direction.z * sine,
		z: direction.x * sine + direction.z * cosine
	};
}

function candidateIsOpen(
	packet: EnergyFlowPacket,
	direction: { x: number; z: number },
	obstacles: FlowObstacle[]
): boolean {
	return !pointIsBlocked(
		packet.mesh.position.x + direction.x * FLOW_PROBE_DISTANCE,
		packet.mesh.position.z + direction.z * FLOW_PROBE_DISTANCE,
		obstacles
	);
}

function escapeObstacleDirection(
	packet: EnergyFlowPacket,
	obstacles: FlowObstacle[]
): { x: number; z: number } | undefined {
	const obstacle = containingObstacle(
		packet.mesh.position.x,
		packet.mesh.position.z,
		obstacles
	);
	if (obstacle === undefined) {
		return undefined;
	}

	let direction = normalizedDirection(
		packet.mesh.position.x - obstacle.x,
		packet.mesh.position.z - obstacle.z
	);
	if (direction.x === 0 && direction.z === 0) {
		direction = {
			x: Math.cos(packet.wobble),
			z: Math.sin(packet.wobble)
		};
	}
	return direction;
}

function surfaceFlowDirection(
	packet: EnergyFlowPacket,
	target: Vector3,
	obstacles: FlowObstacle[]
): { x: number; z: number } | undefined {
	const escapeDirection = escapeObstacleDirection(packet, obstacles);
	if (escapeDirection !== undefined) {
		return escapeDirection;
	}

	const direct = normalizedDirection(
		target.x - packet.mesh.position.x,
		target.z - packet.mesh.position.z
	);
	if (direct.x === 0 && direct.z === 0) {
		return direct;
	}

	const candidates = [
		direct,
		rotateDirection(direct, 0.70710678, 0.70710678),
		rotateDirection(direct, 0.70710678, -0.70710678),
		rotateDirection(direct, 0, 1),
		rotateDirection(direct, 0, -1)
	];

	const preferLeft = Math.sin(packet.wobble) >= 0;
	if (!preferLeft) {
		const swap = candidates[1];
		candidates[1] = candidates[2];
		candidates[2] = swap;
		const sideSwap = candidates[3];
		candidates[3] = candidates[4];
		candidates[4] = sideSwap;
	}

	for (let index = 0; index < candidates.length; index += 1) {
		if (candidateIsOpen(packet, candidates[index], obstacles)) {
			if (index > 0) {
				packet.routeChanges += 1;
			}
			return candidates[index];
		}
	}

	return undefined;
}

function updateSurfacePacket(
	packet: EnergyFlowPacket,
	deltaSeconds: number,
	obstacles: FlowObstacle[]
): boolean {
	const target = economyGlobals.currencyMesh.position;
	const dx = target.x - packet.mesh.position.x;
	const dz = target.z - packet.mesh.position.z;
	const distance = Math.sqrt(dx * dx + dz * dz);

	if (distance <= INTAKE_RADIUS) {
		collectPacket(packet);
		return true;
	}

	if (
		packet.phase === "pooling" &&
		packet.blockedSeconds < POOL_RETRY_SECONDS
	) {
		packet.blockedSeconds += deltaSeconds;
		packet.mesh.position.y = GROUND_Y + Math.sin(packet.age * 2 + packet.wobble) * 0.025;
		return false;
	}

	const direction = surfaceFlowDirection(packet, target, obstacles);
	if (direction === undefined) {
		packet.blockedSeconds += deltaSeconds;
		if (packet.blockedSeconds >= POOL_AFTER_BLOCKED_SECONDS) {
			packet.phase = "pooling";
			setPoolingScale(packet);
			packet.blockedSeconds = 0;
		}
		return false;
	}

	if (packet.phase === "pooling") {
		packet.phase = "streaming";
		resizePacket(packet);
	}
	packet.blockedSeconds = 0;

	const speed = BASE_STREAM_SPEED + Math.min(14, distance * 0.1);
	const step = Math.min(distance, speed * deltaSeconds);
	const nextX = packet.mesh.position.x + direction.x * step;
	const nextZ = packet.mesh.position.z + direction.z * step;

	if (!pointIsBlocked(nextX, nextZ, obstacles)) {
		packet.mesh.position.x = nextX;
		packet.mesh.position.z = nextZ;
	}
	packet.mesh.position.y =
		GROUND_Y + Math.sin(packet.age * 5 + packet.wobble) * 0.07;

	const stretch = 1 + Math.min(0.8, speed / 30);
	packet.mesh.scaling.z = Math.max(packet.mesh.scaling.x, stretch);
	return false;
}

function updateEnergyFlow(): void {
	if (activeScene === undefined || packets.length === 0) {
		return;
	}

	const deltaSeconds = Math.min(
		0.05,
		activeScene.getEngine().getDeltaTime() / 1000
	);
	const obstacles = flowObstacles(activeScene);

	for (let index = packets.length - 1; index >= 0; index -= 1) {
		const packet = packets[index];
		packet.age += deltaSeconds;

		if (packet.phase === "falling") {
			updateFallingPacket(packet, deltaSeconds);
		} else if (updateSurfacePacket(packet, deltaSeconds, obstacles)) {
			packets.splice(index, 1);
		}
	}
}

export {
	energyFlowPrototypeEnabled,
	prototypeStats,
	spawnRecoveredEnergy
};
