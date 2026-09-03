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
	activeVoiceRetention: number;
}

export interface SpatialVoiceHistory {
	[id: string]: SpatialVoiceTier;
}

export interface SpatialVoicePlan {
	id: string;
	tier: SpatialVoiceTier;
	priority: number;
	rank: number;
	hints: SpatialRenderHints;
}

interface RankedVoice {
	id: string;
	priority: number;
	hints: SpatialRenderHints;
}

function clamp(value: number, minimum: number, maximum: number): number {
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

/**
 * Deterministically rank world-space emitters into renderer quality tiers.
 *
 * The underlying spatial priority comes from distance, predicted closest
 * approach, excitation energy, threat, and continuity. A small bounded bonus
 * can be applied to voices that were already rendered during the previous
 * planning pass so objects near a tier boundary do not chatter rapidly between
 * rendered and virtual states.
 *
 * `activeVoiceRetention` is intentionally capped at 0.25. Hysteresis is useful,
 * but a previously audible low-value voice must never receive enough history
 * bonus to indefinitely starve a newly important fly-by or core threat.
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
	const retention = clamp(budget.activeVoiceRetention, 0, 0.25);
	const ranked: RankedVoice[] = sources.map(source => {
		const hints = spatialRenderHints(source, listener, calibration);
		const retainedPriority = wasRendered(source.id, history)
			? clamp(hints.priority + retention, 0, 1)
			: hints.priority;

		return {
			id: source.id,
			priority: retainedPriority,
			hints
		};
	});

	// The id tie-breaker makes the ordering deterministic even on runtimes where
	// Array#sort does not guarantee stability for equal comparator values.
	ranked.sort((a, b) => {
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
	});

	return ranked.map((voice, rank) => ({
		id: voice.id,
		tier: tierForRank(rank, budget),
		priority: voice.priority,
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
