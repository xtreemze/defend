import { SpatialVector3 } from "./spatialAudio";

export interface SpatialMotionSample {
	position: SpatialVector3;
	timeSeconds: number;
}

export interface SpatialMotionCalibration {
	minSampleDeltaSeconds: number;
	maxSampleDeltaSeconds: number;
	teleportDistance: number;
	velocityHalfLifeSeconds: number;
	maxSpeed: number;
	maxPredictionSeconds: number;
}

export interface SpatialMotionEstimate {
	position: SpatialVector3;
	velocity: SpatialVector3;
	timeSeconds: number;
	sampleDeltaSeconds: number;
	reset: boolean;
}

const MAX_MOTION_SCALAR = 1e150;
const LN2 = Math.log(2);

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_MOTION_SCALAR) {
		return MAX_MOTION_SCALAR;
	}
	if (value < -MAX_MOTION_SCALAR) {
		return -MAX_MOTION_SCALAR;
	}
	return value;
}

function positive(value: number): number {
	return Math.max(0, finiteScalar(value));
}

function sanitizeVector(vector: SpatialVector3): SpatialVector3 {
	return {
		x: finiteScalar(vector.x),
		y: finiteScalar(vector.y),
		z: finiteScalar(vector.z)
	};
}

function subtract(a: SpatialVector3, b: SpatialVector3): SpatialVector3 {
	return {
		x: finiteScalar(finiteScalar(a.x) - finiteScalar(b.x)),
		y: finiteScalar(finiteScalar(a.y) - finiteScalar(b.y)),
		z: finiteScalar(finiteScalar(a.z) - finiteScalar(b.z))
	};
}

function addScaled(
	position: SpatialVector3,
	velocity: SpatialVector3,
	seconds: number
): SpatialVector3 {
	const time = finiteScalar(seconds);
	return {
		x: finiteScalar(finiteScalar(position.x) + finiteScalar(velocity.x) * time),
		y: finiteScalar(finiteScalar(position.y) + finiteScalar(velocity.y) * time),
		z: finiteScalar(finiteScalar(position.z) + finiteScalar(velocity.z) * time)
	};
}

function magnitude(vector: SpatialVector3): number {
	const x = finiteScalar(vector.x);
	const y = finiteScalar(vector.y);
	const z = finiteScalar(vector.z);
	return finiteScalar(Math.sqrt(x * x + y * y + z * z), MAX_MOTION_SCALAR);
}

function scale(vector: SpatialVector3, amount: number): SpatialVector3 {
	const scalar = finiteScalar(amount);
	return {
		x: finiteScalar(finiteScalar(vector.x) * scalar),
		y: finiteScalar(finiteScalar(vector.y) * scalar),
		z: finiteScalar(finiteScalar(vector.z) * scalar)
	};
}

function clampMagnitude(vector: SpatialVector3, maximum: number): SpatialVector3 {
	const limit = positive(maximum);
	if (limit <= 0) {
		return { x: 0, y: 0, z: 0 };
	}
	const length = magnitude(vector);
	if (length <= limit || length <= 0.000001) {
		return sanitizeVector(vector);
	}
	return scale(vector, limit / length);
}

function blend(
	from: SpatialVector3,
	to: SpatialVector3,
	amount: number
): SpatialVector3 {
	const t = Math.max(0, Math.min(1, finiteScalar(amount)));
	return {
		x: finiteScalar(finiteScalar(from.x) + (finiteScalar(to.x) - finiteScalar(from.x)) * t),
		y: finiteScalar(finiteScalar(from.y) + (finiteScalar(to.y) - finiteScalar(from.y)) * t),
		z: finiteScalar(finiteScalar(from.z) + (finiteScalar(to.z) - finiteScalar(from.z)) * t)
	};
}

export function spatialMotionSpeed(velocity: SpatialVector3): number {
	return magnitude(velocity);
}

