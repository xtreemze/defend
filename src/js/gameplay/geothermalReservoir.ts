export type GeothermalReservoirPhase = "active" | "retreating" | "erupting";

export interface GeothermalReservoirState {
	phase: GeothermalReservoirPhase;
	accessibleEnergy: number;
	pressure: number;
	depletedSeconds: number;
	retreatSeconds: number;
	eruptionSeconds: number;
}

export interface GeothermalReservoirConfig {
	capacity: number;
	depletedThreshold: number;
	retreatDelaySeconds: number;
	retreatDurationSeconds: number;
	deepReplenishPerSecond: number;
	pressureBuildPerSecond: number;
	pressureReliefPerEnergy: number;
	drawRateForPressureSuppression: number;
	eruptionThreshold: number;
	eruptionDurationSeconds: number;
	eruptionEnergyLossPerSecond: number;
	pressureAfterEruption: number;
}

export interface GeothermalReservoirStep {
	state: GeothermalReservoirState;
	requestedEnergy: number;
	servedEnergy: number;
	unmetEnergy: number;
	replenishedEnergy: number;
	eruptionStarted: boolean;
	retreatStarted: boolean;
	relocationReady: boolean;
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

function safeConfig(config: GeothermalReservoirConfig): GeothermalReservoirConfig {
	const capacity = Math.max(0.000001, positive(config.capacity));
	return {
		capacity,
		depletedThreshold: clamp(config.depletedThreshold, 0, capacity),
		retreatDelaySeconds: positive(config.retreatDelaySeconds),
		retreatDurationSeconds: positive(config.retreatDurationSeconds),
		deepReplenishPerSecond: positive(config.deepReplenishPerSecond),
		pressureBuildPerSecond: positive(config.pressureBuildPerSecond),
		pressureReliefPerEnergy: positive(config.pressureReliefPerEnergy),
		drawRateForPressureSuppression: positive(config.drawRateForPressureSuppression),
		eruptionThreshold: clamp(config.eruptionThreshold, 0, 1),
		eruptionDurationSeconds: positive(config.eruptionDurationSeconds),
		eruptionEnergyLossPerSecond: positive(config.eruptionEnergyLossPerSecond),
		pressureAfterEruption: clamp(config.pressureAfterEruption, 0, 1)
	};
}

export function createGeothermalReservoirState(
	accessibleEnergy: number,
	pressure: number,
	config: GeothermalReservoirConfig
): GeothermalReservoirState {
	const safe = safeConfig(config);
	return {
		phase: "active",
		accessibleEnergy: clamp(accessibleEnergy, 0, safe.capacity),
		pressure: clamp(pressure, 0, 1),
		depletedSeconds: 0,
		retreatSeconds: 0,
		eruptionSeconds: 0
	};
}

/**
 * Advance one local geothermal-access reservoir.
 *
 * The reservoir owns only scalar state. Geometry, stream routing, eruption
 * damage, rendering, and the choice of a relocation point remain caller-owned.
 * This keeps the same resource lifecycle usable by the flat PoC, a future
 * spherical planet, AI simulation, and deterministic tests.
 */
export function stepGeothermalReservoir(
	state: GeothermalReservoirState,
	requestedDrawPerSecond: number,
	deltaSeconds: number,
	config: GeothermalReservoirConfig
): GeothermalReservoirStep {
	const safe = safeConfig(config);
	const dt = positive(deltaSeconds);
	const requestedRate = positive(requestedDrawPerSecond);
	const requestedEnergy = requestedRate * dt;
	let next: GeothermalReservoirState = {
		phase: state.phase,
		accessibleEnergy: clamp(state.accessibleEnergy, 0, safe.capacity),
		pressure: clamp(state.pressure, 0, 1),
		depletedSeconds: positive(state.depletedSeconds),
		retreatSeconds: positive(state.retreatSeconds),
		eruptionSeconds: positive(state.eruptionSeconds)
	};
	let servedEnergy = 0;
	let replenishedEnergy = 0;
	let eruptionStarted = false;
	let retreatStarted = false;

	if (dt === 0) {
		return {
			state: next,
			requestedEnergy,
			servedEnergy,
			unmetEnergy: requestedEnergy,
			replenishedEnergy,
			eruptionStarted,
			retreatStarted,
			relocationReady:
				next.phase === "retreating" && next.retreatSeconds >= safe.retreatDurationSeconds
		};
	}

	if (next.phase === "erupting") {
		next.eruptionSeconds += dt;
		next.accessibleEnergy = Math.max(
			0,
			next.accessibleEnergy - safe.eruptionEnergyLossPerSecond * dt
		);
		if (safe.eruptionDurationSeconds === 0) {
			next.pressure = safe.pressureAfterEruption;
		} else {
			const relaxationRate = 5 / safe.eruptionDurationSeconds;
			const decay = Math.exp(-relaxationRate * dt);
			next.pressure =
				safe.pressureAfterEruption +
				(next.pressure - safe.pressureAfterEruption) * decay;
		}
		if (next.eruptionSeconds >= safe.eruptionDurationSeconds) {
			next.phase = "retreating";
			next.retreatSeconds = 0;
			next.depletedSeconds = safe.retreatDelaySeconds;
			next.eruptionSeconds = safe.eruptionDurationSeconds;
			next.pressure = safe.pressureAfterEruption;
			retreatStarted = true;
		}
	} else if (next.phase === "retreating") {
		next.retreatSeconds += dt;
	} else {
		const replenishRoom = safe.capacity - next.accessibleEnergy;
		replenishedEnergy = Math.min(
			replenishRoom,
			safe.deepReplenishPerSecond * dt
		);
		next.accessibleEnergy += replenishedEnergy;

		servedEnergy = Math.min(next.accessibleEnergy, requestedEnergy);
		next.accessibleEnergy -= servedEnergy;

		if (next.accessibleEnergy <= safe.depletedThreshold) {
			next.depletedSeconds += dt;
		} else {
			next.depletedSeconds = 0;
		}

		const fullness = next.accessibleEnergy / safe.capacity;
		const pressureSuppression =
			safe.drawRateForPressureSuppression === 0
				? requestedRate > 0
					? 1
					: 0
				: clamp(
						requestedRate / safe.drawRateForPressureSuppression,
						0,
						1
					);
		const pressureGain =
			safe.pressureBuildPerSecond * fullness * (1 - pressureSuppression) * dt;
		const pressureRelief = servedEnergy * safe.pressureReliefPerEnergy;
		next.pressure = clamp(next.pressure + pressureGain - pressureRelief, 0, 1);

		if (next.pressure >= safe.eruptionThreshold) {
			next.phase = "erupting";
			next.eruptionSeconds = 0;
			eruptionStarted = true;
		} else if (next.depletedSeconds >= safe.retreatDelaySeconds) {
			next.phase = "retreating";
			next.retreatSeconds = 0;
			retreatStarted = true;
		}
	}

	return {
		state: next,
		requestedEnergy,
		servedEnergy,
		unmetEnergy: Math.max(0, requestedEnergy - servedEnergy),
		replenishedEnergy,
		eruptionStarted,
		retreatStarted,
		relocationReady:
			next.phase === "retreating" && next.retreatSeconds >= safe.retreatDurationSeconds
	};
}

/**
 * Re-seed a reservoir after the world chooses a new physical emergence point.
 * Relocation itself is intentionally not randomised here.
 */
export function relocateGeothermalReservoir(
	accessibleEnergy: number,
	pressure: number,
	config: GeothermalReservoirConfig
): GeothermalReservoirState {
	return createGeothermalReservoirState(accessibleEnergy, pressure, config);
}

export function geothermalReservoirFillRatio(
	state: GeothermalReservoirState,
	config: GeothermalReservoirConfig
): number {
	const capacity = safeConfig(config).capacity;
	return clamp(state.accessibleEnergy / capacity, 0, 1);
}
