export type RaidExchangeChronology =
	| "breach-then-recovery"
	| "recovery-then-breach";

export interface ConservedRaidExchangeInput {
	/** Defender energy physically stored before this opportunity summary. */
	defenderReserve: number;
	/** Maximum defender storage capacity. */
	defenderCapacity: number;
	/** Energy the breaching raider would extract if the target were rich enough. */
	requestedExtractionEnergy: number;
	/**
	 * Legacy aggregate name: energy eligible to source defender recovery.
	 * New integrations should use `captureEligibleAttackerEnergy` on the
	 * composable recovery primitive so surviving/escaped capital is explicit.
	 */
	attackerEmbodiedEnergy: number;
	/** Defender collection demand derived from physical combat outcomes. */
	requestedRecoveryEnergy: number;
	/** Additional dissipative defender loss per unit actually extracted. */
	collateralDissipationRatio: number;
}

export interface ConservedRaidExchangeResult {
	chronology: RaidExchangeChronology;
	reserveBefore: number;
	/** Reserve physically present immediately before extraction. */
	reserveAtBreach: number;
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

export interface RaidBreachSettlementInput {
	defenderReserve: number;
	defenderCapacity: number;
	requestedExtractionEnergy: number;
	collateralDissipationRatio: number;
}

export interface RaidBreachSettlementResult {
	reserveBefore: number;
	reserveAfterExtraction: number;
	reserveAfter: number;
	requestedExtractionEnergy: number;
	extractedEnergy: number;
	unmetExtractionEnergy: number;
	requestedCollateralDissipation: number;
	collateralDissipation: number;
	unmetCollateralDissipation: number;
	defenderEnergyLost: number;
}

export interface RaidRecoveryCollectionInput {
	defenderReserve: number;
	defenderCapacity: number;
	/** Attacker energy physically lost/exposed and eligible for capture. */
	captureEligibleAttackerEnergy: number;
	requestedRecoveryEnergy: number;
}

export interface RaidRecoveryCollectionResult {
	reserveBefore: number;
	reserveAfter: number;
	requestedRecoveryEnergy: number;
	sourceAvailableRecoveryEnergy: number;
	recoverySourceShortfall: number;
	recoveredEnergy: number;
	uncollectedRecoveryEnergy: number;
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

function normalizedReserve(
	defenderReserve: number,
	defenderCapacity: number
): { reserve: number; capacity: number } {
	const capacity = positive(defenderCapacity);
	return {
		reserve: clamp(defenderReserve, 0, capacity),
		capacity
	};
}

/**
 * Settle only the physical breach/extraction portion of an exchange.
 * Recovery packets are deliberately not part of this primitive.
 */
export function settleRaidBreach(
	input: RaidBreachSettlementInput
): RaidBreachSettlementResult {
	const normalized = normalizedReserve(
		input.defenderReserve,
		input.defenderCapacity
	);
	const reserveBefore = normalized.reserve;
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
	const reserveAfter = reserveAfterExtraction - collateralDissipation;
	return {
		reserveBefore,
		reserveAfterExtraction,
		reserveAfter,
		requestedExtractionEnergy,
		extractedEnergy,
		unmetExtractionEnergy,
		requestedCollateralDissipation,
		collateralDissipation,
		unmetCollateralDissipation,
		defenderEnergyLost: extractedEnergy + collateralDissipation
	};
}

/**
 * Collect only defender recovery that has physically arrived. The recovery
 * source is explicitly capture-eligible attacker energy, not total committed or
 * surviving capital.
 */
export function collectRaidRecovery(
	input: RaidRecoveryCollectionInput
): RaidRecoveryCollectionResult {
	const normalized = normalizedReserve(
		input.defenderReserve,
		input.defenderCapacity
	);
	const reserveBefore = normalized.reserve;
	const requestedRecoveryEnergy = positive(input.requestedRecoveryEnergy);
	const sourceAvailableRecoveryEnergy = Math.min(
		requestedRecoveryEnergy,
		positive(input.captureEligibleAttackerEnergy)
	);
	const recoverySourceShortfall = Math.max(
		0,
		requestedRecoveryEnergy - sourceAvailableRecoveryEnergy
	);
	const recoveredEnergy = Math.min(
		sourceAvailableRecoveryEnergy,
		Math.max(0, normalized.capacity - reserveBefore)
	);
	const uncollectedRecoveryEnergy = Math.max(
		0,
		sourceAvailableRecoveryEnergy - recoveredEnergy
	);
	return {
		reserveBefore,
		reserveAfter: reserveBefore + recoveredEnergy,
		requestedRecoveryEnergy,
		sourceAvailableRecoveryEnergy,
		recoverySourceShortfall,
		recoveredEnergy,
		uncollectedRecoveryEnergy
	};
}

/**
 * Opportunity-level convenience composition with an explicit chronology.
 * Conservation does not imply that breach and packet collection commute: the
 * chosen order can change `reserveAtBreach`, actual extraction and final reserve.
 */
export function settleConservedRaidExchangeWithOrder(
	input: ConservedRaidExchangeInput,
	chronology: RaidExchangeChronology
): ConservedRaidExchangeResult {
	const initial = normalizedReserve(
		input.defenderReserve,
		input.defenderCapacity
	);
	let breach: RaidBreachSettlementResult;
	let recovery: RaidRecoveryCollectionResult;

	if (chronology === "recovery-then-breach") {
		recovery = collectRaidRecovery({
			defenderReserve: initial.reserve,
			defenderCapacity: initial.capacity,
			captureEligibleAttackerEnergy: input.attackerEmbodiedEnergy,
			requestedRecoveryEnergy: input.requestedRecoveryEnergy
		});
		breach = settleRaidBreach({
			defenderReserve: recovery.reserveAfter,
			defenderCapacity: initial.capacity,
			requestedExtractionEnergy: input.requestedExtractionEnergy,
			collateralDissipationRatio: input.collateralDissipationRatio
		});
	} else {
		breach = settleRaidBreach({
			defenderReserve: initial.reserve,
			defenderCapacity: initial.capacity,
			requestedExtractionEnergy: input.requestedExtractionEnergy,
			collateralDissipationRatio: input.collateralDissipationRatio
		});
		recovery = collectRaidRecovery({
			defenderReserve: breach.reserveAfter,
			defenderCapacity: initial.capacity,
			captureEligibleAttackerEnergy: input.attackerEmbodiedEnergy,
			requestedRecoveryEnergy: input.requestedRecoveryEnergy
		});
	}

	return {
		chronology,
		reserveBefore: initial.reserve,
		reserveAtBreach: breach.reserveBefore,
		reserveAfterExtraction: breach.reserveAfterExtraction,
		reserveAfterLoss: breach.reserveAfter,
		reserveAfter:
			chronology === "recovery-then-breach"
				? breach.reserveAfter
				: recovery.reserveAfter,
		requestedExtractionEnergy: breach.requestedExtractionEnergy,
		extractedEnergy: breach.extractedEnergy,
		unmetExtractionEnergy: breach.unmetExtractionEnergy,
		requestedCollateralDissipation: breach.requestedCollateralDissipation,
		collateralDissipation: breach.collateralDissipation,
		unmetCollateralDissipation: breach.unmetCollateralDissipation,
		requestedRecoveryEnergy: recovery.requestedRecoveryEnergy,
		sourceAvailableRecoveryEnergy: recovery.sourceAvailableRecoveryEnergy,
		recoverySourceShortfall: recovery.recoverySourceShortfall,
		recoveredEnergy: recovery.recoveredEnergy,
		uncollectedRecoveryEnergy: recovery.uncollectedRecoveryEnergy,
		defenderEnergyLost: breach.defenderEnergyLost
	};
}

/**
 * Backward-compatible aggregate hypothesis: breach/collateral first, then
 * recovery collection. New headless integrations should choose chronology
 * explicitly or call the primitives at their actual event times.
 */
export function settleConservedRaidExchange(
	input: ConservedRaidExchangeInput
): ConservedRaidExchangeResult {
	return settleConservedRaidExchangeWithOrder(
		input,
		"breach-then-recovery"
	);
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
