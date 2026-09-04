import {
	TowerInteractionPreview,
	TowerInteractionReason
} from "./towerInteraction";

export type TowerInteractionInterventionKind =
	| "new-build"
	| "replacement"
	| "upgrade"
	| "maintenance"
	| "other";

export interface TowerInteractionObservation {
	atSeconds: number;
	cellKey: string | null;
	roleKey: string | null;
	/** Caller-owned coarse fingerprint for materially relevant tactical context. */
	tacticalContextKey: string;
	interventionKind: TowerInteractionInterventionKind;
	preview: TowerInteractionPreview;
}

export interface TowerInteractionReasonCounts {
	occupied: number;
	unaffordable: number;
	invalidCost: number;
	protectedCore: number;
	invalidTerrain: number;
	outsideArena: number;
	staleTarget: number;
	maxLevel: number;
	invalidTowerLevel: number;
	cameraGesture: number;
}

export interface TowerInteractionAcceptedContext {
	cellKey: string;
	roleKey: string;
	tacticalContextKey: string;
}

export interface TowerInteractionObservationState {
	startedAtSeconds: number;
	lastObservedAtSeconds: number;
	attempts: number;
	allowedActions: number;
	rejectedActions: number;
	ignoredActions: number;
	invalidObservations: number;
	nonMonotonicObservations: number;
	cameraConflicts: number;
	rejectedBeforeFirstBuild: number;
	ignoredBeforeFirstBuild: number;
	firstAllowedAtSeconds: number | null;
	firstBuildAtSeconds: number | null;
	acceptedReplacements: number;
	repeatedSameContextReplacements: number;
	reasonCounts: TowerInteractionReasonCounts;
	lastAcceptedContexts: TowerInteractionAcceptedContext[];
}

export interface TowerInteractionObservationSummary {
	attempts: number;
	allowedActions: number;
	rejectedActions: number;
	ignoredActions: number;
	invalidObservations: number;
	nonMonotonicObservations: number;
	allowanceRate: number;
	cameraConflicts: number;
	rejectedBeforeFirstBuild: number;
	ignoredBeforeFirstBuild: number;
	timeToFirstAllowedSeconds: number | null;
	timeToFirstBuildSeconds: number | null;
	acceptedReplacements: number;
	repeatedSameContextReplacements: number;
	repetitionRate: number;
	reasonCounts: TowerInteractionReasonCounts;
}

function isFiniteNumber(value: number): boolean {
	return value === value && value !== Infinity && value !== -Infinity;
}

function finite(value: number, fallback = 0): number {
	return isFiniteNumber(value) ? value : fallback;
}

function nonNegative(value: number): number {
	return Math.max(0, finite(value));
}

function count(value: number): number {
	return Math.floor(nonNegative(value));
}

function validHistoricalTime(
	value: number | null,
	start: number,
	last: number
): number | null {
	if (value === null || !isFiniteNumber(value)) return null;
	if (value < start || value > last) return null;
	return value;
}

function emptyReasonCounts(): TowerInteractionReasonCounts {
	return {
		occupied: 0,
		unaffordable: 0,
		invalidCost: 0,
		protectedCore: 0,
		invalidTerrain: 0,
		outsideArena: 0,
		staleTarget: 0,
		maxLevel: 0,
		invalidTowerLevel: 0,
		cameraGesture: 0
	};
}

function copyReasonCounts(
	counts: TowerInteractionReasonCounts | null | undefined
): TowerInteractionReasonCounts {
	if (!counts) return emptyReasonCounts();
	return {
		occupied: count(counts.occupied),
		unaffordable: count(counts.unaffordable),
		invalidCost: count(counts.invalidCost),
		protectedCore: count(counts.protectedCore),
		invalidTerrain: count(counts.invalidTerrain),
		outsideArena: count(counts.outsideArena),
		staleTarget: count(counts.staleTarget),
		maxLevel: count(counts.maxLevel),
		invalidTowerLevel: count(counts.invalidTowerLevel),
		cameraGesture: count(counts.cameraGesture)
	};
}

