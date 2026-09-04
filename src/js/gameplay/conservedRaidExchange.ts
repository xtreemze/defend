export interface ConservedRaidExchangeInput {
	/** Defender energy physically stored before this exchange. */
	defenderReserve: number;
	/** Maximum defender storage capacity. */
	defenderCapacity: number;
	/** Energy the breaching raider would extract if the target were rich enough. */
	requestedExtractionEnergy: number;
	/** Raider energy physically embodied/committed and available to be captured. */
	attackerEmbodiedEnergy: number;
	/** Defender collection demand derived from physical combat outcomes. */
	requestedRecoveryEnergy: number;
	/** Additional dissipative defender loss per unit actually extracted. */
	collateralDissipationRatio: number;
}

export interface ConservedRaidExchangeResult {
	reserveBefore: number;
	reserveAfterExtraction: number;
	reserveAfterLoss: number;
	reserveAfter: number;
	requestedExtractionEnergy: number;
	extractedEnergy: number;
	unmetExtractionEnergy: number;
	requestedCollateralDissipation: number;
	collateralDissipation: number;
	unmetCollateralDissipation: number;
	requestedRecoveryEnergy: number;
	sourceAvailableRecoveryEnergy: number;
	recoverySourceShortfall: number;
	recoveredEnergy: number;
	uncollectedRecoveryEnergy: number;
	defenderEnergyLost: number;
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

/**
 * Settle one abstract raid exchange without allowing either side to manufacture
 * energy through cap clipping.
 *
 * Event order is intentionally explicit:
 *
 * 1. a breaching body extracts from energy already stored in the defender silo;
 * 2. optional collateral loss may dissipate additional defender energy, but can
 *    never increase the attacker's extraction;
 * 3. defender recovery from damaged/destroyed attacker bodies is collected into
 *    the remaining storage headroom.
 *
 * Production event timing may later call the individual physical transitions at
 * different moments. This helper exists for headless deterrence/economy models
 * where those events are summarized into one opportunity.
 */
export function settleConservedRaidExchange(
	input: ConservedRaidExchangeInput
): ConservedRaidExchangeResult {
	const capacity = positive(input.defenderCapacity);
	const reserveBefore = clamp(input.defenderReserve, 0, capacity);

	const requestedExtractionEnergy = positive(input.requestedExtractionEnergy);
	const extractedEnergy = Math.min(reserveBefore, requestedExtractionEnergy);
	const unmetExtractionEnergy = Math.max(
		0,
		requestedExtractionEnergy - extractedEnergy
	);
	const reserveAfterExtraction = reserveBefore - extractedEnergy;

	const requestedCollateralDissipation =
		extractedEnergy * positive(input.collateralDissipationRatio);
	const collateralDissipation = Math.min(
		reserveAfterExtraction,
		requestedCollateralDissipation
	);
	const unmetCollateralDissipation = Math.max(
		0,
		requestedCollateralDissipation - collateralDissipation
	);
	const reserveAfterLoss = reserveAfterExtraction - collateralDissipation;

	const requestedRecoveryEnergy = positive(input.requestedRecoveryEnergy);
	const sourceAvailableRecoveryEnergy = Math.min(
		requestedRecoveryEnergy,
		positive(input.attackerEmbodiedEnergy)
	);
	const recoverySourceShortfall = Math.max(
		0,
		requestedRecoveryEnergy - sourceAvailableRecoveryEnergy
	);
	const recoveredEnergy = Math.min(
		sourceAvailableRecoveryEnergy,
		Math.max(0, capacity - reserveAfterLoss)
	);
	const uncollectedRecoveryEnergy = Math.max(
		0,
		sourceAvailableRecoveryEnergy - recoveredEnergy
	);
	const reserveAfter = reserveAfterLoss + recoveredEnergy;

	return {
		reserveBefore,
		reserveAfterExtraction,
		reserveAfterLoss,
		reserveAfter,
		requestedExtractionEnergy,
		extractedEnergy,
		unmetExtractionEnergy,
		requestedCollateralDissipation,
		collateralDissipation,
		unmetCollateralDissipation,
		requestedRecoveryEnergy,
		sourceAvailableRecoveryEnergy,
		recoverySourceShortfall,
		recoveredEnergy,
		uncollectedRecoveryEnergy,
		defenderEnergyLost: extractedEnergy + collateralDissipation
	};
}

/**
 * Actual attacker return must use energy that was physically extracted rather
 * than the raider's theoretical extraction potential.
 */
export function raidAttackerNetReturn(
	extractedEnergy: number,
	committedEnergy: number,
	travelCost: number
): number {
	return (
		positive(extractedEnergy) -
		positive(committedEnergy) -
		positive(travelCost)
	);
}

/**
 * Readable target richness for experiments/signatures. This is deliberately a
 * lossy ratio, not authoritative defender state and not a difficulty level.
 */
export function raidTargetRichness(
	defenderReserve: number,
	defenderCapacity: number
): number {
	const capacity = positive(defenderCapacity);
	if (capacity <= 0) return 0;
	return clamp(positive(defenderReserve) / capacity, 0, 1);
}
