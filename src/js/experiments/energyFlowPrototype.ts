import {
	Color3,
	Mesh,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3
} from "babylonjs";
import { economyGlobals } from "../main/globalVariables";

type EnergyFlowPhase = "falling" | "streaming";

interface EnergyFlowPacket {
	value: number;
	mesh: Mesh;
	phase: EnergyFlowPhase;
	verticalVelocity: number;
	age: number;
	wobble: number;
}

const MAX_ACTIVE_PACKETS = 64;
const MIN_PACKETS_PER_HIT = 3;
const MAX_PACKETS_PER_HIT = 6;
const GROUND_Y = 0.42;
const INTAKE_RADIUS = 3.2;
const FALL_GRAVITY = 17;
const BASE_STREAM_SPEED = 8;

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

function prototypeStats() {
	let inTransitEnergy = 0;
	packets.forEach(packet => {
		inTransitEnergy += packet.value;
	});
	return {
		activePackets: packets.length,
		inTransitEnergy
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
		resizePacket(packet);
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
		wobble: index * 1.7
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

	const availableSlots = MAX_ACTIVE_PACKETS - packets.length;
	if (availableSlots <= 0) {
		mergeIntoExistingPacket(origin, value);
		return;
	}

	const desiredPackets = Math.max(
		MIN_PACKETS_PER_HIT,
		Math.min(MAX_PACKETS_PER_HIT, Math.ceil(value / 150))
	);
	const packetCount = Math.min(desiredPackets, availableSlots);
	const valuePerPacket = value / packetCount;
	let remainingValue = value;

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

function updateStreamingPacket(
	packet: EnergyFlowPacket,
	deltaSeconds: number
): boolean {
	const target = economyGlobals.currencyMesh.position;
	const dx = target.x - packet.mesh.position.x;
	const dz = target.z - packet.mesh.position.z;
	const distance = Math.sqrt(dx * dx + dz * dz);

	if (distance <= INTAKE_RADIUS) {
		collectPacket(packet);
		return true;
	}

	const speed = BASE_STREAM_SPEED + Math.min(14, distance * 0.1);
	const step = Math.min(distance, speed * deltaSeconds);
	packet.mesh.position.x += (dx / distance) * step;
	packet.mesh.position.z += (dz / distance) * step;
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

	for (let index = packets.length - 1; index >= 0; index -= 1) {
		const packet = packets[index];
		packet.age += deltaSeconds;

		if (packet.phase === "falling") {
			updateFallingPacket(packet, deltaSeconds);
		} else if (updateStreamingPacket(packet, deltaSeconds)) {
			packets.splice(index, 1);
		}
	}
}

export {
	energyFlowPrototypeEnabled,
	prototypeStats,
	spawnRecoveredEnergy
};
