import {
	SpatialAudioCalibration,
	SpatialAudioObjectState,
	SpatialListenerState,
	SpatialRenderHints,
	spatialRenderHints
} from "./spatialAudio";

export type SpatialVoiceTier = "full" | "standard" | "cheap" | "virtual";

export interface SpatialVoiceBudget {
	fullVoices: number;
	standardVoices: number;
	cheapVoices: number;
	/**
	 * Priority margin below the raw rendered/virtual cutoff within which an
	 * already-rendered voice may be retained for one more planning pass.
	 */
	activeVoiceRetention: number;
}

export interface SpatialVoiceHistory {
	[id: string]: SpatialVoiceTier;
}

export interface SpatialVoicePlan {
	id: string;
	tier: SpatialVoiceTier;
	/** Raw semantic priority from spatialRenderHints(), unaffected by history. */
	priority: number;
	/** Selection score after bounded boundary hysteresis is applied. */
	selectionPriority: number;
	rank: number;
	hints: SpatialRenderHints;
}

interface RankedVoice {
	id: string;
	priority: number;
	selectionPriority: number;
	wasRendered: boolean;
	hints: SpatialRenderHints;
}

function clamp(value: number, minimum: number, maximum: number): number {
	if (!isFinite(value)) {
		return minimum;
	}
	return Math.max(minimum, Math.min(maximum, value));
}

function nonNegativeInteger(value: number): number {
	if (!isFinite(value)) {
		return 0;
	}
	return Math.max(0, Math.floor(value));
}

function wasRendered(
	id: string,
	history: SpatialVoiceHistory | undefined
): boolean {
	if (!history || !Object.prototype.hasOwnProperty.call(history, id)) {
		return false;
	}
	return history[id] !== "virtual";
}

function renderedVoiceCount(budget: SpatialVoiceBudget): number {
	return (
		nonNegativeInteger(budget.fullVoices) +
		nonNegativeInteger(budget.standardVoices) +
		nonNegativeInteger(budget.cheapVoices)
	);
}

function tierForRank(rank: number, budget: SpatialVoiceBudget): SpatialVoiceTier {
	const fullEnd = nonNegativeInteger(budget.fullVoices);
	const standardEnd = fullEnd + nonNegativeInteger(budget.standardVoices);
	const cheapEnd = standardEnd + nonNegativeInteger(budget.cheapVoices);

	if (rank < fullEnd) {
		return "full";
	}
	if (rank < standardEnd) {
		return "standard";
	}
	if (rank < cheapEnd) {
		return "cheap";
	}
	return "virtual";
}

function compareRawPriority(a: RankedVoice, b: RankedVoice): number {
	if (a.priority !== b.priority) {
		return b.priority - a.priority;
	}
	if (a.id < b.id) {
		return -1;
	}
	if (a.id > b.id) {
		return 1;
	}
	return 0;
}

function compareSelectionPriority(a: RankedVoice, b: RankedVoice): number {
	if (a.selectionPriority !== b.selectionPriority) {
		return b.selectionPriority - a.selectionPriority;
	}

	// A retained voice only receives precedence when it has been lifted exactly
	// to the raw cutoff. Voices with genuinely higher raw priority are never
	// demoted by this tie-breaker because their selection priority is higher.
	if (a.wasRendered !== b.wasRendered) {
		return a.wasRendered ? -1 : 1;
	}
	if (a.priority !== b.priority) {
		return b.priority - a.priority;
	}
	if (a.id < b.id) {
		return -1;
	}
	if (a.id > b.id) {
		return 1;
	}
	return 0;
}

/**
 * Deterministically rank world-space emitters into renderer quality tiers.
 *
 * The underlying spatial priority comes from distance, predicted closest
 * approach, excitation energy, threat, and continuity. History is used only at
 * the rendered/virtual boundary: an already-rendered voice that falls within a
 * small priority margin below the current raw cutoff may be lifted to that
 * cutoff for one planning pass.
 *
 * This is deliberately safer than adding a retention bonus to every old voice.
 * A new projectile/core threat with raw priority above the cutoff always keeps
 * its higher selection score and cannot be starved by historical allocation.
 * Internal `full`/`standard`/`cheap` boundaries do not currently use hysteresis;
 * renderer-side crossfades can make those quality transitions less audible.
 *
 * This function only chooses semantic quality tiers. A concrete backend decides
 * whether those tiers map to HRTF/equal-power panning, modal count, update rate,
 * filter complexity, or another rendering strategy after profiling.
 */
export function planSpatialVoiceBudget(
	sources: SpatialAudioObjectState[],
	listener: SpatialListenerState,
	calibration: SpatialAudioCalibration,
	budget: SpatialVoiceBudget,
	history?: SpatialVoiceHistory
): SpatialVoicePlan[] {
	const retentionMargin = clamp(budget.activeVoiceRetention, 0, 0.25);
	const renderedCount = renderedVoiceCount(budget);
	const ranked: RankedVoice[] = sources.map(source => {
		const hints = spatialRenderHints(source, listener, calibration);
		return {
			id: source.id,
			priority: hints.priority,
			selectionPriority: hints.priority,
			wasRendered: wasRendered(source.id, history),
			hints
		};
	});

	// Establish the current rendered/virtual boundary from raw semantic priority
	// before history is allowed to influence the selection order.
	const rawRanked = ranked.slice().sort(compareRawPriority);
	const hasVirtualBoundary = renderedCount > 0 && renderedCount < rawRanked.length;
	const rawCutoff = hasVirtualBoundary
		? rawRanked[renderedCount - 1].priority
		: 0;

	if (hasVirtualBoundary && retentionMargin > 0) {
		const minimumRetainedPriority = Math.max(0, rawCutoff - retentionMargin);
		ranked.forEach(voice => {
			if (
				voice.wasRendered &&
				voice.priority < rawCutoff &&
				voice.priority >= minimumRetainedPriority
			) {
				voice.selectionPriority = rawCutoff;
			}
		});
	}

	ranked.sort(compareSelectionPriority);

	return ranked.map((voice, rank) => ({
		id: voice.id,
		tier: tierForRank(rank, budget),
		priority: voice.priority,
		selectionPriority: voice.selectionPriority,
		rank,
		hints: voice.hints
	}));
}

/**
 * Convert a plan into the compact history representation expected by the next
 * planning pass. Virtual voices remain present so a renderer can keep their
 * semantic lifecycle alive without spending DSP on them.
 */
export function spatialVoiceHistory(
	plans: SpatialVoicePlan[]
): SpatialVoiceHistory {
	const history = Object.create(null) as SpatialVoiceHistory;
	plans.forEach(plan => {
		history[plan.id] = plan.tier;
	});
	return history;
}
