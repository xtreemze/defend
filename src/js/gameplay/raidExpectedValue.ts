export type RaidExpectedValueTier = 1 | 2 | 3;

export interface RaidExpectedValueInput {
	tier: RaidExpectedValueTier;
	committedEnergy: number;
	extractionPotential: number;
	perceivedTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViability: number;
	travelAndOperatingCost: number;
}

export interface RaidExpectedValueEstimate {
	tier: RaidExpectedValueTier;
	committedEnergy: number;
	perceivedTargetEnergy: number;
	potentialExtractionAtArrival: number;
	targetLimitedExtractionOnBreach: number;
	expectedExtractedEnergy: number;
	expectedNetReturn: number;
	expectedReturnOnCommitment: number;
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

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, finite(value)));
}

/**
 * Estimate raid value before commitment using a lossy/perceived target-energy
 * quantity rather than authoritative silo state.
 *
 * This is deliberately not settlement authority. #114 owns the conserved
 * after-the-fact exchange. This estimate exists so deterrence can react before
 * launch: an apparently poor target should make expensive commitments
 * unattractive even if its defenses are weak.
 */
export function estimateRaidExpectedValue(
	input: RaidExpectedValueInput
): RaidExpectedValueEstimate {
	const committedEnergy = positive(input.committedEnergy);
	const extractionPotential = positive(input.extractionPotential);
	const perceivedTargetEnergy = positive(input.perceivedTargetEnergy);
	const breachProbability = clamp01(input.expectedBreachProbability);
	const arrivalViability = clamp01(input.expectedArrivalViability);
	const travelAndOperatingCost = positive(input.travelAndOperatingCost);

	const potentialExtractionAtArrival = extractionPotential * arrivalViability;
	const targetLimitedExtractionOnBreach = Math.min(
		perceivedTargetEnergy,
		potentialExtractionAtArrival
	);
	const expectedExtractedEnergy =
		targetLimitedExtractionOnBreach * breachProbability;
	const expectedNetReturn =
		expectedExtractedEnergy - committedEnergy - travelAndOperatingCost;
	const expectedReturnOnCommitment =
		committedEnergy <= 0 ? 0 : expectedNetReturn / committedEnergy;

	return {
		tier: input.tier,
		committedEnergy,
		perceivedTargetEnergy,
		potentialExtractionAtArrival,
		targetLimitedExtractionOnBreach,
		expectedExtractedEnergy,
		expectedNetReturn,
		expectedReturnOnCommitment
	};
}

/**
 * Caller-owned threshold for deciding whether a commitment is economically
 * admissible. A negative threshold can represent deliberate scouting/probing;
 * zero or positive thresholds express stricter economic discipline.
 */
export function raidExpectedValueIsAdmissible(
	estimate: RaidExpectedValueEstimate,
	minimumExpectedNetReturn: number
): boolean {
	return estimate.expectedNetReturn >= finite(minimumExpectedNetReturn);
}

/**
 * Diagnostic selector for experiments: among economically admissible tiers,
 * choose the highest expected absolute net return. Ties prefer the lower-energy
 * commitment so tier number alone never wins a tie.
 *
 * This is not a production AI recommendation; #107 should compare multiple
 * commitment policies and preserve explicit probe behavior under uncertainty.
 */
export function selectRaidTierByExpectedNetReturn(
	estimates: RaidExpectedValueEstimate[],
	minimumExpectedNetReturn: number
): RaidExpectedValueTier | null {
	let best: RaidExpectedValueEstimate | null = null;
	for (let index = 0; index < estimates.length; index += 1) {
		const candidate = estimates[index];
		if (!raidExpectedValueIsAdmissible(candidate, minimumExpectedNetReturn)) {
			continue;
		}
		if (
			best === null ||
			candidate.expectedNetReturn > best.expectedNetReturn ||
			(candidate.expectedNetReturn === best.expectedNetReturn &&
				candidate.committedEnergy < best.committedEnergy)
		) {
			best = candidate;
		}
	}
	return best === null ? null : best.tier;
}
