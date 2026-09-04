import type {
	TowerInteractionIntent,
	TowerInteractionPreview,
	TowerInteractionReason
} from "../gameplay/towerInteraction";

export type TowerFeedbackAnchor =
	| "ground"
	| "tower"
	| "core"
	| "arena-boundary"
	| "none";

export type TowerFeedbackPattern =
	| "solid"
	| "double"
	| "hatch"
	| "dashed"
	| "clipped"
	| "broken"
	| "service"
	| "none";

export type TowerFeedbackMotion =
	| "steady"
	| "compress"
	| "repel"
	| "pulse"
	| "break"
	| "fade"
	| "service"
	| "none";

export type TowerFeedbackAudioCue =
	| "placement-ready"
	| "upgrade-ready"
	| "rebuild-ready"
	| "maintenance-ready"
	| "occupied"
	| "unaffordable"
	| "protected-core"
	| "invalid-terrain"
	| "outside-arena"
	| "stale-target"
	| "max-level"
	| "invalid-state"
	| "none";

export type TowerFeedbackMeaning =
	| "ready"
	| "spatial-conflict"
	| "protected-space"
	| "terrain-conflict"
	| "boundary-conflict"
	| "resource-conflict"
	| "stale"
	| "max-state"
	| "diagnostic"
	| "suppressed";

export interface TowerInteractionFeedbackPreferences {
	reducedMotion: boolean;
	audioEnabled: boolean;
}

export interface TowerInteractionFeedbackDescriptor {
	meaning: TowerFeedbackMeaning;
	anchor: TowerFeedbackAnchor;
	pattern: TowerFeedbackPattern;
	motion: TowerFeedbackMotion;
	audioCue: TowerFeedbackAudioCue;
	announcement: string;
	showPreview: boolean;
	showCostRelationship: boolean;
	suppressed: boolean;
}

const DEFAULT_PREFERENCES: TowerInteractionFeedbackPreferences = {
	reducedMotion: false,
	audioEnabled: true
};

function withPreferences(
	descriptor: TowerInteractionFeedbackDescriptor,
	preferences: TowerInteractionFeedbackPreferences
): TowerInteractionFeedbackDescriptor {
	return {
		...descriptor,
		motion: preferences.reducedMotion ? "none" : descriptor.motion,
		audioCue: preferences.audioEnabled ? descriptor.audioCue : "none"
	};
}

function readyDescriptor(
	intent: TowerInteractionIntent
): TowerInteractionFeedbackDescriptor {
	if (intent === "place") {
		return {
			meaning: "ready",
			anchor: "ground",
			pattern: "solid",
			motion: "steady",
			audioCue: "placement-ready",
			announcement: "Placement available",
			showPreview: true,
			showCostRelationship: true,
			suppressed: false
		};
	}
	if (intent === "upgrade") {
		return {
			meaning: "ready",
			anchor: "tower",
			pattern: "double",
			motion: "pulse",
			audioCue: "upgrade-ready",
			announcement: "Tower upgrade available",
			showPreview: true,
			showCostRelationship: true,
			suppressed: false
		};
	}
	if (intent === "rebuild") {
		return {
			meaning: "ready",
			anchor: "tower",
			pattern: "double",
			motion: "pulse",
			audioCue: "rebuild-ready",
			announcement: "Legacy tower reconstruction available",
			showPreview: true,
			showCostRelationship: true,
			suppressed: false
		};
	}
	if (intent === "maintain") {
		return {
			meaning: "ready",
			anchor: "tower",
			pattern: "service",
			motion: "service",
			audioCue: "maintenance-ready",
			announcement: "Tower maintenance available",
			showPreview: true,
			showCostRelationship: true,
			suppressed: false
		};
	}
	return {
		meaning: "diagnostic",
		anchor: "none",
		pattern: "broken",
		motion: "none",
		audioCue: "invalid-state",
		announcement: "Interaction state unavailable",
		showPreview: false,
		showCostRelationship: false,
		suppressed: false
	};
}

