export type CausalEvidencePhase = "anticipation" | "causation" | "residue";

export interface CausalEvidenceEvent {
	id: string;
	semanticKey: string;
	phase: CausalEvidencePhase;
	atSeconds: number;
	channels: string[];
	magnitude?: number;
}

export interface CausalLegibilityConfig {
	minimumDistinctChannels: number;
	maximumAnticipationLeadSeconds: number;
	maximumResidueDelaySeconds: number;
}

export interface CausalLegibilityChain {
	semanticKey: string;
	anticipationId: string | null;
	causationId: string | null;
	residueId: string | null;
	anticipationLeadSeconds: number | null;
	residueDelaySeconds: number | null;
	distinctChannels: number;
	complete: boolean;
	ordered: boolean;
	timely: boolean;
	multimodal: boolean;
	diagnostics: string[];
}

export interface CausalLegibilityEvaluation {
	chains: CausalLegibilityChain[];
	validEventCount: number;
	invalidEventCount: number;
	completeChainCount: number;
	qualifiedChainCount: number;
	qualified: boolean;
}

const MAX_CAUSAL_TIME_SECONDS = 1e9;

function finiteNumber(value: number): boolean {
	return typeof value === "number" && value === value && value !== Infinity && value !== -Infinity;
}

function nonnegativeFinite(value: number, fallback: number): number {
	if (!finiteNumber(value)) {
		return fallback;
	}
	return Math.max(0, Math.min(MAX_CAUSAL_TIME_SECONDS, value));
}

function validPhase(value: CausalEvidencePhase): boolean {
	return value === "anticipation" || value === "causation" || value === "residue";
}

function validText(value: string): boolean {
	return typeof value === "string" && value.trim().length > 0;
}

function normalizeChannels(channels: string[]): string[] {
	if (!Array.isArray(channels)) {
		return [];
	}
	const seen: { [key: string]: boolean } = {};
	const normalized: string[] = [];
	channels.forEach(channel => {
		if (!validText(channel)) {
			return;
		}
		const key = channel.trim();
		if (seen[key]) {
			return;
		}
		seen[key] = true;
		normalized.push(key);
	});
	return normalized.sort();
}

function eventIsValid(event: CausalEvidenceEvent): boolean {
	return (
		event !== null &&
		typeof event === "object" &&
		validText(event.id) &&
		validText(event.semanticKey) &&
		validPhase(event.phase) &&
		finiteNumber(event.atSeconds) &&
		event.atSeconds >= 0 &&
		Array.isArray(event.channels)
	);
}

function compareEvents(left: CausalEvidenceEvent, right: CausalEvidenceEvent): number {
	if (left.atSeconds !== right.atSeconds) {
		return left.atSeconds - right.atSeconds;
	}
	if (left.semanticKey !== right.semanticKey) {
		return left.semanticKey < right.semanticKey ? -1 : 1;
	}
	if (left.phase !== right.phase) {
		return left.phase < right.phase ? -1 : 1;
	}
	if (left.id === right.id) {
		return 0;
	}
	return left.id < right.id ? -1 : 1;
}

function distinctChannelCount(events: CausalEvidenceEvent[]): number {
	const seen: { [key: string]: boolean } = {};
	events.forEach(event => {
		normalizeChannels(event.channels).forEach(channel => {
			seen[channel] = true;
		});
	});
	return Object.keys(seen).length;
}

function firstPhase(
	events: CausalEvidenceEvent[],
	phase: CausalEvidencePhase,
	notBeforeSeconds: number
): CausalEvidenceEvent | null {
	for (let index = 0; index < events.length; index += 1) {
		const event = events[index];
		if (event.phase === phase && event.atSeconds >= notBeforeSeconds) {
			return event;
		}
	}
	return null;
}

/**
 * Evaluate observed gameplay evidence without predicting physics or authorizing
 * game state. Callers provide timestamped anticipation, causation and residue
 * events after the authoritative simulation has produced them.
 *
 * The result is deliberately semantic: it asks whether a causal chain was
 * observable, ordered and redundantly presented. It does not decide whether a
 * collision, ejection, expiry, energy transfer or economic outcome was correct.
 */
