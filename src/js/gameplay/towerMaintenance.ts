import type {
	GeothermalDrillResult,
	GeothermalPoint,
	GeothermalStream
} from "./geothermalDrill";
import { findReachableGeothermalStream } from "./geothermalDrill";

export type TowerMaintenanceStage =
	| "idle"
	| "isolating"
	| "opening"
	| "redrilling"
	| "reconnecting"
	| "calibrating"
	| "complete";

export interface TowerMaintenanceSchedule {
	isolateEnd: number;
	openEnd: number;
	redrillEnd: number;
	reconnectEnd: number;
	completeAt: number;
}

export interface TowerMaintenanceState {
	stage: TowerMaintenanceStage;
	elapsedSeconds: number;
	firingLocked: boolean;
	serviceExposure: number;
	drillProgress: number;
	connectionGlow: number;
	calibrationProgress: number;
	searchAttempted: boolean;
	connected: boolean;
	connectedStreamId: string | null;
	contactPoint: GeothermalPoint | null;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, finite(value)));
}

function spanProgress(elapsed: number, start: number, end: number): number {
	const safeStart = Math.max(0, finite(start));
	const safeEnd = Math.max(safeStart, finite(end, safeStart));
	if (safeEnd === safeStart) {
		return elapsed >= safeEnd ? 1 : 0;
	}
	return clamp01((elapsed - safeStart) / (safeEnd - safeStart));
}

export function startTowerMaintenance(): TowerMaintenanceState {
	return {
		stage: "isolating",
		elapsedSeconds: 0,
		firingLocked: true,
		serviceExposure: 0,
		drillProgress: 0,
		connectionGlow: 0,
		calibrationProgress: 0,
		searchAttempted: false,
		connected: false,
		connectedStreamId: null,
		contactPoint: null
	};
}

/**
 * Advance a visible service cycle. The geological search happens exactly once
 * when the re-drilling interval completes. Stream migration on its own never
 * mutates tower state; only an explicit maintenance run performs the retry.
 */
export function stepTowerMaintenance(
	state: TowerMaintenanceState,
	deltaSeconds: number,
	schedule: TowerMaintenanceSchedule,
	drillOrigin: GeothermalPoint,
	streams: GeothermalStream[],
	maxReach: number
): TowerMaintenanceState {
	if (state.stage === "idle" || state.stage === "complete") {
		return state;
	}

	const elapsed = state.elapsedSeconds + Math.max(0, finite(deltaSeconds));
	const isolateEnd = Math.max(0, finite(schedule.isolateEnd));
	const openEnd = Math.max(isolateEnd, finite(schedule.openEnd, isolateEnd));
	const redrillEnd = Math.max(openEnd, finite(schedule.redrillEnd, openEnd));
	const reconnectEnd = Math.max(
		redrillEnd,
		finite(schedule.reconnectEnd, redrillEnd)
	);
	const completeAt = Math.max(
		reconnectEnd,
		finite(schedule.completeAt, reconnectEnd)
	);

	let stage: TowerMaintenanceStage;
	if (elapsed < isolateEnd) {
		stage = "isolating";
	} else if (elapsed < openEnd) {
		stage = "opening";
	} else if (elapsed < redrillEnd) {
		stage = "redrilling";
	} else if (elapsed < reconnectEnd) {
		stage = "reconnecting";
	} else if (elapsed < completeAt) {
		stage = "calibrating";
	} else {
		stage = "complete";
	}

	let searchAttempted = state.searchAttempted;
	let connected = state.connected;
	let connectedStreamId = state.connectedStreamId;
	let contactPoint = state.contactPoint;

	if (!searchAttempted && elapsed >= redrillEnd) {
		const result: GeothermalDrillResult & { contactPoint?: GeothermalPoint | null } =
			findReachableGeothermalStream(drillOrigin, streams, maxReach);
		searchAttempted = true;
		connected = result.connected;
		connectedStreamId = result.sourceId;
		contactPoint = result.contactPoint === undefined ? null : result.contactPoint;
	}

	const serviceExposure =
		stage === "isolating"
			? spanProgress(elapsed, 0, isolateEnd) * 0.35
			: stage === "opening" || stage === "redrilling" || stage === "reconnecting"
				? 1
				: stage === "calibrating"
					? 1 - spanProgress(elapsed, reconnectEnd, completeAt)
					: 0;
	const drillProgress = spanProgress(elapsed, openEnd, redrillEnd);
	const connectionGlow = connected
		? spanProgress(elapsed, redrillEnd, reconnectEnd)
		: 0;
	const calibrationProgress = spanProgress(elapsed, reconnectEnd, completeAt);

	return {
		stage,
		elapsedSeconds: elapsed,
		firingLocked: stage !== "complete",
		serviceExposure,
		drillProgress,
		connectionGlow,
		calibrationProgress,
		searchAttempted,
		connected,
		connectedStreamId,
		contactPoint
	};
}
