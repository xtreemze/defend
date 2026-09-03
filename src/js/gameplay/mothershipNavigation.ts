export type MothershipNavigationPhase = "stable" | "warning" | "critical" | "captured";

export interface NavigationVector2 {
	x: number;
	z: number;
}

export interface MothershipNavigationConfig {
	maxAcceleration: number;
	maxSpeed: number;
	linearDamping: number;
	arrivalRadius: number;
	arrivalBrakeGain: number;
	minimumCruiseSpeed: number;
	approachSpeedPerDistance: number;
	warningRadius: number;
	criticalRadius: number;
	safeTargetRadius: number;
	targetLaunchOffset: number;
	attractionStrength: number;
	criticalAttractionStrength: number;
	criticalBasePull: number;
	captureRadiusFactor: number;
	captureInwardSpeed: number;
	capturedAccelerationMultiplier: number;
	overspeedFactor: number;
	movementDrainPerAcceleration: number;
}

export interface MothershipNavigationState {
	position: NavigationVector2;
	velocity: NavigationVector2;
	desiredPosition: NavigationVector2;
	raidSector: NavigationVector2;
	phase: MothershipNavigationPhase;
	totalMovementEnergy: number;
	projectedTargetCount: number;
}

export interface MothershipTargetProjection {
	desiredPosition: NavigationVector2;
	projected: boolean;
}

export interface MothershipNavigationStep {
	state: MothershipNavigationState;
	steeringAcceleration: NavigationVector2;
	attractionAcceleration: NavigationVector2;
	appliedAcceleration: NavigationVector2;
	/** Propulsion-energy demand for this step. A separate reserve authority applies it. */
	movementEnergy: number;
	captureStarted: boolean;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, finite(value, minimum)));
}

function vector(x: number, z: number): NavigationVector2 {
	return { x: finite(x), z: finite(z) };
}

function add(a: NavigationVector2, b: NavigationVector2): NavigationVector2 {
	return vector(a.x + b.x, a.z + b.z);
}

function subtract(a: NavigationVector2, b: NavigationVector2): NavigationVector2 {
	return vector(a.x - b.x, a.z - b.z);
}

function scale(value: NavigationVector2, amount: number): NavigationVector2 {
	return vector(value.x * finite(amount), value.z * finite(amount));
}

export function navigationVectorLength(value: NavigationVector2): number {
	const x = finite(value.x);
	const z = finite(value.z);
	return Math.sqrt(x * x + z * z);
}

function normalize(
	value: NavigationVector2,
	fallback: NavigationVector2 = { x: 1, z: 0 }
): NavigationVector2 {
	const length = navigationVectorLength(value);
	if (length > 0.000001) {
		return scale(value, 1 / length);
	}
	const fallbackLength = navigationVectorLength(fallback);
	if (fallbackLength > 0.000001) {
		return scale(fallback, 1 / fallbackLength);
	}
	return { x: 1, z: 0 };
}

function limitMagnitude(value: NavigationVector2, maximum: number): NavigationVector2 {
	const limit = positive(maximum);
	const length = navigationVectorLength(value);
	if (length <= limit || length <= 0.000001) {
		return vector(value.x, value.z);
	}
	return scale(value, limit / length);
}

function safeConfig(config: MothershipNavigationConfig): MothershipNavigationConfig {
	const warningRadius = positive(config.warningRadius);
	return {
		maxAcceleration: positive(config.maxAcceleration),
		maxSpeed: positive(config.maxSpeed),
		linearDamping: positive(config.linearDamping),
		arrivalRadius: positive(config.arrivalRadius),
		arrivalBrakeGain: positive(config.arrivalBrakeGain),
		minimumCruiseSpeed: positive(config.minimumCruiseSpeed),
		approachSpeedPerDistance: positive(config.approachSpeedPerDistance),
		warningRadius,
		criticalRadius: clamp(config.criticalRadius, 0, warningRadius),
		safeTargetRadius: Math.max(warningRadius, positive(config.safeTargetRadius)),
		targetLaunchOffset: positive(config.targetLaunchOffset),
		attractionStrength: positive(config.attractionStrength),
		criticalAttractionStrength: positive(config.criticalAttractionStrength),
		criticalBasePull: positive(config.criticalBasePull),
		captureRadiusFactor: clamp(config.captureRadiusFactor, 0, 1),
		captureInwardSpeed: positive(config.captureInwardSpeed),
		capturedAccelerationMultiplier: positive(config.capturedAccelerationMultiplier),
		overspeedFactor: Math.max(1, positive(config.overspeedFactor)),
		movementDrainPerAcceleration: positive(config.movementDrainPerAcceleration)
	};
}

export function mothershipNavigationPhase(
	position: NavigationVector2,
	config: MothershipNavigationConfig
): MothershipNavigationPhase {
	const safe = safeConfig(config);
	const distance = navigationVectorLength(position);
	if (distance <= safe.criticalRadius) return "critical";
	if (distance <= safe.warningRadius) return "warning";
	return "stable";
}

/**
 * Convert a desired ground raid sector into a ship target offset away from the
 * silo. Target projection prevents ordinary input from commanding the ship into
 * the attraction field, while existing momentum may still carry it there.
 */
export function projectMothershipTargetForSector(
	sector: NavigationVector2,
	currentPosition: NavigationVector2,
	config: MothershipNavigationConfig
): MothershipTargetProjection {
	const safe = safeConfig(config);
	const outward = normalize(sector, currentPosition);
	let desired = add(sector, scale(outward, safe.targetLaunchOffset));
	const distance = navigationVectorLength(desired);
	if (distance >= safe.safeTargetRadius) {
		return { desiredPosition: desired, projected: false };
	}
	desired = scale(outward, safe.safeTargetRadius);
	return { desiredPosition: desired, projected: true };
}