function copyContexts(
	contexts: TowerInteractionAcceptedContext[] | null | undefined
): TowerInteractionAcceptedContext[] {
	if (!Array.isArray(contexts)) return [];
	const copied: TowerInteractionAcceptedContext[] = [];
	for (let index = 0; index < contexts.length; index += 1) {
		const context = contexts[index];
		if (
			!context ||
			typeof context.cellKey !== "string" ||
			typeof context.roleKey !== "string" ||
			typeof context.tacticalContextKey !== "string"
		) {
			continue;
		}
		copied.push({
			cellKey: context.cellKey,
			roleKey: context.roleKey,
			tacticalContextKey: context.tacticalContextKey
		});
	}
	return copied;
}

function incrementReason(
	counts: TowerInteractionReasonCounts,
	reason: TowerInteractionReason
): void {
	if (reason === "occupied") counts.occupied += 1;
	else if (reason === "unaffordable") counts.unaffordable += 1;
	else if (reason === "invalid-cost") counts.invalidCost += 1;
	else if (reason === "protected-core") counts.protectedCore += 1;
	else if (reason === "invalid-terrain") counts.invalidTerrain += 1;
	else if (reason === "outside-arena") counts.outsideArena += 1;
	else if (reason === "stale-target") counts.staleTarget += 1;
	else if (reason === "max-level") counts.maxLevel += 1;
	else if (reason === "invalid-tower-level") counts.invalidTowerLevel += 1;
	else if (reason === "camera-gesture") counts.cameraGesture += 1;
}

function contextIndex(
	contexts: TowerInteractionAcceptedContext[],
	cellKey: string,
	roleKey: string
): number {
	for (let index = 0; index < contexts.length; index += 1) {
		if (
			contexts[index].cellKey === cellKey &&
			contexts[index].roleKey === roleKey
		) {
			return index;
		}
	}
	return -1;
}

function normalizeState(
	state: TowerInteractionObservationState
): TowerInteractionObservationState {
	const start = nonNegative(state.startedAtSeconds);
	const last = Math.max(start, nonNegative(state.lastObservedAtSeconds));
	const attempts = count(state.attempts);
	const acceptedReplacements = Math.min(
		attempts,
		count(state.acceptedReplacements)
	);
	return {
		startedAtSeconds: start,
		lastObservedAtSeconds: last,
		attempts,
		allowedActions: Math.min(attempts, count(state.allowedActions)),
		rejectedActions: Math.min(attempts, count(state.rejectedActions)),
		ignoredActions: Math.min(attempts, count(state.ignoredActions)),
		invalidObservations: count(state.invalidObservations),
		nonMonotonicObservations: count(state.nonMonotonicObservations),
		cameraConflicts: Math.min(attempts, count(state.cameraConflicts)),
		rejectedBeforeFirstBuild: Math.min(
			attempts,
			count(state.rejectedBeforeFirstBuild)
		),
		ignoredBeforeFirstBuild: Math.min(
			attempts,
			count(state.ignoredBeforeFirstBuild)
		),
		firstAllowedAtSeconds: validHistoricalTime(
			state.firstAllowedAtSeconds,
			start,
			last
		),
		firstBuildAtSeconds: validHistoricalTime(
			state.firstBuildAtSeconds,
			start,
			last
		),
		acceptedReplacements,
		repeatedSameContextReplacements: Math.min(
			acceptedReplacements,
			count(state.repeatedSameContextReplacements)
		),
		reasonCounts: copyReasonCounts(state.reasonCounts),
		lastAcceptedContexts: copyContexts(state.lastAcceptedContexts)
	};
}

export function createTowerInteractionObservationState(
	startedAtSeconds = 0
): TowerInteractionObservationState {
	const start = nonNegative(startedAtSeconds);
	return {
		startedAtSeconds: start,
		lastObservedAtSeconds: start,
		attempts: 0,
		allowedActions: 0,
		rejectedActions: 0,
		ignoredActions: 0,
		invalidObservations: 0,
		nonMonotonicObservations: 0,
		cameraConflicts: 0,
		rejectedBeforeFirstBuild: 0,
		ignoredBeforeFirstBuild: 0,
		firstAllowedAtSeconds: null,
		firstBuildAtSeconds: null,
		acceptedReplacements: 0,
		repeatedSameContextReplacements: 0,
		reasonCounts: emptyReasonCounts(),
		lastAcceptedContexts: []
	};
}

/**
 * Append one passive observation downstream of #117's authoritative preview.
 * This function never changes whether an action is allowed or how much it costs.
 *
 * Invalid/non-monotonic timestamps fail closed. They are counted diagnostically
 * but do not become attempts and cannot change first-build/repetition timing.
 */
