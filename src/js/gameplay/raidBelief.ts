export interface RaidOpportunityBelief {
	perceivedTargetEnergy: number;
}

export interface RaidApproachBelief {
	expectedBreachProbability: number;
	expectedArrivalViability: number;
	uncertainty: number;
	directObservations: number;
	secondsSinceDirectObservation: number;
}

/**
 * Convenience composite for one target + one approach context. Callers should
 * share `opportunity` across a target while keeping separate `approach` beliefs
 * for materially different sector/tier/insertion contexts.
 */
export interface RaidBeliefState {
	opportunity: RaidOpportunityBelief;
	approach: RaidApproachBelief;
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

function isFiniteNumber(value: number): boolean {
	return (
		typeof value === "number" &&
		value === value &&
		value !== Infinity &&
		value !== -Infinity
	);
}

function finite(value: number, fallback = 0): number {
	return isFiniteNumber(value) ? value : fallback;
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

function normalizeApproach(approach: RaidApproachBelief): RaidApproachBelief {
	return {
		expectedBreachProbability: clamp01(approach.expectedBreachProbability),
		expectedArrivalViability: clamp01(approach.expectedArrivalViability),
		uncertainty: clamp01(approach.uncertainty),
		directObservations: Math.max(
			0,
			Math.floor(positive(approach.directObservations))
		),
		secondsSinceDirectObservation: positive(
			approach.secondsSinceDirectObservation
		)
	};
}

function timeAlpha(deltaSeconds: number, halfLifeSeconds: number): number {
	const delta = positive(deltaSeconds);
	if (delta <= 0) return 0;
	if (halfLifeSeconds <= 0) return 1;
	return 1 - Math.pow(0.5, delta / halfLifeSeconds);
}

function validSignatureObservation(observedTargetEnergy: number): boolean {
	return isFiniteNumber(observedTargetEnergy) && observedTargetEnergy >= 0;
}

function validOutcomeObservation(observation: RaidOutcomeObservation): boolean {
	return (
		typeof observation.breached === "boolean" &&
		isFiniteNumber(observation.reliability) &&
		observation.reliability > 0 &&
		isFiniteNumber(observation.remainingViability) &&
		observation.remainingViability >= 0 &&
		observation.remainingViability <= 1
	);
}

export function createRaidOpportunityBelief(
	perceivedTargetEnergy: number,
	calibrationInput: RaidBeliefCalibration
): RaidOpportunityBelief {
	const calibration = normalizeCalibration(calibrationInput);
	return {
		perceivedTargetEnergy: clamp(
			perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		)
	};
}

export function createRaidApproachBelief(
	prior: RaidBeliefPrior
): RaidApproachBelief {
	return {
		expectedBreachProbability: clamp01(prior.expectedBreachProbability),
		expectedArrivalViability: clamp01(prior.expectedArrivalViability),
		uncertainty: clamp01(prior.uncertainty),
		directObservations: 0,
		secondsSinceDirectObservation: 0
	};
}

export function createRaidBelief(
	prior: RaidBeliefPrior,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	return {
		opportunity: createRaidOpportunityBelief(
			prior.perceivedTargetEnergy,
			calibrationInput
		),
		approach: createRaidApproachBelief(prior)
	};
}

/**
 * Age one approach context without changing its mean physical belief. Callers
 * may age many approach beliefs independently while sharing one target-level
 * opportunity belief.
 */
export function ageRaidApproachBelief(
	approach: RaidApproachBelief,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidApproachBelief {
	const calibration = normalizeCalibration(calibrationInput);
	const normalized = normalizeApproach(approach);
	const delta = positive(deltaSeconds);
	const staleAlpha = timeAlpha(
		delta,
		calibration.uncertaintyStaleHalfLifeSeconds
	);
	return {
		expectedBreachProbability: normalized.expectedBreachProbability,
		expectedArrivalViability: normalized.expectedArrivalViability,
		uncertainty: clamp01(
			normalized.uncertainty +
				(1 - normalized.uncertainty) * staleAlpha
		),
		directObservations: normalized.directObservations,
		secondsSinceDirectObservation:
			normalized.secondsSinceDirectObservation + delta
	};
}

export function ageRaidBelief(
	state: RaidBeliefState,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	return {
		opportunity: createRaidOpportunityBelief(
			state.opportunity.perceivedTargetEnergy,
			calibrationInput
		),
		approach: ageRaidApproachBelief(
			state.approach,
			deltaSeconds,
			calibrationInput
		)
	};
}

/**
 * Update target-global opportunity from a lossy teal signature. Invalid/missing
 * samples are not evidence that the target is empty: they leave the opportunity
 * mean unchanged. Values above capacity may still saturate at capacity.
 */
export function observeRaidOpportunitySignature(
	opportunity: RaidOpportunityBelief,
	observedTargetEnergy: number,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidOpportunityBelief {
	const calibration = normalizeCalibration(calibrationInput);
	const current = clamp(
		opportunity.perceivedTargetEnergy,
		0,
		calibration.targetEnergyCapacity
	);
	if (!validSignatureObservation(observedTargetEnergy)) {
		return { perceivedTargetEnergy: current };
	}
	const target = Math.min(
		calibration.targetEnergyCapacity,
		observedTargetEnergy
	);
	const alpha = timeAlpha(deltaSeconds, calibration.signatureHalfLifeSeconds);
	return {
		perceivedTargetEnergy: current + (target - current) * alpha
	};
}

/** Convenience composite: time passes for this approach even when a passive
 * signature sample is unusable; invalid sensor data does not become knowledge. */
export function observeRaidSignature(
	state: RaidBeliefState,
	observedTargetEnergy: number,
	deltaSeconds: number,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	return {
		opportunity: observeRaidOpportunitySignature(
			state.opportunity,
			observedTargetEnergy,
			deltaSeconds,
			calibrationInput
		),
		approach: ageRaidApproachBelief(
			state.approach,
			deltaSeconds,
			calibrationInput
		)
	};
}

/**
 * Direct raid evidence updates one contextual approach belief only. Invalid
 * physical evidence or reliability <= 0 is an epistemic no-op: it does not
 * update means, reduce uncertainty, increment evidence count, or reset age.
 */
export function observeRaidApproachOutcome(
	approach: RaidApproachBelief,
	observation: RaidOutcomeObservation,
	calibrationInput: RaidBeliefCalibration
): RaidApproachBelief {
	const calibration = normalizeCalibration(calibrationInput);
	const normalized = normalizeApproach(approach);
	if (!validOutcomeObservation(observation)) {
		return normalized;
	}

	const reliability = clamp01(observation.reliability);
	const breachAlpha = calibration.breachObservationWeight * reliability;
	const viabilityAlpha = calibration.viabilityObservationWeight * reliability;
	const breachEvidence = observation.breached ? 1 : 0;
	const viabilityEvidence = observation.remainingViability;
	const uncertaintyRetention =
		1 - calibration.directUncertaintyReduction * reliability;

	return {
		expectedBreachProbability: clamp01(
			normalized.expectedBreachProbability +
				(breachEvidence - normalized.expectedBreachProbability) * breachAlpha
		),
		expectedArrivalViability: clamp01(
			normalized.expectedArrivalViability +
				(viabilityEvidence - normalized.expectedArrivalViability) *
					viabilityAlpha
		),
		uncertainty: clamp01(normalized.uncertainty * uncertaintyRetention),
		directObservations: normalized.directObservations + 1,
		secondsSinceDirectObservation: 0
	};
}

export function observeRaidOutcome(
	state: RaidBeliefState,
	observation: RaidOutcomeObservation,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefState {
	return {
		opportunity: createRaidOpportunityBelief(
			state.opportunity.perceivedTargetEnergy,
			calibrationInput
		),
		approach: observeRaidApproachOutcome(
			state.approach,
			observation,
			calibrationInput
		)
	};
}

/**
 * Bounded information-need signal for one approach context. It does not choose
 * a raid or grant economic return. A stale route belief matters more when the
 * shared target still appears valuable.
 */
export function raidBeliefInformationNeed(
	state: RaidBeliefState,
	calibrationInput: RaidBeliefCalibration
): number {
	const calibration = normalizeCalibration(calibrationInput);
	const richness = clamp(
		positive(state.opportunity.perceivedTargetEnergy) /
			calibration.targetEnergyCapacity,
		0,
		1
	);
	return clamp01(
		clamp01(state.approach.uncertainty) * Math.sqrt(richness)
	);
}

export function raidBeliefExpectedValueInputs(
	state: RaidBeliefState,
	calibrationInput: RaidBeliefCalibration
): RaidBeliefExpectedValueInputs {
	const calibration = normalizeCalibration(calibrationInput);
	return {
		perceivedTargetEnergy: clamp(
			state.opportunity.perceivedTargetEnergy,
			0,
			calibration.targetEnergyCapacity
		),
		expectedBreachProbability: clamp01(
			state.approach.expectedBreachProbability
		),
		expectedArrivalViability: clamp01(
			state.approach.expectedArrivalViability
		)
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
