export type AcousticMaterialId =
	| "tower"
	| "projectile"
	| "enemy"
	| "ground"
	| "energy"
	| "fragment";

export interface AcousticMaterial {
	id: AcousticMaterialId;
	density: number;
	stiffness: number;
	damping: number;
	roughness: number;
	brightness: number;
	noise: number;
	saturation: number;
	modeRatios: number[];
}

interface AcousticMaterialBlend {
	density: number;
	stiffness: number;
	damping: number;
	roughness: number;
	brightness: number;
	noise: number;
	saturation: number;
	modeRatios: number[];
}

export interface AcousticVector3 {
	x: number;
	y: number;
	z: number;
}

export interface AcousticContact {
	position: AcousticVector3;
	normal: AcousticVector3;
	/** Signed or absolute relative speed along the contact normal. */
	normalSpeed: number;
	tangentialSpeed: number;
	angularSpeed: number;
	effectiveMass: number;
	bodyScale: number;
	materialA: AcousticMaterialId;
	materialB: AcousticMaterialId;
	damageEnergy: number;
	seed: number;
}

export interface AcousticCalibration {
	referenceImpactEnergy: number;
	referenceSpeed: number;
	referenceBodyScale: number;
	referenceFrequencyHz: number;
	referenceDecaySeconds: number;
}

export interface AcousticExcitation {
	position: AcousticVector3;
	impactEnergy: number;
	normalizedEnergy: number;
	damageEnergy: number;
	normalizedDamageEnergy: number;
	fundamentalHz: number;
	decaySeconds: number;
	brightness: number;
	noiseMix: number;
	scrapeMix: number;
	saturation: number;
	modeRatios: number[];
	seed: number;
}

export const acousticMaterials: { [key: string]: AcousticMaterial } = {
	tower: {
		id: "tower",
		density: 0.9,
		stiffness: 0.85,
		damping: 0.35,
		roughness: 0.35,
		brightness: 0.65,
		noise: 0.2,
		saturation: 0.25,
		modeRatios: [1, 1.61, 2.37, 3.91]
	},
	projectile: {
		id: "projectile",
		density: 1,
		stiffness: 1,
		damping: 0.2,
		roughness: 0.15,
		brightness: 0.95,
		noise: 0.15,
		saturation: 0.45,
		modeRatios: [1, 2.08, 3.23, 5.17]
	},
	enemy: {
		id: "enemy",
		density: 0.75,
		stiffness: 0.62,
		damping: 0.25,
		roughness: 0.2,
		brightness: 0.6,
		noise: 0.3,
		saturation: 0.35,
		modeRatios: [1, 1.42, 2.09, 3.16]
	},
	ground: {
		id: "ground",
		density: 1,
		stiffness: 0.95,
		damping: 0.55,
		roughness: 0.7,
		brightness: 0.45,
		noise: 0.45,
		saturation: 0.15,
		modeRatios: [1, 1.3, 1.92, 2.84]
	},
	energy: {
		id: "energy",
		density: 0.55,
		stiffness: 0.78,
		damping: 0.18,
		roughness: 0.05,
		brightness: 1,
		noise: 0.08,
		saturation: 0.55,
		modeRatios: [1, 1.5, 2.5, 4]
	},
	fragment: {
		id: "fragment",
		density: 0.7,
		stiffness: 0.7,
		damping: 0.45,
		roughness: 0.55,
		brightness: 0.75,
		noise: 0.55,
		saturation: 0.25,
		modeRatios: [1, 1.73, 2.68, 4.11]
	}
};

const MAX_ACOUSTIC_SCALAR = 1e100;

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_ACOUSTIC_SCALAR) {
		return MAX_ACOUSTIC_SCALAR;
	}
	if (value < -MAX_ACOUSTIC_SCALAR) {
		return -MAX_ACOUSTIC_SCALAR;
	}
	return value;
}

function positive(value: number): number {
	return Math.max(0, finiteScalar(value));
}

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, finiteScalar(value)));
}

function average(a: number, b: number): number {
	return finiteScalar((finiteScalar(a) + finiteScalar(b)) / 2);
}

function finitePosition(position: AcousticVector3): AcousticVector3 {
	return {
		x: finiteScalar(position.x),
		y: finiteScalar(position.y),
		z: finiteScalar(position.z)
	};
}

