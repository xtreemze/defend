import {
	settleConservedRaidExchange,
	ConservedRaidExchangeResult
} from "./conservedRaidExchange";

export type RaiderCapitalTier = 1 | 2 | 3;
export type RaiderCapitalMode = "fully-sunk" | "embodied-return";

export interface RaiderCapitalProfile {
	tier: RaiderCapitalTier;
	committedEnergy: number;
	extractionPotential: number;
}

export interface RaiderCapitalSettlementInput {
	mode: RaiderCapitalMode;
	profile: RaiderCapitalProfile;
	defenderReserve: number;
	defenderCapacity: number;
	breached: boolean;
	remainingViability: number;
	travelAndOperatingCost: number;
	defenderCaptureFraction: number;
	collateralDissipationRatio: number;
}

export interface RaiderCapitalSettlement {
	mode: RaiderCapitalMode;
	tier: RaiderCapitalTier;
	committedEnergy: number;
	remainingViability: number;
	requestedExtractionEnergy: number;
	extractedEnergy: number;
	returnedCapital: number;
	capitalAtRiskLost: number;
	capturedCapital: number;
	looseOrDissipatedCapital: number;
	sunkAtLaunch: number;
	attackerNetReturn: number;
	trackedEnergyBefore: number;
	trackedEnergyAfter: number;
	conservationResidual: number;
	exchange: ConservedRaidExchangeResult;
}

export interface RaiderCapitalExpectedValueInput {
	mode: RaiderCapitalMode;
	profile: RaiderCapitalProfile;
	perceivedTargetEnergy: number;
	expectedBreachProbability: number;
	expectedArrivalViabilityOnBreach: number;
	expectedReturnViabilityOnFailure: number;
	travelAndOperatingCost: number;
}

export interface RaiderCapitalExpectedValue {
	mode: RaiderCapitalMode;
	tier: RaiderCapitalTier;
	committedEnergy: number;
	perceivedTargetEnergy: number;
	expectedExtractedEnergy: number;
	expectedReturnedCapital: number;
	expectedCapitalLoss: number;
	expectedNetReturn: number;
	expectedReturnOnCommitment: number;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) return fallback;
	return value;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, finite(value)));
}

function normalizedProfile(profile: RaiderCapitalProfile): RaiderCapitalProfile {
	return {
		tier: profile.tier,
		committedEnergy: positive(profile.committedEnergy),
		extractionPotential: positive(profile.extractionPotential)
	};
}

/**
 * Compare two interpretations of launch commitment while keeping the target
 * exchange conserved through #114's settlement contract.
 *
 * `fully-sunk` deliberately treats launch commitment as an explicit sink. It
 * therefore cannot also be a defender-recovery source without introducing an
 * additional embodied-energy source.
 *
 * `embodied-return` moves launch commitment into the raider. Surviving capital
 * returns in proportion to final viability; capital that does not return is
 * the only launch capital available for defender capture or dissipation.
 */
