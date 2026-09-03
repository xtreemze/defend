export type MothershipLiftPhase =
	| "stable"
	| "low-reserve"
	| "critical"
	| "falling"
	| "hulk";

export interface MothershipEnergyLiftConfig {
	capacity: number;
	lowReserve: number;
	criticalReserve: number;
	fallReserve: number;
	hoverDrainPerSecond: number;
	fallDrainPerSecond: number;
	startAltitude: number;
	hulkCenterAltitude: number;
	reserveSagDistance: number;
	maxLiftStiffness: number;
	minimumLiftStiffnessFactor: number;
	baseVerticalDamping: number;
	additionalVerticalDamping: number;
	baseWobbleAmplitude: number;
	depletionWobbleAmplitude: number;
	baseWobbleFrequency: number;
	depletionWobbleFrequency: number;
	gravity: number;
	impactBounceThreshold: number;
	impactRestitution: number;
	allowFallRecovery: boolean;
}

export interface MothershipEnergyLiftState {
	reserve: number;
	phase: MothershipLiftPhase;
	altitude: number;
	verticalVelocity: number;
	elapsedSeconds: number;
	impactCount: number;
}

export interface MothershipEnergyExchange {
	/** Energy arriving from extraction/recovery during this step. */
	inflowEnergy: number;
	/** Aggregate spend already requested by movement, launch, or other systems. */
	externalSpendEnergy: number;
}

