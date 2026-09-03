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

export interface TerrainDepthBounds {
	minimum: number;
	maximum: number;
	/** False means the supplied neighbor snapshot already violates the slope cap. */
	consistent: boolean;
}

const LN2 = Math.log(2);
const MAX_TERRAIN_SCALAR = 1e100;

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_TERRAIN_SCALAR) {
		return MAX_TERRAIN_SCALAR;
	}
	if (value < -MAX_TERRAIN_SCALAR) {
		return -MAX_TERRAIN_SCALAR;
	}
	return value;
}

function clamp(value: number, minimum: number, maximum: number): number {
	const safeValue = finiteScalar(value, minimum);
	return Math.max(minimum, Math.min(maximum, safeValue));
}

function positive(value: number): number {
	return Math.max(0, finiteScalar(value, 0));
}

/**
 * Kinetic energy normal to the terrain. normalSpeed is treated as a magnitude
 * so callers may pass either a signed contact-normal velocity or an absolute
 * speed without changing the result.
 */
export function terrainImpactEnergy(
	effectiveMass: number,
	normalSpeed: number
): number {
	const mass = positive(effectiveMass);
	const speed = Math.abs(finiteScalar(normalSpeed));
	return positive(finiteScalar(0.5 * mass * Math.pow(speed, 2)));
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
	const depthEnergyScale = Math.max(1, positive(calibration.energyForMaxDepth));
	const radiusEnergyScale = Math.max(1, positive(calibration.energyForMaxRadius));
	const normalizedDepthEnergy = positive(
		finiteScalar((energy * compliance) / depthEnergyScale)
	);
	const normalizedRadiusEnergy = positive(
		finiteScalar(Math.log(1 + energy / radiusEnergyScale))
	);
	const maximumDepth = positive(calibration.maxDepth);
	const depth = finiteScalar(
		maximumDepth * Math.tanh(normalizedDepthEnergy) * (1 - stabilization)
	);
	const minimumRadius = positive(calibration.minFootprintRadius);
	const maximumRadius = Math.max(
		minimumRadius,
		positive(calibration.maxFootprintRadius)
	);
	const baseRadius = Math.max(minimumRadius, positive(impact.bodyRadius));
	const radius = finiteScalar(baseRadius * (1 + normalizedRadiusEnergy));

	return {
		energy,
		depth: clamp(depth, 0, maximumDepth),
		footprintRadius: clamp(radius, minimumRadius, maximumRadius)
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
	const radius = Math.max(0.0001, positive(profile.footprintRadius));
	const distance = positive(distanceFromImpact);
	if (distance >= radius) {
		return 0;
	}

	const normalizedDistance = distance / radius;
	const smooth = 1 - normalizedDistance * normalizedDistance;
	return positive(finiteScalar(positive(profile.depth) * smooth * smooth));
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
	return clamp(finiteScalar(current + diminishingAddition), 0, limit);
}

/**
 * Compute the depth interval that satisfies the configured slope against a
 * snapshot of neighboring samples.
 *
 * This must be evaluated from one immutable field snapshot. Mutating a cell and
 * then feeding that result into the next neighbor would make the outcome depend
 * on neighbor iteration order, which is especially undesirable for deterministic
 * replay and six-neighbor hex updates.
 *
 * If the neighboring snapshot is already mutually inconsistent, no single value
 * can satisfy every pairwise slope constraint. In that case `consistent` is
 * false and the returned minimum/maximum preserve the conflicting bounds so the
 * caller can apply the deterministic minimax fallback in
 * `limitDepthByNeighborSlopes()` while diffusion/recovery resolves the field.
 */
export function terrainDepthBoundsFromNeighbors(
	neighborDepths: number[],
	sampleSpacing: number,
	maxSlope: number,
	maxDepth: number
): TerrainDepthBounds {
	const depthLimit = positive(maxDepth);
	const spacing = positive(sampleSpacing);
	if (depthLimit === 0) {
		return { minimum: 0, maximum: 0, consistent: true };
	}
	if (spacing === 0 || neighborDepths.length === 0) {
		return { minimum: 0, maximum: depthLimit, consistent: true };
	}

	const maximumDifference = positive(finiteScalar(spacing * positive(maxSlope)));
	let minimumAllowed = 0;
	let maximumAllowed = depthLimit;

	neighborDepths.forEach(neighborDepth => {
		const neighbor = clamp(neighborDepth, 0, depthLimit);
		minimumAllowed = Math.max(
			minimumAllowed,
			Math.max(0, neighbor - maximumDifference)
		);
		maximumAllowed = Math.min(
			maximumAllowed,
			Math.min(depthLimit, neighbor + maximumDifference)
		);
	});

	return {
		minimum: minimumAllowed,
		maximum: maximumAllowed,
		consistent: minimumAllowed <= maximumAllowed
	};
}

/**
 * Order-independent slope limiting against all neighbors from one field
 * snapshot. For an already-inconsistent neighbor set, return the midpoint of
 * the conflicting bounds. That midpoint minimizes the worst symmetric bound
 * violation deterministically; subsequent snapshot-based diffusion/slope passes
 * can then converge without depending on neighbor iteration order.
 */
export function limitDepthByNeighborSlopes(
	currentDepth: number,
	neighborDepths: number[],
	sampleSpacing: number,
	maxSlope: number,
	maxDepth: number
): number {
	const depthLimit = positive(maxDepth);
	const current = clamp(currentDepth, 0, depthLimit);
	const bounds = terrainDepthBoundsFromNeighbors(
		neighborDepths,
		sampleSpacing,
		maxSlope,
		depthLimit
	);

	if (bounds.consistent) {
		return clamp(current, bounds.minimum, bounds.maximum);
	}

	return clamp(
		finiteScalar((bounds.minimum + bounds.maximum) / 2),
		0,
		depthLimit
	);
}

/**
 * Pairwise compatibility helper. Field implementations should prefer
 * `limitDepthByNeighborSlopes()` so all neighbor constraints are evaluated from
 * one immutable snapshot rather than sequential mutation order.
 */
export function limitDepthBySlope(
	currentDepth: number,
	neighborDepth: number,
	sampleSpacing: number,
	maxSlope: number,
	maxDepth: number
): number {
	return limitDepthByNeighborSlopes(
		currentDepth,
		[neighborDepth],
		sampleSpacing,
		maxSlope,
		maxDepth
	);
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
	const distance = positive(distanceFromStructure);
	if (radius === 0 || distance >= radius) {
		return 0;
	}

	const normalizedDistance = distance / radius;
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
	const baseHalfLife = Math.max(1, positive(calibration.baseRecoveryHalfLifeMs));
	const minimumHalfLife = Math.max(
		1,
		Math.min(baseHalfLife, positive(calibration.minimumRecoveryHalfLifeMs))
	);
	const stabilizedHalfLife =
		baseHalfLife -
		(baseHalfLife - minimumHalfLife) * clamp(stabilization, 0, 1);
	const decay = Math.exp(
		(-LN2 * positive(deltaTimeMs)) / Math.max(1, stabilizedHalfLife)
	);
	return positive(finiteScalar(positive(currentDepth) * decay));
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
	const current = positive(currentDepth);
	const neighborAverage = positive(neighborAverageDepth);
	const rate =
		positive(calibration.diffusionPerSecond) *
		(1 + clamp(stabilization, 0, 1));
	const blend = clamp(
		1 - Math.exp(-rate * positive(deltaTimeMs) / 1000),
		0,
		1
	);
	return positive(
		finiteScalar(current + (neighborAverage - current) * blend)
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
	const current = finiteScalar(currentHeight);
	const target = finiteScalar(targetHeight, current);
	const dtMs = positive(deltaTimeMs);
	const dtSeconds = dtMs / 1000;
	if (dtSeconds === 0) {
		return current;
	}

	const halfLife = Math.max(1, positive(halfLifeMs));
	const blend = clamp(1 - Math.exp((-LN2 * dtMs) / halfLife), 0, 1);
	const desiredChange = finiteScalar((target - current) * blend);
	const maximumChange = positive(finiteScalar(positive(maxSpeed) * dtSeconds));
	const appliedChange = clamp(desiredChange, -maximumChange, maximumChange);
	return finiteScalar(current + appliedChange, current);
}

/**
 * Calibration-aware support follower. This prevents `maxSupportSpeed` from
 * becoming a disconnected configuration value while retaining the generic
 * `settleSupportHeight()` primitive for fixtures that need an explicit cap.
 */
export function settleCalibratedSupportHeight(
	currentHeight: number,
	targetHeight: number,
	deltaTimeMs: number,
	halfLifeMs: number,
	calibration: TerrainDeformationCalibration
): number {
	return settleSupportHeight(
		currentHeight,
		targetHeight,
		deltaTimeMs,
		halfLifeMs,
		calibration.maxSupportSpeed
	);
}
