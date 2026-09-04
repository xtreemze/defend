type DefenseInteractionKind = "placement" | "tower";
type DefenseGestureOwner = "world" | "camera";
type DefenseMaxTowerAction = "reject" | "refresh";
type DefenseInteractionAction = "none" | "place" | "upgrade" | "refresh";
type DefenseInteractionRejection =
	| "none"
	| "camera-gesture"
	| "stale-target"
	| "invalid-terrain"
	| "protected-target"
	| "occupied"
	| "unaffordable"
	| "invalid-tower-state"
	| "max-state";

interface DefenseInteractionRequest {
	kind: DefenseInteractionKind;
	gestureOwner: DefenseGestureOwner;
	targetAvailable: boolean;
	affordable: boolean;
	terrainValid?: boolean;
	protectedTarget?: boolean;
	occupied?: boolean;
	currentTowerLevel?: number;
	maxTowerLevel?: number;
	maxTowerAction?: DefenseMaxTowerAction;
}

interface DefenseInteractionResolution {
	accepted: boolean;
	action: DefenseInteractionAction;
	rejection: DefenseInteractionRejection;
	fromLevel: number | null;
	toLevel: number | null;
}

function rejected(
	rejection: DefenseInteractionRejection,
	fromLevel: number | null = null
): DefenseInteractionResolution {
	return {
		accepted: false,
		action: "none",
		rejection,
		fromLevel,
		toLevel: fromLevel
	};
}

function accepted(
	action: DefenseInteractionAction,
	fromLevel: number | null,
	toLevel: number | null
): DefenseInteractionResolution {
	return {
		accepted: true,
		action,
		rejection: "none",
		fromLevel,
		toLevel
	};
}

function resolvePlacementInteraction(
	request: DefenseInteractionRequest
): DefenseInteractionResolution {
	if (request.terrainValid !== true) {
		return rejected("invalid-terrain");
	}
	if (request.protectedTarget === true) {
		return rejected("protected-target");
	}
	if (request.occupied === true) {
		return rejected("occupied");
	}
	if (!request.affordable) {
		return rejected("unaffordable");
	}
	return accepted("place", null, 1);
}

function resolveTowerInteraction(
	request: DefenseInteractionRequest
): DefenseInteractionResolution {
	const currentLevel = request.currentTowerLevel;
	const maxLevel = request.maxTowerLevel;

	if (
		typeof currentLevel !== "number" ||
		typeof maxLevel !== "number" ||
		currentLevel < 1 ||
		maxLevel < 1 ||
		currentLevel > maxLevel
	) {
		return rejected("invalid-tower-state");
	}

	if (currentLevel === maxLevel) {
		if (request.maxTowerAction !== "refresh") {
			return rejected("max-state", currentLevel);
		}
		if (!request.affordable) {
			return rejected("unaffordable", currentLevel);
		}
		return accepted("refresh", currentLevel, currentLevel);
	}

	if (!request.affordable) {
		return rejected("unaffordable", currentLevel);
	}

	return accepted("upgrade", currentLevel, currentLevel + 1);
}

/**
 * Classify a direct-world defensive interaction without depending on Babylon,
 * DOM state, balance arithmetic, or presentation effects.
 *
 * The caller resolves affordability separately. This keeps the interaction
 * contract neutral while the legacy strict-greater-than affordability behavior
 * is characterized and later corrected independently.
 */
function resolveDefenseInteraction(
	request: DefenseInteractionRequest
): DefenseInteractionResolution {
	if (request.gestureOwner === "camera") {
		return rejected("camera-gesture");
	}
	if (!request.targetAvailable) {
		return rejected("stale-target");
	}
	if (request.kind === "placement") {
		return resolvePlacementInteraction(request);
	}
	return resolveTowerInteraction(request);
}

export {
	DefenseInteractionKind,
	DefenseGestureOwner,
	DefenseMaxTowerAction,
	DefenseInteractionAction,
	DefenseInteractionRejection,
	DefenseInteractionRequest,
	DefenseInteractionResolution,
	resolveDefenseInteraction
};