export function recordTowerInteractionObservation(
	state: TowerInteractionObservationState,
	observation: TowerInteractionObservation
): TowerInteractionObservationState {
	const next = normalizeState(state);
	if (!isFiniteNumber(observation.atSeconds)) {
		next.invalidObservations += 1;
		return next;
	}
	if (
		observation.atSeconds < next.startedAtSeconds ||
		observation.atSeconds < next.lastObservedAtSeconds
	) {
		next.invalidObservations += 1;
		next.nonMonotonicObservations += 1;
		return next;
	}

	const atSeconds = observation.atSeconds;
	next.lastObservedAtSeconds = atSeconds;
	next.attempts += 1;
	incrementReason(next.reasonCounts, observation.preview.reason);

	if (observation.preview.disposition === "ignored") {
		next.ignoredActions += 1;
		if (observation.preview.reason === "camera-gesture") {
			next.cameraConflicts += 1;
		}
		if (next.firstBuildAtSeconds === null) {
			next.ignoredBeforeFirstBuild += 1;
		}
		return next;
	}

	if (observation.preview.disposition === "rejected") {
		next.rejectedActions += 1;
		if (next.firstBuildAtSeconds === null) {
			next.rejectedBeforeFirstBuild += 1;
		}
		return next;
	}

	next.allowedActions += 1;
	if (next.firstAllowedAtSeconds === null) {
		next.firstAllowedAtSeconds = atSeconds;
	}
	if (
		next.firstBuildAtSeconds === null &&
		observation.interventionKind === "new-build" &&
		observation.preview.intent === "place"
	) {
		next.firstBuildAtSeconds = atSeconds;
	}

	if (
		observation.cellKey !== null &&
		observation.roleKey !== null &&
		typeof observation.cellKey === "string" &&
		typeof observation.roleKey === "string" &&
		typeof observation.tacticalContextKey === "string"
	) {
		const index = contextIndex(
			next.lastAcceptedContexts,
			observation.cellKey,
			observation.roleKey
		);
		if (observation.interventionKind === "replacement") {
			next.acceptedReplacements += 1;
			if (
				index >= 0 &&
				next.lastAcceptedContexts[index].tacticalContextKey ===
					observation.tacticalContextKey
			) {
				next.repeatedSameContextReplacements += 1;
			}
		}

		const context = {
			cellKey: observation.cellKey,
			roleKey: observation.roleKey,
			tacticalContextKey: observation.tacticalContextKey
		};
		if (index >= 0) next.lastAcceptedContexts[index] = context;
		else next.lastAcceptedContexts.push(context);
	}

	return next;
}

export function summarizeTowerInteractionObservations(
	state: TowerInteractionObservationState
): TowerInteractionObservationSummary {
	const safe = normalizeState(state);
	const attempts = safe.attempts;
	const allowedActions = safe.allowedActions;
	const acceptedReplacements = safe.acceptedReplacements;
	const repeatedSameContextReplacements = safe.repeatedSameContextReplacements;
	return {
		attempts,
		allowedActions,
		rejectedActions: safe.rejectedActions,
		ignoredActions: safe.ignoredActions,
		invalidObservations: safe.invalidObservations,
		nonMonotonicObservations: safe.nonMonotonicObservations,
		allowanceRate:
			attempts <= 0 ? 0 : Math.min(1, allowedActions / attempts),
		cameraConflicts: safe.cameraConflicts,
		rejectedBeforeFirstBuild: safe.rejectedBeforeFirstBuild,
		ignoredBeforeFirstBuild: safe.ignoredBeforeFirstBuild,
		timeToFirstAllowedSeconds:
			safe.firstAllowedAtSeconds === null
				? null
				: Math.max(0, safe.firstAllowedAtSeconds - safe.startedAtSeconds),
		timeToFirstBuildSeconds:
			safe.firstBuildAtSeconds === null
				? null
				: Math.max(0, safe.firstBuildAtSeconds - safe.startedAtSeconds),
		acceptedReplacements,
		repeatedSameContextReplacements,
		repetitionRate:
			acceptedReplacements <= 0
				? 0
				: Math.min(
					1,
					repeatedSameContextReplacements / acceptedReplacements
				),
		reasonCounts: copyReasonCounts(safe.reasonCounts)
	};
}