export interface MothershipEnergyLiftStep {
	state: MothershipEnergyLiftState;
	inflowApplied: number;
	externalSpendApplied: number;
	unmetExternalSpend: number;
	baseDrainApplied: number;
	liftFraction: number;
	targetAltitude: number;
	instability: number;
	fallStarted: boolean;
	impactOccurred: boolean;
	becameHulk: boolean;
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

function safeConfig(config: MothershipEnergyLiftConfig): MothershipEnergyLiftConfig {
	const capacity = Math.max(0.000001, positive(config.capacity));
	const fallReserve = clamp(config.fallReserve, 0, capacity);
	const criticalReserve = clamp(config.criticalReserve, fallReserve, capacity);
	const lowReserve = clamp(config.lowReserve, criticalReserve, capacity);
	return {
		capacity,
		lowReserve,
		criticalReserve,
		fallReserve,
		hoverDrainPerSecond: positive(config.hoverDrainPerSecond),
		fallDrainPerSecond: positive(config.fallDrainPerSecond),
		startAltitude: finite(config.startAltitude),
		hulkCenterAltitude: finite(config.hulkCenterAltitude),
		reserveSagDistance: positive(config.reserveSagDistance),
		maxLiftStiffness: positive(config.maxLiftStiffness),
		minimumLiftStiffnessFactor: clamp(config.minimumLiftStiffnessFactor, 0, 1),
		baseVerticalDamping: positive(config.baseVerticalDamping),
		additionalVerticalDamping: positive(config.additionalVerticalDamping),
		baseWobbleAmplitude: positive(config.baseWobbleAmplitude),
		depletionWobbleAmplitude: positive(config.depletionWobbleAmplitude),
		baseWobbleFrequency: positive(config.baseWobbleFrequency),
		depletionWobbleFrequency: positive(config.depletionWobbleFrequency),
		gravity: positive(config.gravity),
		impactBounceThreshold: positive(config.impactBounceThreshold),
		impactRestitution: clamp(config.impactRestitution, 0, 1),
		allowFallRecovery: config.allowFallRecovery === true
	};
}

export function mothershipLiftPhaseForReserve(
	reserve: number,
	config: MothershipEnergyLiftConfig
): MothershipLiftPhase {
	const safe = safeConfig(config);
	const value = clamp(reserve, 0, safe.capacity);
	if (value <= safe.fallReserve) return "falling";
	if (value <= safe.criticalReserve) return "critical";
	if (value <= safe.lowReserve) return "low-reserve";
	return "stable";
}

export function mothershipLiftFraction(
	reserve: number,
	config: MothershipEnergyLiftConfig
): number {
	const safe = safeConfig(config);
	const denominator = Math.max(0.000001, safe.capacity - safe.fallReserve);
	return clamp((finite(reserve) - safe.fallReserve) / denominator, 0, 1);
}

export function createMothershipEnergyLiftState(
	reserve: number,
	config: MothershipEnergyLiftConfig
): MothershipEnergyLiftState {
	const safe = safeConfig(config);
	const boundedReserve = clamp(reserve, 0, safe.capacity);
	return {
		reserve: boundedReserve,
		phase: mothershipLiftPhaseForReserve(boundedReserve, safe),
		altitude: safe.startAltitude,
		verticalVelocity: 0,
		elapsedSeconds: 0,
		impactCount: 0
	};
}

/**
 * Single authoritative mothership reserve + vertical-lift step.
 *
 * Navigation/launch/extraction systems submit energy quantities but do not own
 * the reserve. The caller retains category-level accounting for player-facing
 * transparency; this contract only conserves the shared scalar pool and derives
 * suspension/crash consequences from it.
 */
export function stepMothershipEnergyLift(
	state: MothershipEnergyLiftState,
	exchange: MothershipEnergyExchange,
	deltaSeconds: number,
	config: MothershipEnergyLiftConfig
): MothershipEnergyLiftStep {
	const safe = safeConfig(config);
	const dt = positive(deltaSeconds);
	let next: MothershipEnergyLiftState = {
		reserve: clamp(state.reserve, 0, safe.capacity),
		phase: state.phase,
		altitude: finite(state.altitude, safe.startAltitude),
		verticalVelocity: finite(state.verticalVelocity),
		elapsedSeconds: positive(state.elapsedSeconds),
		impactCount: Math.max(0, Math.floor(positive(state.impactCount)))
	};

	if (next.phase === "hulk") {
		return {
			state: next,
			inflowApplied: 0,
			externalSpendApplied: 0,
			unmetExternalSpend: positive(exchange.externalSpendEnergy),
			baseDrainApplied: 0,
			liftFraction: 0,
			targetAltitude: safe.hulkCenterAltitude,
			instability: 1,
			fallStarted: false,
			impactOccurred: false,
			becameHulk: false
		};
	}

	next.elapsedSeconds += dt;

	const inflowRequested = positive(exchange.inflowEnergy);
	const inflowApplied = Math.min(safe.capacity - next.reserve, inflowRequested);
	next.reserve += inflowApplied;

	const externalRequested = positive(exchange.externalSpendEnergy);
	const externalSpendApplied = Math.min(next.reserve, externalRequested);
	next.reserve -= externalSpendApplied;
	const unmetExternalSpend = Math.max(0, externalRequested - externalSpendApplied);

	const drainRate =
		next.phase === "falling" ? safe.fallDrainPerSecond : safe.hoverDrainPerSecond;
	const baseDrainRequested = drainRate * dt;
	const baseDrainApplied = Math.min(next.reserve, baseDrainRequested);
	next.reserve -= baseDrainApplied;

	let fallStarted = false;
	let impactOccurred = false;
	let becameHulk = false;

	if (next.phase === "falling" && safe.allowFallRecovery) {
		const recoveredPhase = mothershipLiftPhaseForReserve(next.reserve, safe);
		if (recoveredPhase !== "falling") {
			next.phase = recoveredPhase;
		}
	}

	if (next.phase !== "falling") {
		const reservePhase = mothershipLiftPhaseForReserve(next.reserve, safe);
		if (reservePhase === "falling") {
			next.phase = "falling";
			fallStarted = true;
		} else {
			next.phase = reservePhase;
		}
	}

	let liftFraction = mothershipLiftFraction(next.reserve, safe);
	let targetAltitude =
		safe.startAltitude - (1 - liftFraction) * safe.reserveSagDistance;
	let instability = (1 - liftFraction) * (1 - liftFraction);

	if (next.phase === "falling") {
		next.verticalVelocity -= safe.gravity * dt;
		next.altitude += next.verticalVelocity * dt;
		if (next.altitude <= safe.hulkCenterAltitude) {
			next.altitude = safe.hulkCenterAltitude;
			next.impactCount += 1;
			impactOccurred = true;
			if (
				next.impactCount === 1 &&
				Math.abs(next.verticalVelocity) > safe.impactBounceThreshold
			) {
				next.verticalVelocity =
					Math.abs(next.verticalVelocity) * safe.impactRestitution;
			} else {
				next.verticalVelocity = 0;
				next.phase = "hulk";
				becameHulk = true;
			}
		}
		liftFraction = 0;
		targetAltitude = safe.hulkCenterAltitude;
		instability = 1;
	} else {
		const depletion = 1 - liftFraction;
		const stiffness =
			safe.maxLiftStiffness *
			(safe.minimumLiftStiffnessFactor +
				liftFraction * (1 - safe.minimumLiftStiffnessFactor));
		const damping =
			safe.baseVerticalDamping + liftFraction * safe.additionalVerticalDamping;
		const wobbleAmplitude =
			safe.baseWobbleAmplitude +
			depletion * depletion * safe.depletionWobbleAmplitude;
		const wobbleFrequency =
			safe.baseWobbleFrequency +
			depletion * safe.depletionWobbleFrequency;
		const wobble = Math.sin(next.elapsedSeconds * wobbleFrequency) * wobbleAmplitude;
		const acceleration =
			(targetAltitude - next.altitude) * stiffness -
			next.verticalVelocity * damping +
			wobble;
		next.verticalVelocity += acceleration * dt;
		next.altitude += next.verticalVelocity * dt;
	}

	return {
		state: next,
		inflowApplied,
		externalSpendApplied,
		unmetExternalSpend,
		baseDrainApplied,
		liftFraction,
		targetAltitude,
		instability,
		fallStarted,
		impactOccurred,
		becameHulk
	};
}
