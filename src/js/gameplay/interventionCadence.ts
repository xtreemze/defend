export type InterventionOpportunityKind =
	| "edge-ejection"
	| "route-change"
	| "mixed-threat"
	| "reserve-spend"
	| "tower-lifecycle"
	| "energy-flow"
	| "breach-response"
	| "other";

export type InterventionActionKind =
	| "place"
	| "upgrade"
	| "replace"
	| "maintain"
	| "redirect"
	| "other";

export interface InterventionOpportunity {
	id: string;
	kind: InterventionOpportunityKind;
	startSeconds: number;
	endSeconds: number;
	contextKey: string;
}

export interface InterventionAction {
	atSeconds: number;
	kind: InterventionActionKind;
	/**
	 * Optional opportunity id this action intentionally answers. Null means the
	 * action is not attributed to a measured decision window.
	 */
	opportunityId: string | null;
}

export interface InterventionCadenceInput {
	sessionStartSeconds: number;
	sessionEndSeconds: number;
	opportunities: InterventionOpportunity[];
	actions: InterventionAction[];
}

export interface InterventionCadenceSummary {
	durationSeconds: number;
	opportunities: number;
	respondedOpportunities: number;
	missedOpportunities: number;
	responseRate: number;
	actions: number;
	linkedActions: number;
	lateLinkedActions: number;
	unlinkedActions: number;
	unlinkedActionShare: number;
	actionsPerMinute: number;
	opportunitiesPerMinute: number;
	meanResponseSeconds: number | null;
	longestResponseSeconds: number | null;
	opportunityCoverageSeconds: number;
	opportunityCoverageShare: number;
	longestNoOpportunityGapSeconds: number;
}

interface NormalizedOpportunity {
	id: string;
	startSeconds: number;
	endSeconds: number;
}

