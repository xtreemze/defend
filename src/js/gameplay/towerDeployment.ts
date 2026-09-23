export type TowerDeploymentStage =
	| "foundation"
	| "base"
	| "drilling"
	| "assembly"
	| "calibrating"
	| "ready"
	| "dry";

export interface TowerDeploymentWindow {
	start: number;
	end: number;
}

export interface TowerDeploymentSchedule {
	base: TowerDeploymentWindow;
	drill?: TowerDeploymentWindow;
	pillar?: TowerDeploymentWindow;
	turret?: TowerDeploymentWindow;
	completeAt: number;
}

export interface TowerDeploymentProgress {
	base: number;
	drill: number;
	pillar: number;
	turret: number;
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

export function deploymentWindowProgress(
	elapsedSeconds: number,
	window: TowerDeploymentWindow | undefined
): number {
	if (window === undefined) {
		return 0;
	}
	const start = finite(window.start);
	const end = Math.max(start, finite(window.end, start));
	if (end === start) {
		return finite(elapsedSeconds) >= end ? 1 : 0;
	}
	return clamp01((finite(elapsedSeconds) - start) / (end - start));
}

export function towerDeploymentProgress(
	elapsedSeconds: number,
	schedule: TowerDeploymentSchedule
): TowerDeploymentProgress {
	return {
		base: deploymentWindowProgress(elapsedSeconds, schedule.base),
		drill: deploymentWindowProgress(elapsedSeconds, schedule.drill),
		pillar: deploymentWindowProgress(elapsedSeconds, schedule.pillar),
		turret: deploymentWindowProgress(elapsedSeconds, schedule.turret)
	};
}

/**
 * Semantic phase only. Component progress may overlap; callers should use
 * `towerDeploymentProgress()` for visual growth and this function for status/UI.
 */
export function towerDeploymentStage(
	level: number,
	elapsedSeconds: number,
	powered: boolean,
	schedule: TowerDeploymentSchedule
): TowerDeploymentStage {
	const elapsed = Math.max(0, finite(elapsedSeconds));
	const completeAt = Math.max(0, finite(schedule.completeAt));
	if (elapsed < Math.max(0, finite(schedule.base.start))) {
		return "foundation";
	}
	if (elapsed < Math.max(0, finite(schedule.base.end))) {
		return "base";
	}
	if (level <= 1) {
		return elapsed < completeAt ? "calibrating" : "ready";
	}
	if (schedule.drill !== undefined && elapsed < Math.max(0, finite(schedule.drill.end))) {
		return "drilling";
	}
	if (schedule.turret !== undefined && elapsed < Math.max(0, finite(schedule.turret.end))) {
		return "assembly";
	}
	if (elapsed < completeAt) {
		return "calibrating";
	}
	return powered ? "ready" : "dry";
}
