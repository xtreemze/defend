export type CausalEvidencePhase = "anticipation" | "causation" | "residue";

export type CausalSupportStage =
	| "observed-example"
	| "guided"
	| "independent"
	| "near-transfer"
	| "mixed-transfer";

export type CausalExplanationGrade =
	| "not-collected"
	| "weak"
	| "partial"
	| "strong";

export interface CausalEvidenceEvent {
	timeSeconds: number;
	phase: CausalEvidencePhase;
	/** Caller-owned semantic event label, e.g. projectile-impact or energy-stranded. */
	kind: string;
}

/**
 * One experimental observation. This is deliberately anonymous and contains no
 * player/account identifier. A user-study wrapper may correlate trials outside
 * this gameplay-neutral contract if consent/process later requires it.
 */
export interface CausalEvidenceTrial {
	trialId: string;
	fixtureId: string;
	/** Stable causal rule being tested, independent of encounter presentation. */
	mechanismId: string;
	/** Surface/geometry/composition variant used to test transfer. */
	surfaceVariantId: string;
	supportStage: CausalSupportStage;
	/** Null when a worked/observed example intentionally collects no prediction. */
	predictedOutcome: string | null;
	actualOutcome: string;
	events: CausalEvidenceEvent[];
	/** Human/external coding result; this module does not infer semantics from prose. */
	explanationGrade: CausalExplanationGrade;
}

export interface CausalTraceValidation {
	monotonicTime: boolean;
	hasAnticipation: boolean;
	hasCausation: boolean;
	hasResidue: boolean;
	orderedPhases: boolean;
	complete: boolean;
}

export interface CausalEvidenceSummary {
	trialCount: number;
	predictionCount: number;
	predictionMatches: number;
	predictionAccuracy: number;
	transferTrialCount: number;
	transferPredictionCount: number;
	transferPredictionMatches: number;
	transferPredictionAccuracy: number;
	completeTraceCount: number;
	strongExplanationCount: number;
	collectedExplanationCount: number;
	strongExplanationRate: number;
	mechanismCount: number;
	surfaceVariantCount: number;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function nonnegative(value: number): number {
	return Math.max(0, finite(value));
}

function ratio(numerator: number, denominator: number): number {
	if (denominator <= 0) return 0;
	return Math.max(0, Math.min(1, numerator / denominator));
}

function firstPhaseTime(
	events: CausalEvidenceEvent[],
	phase: CausalEvidencePhase
): number | null {
	for (let index = 0; index < events.length; index += 1) {
		if (events[index].phase === phase) {
			return nonnegative(events[index].timeSeconds);
		}
	}
	return null;
}

function uniqueStringCount(values: string[]): number {
	const seen: { [value: string]: boolean } = Object.create(null);
	let count = 0;
	for (let index = 0; index < values.length; index += 1) {
		const value = values[index];
		if (!seen[value]) {
			seen[value] = true;
			count += 1;
		}
	}
	return count;
}

export function isCausalTransferStage(stage: CausalSupportStage): boolean {
	return stage === "near-transfer" || stage === "mixed-transfer";
}

export function causalPredictionMatches(trial: CausalEvidenceTrial): boolean {
	return (
		trial.predictedOutcome !== null &&
		trial.predictedOutcome === trial.actualOutcome
	);
}

/**
 * Validate the recorded causal chronology without sorting it. Sorting here would
 * hide an instrumentation bug and erase evidence that a fixture emitted events
 * out of order.
 */
export function validateCausalTrace(
	events: CausalEvidenceEvent[]
): CausalTraceValidation {
	let monotonicTime = true;
	let previousTime = 0;
	for (let index = 0; index < events.length; index += 1) {
		const time = nonnegative(events[index].timeSeconds);
		if (index > 0 && time < previousTime) monotonicTime = false;
		previousTime = time;
	}

	const anticipationTime = firstPhaseTime(events, "anticipation");
	const causationTime = firstPhaseTime(events, "causation");
	const residueTime = firstPhaseTime(events, "residue");
	const hasAnticipation = anticipationTime !== null;
	const hasCausation = causationTime !== null;
	const hasResidue = residueTime !== null;
	const orderedPhases =
		hasAnticipation &&
		hasCausation &&
		hasResidue &&
		(anticipationTime as number) <= (causationTime as number) &&
		(causationTime as number) <= (residueTime as number);

	return {
		monotonicTime,
		hasAnticipation,
		hasCausation,
		hasResidue,
		orderedPhases,
		complete: monotonicTime && orderedPhases
	};
}

/**
 * Aggregate only evidence properties that are meaningful across different
 * mechanics. Outcome categories remain caller-owned qualitative labels; this
 * helper never compares numeric balance, difficulty, or domain-specific scores.
 */
export function summarizeCausalEvidence(
	trials: CausalEvidenceTrial[]
): CausalEvidenceSummary {
	let predictionCount = 0;
	let predictionMatches = 0;
	let transferTrialCount = 0;
	let transferPredictionCount = 0;
	let transferPredictionMatches = 0;
	let completeTraceCount = 0;
	let strongExplanationCount = 0;
	let collectedExplanationCount = 0;
	const mechanismIds: string[] = [];
	const surfaceVariantIds: string[] = [];

	for (let index = 0; index < trials.length; index += 1) {
		const trial = trials[index];
		mechanismIds.push(trial.mechanismId);
		surfaceVariantIds.push(trial.surfaceVariantId);

		const hasPrediction = trial.predictedOutcome !== null;
		const matched = causalPredictionMatches(trial);
		if (hasPrediction) {
			predictionCount += 1;
			if (matched) predictionMatches += 1;
		}

		if (isCausalTransferStage(trial.supportStage)) {
			transferTrialCount += 1;
			if (hasPrediction) {
				transferPredictionCount += 1;
				if (matched) transferPredictionMatches += 1;
			}
		}

		if (validateCausalTrace(trial.events).complete) completeTraceCount += 1;
		if (trial.explanationGrade !== "not-collected") {
			collectedExplanationCount += 1;
			if (trial.explanationGrade === "strong") strongExplanationCount += 1;
		}
	}

	return {
		trialCount: trials.length,
		predictionCount,
		predictionMatches,
		predictionAccuracy: ratio(predictionMatches, predictionCount),
		transferTrialCount,
		transferPredictionCount,
		transferPredictionMatches,
		transferPredictionAccuracy: ratio(
			transferPredictionMatches,
			transferPredictionCount
		),
		completeTraceCount,
		strongExplanationCount,
		collectedExplanationCount,
		strongExplanationRate: ratio(
			strongExplanationCount,
			collectedExplanationCount
		),
		mechanismCount: uniqueStringCount(mechanismIds),
		surfaceVariantCount: uniqueStringCount(surfaceVariantIds)
	};
}
