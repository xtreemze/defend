export interface SpatialVector3 {
	x: number;
	y: number;
	z: number;
}

export interface SpatialAudioObjectState {
	id: string;
	kind: string;
	position: SpatialVector3;
	velocity: SpatialVector3;
	orientation: SpatialVector3;
	angularVelocity?: SpatialVector3;
	radius: number;
	baseGain: number;
	excitationEnergy: number;
	threat: number;
	continuity: number;
	seed: number;
	sustained: boolean;
}

export interface SpatialListenerState {
	position: SpatialVector3;
	velocity: SpatialVector3;
	forward: SpatialVector3;
	up: SpatialVector3;
	focusPosition?: SpatialVector3;
}

export interface SpatialAudioCalibration {
	speedOfSound: number;
	maxRadialFractionOfSoundSpeed: number;
	minDopplerRatio: number;
	maxDopplerRatio: number;
	referenceDistance: number;
	rolloffExponent: number;
	airAbsorptionPerUnit: number;
	predictionHorizonSeconds: number;
	energyReference: number;
	proximityWeight: number;
	closestApproachWeight: number;
	energyWeight: number;
	threatWeight: number;
	continuityWeight: number;
}

export interface ClosestApproach {
	timeSeconds: number;
	distance: number;
}

export interface DopplerState {
	ratio: number;
	listenerTowardSource: number;
	sourceAwayFromListener: number;
}

export interface SpatialRenderHints {
	distance: number;
	closestApproach: ClosestApproach;
	doppler: DopplerState;
	distanceGain: number;
	highFrequencyRetention: number;
	priority: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, value));
}

function positive(value: number): number {
	return Math.max(0, value);
}

function subtract(a: SpatialVector3, b: SpatialVector3): SpatialVector3 {
	return {
		x: a.x - b.x,
		y: a.y - b.y,
		z: a.z - b.z
	};
}

