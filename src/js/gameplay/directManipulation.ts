export type DirectManipulationTargetKind =
	| "ground"
	| "tower"
	| "other"
	| "none";

export type DirectManipulationGestureOwner = "world" | "camera" | "none";

export type TowerDirectAction = "upgrade" | "maintenance";

export type DirectManipulationAction =
	| "place"
	| "upgrade"
	| "maintenance"
	| "none";

export type DirectManipulationRejectionReason =
	| "none"
	| "unaffordable"
	| "occupied"
	| "protected"
	| "invalid-terrain"
	| "maximum-state"
	| "no-service-needed"
	| "camera-owned"
	| "stale-target"
	| "unsupported-target";

export type DirectManipulationCueFamily =
	| "commit"
	| "resource"
	| "occupancy"
	| "protected"
	| "terrain"
	| "maximum"
	| "service"
	| "gesture"
	| "stale"
	| "unsupported";

export type DirectManipulationResidue =
	| "new-tower"
	| "higher-tier"
	| "serviced"
	| "unchanged";

export interface DirectManipulationCandidate {
	targetKind: DirectManipulationTargetKind;
	gestureOwner: DirectManipulationGestureOwner;
	targetStale: boolean;
	terrainValid: boolean;
	occupied: boolean;
	protected: boolean;
	/** Caller-owned economy verdict. This module does not encode `>` vs `>=`. */
	affordable: boolean;
	requiredEnergy: number;
	currentTowerLevel: number | null;
	maximumTowerLevel: number;
	requestedTowerAction: TowerDirectAction;
	maintenanceAvailable: boolean;
}

export interface DirectManipulationOutcome {
	action: DirectManipulationAction;
	accepted: boolean;
	rejectionReason: DirectManipulationRejectionReason;
	cueFamily: DirectManipulationCueFamily;
	requiredEnergy: number;
	currentTowerLevel: number | null;
	resultingTowerLevel: number | null;
	residue: DirectManipulationResidue;
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

function normalizedLevel(value: number | null): number | null {
	if (value === null) return null;
	return Math.max(1, Math.floor(finite(value, 1)));
}

function reject(
	reason: DirectManipulationRejectionReason,
	cueFamily: DirectManipulationCueFamily,
	candidate: DirectManipulationCandidate,
	action: DirectManipulationAction = "none"
): DirectManipulationOutcome {
	const currentTowerLevel = normalizedLevel(candidate.currentTowerLevel);
	return {
		action,
		accepted: false,
		rejectionReason: reason,
		cueFamily,
		requiredEnergy: nonNegative(candidate.requiredEnergy),
		currentTowerLevel,
		resultingTowerLevel: currentTowerLevel,
		residue: "unchanged"
	};
}

/**
 * Classify a direct-world manipulation attempt before presentation or mutation.
 *
 * The caller remains authoritative for:
 * - pointer/pick resolution;
 * - grid/topology occupancy;
 * - protected/core-cell policy;
 * - terrain validity;
 * - economy affordability semantics;
 * - whether maintenance is currently meaningful.
 *
 * This contract only makes those facts legible as one deterministic action or
 * rejection reason. It intentionally does not reproduce the legacy strict-`>`
 * affordability rule tracked by #109.
 */
export function classifyDirectManipulation(
	candidate: DirectManipulationCandidate
): DirectManipulationOutcome {
	if (candidate.gestureOwner === "camera") {
		return reject("camera-owned", "gesture", candidate);
	}

	if (candidate.targetStale) {
		return reject("stale-target", "stale", candidate);
	}

	if (candidate.targetKind === "ground") {
		if (!candidate.terrainValid) {
			return reject("invalid-terrain", "terrain", candidate, "place");
		}
		if (candidate.protected) {
			return reject("protected", "protected", candidate, "place");
		}
		if (candidate.occupied) {
			return reject("occupied", "occupancy", candidate, "place");
		}
		if (!candidate.affordable) {
			return reject("unaffordable", "resource", candidate, "place");
		}
		return {
			action: "place",
			accepted: true,
			rejectionReason: "none",
			cueFamily: "commit",
			requiredEnergy: nonNegative(candidate.requiredEnergy),
			currentTowerLevel: null,
			resultingTowerLevel: 1,
			residue: "new-tower"
		};
	}

	if (candidate.targetKind === "tower") {
		const currentTowerLevel = normalizedLevel(candidate.currentTowerLevel);
		if (currentTowerLevel === null) {
			return reject("stale-target", "stale", candidate);
		}

		if (candidate.requestedTowerAction === "maintenance") {
			if (!candidate.maintenanceAvailable) {
				return reject(
					"no-service-needed",
					"service",
					candidate,
					"maintenance"
				);
			}
			if (!candidate.affordable) {
				return reject(
					"unaffordable",
					"resource",
					candidate,
					"maintenance"
				);
			}
			return {
				action: "maintenance",
				accepted: true,
				rejectionReason: "none",
				cueFamily: "commit",
				requiredEnergy: nonNegative(candidate.requiredEnergy),
				currentTowerLevel,
				resultingTowerLevel: currentTowerLevel,
				residue: "serviced"
			};
		}

		const maximumTowerLevel = Math.max(
			1,
			Math.floor(finite(candidate.maximumTowerLevel, 1))
		);
		if (currentTowerLevel >= maximumTowerLevel) {
			return reject(
				"maximum-state",
				"maximum",
				candidate,
				"upgrade"
			);
		}
		if (!candidate.affordable) {
			return reject(
				"unaffordable",
				"resource",
				candidate,
				"upgrade"
			);
		}
		return {
			action: "upgrade",
			accepted: true,
			rejectionReason: "none",
			cueFamily: "commit",
			requiredEnergy: nonNegative(candidate.requiredEnergy),
			currentTowerLevel,
			resultingTowerLevel: currentTowerLevel + 1,
			residue: "higher-tier"
		};
	}

	return reject("unsupported-target", "unsupported", candidate);
}

export function directManipulationIsRejected(
	outcome: DirectManipulationOutcome
): boolean {
	return !outcome.accepted && outcome.rejectionReason !== "none";
}
