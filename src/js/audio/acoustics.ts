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

export interface AcousticVector3 {
	x: number;
	y: number;
	z: number;
}

export interface AcousticContact {
	position: AcousticVector3;
	normal: AcousticVector3;
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

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, value));
}

function average(a: number, b: number): number {
	return (a + b) / 2;
}

function materialPair(
	materialA: AcousticMaterialId,
	materialB: AcousticMaterialId
): AcousticMaterial {
	const a = acousticMaterials[materialA];
	const b = acousticMaterials[materialB];
	return {
		id: a.id,
		density: average(a.density, b.density),
		stiffness: average(a.stiffness, b.stiffness),
		damping: average(a.damping, b.damping),
		roughness: average(a.roughness, b.roughness),
		brightness: average(a.brightness, b.brightness),
		noise: average(a.noise, b.noise),
		saturation: average(a.saturation, b.saturation),
		modeRatios: a.modeRatios.concat(b.modeRatios)
	};
}

export function impactEnergy(contact: AcousticContact): number {
	return 0.5 * Math.max(0, contact.effectiveMass) *
		Math.pow(Math.max(0, contact.normalSpeed), 2);
}

export function deriveAcousticExcitation(
	contact: AcousticContact,
	calibration: AcousticCalibration
): AcousticExcitation {
	const pair = materialPair(contact.materialA, contact.materialB);
	const energy = impactEnergy(contact);
	const normalizedEnergy = clamp01(
		energy / Math.max(calibration.referenceImpactEnergy, 0.000001)
	);
	const speedRatio = clamp01(
		contact.normalSpeed / Math.max(calibration.referenceSpeed, 0.000001)
	);
	const scaleRatio = Math.max(
		contact.bodyScale / Math.max(calibration.referenceBodyScale, 0.000001),
		0.1
	);
	const materialPitch = Math.sqrt(
		Math.max(pair.stiffness, 0.000001) / Math.max(pair.density, 0.000001)
	);
	const tangentialRatio = clamp01(
		contact.tangentialSpeed / Math.max(calibration.referenceSpeed, 0.000001)
	);
	const angularRatio = clamp01(
		contact.angularSpeed * contact.bodyScale /
		Math.max(calibration.referenceSpeed, 0.000001)
	);

	return {
		position: contact.position,
		impactEnergy: energy,
		normalizedEnergy,
		fundamentalHz:
			calibration.referenceFrequencyHz * materialPitch / scaleRatio,
		decaySeconds:
			calibration.referenceDecaySeconds * (0.15 + 1 - pair.damping),
		brightness: clamp01(pair.brightness * (0.5 + speedRatio * 0.5)),
		noiseMix: clamp01(pair.noise * normalizedEnergy + pair.roughness * tangentialRatio),
		scrapeMix: clamp01(pair.roughness * Math.max(tangentialRatio, angularRatio)),
		saturation: clamp01(pair.saturation * normalizedEnergy),
		modeRatios: pair.modeRatios,
		seed: contact.seed
	};
}
