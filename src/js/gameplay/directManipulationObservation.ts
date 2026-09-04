import type {
	DirectManipulationOutcome,
	DirectManipulationRejectionReason
} from "./directManipulation";

export type DirectManipulationInterventionKind =
	| "new-build"
	| "replacement"
	| "upgrade"
	| "maintenance"
	| "other";

export interface DirectManipulationObservation {
	/** Monotonic session-relative time. */
	atSeconds: number;
	/** Stable topology/cell identity when the attempt resolves to one. */
	cellKey: string | null;
	/** Stable semantic role, e.g. barrier/interceptor/siege. */
	roleKey: string | null;
	/** Caller-owned tactical-context fingerprint; no gameplay authority implied. */
	tacticalContextKey: string;
	interventionKind: DirectManipulationInterventionKind;
	outcome: DirectManipulationOutcome;
}

export interface DirectManipulationRejectionCounts {
	unaffordable: number;
	occupied: number;
	protected: number;
	invalidTerrain: number;
	maximumState: number;
	noServiceNeeded: number;
	cameraOwned: number;
	staleTarget: number;
	unsupportedTarget: number;
}

export interface DirectManipulationAcceptedContext {
	cellKey: string;
	roleKey: string;
	tacticalContextKey: string;
}

export interface DirectManipulationObservationState {
	startedAtSeconds: number;
	lastObservedAtSeconds: number;
	attempts: number;
	acceptedActions: number;
	rejectedActions: number;
	cameraConflicts: number;
	rejectedBeforeFirstBuild: number;
	firstAcceptedAtSeconds: number | null;
	firstBuildAtSeconds: number | null;
	acceptedReplacements: number;
	repeatedSameContextReplacements: number;
	rejectionCounts: DirectManipulationRejectionCounts;
	lastAcceptedContexts: DirectManipulationAcceptedContext[];
}