export function initialSpatialMotionEstimate(
	sample: SpatialMotionSample
): SpatialMotionEstimate {
	return {
		position: sanitizeVector(sample.position),
		velocity: { x: 0, y: 0, z: 0 },
		timeSeconds: finiteScalar(sample.timeSeconds),
		sampleDeltaSeconds: 0,
		reset: true
	};
}

/**
 * Derive a bounded, smoothed velocity estimate from timestamped transforms.
 *
 * Non-monotonic/long-gap timestamps and explicit teleport-sized position jumps
 * reset velocity to zero so camera resets, scene loads and debugger scrubs do
 * not become artificial Doppler spikes. Very small but positive sample deltas
 * use the configured minimum denominator instead of amplifying transform jitter.
 */
export function updateSpatialMotionEstimate(
	previous: SpatialMotionEstimate,
	sample: SpatialMotionSample,
	calibration: SpatialMotionCalibration
): SpatialMotionEstimate {
	const previousPosition = sanitizeVector(previous.position);
	const position = sanitizeVector(sample.position);
	const previousTime = finiteScalar(previous.timeSeconds);
	const timeSeconds = finiteScalar(sample.timeSeconds, previousTime);
	const deltaSeconds = finiteScalar(timeSeconds - previousTime);
	const minDelta = positive(calibration.minSampleDeltaSeconds);
	const configuredMaxDelta = positive(calibration.maxSampleDeltaSeconds);
	const maxDelta =
		configuredMaxDelta > 0 ? Math.max(minDelta, configuredMaxDelta) : 0;
	const displacement = subtract(position, previousPosition);
	const distance = magnitude(displacement);
	const teleportDistance = positive(calibration.teleportDistance);
	const teleported = teleportDistance > 0 && distance >= teleportDistance;
	const invalidTime = deltaSeconds <= 0 || (maxDelta > 0 && deltaSeconds > maxDelta);

	if (teleported || invalidTime) {
		return {
			position,
			velocity: { x: 0, y: 0, z: 0 },
			timeSeconds,
			sampleDeltaSeconds: deltaSeconds,
			reset: true
		};
	}

	const denominator = Math.max(deltaSeconds, minDelta, 0.000001);
	const rawVelocity = clampMagnitude(
		scale(displacement, 1 / denominator),
		calibration.maxSpeed
	);
	const previousVelocity = clampMagnitude(
		sanitizeVector(previous.velocity),
		calibration.maxSpeed
	);
	const halfLife = positive(calibration.velocityHalfLifeSeconds);
	const blendAmount =
		halfLife <= 0
			? 1
			: 1 - Math.exp((-LN2 * denominator) / Math.max(halfLife, 0.000001));
	const velocity = clampMagnitude(
		blend(previousVelocity, rawVelocity, blendAmount),
		calibration.maxSpeed
	);

	return {
		position,
		velocity,
		timeSeconds,
		sampleDeltaSeconds: deltaSeconds,
		reset: false
	};
}

/**
 * Short bounded extrapolation for lower-rate transform/control snapshots.
 * This is presentation/audio planning only; it must never advance simulation
 * authority or replace the current authoritative transform.
 */
export function predictSpatialMotionPosition(
	estimate: SpatialMotionEstimate,
	targetTimeSeconds: number,
	maxPredictionSeconds: number
): SpatialVector3 {
	const limit = positive(maxPredictionSeconds);
	const requested = Math.max(
		0,
		finiteScalar(targetTimeSeconds) - finiteScalar(estimate.timeSeconds)
	);
	const seconds = Math.min(requested, limit);
	return addScaled(
		sanitizeVector(estimate.position),
		sanitizeVector(estimate.velocity),
		seconds
	);
}

export function predictSpatialMotionFromCalibration(
	estimate: SpatialMotionEstimate,
	targetTimeSeconds: number,
	calibration: SpatialMotionCalibration
): SpatialVector3 {
	return predictSpatialMotionPosition(
		estimate,
		targetTimeSeconds,
		calibration.maxPredictionSeconds
	);
}
