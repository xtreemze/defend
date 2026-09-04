import type { MothershipEnergyLiftState } from "./mothershipEnergyLift";

export interface MothershipDiscreteSpendAuthorization {
	authorized: boolean;
	inputValid: boolean;
	requestedEnergy: number;
	availableEnergy: number;
	shortfallEnergy: number;
}

export interface MothershipContinuousSpendFunding {
	inputValid: boolean;
	authorityAvailable: boolean;
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

function isFiniteNonnegative(value: number): boolean {
	return (
		value === value &&
		value !== Infinity &&
		value !== -Infinity &&
		value >= 0
	);
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
 * Malformed authority inputs fail closed instead of being sanitized into free
 * physical permission.
 */
export function authorizeDiscreteMothershipSpend(
	state: MothershipEnergyLiftState,
	requestedEnergy: number,
	protectedReserve = 0
): MothershipDiscreteSpendAuthorization {
	const requestedValid = isFiniteNonnegative(requestedEnergy);
	const protectedValid = isFiniteNonnegative(protectedReserve);
	const reserveValid = isFiniteNonnegative(state.reserve);
	const inputValid = requestedValid && protectedValid && reserveValid;
	const requested = requestedValid ? requestedEnergy : 0;
	const reserve = reserveValid ? state.reserve : 0;
	const protectedAmount = protectedValid
		? Math.min(reserve, protectedReserve)
		: reserve;
	const authorityAvailable = inputValid && state.phase !== "hulk";
	const available = authorityAvailable
		? Math.max(0, reserve - protectedAmount)
		: 0;
	const shortfall = Math.max(0, requested - available);
	return {
		authorized: authorityAvailable && shortfall <= 0,
		inputValid,
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
 *
 * Invalid numeric authority inputs and hulk state expose zero actuator authority.
 */
export function fundContinuousMothershipSpend(
	state: MothershipEnergyLiftState,
	requestedEnergy: number,
	protectedReserve = 0
): MothershipContinuousSpendFunding {
	const requestedValid = isFiniteNonnegative(requestedEnergy);
	const protectedValid = isFiniteNonnegative(protectedReserve);
	const reserveValid = isFiniteNonnegative(state.reserve);
	const inputValid = requestedValid && protectedValid && reserveValid;
	const requested = requestedValid ? requestedEnergy : 0;
	const reserve = reserveValid ? state.reserve : 0;
	const protectedAmount = protectedValid
		? Math.min(reserve, protectedReserve)
		: reserve;
	const authorityAvailable = inputValid && state.phase !== "hulk";
	const available = authorityAvailable
		? Math.max(0, reserve - protectedAmount)
		: 0;
	const funded = Math.min(requested, available);
	return {
		inputValid,
		authorityAvailable,
		requestedEnergy: requested,
		fundedEnergy: funded,
		unmetEnergy: Math.max(0, requested - funded)
	};
}

export function mothershipFundingFraction(
	funding: MothershipContinuousSpendFunding
): number {
	if (!funding.inputValid || !funding.authorityAvailable) {
		return 0;
	}
	if (funding.requestedEnergy <= 0) {
		return 1;
	}
	return Math.max(0, Math.min(1, funding.fundedEnergy / funding.requestedEnergy));
}
