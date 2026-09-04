export type TowerInteractionTargetKind =
	| "ground"
	| "tower"
	| "protected-core"
	| "invalid-terrain"
	| "outside-arena"
	| "stale-target";

export type TowerInteractionInputOwner = "world" | "camera";

/**
 * `legacy-strict` mirrors the current production `balance > cost` behavior.
 * `inclusive` expresses ordinary exact-cost affordability (`balance >= cost`)
 * for the separately tracked post-baseline fix. The caller chooses explicitly;
 * this module does not silently change live economics.
 */
export type TowerAffordabilityRule = "legacy-strict" | "inclusive";

/**
 * Current production reconstructs level 3 when it is tapped and affordable.
 * Maintenance/no-op semantics remain design decisions, so the caller selects
 * which interpretation is being previewed or certified.
 */
export type TowerMaxLevelBehavior =
	| "legacy-rebuild"
	| "maintenance"
	| "no-op";

export type TowerInteractionIntent =
	| "place"
	| "upgrade"
	| "rebuild"
	| "maintain"
	| "none";

export type TowerInteractionDisposition = "allowed" | "rejected" | "ignored";

export type TowerInteractionReason =
	| "none"
	| "camera-gesture"
	| "occupied"
	| "unaffordable"
	| "invalid-cost"
	| "protected-core"
	| "invalid-terrain"
	| "outside-arena"
	| "stale-target"
	| "max-level"
	| "invalid-tower-level";

export interface TowerInteractionRequest {
	inputOwner: TowerInteractionInputOwner;
	targetKind: TowerInteractionTargetKind;
	occupied: boolean;
	balance: number;
	requestedCost: number;
	currentLevel: number;
	maximumLevel: number;
	affordabilityRule: TowerAffordabilityRule;
	maxLevelBehavior: TowerMaxLevelBehavior;
}

export interface TowerInteractionPreview {
	intent: TowerInteractionIntent;
	disposition: TowerInteractionDisposition;
	reason: TowerInteractionReason;
	requestedCost: number;
	balanceBefore: number;
	balanceAfter: number;
	fromLevel: number;
	toLevel: number;
}

function finite(value: number, fallback = 0): number {
	if (
		typeof value !== "number" ||
		value !== value ||
		value === Infinity ||
		value === -Infinity
	) {
		return fallback;
	}
	return value;
}

function nonnegative(value: number): number {
	return Math.max(0, finite(value));
}

function isFiniteNonnegative(value: number): boolean {
	return (
		typeof value === "number" &&
		value === value &&
		value !== Infinity &&
		value !== -Infinity &&
		value >= 0
	);
}

function towerLevel(value: number): number {
	return Math.max(0, Math.floor(nonnegative(value)));
}

export function towerInteractionCanAfford(
	balance: number,
	cost: number,
	rule: TowerAffordabilityRule
): boolean {
	if (!isFiniteNonnegative(balance) || !isFiniteNonnegative(cost)) return false;
	return rule === "inclusive" ? balance >= cost : balance > cost;
}

function preview(
	request: TowerInteractionRequest,
	intent: TowerInteractionIntent,
	disposition: TowerInteractionDisposition,
	reason: TowerInteractionReason,
	fromLevel: number,
	toLevel: number,
	charge: boolean
): TowerInteractionPreview {
	const balance = nonnegative(request.balance);
	const cost = nonnegative(request.requestedCost);
	return {
		intent,
		disposition,
		reason,
		requestedCost: cost,
		balanceBefore: balance,
		balanceAfter: charge ? Math.max(0, balance - cost) : balance,
		fromLevel,
		toLevel
	};
}

function rejected(
	request: TowerInteractionRequest,
	reason: TowerInteractionReason,
	intent: TowerInteractionIntent,
	fromLevel: number,
	toLevel: number
): TowerInteractionPreview {
	return preview(request, intent, "rejected", reason, fromLevel, toLevel, false);
}

function permitted(
	request: TowerInteractionRequest,
	intent: TowerInteractionIntent,
	fromLevel: number,
	toLevel: number
): TowerInteractionPreview {
	if (!isFiniteNonnegative(request.requestedCost)) {
		return rejected(request, "invalid-cost", intent, fromLevel, toLevel);
	}
	if (
		!towerInteractionCanAfford(
			request.balance,
			request.requestedCost,
			request.affordabilityRule
		)
	) {
		return rejected(request, "unaffordable", intent, fromLevel, toLevel);
	}
	return preview(request, intent, "allowed", "none", fromLevel, toLevel, true);
}

/**
 * Classify a pointer/touch candidate before Babylon presentation or mutation.
 *
 * Geometry/picking owns target classification and requested cost. This function
 * owns only the semantic result: what the user appears to be asking for, whether
 * that request is actionable under the selected legacy/future policy, and the
 * reason a world interaction should communicate when it is not.
 *
 * It intentionally performs no scene mutation, audio, color change, placement,
 * disposal, construction, upgrade, maintenance or reserve mutation.
 */
export function classifyTowerInteraction(
	request: TowerInteractionRequest
): TowerInteractionPreview {
	const currentLevel = towerLevel(request.currentLevel);
	const maximumLevel = Math.max(1, towerLevel(request.maximumLevel));

	if (request.inputOwner === "camera") {
		return preview(
			request,
			"none",
			"ignored",
			"camera-gesture",
			currentLevel,
			currentLevel,
			false
		);
	}

	if (request.targetKind === "protected-core") {
		return rejected(
			request,
			"protected-core",
			"none",
			currentLevel,
			currentLevel
		);
	}
	if (request.targetKind === "invalid-terrain") {
		return rejected(
			request,
			"invalid-terrain",
			"none",
			currentLevel,
			currentLevel
		);
	}
	if (request.targetKind === "outside-arena") {
		return rejected(
			request,
			"outside-arena",
			"none",
			currentLevel,
			currentLevel
		);
	}
	if (request.targetKind === "stale-target") {
		return rejected(
			request,
			"stale-target",
			"none",
			currentLevel,
			currentLevel
		);
	}

	if (request.targetKind === "ground") {
		if (request.occupied) {
			return rejected(request, "occupied", "place", 0, 1);
		}
		return permitted(request, "place", 0, 1);
	}

	if (currentLevel <= 0 || currentLevel > maximumLevel) {
		return rejected(
			request,
			"invalid-tower-level",
			"none",
			currentLevel,
			currentLevel
		);
	}

	if (currentLevel < maximumLevel) {
		return permitted(request, "upgrade", currentLevel, currentLevel + 1);
	}

	if (request.maxLevelBehavior === "legacy-rebuild") {
		return permitted(request, "rebuild", currentLevel, currentLevel);
	}
	if (request.maxLevelBehavior === "maintenance") {
		return permitted(request, "maintain", currentLevel, currentLevel);
	}
	return rejected(
		request,
		"max-level",
		"none",
		currentLevel,
		currentLevel
	);
}
