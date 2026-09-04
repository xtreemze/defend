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
	/** Physical viability/capability when extraction occurs. */
	breachViability: number;
	/** Capital fraction that actually survives the later retreat/evacuation. */
	returnViability: number;
	travelAndOperatingCost: number;
	defenderCaptureFraction: number;
	collateralDissipationRatio: number;
}

export interface RaiderCapitalSettlement {
	mode: RaiderCapitalMode;
	tier: RaiderCapitalTier;
	committedEnergy: number;
	breachViability: number;
	returnViability: number;
	capitalPresentAtBreach: number;
	preBreachCapitalLoss: number;
	postBreachCapitalLoss: number;
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
	/** Expected body viability/capability at successful extraction. */
	expectedArrivalViabilityOnBreach: number;
	/** Expected capital fraction that returns after a successful breach. */
	expectedReturnViabilityAfterBreach: number;
	/** Expected capital fraction that returns after a failed breach/retreat. */
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
	expectedPostBreachCapitalLoss: number;
	expectedNetReturn: number;
	expectedReturnOnCommitment: number;
}

function finite(value: number, fallback = 0): number {
	if (
		typeof value !== "number" ||
		value !== value ||
		value === Infinity ||
		value === -Infinity
	) {
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
 * `embodied-return` moves launch commitment into the raider. Viability at breach
 * limits extraction capability and capital still physically present at that
 * moment. A separate return viability then allows post-breach interception,
 * ejection, collision or failed evacuation to destroy/expose additional capital.
 */
export function settleRaiderCapitalEconomy(
	input: RaiderCapitalSettlementInput
): RaiderCapitalSettlement {
	const profile = normalizedProfile(input.profile);
	const breachViability = input.breached ? clamp01(input.breachViability) : 0;
	const requestedReturnViability = clamp01(input.returnViability);
	const returnViability = input.breached
		? Math.min(requestedReturnViability, breachViability)
		: requestedReturnViability;
	const captureFraction = clamp01(input.defenderCaptureFraction);
	const requestedExtractionEnergy = input.breached
		? profile.extractionPotential * breachViability
		: 0;

	const capitalPresentAtBreach =
		input.mode === "embodied-return" && input.breached
			? profile.committedEnergy * breachViability
			: 0;
	const returnedCapital =
		input.mode === "embodied-return"
			? profile.committedEnergy * returnViability
			: 0;
	const preBreachCapitalLoss =
		input.mode !== "embodied-return"
			? 0
			: input.breached
				? Math.max(0, profile.committedEnergy - capitalPresentAtBreach)
				: Math.max(0, profile.committedEnergy - returnedCapital);
	const postBreachCapitalLoss =
		input.mode === "embodied-return" && input.breached
			? Math.max(0, capitalPresentAtBreach - returnedCapital)
			: 0;
	const capitalAtRiskLost = preBreachCapitalLoss + postBreachCapitalLoss;
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
		breachViability,
		returnViability,
		capitalPresentAtBreach,
		preBreachCapitalLoss,
		postBreachCapitalLoss,
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
 * Pre-commit expected value with target-richness-bounded extraction and an
 * explicit post-breach return phase. Successful extraction therefore does not
 * imply that the same fraction of capital safely reaches the mothership.
 */
export function estimateRaiderCapitalExpectedValue(
	input: RaiderCapitalExpectedValueInput
): RaiderCapitalExpectedValue {
	const profile = normalizedProfile(input.profile);
	const perceivedTargetEnergy = positive(input.perceivedTargetEnergy);
	const breachProbability = clamp01(input.expectedBreachProbability);
	const breachViability = clamp01(input.expectedArrivalViabilityOnBreach);
	const successReturnViability = Math.min(
		clamp01(input.expectedReturnViabilityAfterBreach),
		breachViability
	);
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
				(breachProbability * successReturnViability +
					(1 - breachProbability) * failureViability)
			: 0;
	const expectedCapitalLoss =
		profile.committedEnergy - expectedReturnedCapital;
	const expectedPostBreachCapitalLoss =
		input.mode === "embodied-return"
			? profile.committedEnergy *
				breachProbability *
				Math.max(0, breachViability - successReturnViability)
			: 0;
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
		expectedPostBreachCapitalLoss,
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
