import type { MothershipEnergyLiftState } from "./mothershipEnergyLift";

export interface MothershipDiscreteSpendAuthorization {
	authorized: boolean;
	requestedEnergy: number;
	availableEnergy: number;
	shortfallEnergy: number;
}

export interface MothershipContinuousSpendFunding {
	requestedEnergy: number;
	fundedEnergy: number;
	unmetEnergy: number;
}

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

/**
 * Check an all-or-nothing action before committing its physical side effect.
 *
 * This helper does not mutate reserve. The caller should only spawn/commit the
 * action when `authorized` is true, then submit exactly `requestedEnergy` to
 * the authoritative energy/lift step in the same simulation transaction.
 *
 * `protectedReserve` is optional policy: zero allows spending down to empty;
 * a caller may reserve a survival/hover buffer without changing core physics.
 */
export function authorizeDiscreteMothershipSpend(
	state: MothershipEnergyLiftState,
	requestedEnergy: number,
	protectedReserve = 0
): MothershipDiscreteSpendAuthorization {
	const requested = positive(requestedEnergy);
	const reserve = positive(state.reserve);
	const protectedAmount = Math.min(reserve, positive(protectedReserve));
	const available = state.phase === "hulk" ? 0 : Math.max(0, reserve - protectedAmount);
	const shortfall = Math.max(0, requested - available);
	return {
		authorized: shortfall <= 0,
		requestedEnergy: requested,
		availableEnergy: available,
		shortfallEnergy: shortfall
	};
}

/**
 * Determine how much continuously requested propulsion/service demand can be
 * funded this step. Unlike a discrete launch, continuous authority may degrade
 * proportionally instead of creating energy debt.
 *
 * This helper also does not mutate reserve. The funded amount is intended to be
 * submitted to the single reserve authority while the calling motion/actuator
 * layer scales its commanded authority by `funded / requested`.
 */
export function fundContinuousMothershipSpend(
	state: MothershipEnergyLiftState,
	requestedEnergy: number,
	protectedReserve = 0
): MothershipContinuousSpendFunding {
	const requested = positive(requestedEnergy);
	const reserve = positive(state.reserve);
	const protectedAmount = Math.min(reserve, positive(protectedReserve));
	const available = state.phase === "hulk" ? 0 : Math.max(0, reserve - protectedAmount);
	const funded = Math.min(requested, available);
	return {
		requestedEnergy: requested,
		fundedEnergy: funded,
		unmetEnergy: Math.max(0, requested - funded)
	};
}

export function mothershipFundingFraction(
	funding: MothershipContinuousSpendFunding
): number {
	if (funding.requestedEnergy <= 0) {
		return 1;
	}
	return Math.max(0, Math.min(1, funding.fundedEnergy / funding.requestedEnergy));
}