/**
 * Blend two semantic materials without inventing a third material identity.
 *
 * Material A/B ordering is physics-engine bookkeeping and must not change the
 * resulting timbre. The pair is therefore canonicalized by material id before
 * mode lists are combined. Equal-material contacts keep one mode list instead
 * of duplicating identical resonators.
 */
function materialPair(
	materialA: AcousticMaterialId,
	materialB: AcousticMaterialId
): AcousticMaterialBlend {
	const firstId = materialA <= materialB ? materialA : materialB;
	const secondId = materialA <= materialB ? materialB : materialA;
	const first = acousticMaterials[firstId];
	const second = acousticMaterials[secondId];
	const modeRatios =
		firstId === secondId
			? first.modeRatios.slice()
			: first.modeRatios.concat(second.modeRatios);

	return {
		density: average(first.density, second.density),
		stiffness: average(first.stiffness, second.stiffness),
		damping: average(first.damping, second.damping),
		roughness: average(first.roughness, second.roughness),
		brightness: average(first.brightness, second.brightness),
		noise: average(first.noise, second.noise),
		saturation: average(first.saturation, second.saturation),
		modeRatios
	};
}

/**
 * Kinetic energy normal to the contact. `normalSpeed` may be signed or already
 * absolute; using its magnitude keeps this scalar aligned with #59 terrain
 * impact energy so both systems can consume one physical collision description.
 */
export function impactEnergy(contact: AcousticContact): number {
	const mass = positive(contact.effectiveMass);
	const speed = Math.abs(finiteScalar(contact.normalSpeed));
	return positive(finiteScalar(0.5 * mass * Math.pow(speed, 2)));
}

export function deriveAcousticExcitation(
	contact: AcousticContact,
	calibration: AcousticCalibration
): AcousticExcitation {
	const pair = materialPair(contact.materialA, contact.materialB);
	const energy = impactEnergy(contact);
	const damageEnergy = positive(contact.damageEnergy);
	const referenceImpactEnergy = Math.max(
		positive(calibration.referenceImpactEnergy),
		0.000001
	);
	const referenceSpeed = Math.max(
		positive(calibration.referenceSpeed),
		0.000001
	);
	const referenceBodyScale = Math.max(
		positive(calibration.referenceBodyScale),
		0.000001
	);
	const normalizedEnergy = clamp01(energy / referenceImpactEnergy);
	const normalizedDamageEnergy = clamp01(damageEnergy / referenceImpactEnergy);
	const speedRatio = clamp01(
		Math.abs(finiteScalar(contact.normalSpeed)) / referenceSpeed
	);
	const scaleRatio = Math.max(
		positive(contact.bodyScale) / referenceBodyScale,
		0.1
	);
	const materialPitch = Math.sqrt(
		Math.max(pair.stiffness, 0.000001) / Math.max(pair.density, 0.000001)
	);
	const tangentialRatio = clamp01(
		Math.abs(finiteScalar(contact.tangentialSpeed)) / referenceSpeed
	);
	const angularRatio = clamp01(
		Math.abs(finiteScalar(contact.angularSpeed)) * positive(contact.bodyScale) /
			referenceSpeed
	);
	const fundamentalHz = positive(
		finiteScalar(
			positive(calibration.referenceFrequencyHz) * materialPitch / scaleRatio
		)
	);
	const decaySeconds = positive(
		finiteScalar(
			positive(calibration.referenceDecaySeconds) * (0.15 + 1 - pair.damping)
		)
	);

	return {
		position: finitePosition(contact.position),
		impactEnergy: energy,
		normalizedEnergy,
		damageEnergy,
		normalizedDamageEnergy,
		fundamentalHz,
		decaySeconds,
		brightness: clamp01(pair.brightness * (0.5 + speedRatio * 0.5)),
		noiseMix: clamp01(
			pair.noise * normalizedEnergy + pair.roughness * tangentialRatio
		),
		scrapeMix: clamp01(
			pair.roughness * Math.max(tangentialRatio, angularRatio)
		),
		saturation: clamp01(pair.saturation * normalizedEnergy),
		modeRatios: pair.modeRatios.slice(),
		seed: finiteScalar(contact.seed)
	};
}