export function evaluateCausalLegibility(
	events: CausalEvidenceEvent[],
	config: CausalLegibilityConfig
): CausalLegibilityEvaluation {
	const input = Array.isArray(events) ? events : [];
	let invalidEventCount = 0;
	const validEvents: CausalEvidenceEvent[] = [];

	input.forEach(event => {
		if (!eventIsValid(event)) {
			invalidEventCount += 1;
			return;
		}
		validEvents.push({
			id: event.id.trim(),
			semanticKey: event.semanticKey.trim(),
			phase: event.phase,
			atSeconds: nonnegativeFinite(event.atSeconds, 0),
			channels: normalizeChannels(event.channels),
			magnitude: finiteNumber(event.magnitude as number) ? event.magnitude : undefined
		});
	});

	validEvents.sort(compareEvents);

	const grouped: { [key: string]: CausalEvidenceEvent[] } = {};
	validEvents.forEach(event => {
		if (!grouped[event.semanticKey]) {
			grouped[event.semanticKey] = [];
		}
		grouped[event.semanticKey].push(event);
	});

	const minimumDistinctChannels = Math.max(
		1,
		Math.floor(nonnegativeFinite(config.minimumDistinctChannels, 1))
	);
	const maximumAnticipationLeadSeconds = nonnegativeFinite(
		config.maximumAnticipationLeadSeconds,
		MAX_CAUSAL_TIME_SECONDS
	);
	const maximumResidueDelaySeconds = nonnegativeFinite(
		config.maximumResidueDelaySeconds,
		MAX_CAUSAL_TIME_SECONDS
	);

	const chains = Object.keys(grouped)
		.sort()
		.map(semanticKey => {
			const chainEvents = grouped[semanticKey];
			const diagnostics: string[] = [];
			const anticipation = firstPhase(chainEvents, "anticipation", 0);
			const causation = firstPhase(
				chainEvents,
				"causation",
				anticipation ? anticipation.atSeconds : 0
			);
			const residue = firstPhase(
				chainEvents,
				"residue",
				causation ? causation.atSeconds : anticipation ? anticipation.atSeconds : 0
			);

			const complete = anticipation !== null && causation !== null && residue !== null;
			const ordered =
				complete &&
				anticipation!.atSeconds <= causation!.atSeconds &&
				causation!.atSeconds <= residue!.atSeconds;
			const anticipationLeadSeconds =
				anticipation && causation ? causation.atSeconds - anticipation.atSeconds : null;
			const residueDelaySeconds = causation && residue ? residue.atSeconds - causation.atSeconds : null;
			const timely =
				ordered &&
				anticipationLeadSeconds !== null &&
				residueDelaySeconds !== null &&
				anticipationLeadSeconds <= maximumAnticipationLeadSeconds &&
				residueDelaySeconds <= maximumResidueDelaySeconds;
			const channelCount = distinctChannelCount(chainEvents);
			const multimodal = channelCount >= minimumDistinctChannels;

			if (!anticipation) diagnostics.push("missing-anticipation");
			if (!causation) diagnostics.push("missing-causation");
			if (!residue) diagnostics.push("missing-residue");
			if (complete && !ordered) diagnostics.push("phase-order");
			if (ordered && !timely) diagnostics.push("timing-window");
			if (!multimodal) diagnostics.push("insufficient-channels");

			return {
				semanticKey,
				anticipationId: anticipation ? anticipation.id : null,
				causationId: causation ? causation.id : null,
				residueId: residue ? residue.id : null,
				anticipationLeadSeconds,
				residueDelaySeconds,
				distinctChannels: channelCount,
				complete,
				ordered,
				timely,
				multimodal,
				diagnostics
			};
		});

	let completeChainCount = 0;
	let qualifiedChainCount = 0;
	chains.forEach(chain => {
		if (chain.complete) {
			completeChainCount += 1;
		}
		if (chain.complete && chain.ordered && chain.timely && chain.multimodal) {
			qualifiedChainCount += 1;
		}
	});

	return {
		chains,
		validEventCount: validEvents.length,
		invalidEventCount,
		completeChainCount,
		qualifiedChainCount,
		qualified:
			invalidEventCount === 0 &&
			chains.length > 0 &&
			qualifiedChainCount === chains.length
	};
}