function rejectionDescriptor(
	reason: TowerInteractionReason,
	preview: TowerInteractionPreview
): TowerInteractionFeedbackDescriptor {
	if (reason === "occupied") {
		return {
			meaning: "spatial-conflict",
			anchor: "ground",
			pattern: "hatch",
			motion: "compress",
			audioCue: "occupied",
			announcement: "Placement blocked by occupied space",
			showPreview: true,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "protected-core") {
		return {
			meaning: "protected-space",
			anchor: "core",
			pattern: "double",
			motion: "repel",
			audioCue: "protected-core",
			announcement: "This core space is protected",
			showPreview: true,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "invalid-terrain") {
		return {
			meaning: "terrain-conflict",
			anchor: "ground",
			pattern: "broken",
			motion: "break",
			audioCue: "invalid-terrain",
			announcement: "This surface cannot support the action",
			showPreview: true,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "outside-arena") {
		return {
			meaning: "boundary-conflict",
			anchor: "arena-boundary",
			pattern: "clipped",
			motion: "fade",
			audioCue: "outside-arena",
			announcement: "Target is outside the playable arena",
			showPreview: true,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "unaffordable") {
		return {
			meaning: "resource-conflict",
			anchor: preview.intent === "place" ? "ground" : "tower",
			pattern: "solid",
			motion: "pulse",
			audioCue: "unaffordable",
			announcement: "Insufficient energy for this action",
			showPreview: true,
			showCostRelationship: true,
			suppressed: false
		};
	}
	if (reason === "stale-target") {
		return {
			meaning: "stale",
			anchor: "none",
			pattern: "dashed",
			motion: "fade",
			audioCue: "stale-target",
			announcement: "Target is no longer available",
			showPreview: false,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "max-level") {
		return {
			meaning: "max-state",
			anchor: "tower",
			pattern: "double",
			motion: "steady",
			audioCue: "max-level",
			announcement: "Tower is already at its maximum state",
			showPreview: true,
			showCostRelationship: false,
			suppressed: false
		};
	}
	if (reason === "invalid-cost" || reason === "invalid-tower-level") {
		return {
			meaning: "diagnostic",
			anchor: preview.intent === "place" ? "ground" : "tower",
			pattern: "broken",
			motion: "none",
			audioCue: "invalid-state",
			announcement: "Interaction is unavailable",
			showPreview: false,
			showCostRelationship: false,
			suppressed: false
		};
	}
	return {
		meaning: "diagnostic",
		anchor: "none",
		pattern: "broken",
		motion: "none",
		audioCue: "invalid-state",
		announcement: "Interaction is unavailable",
		showPreview: false,
		showCostRelationship: false,
		suppressed: false
	};
}

/**
 * Map an authoritative tower-interaction preview into presentation semantics.
 *
 * This is strictly downstream of gameplay classification. It cannot make a
 * rejected interaction legal, alter cost/balance, choose max-tier policy, or
 * mutate the scene. Presentation adapters may render these descriptors with
 * Babylon/DOM/Web Audio later.
 */
export function towerInteractionFeedback(
	preview: TowerInteractionPreview,
	preferences: TowerInteractionFeedbackPreferences = DEFAULT_PREFERENCES
): TowerInteractionFeedbackDescriptor {
	if (preview.disposition === "ignored" && preview.reason === "camera-gesture") {
		return {
			meaning: "suppressed",
			anchor: "none",
			pattern: "none",
			motion: "none",
			audioCue: "none",
			announcement: "",
			showPreview: false,
			showCostRelationship: false,
			suppressed: true
		};
	}

	const descriptor =
		preview.disposition === "allowed"
			? readyDescriptor(preview.intent)
			: rejectionDescriptor(preview.reason, preview);
	return withPreferences(descriptor, preferences);
}
