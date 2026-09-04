export interface RaidBeliefState {
	perceivedTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViability: number;
	uncertainty: number;
	directObservations: number;
	secondsSinceDirectObservation: number;
}

export interface RaidBeliefCalibration {
	targetEnergyCapacity: number;
	signatureHalfLifeSeconds: number;
	uncertaintyStaleHalfLifeSeconds: number;
	breachObservationWeight: number;
	viabilityObservationWeight: number;
	directUncertaintyReduction: number;
}

export interface RaidBeliefPrior {
	perceivedTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViability: number;
	uncertainty: number;
}

export interface RaidOutcomeObservation {
	breached: boolean;
	remainingViability: number;
	reliability: number;
}

export interface RaidBeliefExpectedValueInputs {
	perceivedTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViability: number;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) return fallback;
	return value;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.max(minimum, Math.min(maximum, finite(value, minimum)));
}

function clamp01(value: number): number {
	return clamp(value, 0, 1);
}

function normalizeCalibration(
	input: RaidBeliefCalibration
): RaidBeliefCalibration {
	return {
		targetEnergyCapacity: Math.max(1, positive(input.targetEnergyCapacity)),
		signatureHalfLifeSeconds: positive(input.signatureHalfLifeSeconds),
		uncertaintyStaleHalfLifeSeconds: positive(
			input.uncertaintyStaleHalfLifeSeconds
		),
		breachObservationWeight: clamp01(input.breachObservationWeight),
		viabilityObservationWeight: clamp01(input.viabilityObservationWeight),
		directUncertaintyReduction: clamp01(input.directUncertaintyReduction)
	};
}

function timeAlpha(deltaSeconds: number, halfLifeSeconds: number): number {
	const delta = positive(deltaSeconds);
	if (delta <= 0) return 0;
	if (halfLifeSeconds <= 0) return 1;
	return 1 - Math.pow(0.5, delta / halfLifeSeconds);
}

export function createRaidBelief(
	prior: RaidBeliefPrior,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	const calibration = normalizeCalibration(calibrationInput);
	return {
		perceivedTargetEnergy: clamp(
			prior.perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		),
		expectedBreachProbability: clamp01(prior.expectedBreachProbability),
		expectedArrivalViability: clamp01(prior.expectedArrivalViability),
		uncertainty: clamp01(prior.uncertainty),
		directObservations: 0,
		secondsSinceDirectObservation: 0
	};
}

/**
 * Age information without changing the mean physical belief. A quiet target may
 * have changed because towers degrade, geometry changes and reserves move, so
 * certainty erodes even though the attacker has not received evidence that the
 * target became easier or harder.
 */
export function ageRaidBelief(
	state: RaidBeliefState,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	const calibration = normalizeCalibration(calibrationInput);
	const delta = positive(deltaSeconds);
	const staleAlpha = timeAlpha(
		delta,
		calibration.uncertaintyStaleHalfLifeSeconds
	);
	return {
		perceivedTargetEnergy: clamp(
			state.perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		),
		expectedBreachProbability: clamp01(state.expectedBreachProbability),
		expectedArrivalViability: clamp01(state.expectedArrivalViability),
		uncertainty: clamp01(
			state.uncertainty + (1 - state.uncertainty) * staleAlpha
		),
		directObservations: Math.max(
			0,
			Math.floor(positive(state.directObservations))
		),
		secondsSinceDirectObservation:
			positive(state.secondsSinceDirectObservation) + delta
	};
}

/**
 * A passive teal signature updates perceived opportunity but not hidden defense
 * quality. The time-domain half-life keeps a constant observation equivalent
 * across different sampling cadences.
 */