function dot(a: SpatialVector3, b: SpatialVector3): number {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

function magnitudeSquared(vector: SpatialVector3): number {
	return dot(vector, vector);
}

function magnitude(vector: SpatialVector3): number {
	return Math.sqrt(magnitudeSquared(vector));
}

function scale(vector: SpatialVector3, amount: number): SpatialVector3 {
	return {
		x: vector.x * amount,
		y: vector.y * amount,
		z: vector.z * amount
	};
}

function normalize(vector: SpatialVector3): SpatialVector3 {
	const length = magnitude(vector);
	if (length <= 0.000001) {
		return { x: 0, y: 0, z: 0 };
	}
	return scale(vector, 1 / length);
}

export function spatialDistance(a: SpatialVector3, b: SpatialVector3): number {
	return magnitude(subtract(a, b));
}

/**
 * Predict the nearest separation between a moving source and listener over a
 * bounded future horizon. This is useful for prioritizing fast fly-bys before
 * the source is already beside the camera.
 */
export function closestApproach(
	sourcePosition: SpatialVector3,
	sourceVelocity: SpatialVector3,
	listenerPosition: SpatialVector3,
	listenerVelocity: SpatialVector3,
	horizonSeconds: number
): ClosestApproach {
	const relativePosition = subtract(sourcePosition, listenerPosition);
	const relativeVelocity = subtract(sourceVelocity, listenerVelocity);
	const velocitySquared = magnitudeSquared(relativeVelocity);
	const horizon = positive(horizonSeconds);
	let timeSeconds = 0;

	if (velocitySquared > 0.000001) {
		timeSeconds = clamp(
			-dot(relativePosition, relativeVelocity) / velocitySquared,
			0,
			horizon
		);
	}

	const positionAtClosest = {
		x: relativePosition.x + relativeVelocity.x * timeSeconds,
		y: relativePosition.y + relativeVelocity.y * timeSeconds,
		z: relativePosition.z + relativeVelocity.z * timeSeconds
	};

	return {
		timeSeconds,
		distance: magnitude(positionAtClosest)
	};
}

/**
 * Explicit Doppler derived from listener/source motion along the line of sight.
 * Web Audio spatial panners do not expose source/listener velocity, so the
 * backend can apply this ratio to oscillator phase/frequency or playback rate.
 *
 * Positive listenerTowardSource raises pitch. Positive sourceAwayFromListener
 * lowers pitch. Tangential motion contributes little until its radial component
 * changes during a pass.
 */
export function dopplerState(
	sourcePosition: SpatialVector3,
	sourceVelocity: SpatialVector3,
	listenerPosition: SpatialVector3,
	listenerVelocity: SpatialVector3,
	calibration: SpatialAudioCalibration
): DopplerState {
	const fromListenerToSource = subtract(sourcePosition, listenerPosition);
	const direction = normalize(fromListenerToSource);
	if (magnitudeSquared(direction) === 0) {
		return {
			ratio: 1,
			listenerTowardSource: 0,
			sourceAwayFromListener: 0
		};
	}

	const speedOfSound = Math.max(0.0001, positive(calibration.speedOfSound));
	const radialLimit =
		speedOfSound *
		clamp(calibration.maxRadialFractionOfSoundSpeed, 0, 0.95);
	const listenerTowardSource = clamp(
		dot(listenerVelocity, direction),
		-radialLimit,
		radialLimit
	);
	const sourceAwayFromListener = clamp(
		dot(sourceVelocity, direction),
		-radialLimit,
		radialLimit
	);
	const numerator = speedOfSound + listenerTowardSource;
	const denominator = Math.max(
		speedOfSound * 0.05,
		speedOfSound + sourceAwayFromListener
	);
	const minimumRatio = Math.max(0.01, calibration.minDopplerRatio);
	const maximumRatio = Math.max(minimumRatio, calibration.maxDopplerRatio);

	return {
		ratio: clamp(numerator / denominator, minimumRatio, maximumRatio),
		listenerTowardSource,
		sourceAwayFromListener
	};
}

/**
 * A renderer-independent distance gain hint. A Web Audio backend may use its
 * native PannerNode distance model instead; this scalar remains useful for
 * prioritization, alternate/native backends and deterministic fixtures.
 */
export function distanceGain(
	distance: number,
	referenceDistance: number,
	rolloffExponent: number
): number {
	const reference = Math.max(0.0001, positive(referenceDistance));
	const normalizedDistance = positive(distance) / reference;
	const exponent = Math.max(0.0001, positive(rolloffExponent));
	return 1 / (1 + Math.pow(normalizedDistance, exponent));
}

/**
 * Simple high-frequency retention hint for distance-dependent air loss. 1 means
 * no additional loss; values approach zero gradually with distance.
 */
export function highFrequencyRetention(
	distance: number,
	referenceDistance: number,
	absorptionPerUnit: number
): number {
	const beyondReference = Math.max(
		0,
		positive(distance) - positive(referenceDistance)
	);
	return Math.exp(-positive(absorptionPerUnit) * beyondReference);
}

/**
 * Perceptual/gameplay priority. Nearby sources matter, but predicted close
 * fly-bys, energetic impacts and threats to the core can outrank merely-near
 * low-value chatter. Continuity prevents sustained voices from being chopped
 * aggressively once they are already perceptually established.
 */
export function spatialPriority(
	source: SpatialAudioObjectState,
	listener: SpatialListenerState,
	calibration: SpatialAudioCalibration
): number {
	const distance = spatialDistance(source.position, listener.position);
	const approach = closestApproach(
		source.position,
		source.velocity,
		listener.position,
		listener.velocity,
		calibration.predictionHorizonSeconds
	);
	const proximity = distanceGain(
		distance,
		calibration.referenceDistance,
		calibration.rolloffExponent
	);
	const closestProximity = distanceGain(
		approach.distance,
		calibration.referenceDistance,
		calibration.rolloffExponent
	);
	const horizon = Math.max(0.0001, positive(calibration.predictionHorizonSeconds));
	const imminence = 1 - clamp(approach.timeSeconds / horizon, 0, 1);
	const closestApproachScore = closestProximity * (0.5 + 0.5 * imminence);
	const energyReference = Math.max(0.0001, positive(calibration.energyReference));
	const energy = positive(source.excitationEnergy);
	const energyScore = energy / (energy + energyReference);
	const threat = clamp(source.threat, 0, 1);
	const continuity = clamp(source.continuity, 0, 1);
	const proximityWeight = positive(calibration.proximityWeight);
	const closestWeight = positive(calibration.closestApproachWeight);
	const energyWeight = positive(calibration.energyWeight);
	const threatWeight = positive(calibration.threatWeight);
	const continuityWeight = positive(calibration.continuityWeight);
	const totalWeight =
		proximityWeight +
		closestWeight +
		energyWeight +
		threatWeight +
		continuityWeight;

	if (totalWeight <= 0.000001) {
		return 0;
	}

	return clamp(
		(proximity * proximityWeight +
			closestApproachScore * closestWeight +
			energyScore * energyWeight +
			threat * threatWeight +
			continuity * continuityWeight) /
			totalWeight,
		0,
		1
	);
}

export function spatialRenderHints(
	source: SpatialAudioObjectState,
	listener: SpatialListenerState,
	calibration: SpatialAudioCalibration
): SpatialRenderHints {
	const distance = spatialDistance(source.position, listener.position);
	return {
		distance,
		closestApproach: closestApproach(
			source.position,
			source.velocity,
			listener.position,
			listener.velocity,
			calibration.predictionHorizonSeconds
		),
		doppler: dopplerState(
			source.position,
			source.velocity,
			listener.position,
			listener.velocity,
			calibration
		),
		distanceGain: distanceGain(
			distance,
			calibration.referenceDistance,
			calibration.rolloffExponent
		),
		highFrequencyRetention: highFrequencyRetention(
			distance,
			calibration.referenceDistance,
			calibration.airAbsorptionPerUnit
		),
		priority: spatialPriority(source, listener, calibration)
	};
}