export function createMothershipNavigationState(
	position: NavigationVector2,
	sector: NavigationVector2,
	config: MothershipNavigationConfig
): MothershipNavigationState {
	const projection = projectMothershipTargetForSector(sector, position, config);
	return {
		position: vector(position.x, position.z),
		velocity: { x: 0, z: 0 },
		desiredPosition: projection.desiredPosition,
		raidSector: vector(sector.x, sector.z),
		phase: mothershipNavigationPhase(position, config),
		totalMovementEnergy: 0,
		projectedTargetCount: projection.projected ? 1 : 0
	};
}

export function setMothershipRaidSector(
	state: MothershipNavigationState,
	sector: NavigationVector2,
	config: MothershipNavigationConfig
): MothershipNavigationState {
	const projection = projectMothershipTargetForSector(sector, state.position, config);
	return {
		position: vector(state.position.x, state.position.z),
		velocity: vector(state.velocity.x, state.velocity.z),
		desiredPosition: projection.desiredPosition,
		raidSector: vector(sector.x, sector.z),
		phase: state.phase,
		totalMovementEnergy: positive(state.totalMovementEnergy),
		projectedTargetCount:
			positive(state.projectedTargetCount) + (projection.projected ? 1 : 0)
	};
}

function steeringAcceleration(
	state: MothershipNavigationState,
	config: MothershipNavigationConfig
): NavigationVector2 {
	const safe = safeConfig(config);
	const error = subtract(state.desiredPosition, state.position);
	const distance = navigationVectorLength(error);
	if (distance < safe.arrivalRadius) {
		return limitMagnitude(
			scale(state.velocity, -safe.arrivalBrakeGain),
			safe.maxAcceleration
		);
	}
	const desiredDirection = normalize(error);
	const desiredSpeed = Math.min(
		safe.maxSpeed,
		Math.max(safe.minimumCruiseSpeed, distance * safe.approachSpeedPerDistance)
	);
	const desiredVelocity = scale(desiredDirection, desiredSpeed);
	return limitMagnitude(subtract(desiredVelocity, state.velocity), safe.maxAcceleration);
}

function attractionAcceleration(
	position: NavigationVector2,
	phase: MothershipNavigationPhase,
	config: MothershipNavigationConfig
): NavigationVector2 {
	const safe = safeConfig(config);
	const distance = navigationVectorLength(position);
	if (distance >= safe.warningRadius || distance < 0.000001) {
		return { x: 0, z: 0 };
	}
	const inward = normalize(scale(position, -1));
	const normalized = 1 - distance / Math.max(0.000001, safe.warningRadius);
	const strength =
		phase === "critical"
			? safe.criticalAttractionStrength *
				(safe.criticalBasePull + normalized * normalized)
			: safe.attractionStrength * normalized * normalized;
	return scale(inward, strength);
}

function inwardSpeed(state: MothershipNavigationState): number {
	const outward = normalize(state.position);
	return -(state.velocity.x * outward.x + state.velocity.z * outward.z);
}

export function stepMothershipNavigation(
	state: MothershipNavigationState,
	deltaSeconds: number,
	config: MothershipNavigationConfig
): MothershipNavigationStep {
	const safe = safeConfig(config);
	const dt = positive(deltaSeconds);
	let phase =
		state.phase === "captured"
			? "captured"
			: mothershipNavigationPhase(state.position, safe);
	let captureStarted = false;
	let steering = steeringAcceleration(state, safe);
	let attraction = attractionAcceleration(state.position, phase, safe);
	let acceleration = add(steering, attraction);

	if (
		phase === "critical" &&
		navigationVectorLength(state.position) <
			safe.criticalRadius * safe.captureRadiusFactor &&
		inwardSpeed(state) > safe.captureInwardSpeed
	) {
		phase = "captured";
		captureStarted = true;
	}

	if (phase === "captured") {
		steering = { x: 0, z: 0 };
		attraction = scale(
			normalize(scale(state.position, -1)),
			safe.criticalAttractionStrength * safe.capturedAccelerationMultiplier
		);
		acceleration = attraction;
	}

	let velocity = add(state.velocity, scale(acceleration, dt));
	const damping = Math.exp(-safe.linearDamping * dt);
	velocity = scale(velocity, damping);
	velocity = limitMagnitude(velocity, safe.maxSpeed * safe.overspeedFactor);
	const position = add(state.position, scale(velocity, dt));

	// Only engine steering produces propulsion demand. Silo attraction is an
	// external field; a separate mothership energy authority decides whether the
	// requested movement energy can actually be paid together with hover/launch
	// costs and what low reserve does to lift.
	const movementEnergy =
		navigationVectorLength(steering) * safe.movementDrainPerAcceleration * dt;

	return {
		state: {
			position,
			velocity,
			desiredPosition: vector(state.desiredPosition.x, state.desiredPosition.z),
			raidSector: vector(state.raidSector.x, state.raidSector.z),
			phase,
			totalMovementEnergy: positive(state.totalMovementEnergy) + movementEnergy,
			projectedTargetCount: positive(state.projectedTargetCount)
		},
		steeringAcceleration: steering,
		attractionAcceleration: attraction,
		appliedAcceleration: acceleration,
		movementEnergy,
		captureStarted
	};
}