export function observeRaidSignature(
	stateInput: RaidBeliefState,
	observedTargetEnergy: number,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	const calibration = normalizeCalibration(calibrationInput);
	const state = ageRaidBelief(stateInput, deltaSeconds, calibration);
	const target = clamp(
		observedTargetEnergy,
		0,
		calibration.targetEnergyCapacity
	);
	const alpha = timeAlpha(deltaSeconds, calibration.signatureHalfLifeSeconds);
	return {
		perceivedTargetEnergy:
			state.perceivedTargetEnergy +
			(target - state.perceivedTargetEnergy) * alpha,
		expectedBreachProbability: state.expectedBreachProbability,
		expectedArrivalViability: state.expectedArrivalViability,
		uncertainty: state.uncertainty,
		directObservations: state.directObservations,
		secondsSinceDirectObservation: state.secondsSinceDirectObservation
	};
}

/**
 * Direct raid evidence updates breach and viability expectations gradually. A
 * single success after repeated failure cannot reset the model to perfect
 * optimism; repeated evidence is required. Direct evidence also makes current
 * information less uncertain and resets its staleness clock.
 */
export function observeRaidOutcome(
	stateInput: RaidBeliefState,
	observation: RaidOutcomeObservation,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	const calibration = normalizeCalibration(calibrationInput);
	const reliability = clamp01(observation.reliability);
	const breachAlpha = calibration.breachObservationWeight * reliability;
	const viabilityAlpha = calibration.viabilityObservationWeight * reliability;
	const breachEvidence = observation.breached ? 1 : 0;
	const viabilityEvidence = clamp01(observation.remainingViability);
	const breach = clamp01(
		stateInput.expectedBreachProbability +
			(breachEvidence - stateInput.expectedBreachProbability) * breachAlpha
	);
	const viability = clamp01(
		stateInput.expectedArrivalViability +
			(viabilityEvidence - stateInput.expectedArrivalViability) * viabilityAlpha
	);
	const uncertaintyRetention =
		1 - calibration.directUncertaintyReduction * reliability;

	return {
		perceivedTargetEnergy: clamp(
			stateInput.perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		),
		expectedBreachProbability: breach,
		expectedArrivalViability: viability,
		uncertainty: clamp01(stateInput.uncertainty * uncertaintyRetention),
		directObservations:
			Math.max(0, Math.floor(positive(stateInput.directObservations))) + 1,
		secondsSinceDirectObservation: 0
	};
}

/**
 * Bounded information-need signal for downstream probe experiments. It does not
 * choose a raid or grant an economic bonus. A stale belief matters more when the
 * target still appears valuable; a dim target has little reason to re-check.
 */
export function raidBeliefInformationNeed(
	state: RaidBeliefState,
	calibrationInput: RaidBeliefCalibration
): number {
	const calibration = normalizeCalibration(calibrationInput);
	const richness = clamp(
		positive(state.perceivedTargetEnergy) / calibration.targetEnergyCapacity,
		0,
		1
	);
	return clamp01(clamp01(state.uncertainty) * Math.sqrt(richness));
}

export function raidBeliefExpectedValueInputs(
	state: RaidBeliefState,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefExpectedValueInputs {
	const calibration = normalizeCalibration(calibrationInput);
	return {
		perceivedTargetEnergy: clamp(
			state.perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		),
		expectedBreachProbability: clamp01(state.expectedBreachProbability),
		expectedArrivalViability: clamp01(state.expectedArrivalViability)
	};
}

export const DEFAULT_RAID_BELIEF_CALIBRATION: RaidBeliefCalibration = {
	targetEnergyCapacity: 30000,
	signatureHalfLifeSeconds: 8,
	uncertaintyStaleHalfLifeSeconds: 90,
	breachObservationWeight: 0.18,
	viabilityObservationWeight: 0.22,
	directUncertaintyReduction: 0.45
};

export const DEFAULT_RAID_BELIEF_PRIOR: RaidBeliefPrior = {
	perceivedTargetEnergy: 24000,
	expectedBreachProbability: 0.74,
	expectedArrivalViability: 0.68,
	uncertainty: 0.58
};