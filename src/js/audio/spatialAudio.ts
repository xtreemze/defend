export interface SpatialVector3 {
	x: number;
	y: number;
	z: number;
}

export interface SpatialAudioObjectState {
	id: string;
	kind: string;
	acousticProfile: string;
	position: SpatialVector3;
	velocity: SpatialVector3;
	orientation: SpatialVector3;
	angularVelocity?: SpatialVector3;
	directivity: number;
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

/**
 * Defensive numeric ceiling for this pure boundary. Real Defend world-space
 * values are many orders of magnitude smaller; the ceiling only prevents
 * malformed Infinity/NaN or absurd external state from poisoning an audio
 * planning pass with non-finite output.
 */
const MAX_SPATIAL_SCALAR = 1e150;

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_SPATIAL_SCALAR) {
		return MAX_SPATIAL_SCALAR;
	}
	if (value < -MAX_SPATIAL_SCALAR) {
		return -MAX_SPATIAL_SCALAR;
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

function subtract(a: SpatialVector3, b: SpatialVector3): SpatialVector3 {
	return {
		x: finiteScalar(finiteScalar(a.x) - finiteScalar(b.x)),
		y: finiteScalar(finiteScalar(a.y) - finiteScalar(b.y)),
		z: finiteScalar(finiteScalar(a.z) - finiteScalar(b.z))
	};
}

function dot(a: SpatialVector3, b: SpatialVector3): number {
	return finiteScalar(
		finiteScalar(a.x) * finiteScalar(b.x) +
			finiteScalar(a.y) * finiteScalar(b.y) +
			finiteScalar(a.z) * finiteScalar(b.z)
	);
}

function magnitudeSquared(vector: SpatialVector3): number {
	return positive(dot(vector, vector));
}

function magnitude(vector: SpatialVector3): number {
	return finiteScalar(Math.sqrt(magnitudeSquared(vector)), MAX_SPATIAL_SCALAR);
}

function scale(vector: SpatialVector3, amount: number): SpatialVector3 {
	const safeAmount = finiteScalar(amount);
	return {
		x: finiteScalar(finiteScalar(vector.x) * safeAmount),
		y: finiteScalar(finiteScalar(vector.y) * safeAmount),
		z: finiteScalar(finiteScalar(vector.z) * safeAmount)
	};
}

function addScaled(
	position: SpatialVector3,
	velocity: SpatialVector3,
	timeSeconds: number
): SpatialVector3 {
	const time = finiteScalar(timeSeconds);
	return {
		x: finiteScalar(finiteScalar(position.x) + finiteScalar(velocity.x) * time),
		y: finiteScalar(finiteScalar(position.y) + finiteScalar(velocity.y) * time),
		z: finiteScalar(finiteScalar(position.z) + finiteScalar(velocity.z) * time)
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
			finiteScalar(-dot(relativePosition, relativeVelocity) / velocitySquared),
			0,
			horizon
		);
	}

	const positionAtClosest = addScaled(
		relativePosition,
		relativeVelocity,
		timeSeconds
	);

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
	const radialLimit = finiteScalar(
		speedOfSound *
			clamp(calibration.maxRadialFractionOfSoundSpeed, 0, 0.95)
	);
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
	const numerator = finiteScalar(speedOfSound + listenerTowardSource);
	const denominator = Math.max(
		speedOfSound * 0.05,
		finiteScalar(speedOfSound + sourceAwayFromListener)
	);
	const minimumRatio = Math.max(0.01, positive(calibration.minDopplerRatio));
	const maximumRatio = Math.max(
		minimumRatio,
		positive(calibration.maxDopplerRatio)
	);

	return {
		ratio: clamp(numerator / denominator, minimumRatio, maximumRatio),
		listenerTowardSource,
		sourceAwayFromListener
	};
}

/**
 * A renderer-independent distance gain hint. Full gain is retained inside the
 * reference distance, matching the semantic expectation of a spatial near
 * field. A Web Audio backend may use its native PannerNode distance model
 * instead; this scalar remains useful for prioritization and native backends.
 */
export function distanceGain(
	distance: number,
	referenceDistance: number,
	rolloffExponent: number
): number {
	const reference = Math.max(0.0001, positive(referenceDistance));
	const normalizedBeyondReference = Math.max(
		0,
		positive(distance) / reference - 1
	);
	const exponent = Math.max(0.0001, positive(rolloffExponent));
	return clamp(1 / (1 + Math.pow(normalizedBeyondReference, exponent)), 0, 1);
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
	return clamp(
		Math.exp(-positive(absorptionPerUnit) * beyondReference),
		0,
		1
	);
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
	const energyScore = clamp(energy / finiteScalar(energy + energyReference), 0, 1);
	const threat = clamp(source.threat, 0, 1);
	const continuity = clamp(source.continuity, 0, 1);
	const proximityWeight = positive(calibration.proximityWeight);
	const closestWeight = positive(calibration.closestApproachWeight);
	const energyWeight = positive(calibration.energyWeight);
	const threatWeight = positive(calibration.threatWeight);
	const continuityWeight = positive(calibration.continuityWeight);
	const totalWeight = finiteScalar(
		proximityWeight +
			closestWeight +
			energyWeight +
			threatWeight +
			continuityWeight
	);

	if (totalWeight <= 0.000001) {
		return 0;
	}

	const weightedPriority = finiteScalar(
		proximity * proximityWeight +
			closestApproachScore * closestWeight +
			energyScore * energyWeight +
			threat * threatWeight +
			continuity * continuityWeight
	);

	return clamp(weightedPriority / totalWeight, 0, 1);
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