export function settleRaiderCapitalEconomy(
	input: RaiderCapitalSettlementInput
): RaiderCapitalSettlement {
	const profile = normalizedProfile(input.profile);
	const viability = clamp01(input.remainingViability);
	const captureFraction = clamp01(input.defenderCaptureFraction);
	const requestedExtractionEnergy = input.breached
		? profile.extractionPotential * viability
		: 0;

	const returnedCapital =
		input.mode === "embodied-return"
			? profile.committedEnergy * viability
			: 0;
	const capitalAtRiskLost =
		input.mode === "embodied-return"
			? profile.committedEnergy - returnedCapital
			: 0;
	const requestedRecoveryEnergy = capitalAtRiskLost * captureFraction;
	const sunkAtLaunch =
		input.mode === "fully-sunk" ? profile.committedEnergy : 0;

	const exchange = settleConservedRaidExchange({
		defenderReserve: positive(input.defenderReserve),
		defenderCapacity: positive(input.defenderCapacity),
		requestedExtractionEnergy,
		attackerEmbodiedEnergy: capitalAtRiskLost,
		requestedRecoveryEnergy,
		collateralDissipationRatio: positive(input.collateralDissipationRatio)
	});

	const capturedCapital = exchange.recoveredEnergy;
	const looseOrDissipatedCapital = Math.max(
		0,
		capitalAtRiskLost - capturedCapital
	);
	const travelAndOperatingCost = positive(input.travelAndOperatingCost);
	const attackerNetReturn =
		exchange.extractedEnergy +
		returnedCapital -
		profile.committedEnergy -
		travelAndOperatingCost;

	const trackedEnergyBefore =
		exchange.reserveBefore + profile.committedEnergy;
	const trackedEnergyAfter =
		exchange.reserveAfter +
		exchange.extractedEnergy +
		exchange.collateralDissipation +
		returnedCapital +
		looseOrDissipatedCapital +
		sunkAtLaunch;

	return {
		mode: input.mode,
		tier: profile.tier,
		committedEnergy: profile.committedEnergy,
		remainingViability: viability,
		requestedExtractionEnergy,
		extractedEnergy: exchange.extractedEnergy,
		returnedCapital,
		capitalAtRiskLost,
		capturedCapital,
		looseOrDissipatedCapital,
		sunkAtLaunch,
		attackerNetReturn,
		trackedEnergyBefore,
		trackedEnergyAfter,
		conservationResidual: trackedEnergyAfter - trackedEnergyBefore,
		exchange
	};
}

/**
 * Pre-commit expected value with the same target-richness cap used by #119,
 * extended to account for capital that can physically return from a surviving
 * raider. Failure viability represents a retreat/failed-breach survival
 * hypothesis and remains caller-owned.
 */
export function estimateRaiderCapitalExpectedValue(
	input: RaiderCapitalExpectedValueInput
): RaiderCapitalExpectedValue {
	const profile = normalizedProfile(input.profile);
	const perceivedTargetEnergy = positive(input.perceivedTargetEnergy);
	const breachProbability = clamp01(input.expectedBreachProbability);
	const breachViability = clamp01(input.expectedArrivalViabilityOnBreach);
	const failureViability = clamp01(input.expectedReturnViabilityOnFailure);
	const travelAndOperatingCost = positive(input.travelAndOperatingCost);
	const extractionOnBreach = Math.min(
		perceivedTargetEnergy,
		profile.extractionPotential * breachViability
	);
	const expectedExtractedEnergy = extractionOnBreach * breachProbability;

	const expectedReturnedCapital =
		input.mode === "embodied-return"
			? profile.committedEnergy *
				(breachProbability * breachViability +
					(1 - breachProbability) * failureViability)
			: 0;
	const expectedCapitalLoss =
		profile.committedEnergy - expectedReturnedCapital;
	const expectedNetReturn =
		expectedExtractedEnergy - expectedCapitalLoss - travelAndOperatingCost;
	const expectedReturnOnCommitment =
		profile.committedEnergy <= 0
			? 0
			: expectedNetReturn / profile.committedEnergy;

	return {
		mode: input.mode,
		tier: profile.tier,
		committedEnergy: profile.committedEnergy,
		perceivedTargetEnergy,
		expectedExtractedEnergy,
		expectedReturnedCapital,
		expectedCapitalLoss,
		expectedNetReturn,
		expectedReturnOnCommitment
	};
}

export function raiderCapitalExpectedValueIsPositive(
	estimate: RaiderCapitalExpectedValue
): boolean {
	return estimate.expectedNetReturn > 0;
}

export const DEFAULT_RAIDER_CAPITAL_PROFILES: RaiderCapitalProfile[] = [
	{ tier: 1, committedEnergy: 3000, extractionPotential: 7720 },
	{ tier: 2, committedEnergy: 12000, extractionPotential: 30440 },
	{ tier: 3, committedEnergy: 27000, extractionPotential: 68160 }
];