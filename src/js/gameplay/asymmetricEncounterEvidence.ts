type AsymmetricVictoryAxis =
	| "economic"
	| "displacement"
	| "temporal"
	| "geometric"
	| "attrition";

interface AsymmetricEncounterEvidence {
	playerSucceeded: boolean;
	criticalAssetPreserved: boolean;
	playerCommittedEnergy: number;
	opponentCommittedEnergy: number;
	playerOperatingCost: number;
	opponentOperatingCost: number;
	playerRecoveredEnergy: number;
	opponentRecoveredEnergy: number;
	playerInfrastructureLoss: number;
	opponentInfrastructureLoss: number;
	bodiesFaced: number;
	bodiesDestroyed: number;
	bodiesEjected: number;
	bodiesExpired: number;
	bodiesBreached: number;
	routeDistanceAdded: number;
	delaySeconds: number;
}

interface AsymmetricVictoryThresholds {
	minimumCommitmentDisadvantage: number;
	minimumEconomicLeverage: number;
	minimumNonDestructiveResolutionShare: number;
	minimumRouteDistanceAdded: number;
	minimumDelaySeconds: number;
	maximumBreachRate: number;
}

interface AsymmetricVictoryEvaluation {
	qualifies: boolean;
	commitmentDisadvantage: number;
	playerGrossCost: number;
	opponentGrossCost: number;
	playerNetCost: number;
	opponentNetCost: number;
	economicLeverage: number;
	nonDestructiveResolutionShare: number;
	breachRate: number;
	resolvedBodies: number;
	axes: AsymmetricVictoryAxis[];
}

const MAX_EVIDENCE_SCALAR = 1e100;
const MIN_RATIO_DENOMINATOR = 1;

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_EVIDENCE_SCALAR) {
		return MAX_EVIDENCE_SCALAR;
	}
	if (value < -MAX_EVIDENCE_SCALAR) {
		return -MAX_EVIDENCE_SCALAR;
	}
	return value;
}

function nonnegative(value: number): number {
	return Math.max(0, finiteScalar(value));
}

function boundedRatio(numerator: number, denominator: number): number {
	const safeNumerator = nonnegative(numerator);
	const safeDenominator = Math.max(MIN_RATIO_DENOMINATOR, nonnegative(denominator));
	return Math.min(MAX_EVIDENCE_SCALAR, safeNumerator / safeDenominator);
}

function fraction(numerator: number, denominator: number): number {
	const safeDenominator = nonnegative(denominator);
	if (safeDenominator <= 0) {
		return 0;
	}
	return Math.max(0, Math.min(1, nonnegative(numerator) / safeDenominator));
}

function encounterGrossCost(
	committedEnergy: number,
	operatingCost: number,
	infrastructureLoss: number
): number {
	return (
		nonnegative(committedEnergy) +
		nonnegative(operatingCost) +
		nonnegative(infrastructureLoss)
	);
}

function encounterNetCost(
	committedEnergy: number,
	operatingCost: number,
	infrastructureLoss: number,
	recoveredEnergy: number
): number {
	return Math.max(
		0,
		encounterGrossCost(committedEnergy, operatingCost, infrastructureLoss) -
			nonnegative(recoveredEnergy)
	);
}

function evaluateAsymmetricVictory(
	evidence: AsymmetricEncounterEvidence,
	thresholds: AsymmetricVictoryThresholds
): AsymmetricVictoryEvaluation {
	const playerCommittedEnergy = nonnegative(evidence.playerCommittedEnergy);
	const opponentCommittedEnergy = nonnegative(evidence.opponentCommittedEnergy);
	const playerGrossCost = encounterGrossCost(
		playerCommittedEnergy,
		evidence.playerOperatingCost,
		evidence.playerInfrastructureLoss
	);
	const opponentGrossCost = encounterGrossCost(
		opponentCommittedEnergy,
		evidence.opponentOperatingCost,
		evidence.opponentInfrastructureLoss
	);
	const playerNetCost = encounterNetCost(
		playerCommittedEnergy,
		evidence.playerOperatingCost,
		evidence.playerInfrastructureLoss,
		evidence.playerRecoveredEnergy
	);
	const opponentNetCost = encounterNetCost(
		opponentCommittedEnergy,
		evidence.opponentOperatingCost,
		evidence.opponentInfrastructureLoss,
		evidence.opponentRecoveredEnergy
	);
	const commitmentDisadvantage = boundedRatio(
		opponentCommittedEnergy,
		playerCommittedEnergy
	);
	const economicLeverage = boundedRatio(opponentNetCost, playerGrossCost);
	const bodiesFaced = nonnegative(evidence.bodiesFaced);
	const resolvedBodies = Math.min(
		bodiesFaced,
		nonnegative(evidence.bodiesDestroyed) +
			nonnegative(evidence.bodiesEjected) +
			nonnegative(evidence.bodiesExpired) +
			nonnegative(evidence.bodiesBreached)
	);
	const nonDestructiveResolutionShare = fraction(
		nonnegative(evidence.bodiesEjected) + nonnegative(evidence.bodiesExpired),
		resolvedBodies
	);
	const breachRate = fraction(evidence.bodiesBreached, bodiesFaced);
	const routeDistanceAdded = nonnegative(evidence.routeDistanceAdded);
	const delaySeconds = nonnegative(evidence.delaySeconds);

	const axes: AsymmetricVictoryAxis[] = [];
	if (economicLeverage >= nonnegative(thresholds.minimumEconomicLeverage)) {
		axes.push("economic");
	}
	if (nonnegative(evidence.bodiesEjected) > 0) {
		axes.push("displacement");
	}
	if (delaySeconds >= nonnegative(thresholds.minimumDelaySeconds)) {
		axes.push("temporal");
	}
	if (routeDistanceAdded >= nonnegative(thresholds.minimumRouteDistanceAdded)) {
		axes.push("geometric");
	}
	if (nonDestructiveResolutionShare >= nonnegative(thresholds.minimumNonDestructiveResolutionShare)) {
		axes.push("attrition");
	}

	const hasLeverageSignal = axes.length > 0;
	const commitmentThreshold = Math.max(
		1,
		nonnegative(thresholds.minimumCommitmentDisadvantage)
	);
	const breachThreshold = Math.max(
		0,
		Math.min(1, finiteScalar(thresholds.maximumBreachRate, 1))
	);

	return {
		qualifies:
			evidence.playerSucceeded === true &&
			evidence.criticalAssetPreserved === true &&
			commitmentDisadvantage >= commitmentThreshold &&
			breachRate <= breachThreshold &&
			hasLeverageSignal,
		commitmentDisadvantage,
		playerGrossCost,
		opponentGrossCost,
		playerNetCost,
		opponentNetCost,
		economicLeverage,
		nonDestructiveResolutionShare,
		breachRate,
		resolvedBodies,
		axes
	};
}

export {
	AsymmetricEncounterEvidence,
	AsymmetricVictoryAxis,
	AsymmetricVictoryEvaluation,
	AsymmetricVictoryThresholds,
	encounterGrossCost,
	encounterNetCost,
	evaluateAsymmetricVictory
};
