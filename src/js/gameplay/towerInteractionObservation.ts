import type {
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

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function nonNegative(value: number): number {
	return Math.max(0, finite(value));
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
	counts: TowerInteractionReasonCounts
): TowerInteractionReasonCounts {
	return {
		occupied: counts.occupied,
		unaffordable: counts.unaffordable,
		invalidCost: counts.invalidCost,
		protectedCore: counts.protectedCore,
		invalidTerrain: counts.invalidTerrain,
		outsideArena: counts.outsideArena,
		staleTarget: counts.staleTarget,
		maxLevel: counts.maxLevel,
		invalidTowerLevel: counts.invalidTowerLevel,
		cameraGesture: counts.cameraGesture
	};
}

function copyContexts(
	contexts: TowerInteractionAcceptedContext[]
): TowerInteractionAcceptedContext[] {
	return contexts.map(context => ({
		cellKey: context.cellKey,
		roleKey: context.roleKey,
		tacticalContextKey: context.tacticalContextKey
	}));
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
 */
export function recordTowerInteractionObservation(
	state: TowerInteractionObservationState,
	observation: TowerInteractionObservation
): TowerInteractionObservationState {
	const next: TowerInteractionObservationState = {
		startedAtSeconds: nonNegative(state.startedAtSeconds),
		lastObservedAtSeconds: Math.max(
			nonNegative(state.lastObservedAtSeconds),
			nonNegative(observation.atSeconds)
		),
		attempts: nonNegative(state.attempts) + 1,
		allowedActions: nonNegative(state.allowedActions),
		rejectedActions: nonNegative(state.rejectedActions),
		ignoredActions: nonNegative(state.ignoredActions),
		cameraConflicts: nonNegative(state.cameraConflicts),
		rejectedBeforeFirstBuild: nonNegative(state.rejectedBeforeFirstBuild),
		ignoredBeforeFirstBuild: nonNegative(state.ignoredBeforeFirstBuild),
		firstAllowedAtSeconds: state.firstAllowedAtSeconds,
		firstBuildAtSeconds: state.firstBuildAtSeconds,
		acceptedReplacements: nonNegative(state.acceptedReplacements),
		repeatedSameContextReplacements: nonNegative(
			state.repeatedSameContextReplacements
		),
		reasonCounts: copyReasonCounts(state.reasonCounts),
		lastAcceptedContexts: copyContexts(state.lastAcceptedContexts)
	};
	const atSeconds = next.lastObservedAtSeconds;
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

	if (observation.cellKey !== null && observation.roleKey !== null) {
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
	const attempts = nonNegative(state.attempts);
	const allowedActions = nonNegative(state.allowedActions);
	const acceptedReplacements = nonNegative(state.acceptedReplacements);
	const repeatedSameContextReplacements = nonNegative(
		state.repeatedSameContextReplacements
	);
	return {
		attempts,
		allowedActions,
		rejectedActions: nonNegative(state.rejectedActions),
		ignoredActions: nonNegative(state.ignoredActions),
		allowanceRate: attempts <= 0 ? 0 : allowedActions / attempts,
		cameraConflicts: nonNegative(state.cameraConflicts),
		rejectedBeforeFirstBuild: nonNegative(state.rejectedBeforeFirstBuild),
		ignoredBeforeFirstBuild: nonNegative(state.ignoredBeforeFirstBuild),
		timeToFirstAllowedSeconds:
			state.firstAllowedAtSeconds === null
				? null
				: Math.max(
					0,
					finite(state.firstAllowedAtSeconds) -
						nonNegative(state.startedAtSeconds)
				),
		timeToFirstBuildSeconds:
			state.firstBuildAtSeconds === null
				? null
				: Math.max(
					0,
					finite(state.firstBuildAtSeconds) -
						nonNegative(state.startedAtSeconds)
				),
		acceptedReplacements,
		repeatedSameContextReplacements,
		repetitionRate:
			acceptedReplacements <= 0
				? 0
				: repeatedSameContextReplacements / acceptedReplacements,
		reasonCounts: copyReasonCounts(state.reasonCounts)
	};
}