export interface DirectManipulationObservationSummary {
	attempts: number;
	acceptedActions: number;
	rejectedActions: number;
	acceptanceRate: number;
	cameraConflicts: number;
	rejectedBeforeFirstBuild: number;
	timeToFirstAcceptedSeconds: number | null;
	timeToFirstBuildSeconds: number | null;
	acceptedReplacements: number;
	repeatedSameContextReplacements: number;
	repetitionRate: number;
	rejectionCounts: DirectManipulationRejectionCounts;
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

function emptyRejectionCounts(): DirectManipulationRejectionCounts {
	return {
		unaffordable: 0,
		occupied: 0,
		protected: 0,
		invalidTerrain: 0,
		maximumState: 0,
		noServiceNeeded: 0,
		cameraOwned: 0,
		staleTarget: 0,
		unsupportedTarget: 0
	};
}

function copyRejectionCounts(
	counts: DirectManipulationRejectionCounts
): DirectManipulationRejectionCounts {
	return {
		unaffordable: counts.unaffordable,
		occupied: counts.occupied,
		protected: counts.protected,
		invalidTerrain: counts.invalidTerrain,
		maximumState: counts.maximumState,
		noServiceNeeded: counts.noServiceNeeded,
		cameraOwned: counts.cameraOwned,
		staleTarget: counts.staleTarget,
		unsupportedTarget: counts.unsupportedTarget
	};
}

function copyContexts(
	contexts: DirectManipulationAcceptedContext[]
): DirectManipulationAcceptedContext[] {
	return contexts.map(context => ({
		cellKey: context.cellKey,
		roleKey: context.roleKey,
		tacticalContextKey: context.tacticalContextKey
	}));
}

export function createDirectManipulationObservationState(
	startedAtSeconds = 0
): DirectManipulationObservationState {
	const start = nonNegative(startedAtSeconds);
	return {
		startedAtSeconds: start,
		lastObservedAtSeconds: start,
		attempts: 0,
		acceptedActions: 0,
		rejectedActions: 0,
		cameraConflicts: 0,
		rejectedBeforeFirstBuild: 0,
		firstAcceptedAtSeconds: null,
		firstBuildAtSeconds: null,
		acceptedReplacements: 0,
		repeatedSameContextReplacements: 0,
		rejectionCounts: emptyRejectionCounts(),
		lastAcceptedContexts: []
	};
}

function incrementReason(
	counts: DirectManipulationRejectionCounts,
	reason: DirectManipulationRejectionReason
): void {
	if (reason === "unaffordable") counts.unaffordable += 1;
	else if (reason === "occupied") counts.occupied += 1;
	else if (reason === "protected") counts.protected += 1;
	else if (reason === "invalid-terrain") counts.invalidTerrain += 1;
	else if (reason === "maximum-state") counts.maximumState += 1;
	else if (reason === "no-service-needed") counts.noServiceNeeded += 1;
	else if (reason === "camera-owned") counts.cameraOwned += 1;
	else if (reason === "stale-target") counts.staleTarget += 1;
	else if (reason === "unsupported-target") counts.unsupportedTarget += 1;
}

function contextIndex(
	contexts: DirectManipulationAcceptedContext[],
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

/**
 * Append one observational event without changing gameplay state.
 *
 * `tacticalContextKey` is deliberately caller-owned. It should represent only
 * the coarse facts needed to decide whether a same-cell/same-role replacement
 * occurred under materially unchanged circumstances. The observer never reads
 * or mutates combat simulation state directly.
 */
export function recordDirectManipulationObservation(
	state: DirectManipulationObservationState,
	observation: DirectManipulationObservation
): DirectManipulationObservationState {
	const next: DirectManipulationObservationState = {
		startedAtSeconds: nonNegative(state.startedAtSeconds),
		lastObservedAtSeconds: Math.max(
			nonNegative(state.lastObservedAtSeconds),
			nonNegative(observation.atSeconds)
		),
		attempts: nonNegative(state.attempts) + 1,
		acceptedActions: nonNegative(state.acceptedActions),
		rejectedActions: nonNegative(state.rejectedActions),
		cameraConflicts: nonNegative(state.cameraConflicts),
		rejectedBeforeFirstBuild: nonNegative(state.rejectedBeforeFirstBuild),
		firstAcceptedAtSeconds: state.firstAcceptedAtSeconds,
		firstBuildAtSeconds: state.firstBuildAtSeconds,
		acceptedReplacements: nonNegative(state.acceptedReplacements),
		repeatedSameContextReplacements: nonNegative(
			state.repeatedSameContextReplacements
		),
		rejectionCounts: copyRejectionCounts(state.rejectionCounts),
		lastAcceptedContexts: copyContexts(state.lastAcceptedContexts)
	};
	const atSeconds = next.lastObservedAtSeconds;

	if (!observation.outcome.accepted) {
		next.rejectedActions += 1;
		incrementReason(next.rejectionCounts, observation.outcome.rejectionReason);
		if (observation.outcome.rejectionReason === "camera-owned") {
			next.cameraConflicts += 1;
		}
		if (next.firstBuildAtSeconds === null) {
			next.rejectedBeforeFirstBuild += 1;
		}
		return next;
	}

	next.acceptedActions += 1;
	if (next.firstAcceptedAtSeconds === null) {
		next.firstAcceptedAtSeconds = atSeconds;
	}
	if (
		next.firstBuildAtSeconds === null &&
		observation.interventionKind === "new-build" &&
		observation.outcome.action === "place"
	) {
		next.firstBuildAtSeconds = atSeconds;
	}

	if (
		observation.cellKey !== null &&
		observation.roleKey !== null
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

export function summarizeDirectManipulationObservations(
	state: DirectManipulationObservationState
): DirectManipulationObservationSummary {
	const attempts = nonNegative(state.attempts);
	const acceptedActions = nonNegative(state.acceptedActions);
	const acceptedReplacements = nonNegative(state.acceptedReplacements);
	const repeatedSameContextReplacements = nonNegative(
		state.repeatedSameContextReplacements
	);
	return {
		attempts,
		acceptedActions,
		rejectedActions: nonNegative(state.rejectedActions),
		acceptanceRate: attempts <= 0 ? 0 : acceptedActions / attempts,
		cameraConflicts: nonNegative(state.cameraConflicts),
		rejectedBeforeFirstBuild: nonNegative(state.rejectedBeforeFirstBuild),
		timeToFirstAcceptedSeconds:
			state.firstAcceptedAtSeconds === null
				? null
				: Math.max(
					0,
					finite(state.firstAcceptedAtSeconds) -
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
		rejectionCounts: copyRejectionCounts(state.rejectionCounts)
	};
}
