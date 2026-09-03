export interface TerrainDeformationCalibration {
	maxDepth: number;
	minFootprintRadius: number;
	maxFootprintRadius: number;
	energyForMaxDepth: number;
	energyForMaxRadius: number;
	baseRecoveryHalfLifeMs: number;
	minimumRecoveryHalfLifeMs: number;
	diffusionPerSecond: number;
	maxSupportSpeed: number;
}

export interface TerrainImpact {
	effectiveMass: number;
	normalSpeed: number;
	bodyRadius: number;
	compliance: number;
	stabilization: number;
}

export interface TerrainImpactProfile {
	energy: number;
	depth: number;
	footprintRadius: number;
}

const LN2 = Math.log(2);

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, value));
}

function positive(value: number): number {
	return Math.max(0, value);
}

/**
 * Kinetic energy normal to the terrain. This is intentionally the same
 * physically meaningful scalar used by the acoustic work so terrain and sound
 * can react to one collision description without becoming coupled systems.
 */
export function terrainImpactEnergy(
	effectiveMass: number,
	normalSpeed: number
): number {
	return 0.5 * positive(effectiveMass) * Math.pow(positive(normalSpeed), 2);
}

/**
 * Produce a bounded deformation profile. Energy increases depth only through a
 * saturating tanh response while body size and energy primarily broaden the
 * affected footprint. Structural stabilization reduces depth without changing
 * the incoming collision energy.
 */
export function terrainImpactProfile(
	impact: TerrainImpact,
	calibration: TerrainDeformationCalibration
): TerrainImpactProfile {
	const energy = terrainImpactEnergy(impact.effectiveMass, impact.normalSpeed);
	const compliance = positive(impact.compliance);
	const stabilization = clamp(impact.stabilization, 0, 1);
	const depthEnergyScale = Math.max(1, calibration.energyForMaxDepth);
	const radiusEnergyScale = Math.max(1, calibration.energyForMaxRadius);
	const normalizedDepthEnergy = (energy * compliance) / depthEnergyScale;
	const normalizedRadiusEnergy = Math.log(1 + energy / radiusEnergyScale);
	const depth =
		positive(calibration.maxDepth) *
		Math.tanh(normalizedDepthEnergy) *
		(1 - stabilization);
	const baseRadius = Math.max(
		positive(calibration.minFootprintRadius),
		positive(impact.bodyRadius)
	);
	const radius = baseRadius * (1 + normalizedRadiusEnergy);

	return {
		energy,
		depth: clamp(depth, 0, positive(calibration.maxDepth)),
		footprintRadius: clamp(
			radius,
			positive(calibration.minFootprintRadius),
			Math.max(
				positive(calibration.minFootprintRadius),
				positive(calibration.maxFootprintRadius)
			)
		)
	};
}

/**
 * Smooth radial depression kernel. Returns a positive depth contribution; the
 * caller may store ground displacement as a negative height if desired.
 */
export function radialDeformationDepth(
	distanceFromImpact: number,
	profile: TerrainImpactProfile
): number {
	const radius = Math.max(0.0001, profile.footprintRadius);
	const distance = positive(distanceFromImpact);
	if (distance >= radius) {
		return 0;
	}

	const normalizedDistance = distance / radius;
	const smooth = 1 - normalizedDistance * normalizedDistance;
	return profile.depth * smooth * smooth;
}

/**
 * Accumulate a new depression while respecting the global depth cap. Existing
 * displacement is represented as a positive depression depth.
 */
export function accumulateDepression(
	currentDepth: number,
	addedDepth: number,
	maxDepth: number
): number {
	const limit = positive(maxDepth);
	if (limit === 0) {
		return 0;
	}

	const current = clamp(currentDepth, 0, limit);
	const remaining = limit - current;
	const addition = positive(addedDepth);
	const diminishingAddition = remaining * (1 - Math.exp(-addition / limit));
	return clamp(current + diminishingAddition, 0, limit);
}

/**
 * Foundation influence. The result is 0 outside the stabilization radius and
 * approaches strength at the structure center with a smooth falloff.
 */
export function structuralStabilization(
	distanceFromStructure: number,
	stabilizationRadius: number,
	strength: number
): number {
	const radius = positive(stabilizationRadius);
	if (radius === 0 || distanceFromStructure >= radius) {
		return 0;
	}

	const normalizedDistance = positive(distanceFromStructure) / radius;
	const smooth = 1 - normalizedDistance * normalizedDistance;
	return clamp(strength, 0, 1) * smooth * smooth;
}

/**
 * Frame-rate independent recovery toward baseline. Stabilization shortens the
 * half-life but never below the configured minimum.
 */
export function relaxDepression(
	currentDepth: number,
	deltaTimeMs: number,
	stabilization: number,
	calibration: TerrainDeformationCalibration
): number {
	const baseHalfLife = Math.max(1, calibration.baseRecoveryHalfLifeMs);
	const minimumHalfLife = Math.max(
		1,
		Math.min(baseHalfLife, calibration.minimumRecoveryHalfLifeMs)
	);
	const stabilizedHalfLife =
		baseHalfLife -
		(baseHalfLife - minimumHalfLife) * clamp(stabilization, 0, 1);
	const decay = Math.exp(
		(-LN2 * positive(deltaTimeMs)) / Math.max(1, stabilizedHalfLife)
	);
	return positive(currentDepth) * decay;
}

/**
 * Diffuse a sample toward the mean of its neighboring terrain samples. A hex
 * field can pass the average of its six neighbors; another topology can use the
 * same semantic function without changing the deformation model.
 */
export function diffuseDepression(
	currentDepth: number,
	neighborAverageDepth: number,
	deltaTimeMs: number,
	stabilization: number,
	calibration: TerrainDeformationCalibration
): number {
	const rate =
		positive(calibration.diffusionPerSecond) *
		(1 + clamp(stabilization, 0, 1));
	const blend = 1 - Math.exp(-rate * positive(deltaTimeMs) / 1000);
	return Math.max(
		0,
		currentDepth + (positive(neighborAverageDepth) - currentDepth) * blend
	);
}

/**
 * Damped support-height follower for towers, walls, the core and camera target.
 * This does not move anything laterally and caps vertical speed so a single
 * impact cannot produce a visible snap.
 */
export function settleSupportHeight(
	currentHeight: number,
	targetHeight: number,
	deltaTimeMs: number,
	halfLifeMs: number,
	maxSpeed: number
): number {
	const dtSeconds = positive(deltaTimeMs) / 1000;
	if (dtSeconds === 0) {
		return currentHeight;
	}

	const halfLife = Math.max(1, halfLifeMs);
	const blend = 1 - Math.exp((-LN2 * positive(deltaTimeMs)) / halfLife);
	const desiredChange = (targetHeight - currentHeight) * blend;
	const maximumChange = positive(maxSpeed) * dtSeconds;
	const appliedChange = clamp(desiredChange, -maximumChange, maximumChange);
	return currentHeight + appliedChange;
}