interface Interval {
	start: number;
	end: number;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function clamp(value: number, minimum: number, maximum: number): number {
	return Math.min(maximum, Math.max(minimum, value));
}

function normalizeBounds(startSeconds: number, endSeconds: number): Interval {
	const start = Math.max(0, finite(startSeconds));
	const end = Math.max(start, finite(endSeconds, start));
	return { start, end };
}

function normalizeOpportunity(
	opportunity: InterventionOpportunity,
	bounds: Interval
): NormalizedOpportunity {
	const rawStart = finite(opportunity.startSeconds, bounds.start);
	const rawEnd = finite(opportunity.endSeconds, rawStart);
	const start = clamp(rawStart, bounds.start, bounds.end);
	const end = clamp(Math.max(rawStart, rawEnd), start, bounds.end);
	return {
		id: opportunity.id,
		startSeconds: start,
		endSeconds: end
	};
}

function mergeIntervals(intervals: Interval[]): Interval[] {
	if (intervals.length === 0) return [];
	const ordered = intervals
		.map(interval => ({ start: interval.start, end: interval.end }))
		.sort((a, b) => a.start - b.start || a.end - b.end);
	const merged: Interval[] = [ordered[0]];
	for (let index = 1; index < ordered.length; index += 1) {
		const current = ordered[index];
		const previous = merged[merged.length - 1];
		if (current.start <= previous.end) {
			previous.end = Math.max(previous.end, current.end);
		} else {
			merged.push(current);
		}
	}
	return merged;
}

function coverageSeconds(intervals: Interval[]): number {
	let total = 0;
	for (let index = 0; index < intervals.length; index += 1) {
		total += Math.max(0, intervals[index].end - intervals[index].start);
	}
	return total;
}

function longestNoOpportunityGap(bounds: Interval, intervals: Interval[]): number {
	if (bounds.end <= bounds.start) return 0;
	if (intervals.length === 0) return bounds.end - bounds.start;
	let longest = Math.max(0, intervals[0].start - bounds.start);
	for (let index = 1; index < intervals.length; index += 1) {
		longest = Math.max(longest, intervals[index].start - intervals[index - 1].end);
	}
	return Math.max(longest, bounds.end - intervals[intervals.length - 1].end);
}

function firstOpportunityById(
	opportunities: NormalizedOpportunity[],
	id: string
): NormalizedOpportunity | null {
	for (let index = 0; index < opportunities.length; index += 1) {
		if (opportunities[index].id === id) return opportunities[index];
	}
	return null;
}

/**
 * Summarize how often the simulation presents meaningful opportunities to alter
 * the physical future, independently from raw input volume.
 *
 * The caller owns opportunity classification. This module does not decide that
 * a click is meaningful, reward action-per-minute, or feed metrics back into
 * simulation authority. It only measures supplied decision windows and whether
 * actions were attributed to them while they were still open.
 */
export function summarizeInterventionCadence(
	input: InterventionCadenceInput
): InterventionCadenceSummary {
	const bounds = normalizeBounds(input.sessionStartSeconds, input.sessionEndSeconds);
	const durationSeconds = Math.max(0, bounds.end - bounds.start);
	const opportunities = input.opportunities.map(opportunity =>
		normalizeOpportunity(opportunity, bounds)
	);
	const mergedWindows = mergeIntervals(
		opportunities.map(opportunity => ({
			start: opportunity.startSeconds,
			end: opportunity.endSeconds
		}))
	);
	const opportunityCoverageSeconds = coverageSeconds(mergedWindows);

	let linkedActions = 0;
	let lateLinkedActions = 0;
	let unlinkedActions = 0;
	const firstResponses: { [id: string]: number } = {};

	for (let index = 0; index < input.actions.length; index += 1) {
		const action = input.actions[index];
		const atSeconds = clamp(finite(action.atSeconds, bounds.start), bounds.start, bounds.end);
		if (action.opportunityId === null) {
			unlinkedActions += 1;
			continue;
		}
		const opportunity = firstOpportunityById(opportunities, action.opportunityId);
		if (opportunity === null) {
			unlinkedActions += 1;
			continue;
		}
		linkedActions += 1;
		if (atSeconds < opportunity.startSeconds || atSeconds > opportunity.endSeconds) {
			lateLinkedActions += 1;
			continue;
		}
		if (firstResponses[opportunity.id] === undefined) {
			firstResponses[opportunity.id] = atSeconds;
		}
	}

	let respondedOpportunities = 0;
	let responseTotal = 0;
	let longestResponseSeconds: number | null = null;
	for (let index = 0; index < opportunities.length; index += 1) {
		const opportunity = opportunities[index];
		const responseAt = firstResponses[opportunity.id];
		if (responseAt === undefined) continue;
		respondedOpportunities += 1;
		const responseSeconds = Math.max(0, responseAt - opportunity.startSeconds);
		responseTotal += responseSeconds;
		longestResponseSeconds =
			longestResponseSeconds === null
				? responseSeconds
				: Math.max(longestResponseSeconds, responseSeconds);
	}

	const opportunityCount = opportunities.length;
	const actionCount = input.actions.length;
	return {
		durationSeconds,
		opportunities: opportunityCount,
		respondedOpportunities,
		missedOpportunities: Math.max(0, opportunityCount - respondedOpportunities),
		responseRate:
			opportunityCount <= 0 ? 0 : respondedOpportunities / opportunityCount,
		actions: actionCount,
		linkedActions,
		lateLinkedActions,
		unlinkedActions,
		unlinkedActionShare: actionCount <= 0 ? 0 : unlinkedActions / actionCount,
		actionsPerMinute:
			durationSeconds <= 0 ? 0 : actionCount / (durationSeconds / 60),
		opportunitiesPerMinute:
			durationSeconds <= 0 ? 0 : opportunityCount / (durationSeconds / 60),
		meanResponseSeconds:
			respondedOpportunities <= 0 ? null : responseTotal / respondedOpportunities,
		longestResponseSeconds,
		opportunityCoverageSeconds,
		opportunityCoverageShare:
			durationSeconds <= 0 ? 0 : opportunityCoverageSeconds / durationSeconds,
		longestNoOpportunityGapSeconds: longestNoOpportunityGap(bounds, mergedWindows)
	};
}
