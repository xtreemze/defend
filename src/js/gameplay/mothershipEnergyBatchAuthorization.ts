import type { MothershipEnergyLiftState } from "./mothershipEnergyLift";

export type MothershipEnergyDemandKind = "discrete" | "continuous";

export interface MothershipEnergyDemand {
	kind: MothershipEnergyDemandKind;
	requestedEnergy: number;
}

export interface MothershipEnergyDemandAllocation {
	index: number;
	kind: MothershipEnergyDemandKind;
	requestedEnergy: number;
	authorized: boolean;
	fundedEnergy: number;
	unmetEnergy: number;
	fundingFraction: number;
}

export interface MothershipEnergyBatchAuthorization {
	inputValid: boolean;
	authorityAvailable: boolean;
	reserveSnapshot: number;
	protectedReserve: number;
	spendableEnergy: number;
	allocatedEnergy: number;
	remainingSpendableEnergy: number;
	allocations: MothershipEnergyDemandAllocation[];
}

function isFiniteNonnegative(value: number): boolean {
	return (
		value === value &&
		value !== Infinity &&
		value !== -Infinity &&
		value >= 0
	);
}

function zeroAllocation(
	index: number,
	demand: MothershipEnergyDemand
): MothershipEnergyDemandAllocation {
	return {
		index,
		kind: demand.kind,
		requestedEnergy: isFiniteNonnegative(demand.requestedEnergy)
			? demand.requestedEnergy
			: 0,
		authorized: false,
		fundedEnergy: 0,
		unmetEnergy: isFiniteNonnegative(demand.requestedEnergy)
			? demand.requestedEnergy
			: 0,
		fundingFraction: 0
	};
}

/**
 * Authorize all same-step mothership energy demands against one reserve snapshot.
 *
 * Array order is deliberate caller-owned priority. For example, a caller may
 * place hover/propulsion before launch, or launch before optional maneuvering,
 * but that ordering must be explicit rather than emerging from whichever system
 * happened to call an independent authorization helper first.
 *
 * Discrete demands are all-or-nothing. Continuous demands may receive partial
 * funding. The batch never mutates reserve. After authorization, the caller must:
 *
 * 1. apply only authorized discrete physical actions;
 * 2. scale continuous authority by each returned `fundingFraction`;
 * 3. submit exactly `allocatedEnergy` once to the authoritative energy/lift step.
 *
 * If a physical action cannot actually be applied, discard the batch result and
 * recompute rather than partially committing stale reservations.
 */
export function authorizeMothershipEnergyBatch(
	state: MothershipEnergyLiftState,
	demands: MothershipEnergyDemand[],
	protectedReserve = 0
): MothershipEnergyBatchAuthorization {
	const reserveValid = isFiniteNonnegative(state.reserve);
	const protectedValid = isFiniteNonnegative(protectedReserve);
	let demandsValid = true;
	for (let index = 0; index < demands.length; index += 1) {
		if (!isFiniteNonnegative(demands[index].requestedEnergy)) {
			demandsValid = false;
			break;
		}
	}
	const inputValid = reserveValid && protectedValid && demandsValid;
	const reserveSnapshot = reserveValid ? state.reserve : 0;
	const protectedAmount = protectedValid
		? Math.min(reserveSnapshot, protectedReserve)
		: reserveSnapshot;
	const authorityAvailable = inputValid && state.phase !== "hulk";
	const spendableEnergy = authorityAvailable
		? Math.max(0, reserveSnapshot - protectedAmount)
		: 0;

	if (!authorityAvailable) {
		return {
			inputValid,
			authorityAvailable,
			reserveSnapshot,
			protectedReserve: protectedAmount,
			spendableEnergy,
			allocatedEnergy: 0,
			remainingSpendableEnergy: spendableEnergy,
			allocations: demands.map((demand, index) => zeroAllocation(index, demand))
		};
	}

	let remaining = spendableEnergy;
	const allocations: MothershipEnergyDemandAllocation[] = [];
	for (let index = 0; index < demands.length; index += 1) {
		const demand = demands[index];
		const requested = demand.requestedEnergy;
		if (demand.kind === "discrete") {
			const authorized = requested <= remaining;
			const funded = authorized ? requested : 0;
			allocations.push({
				index,
				kind: demand.kind,
				requestedEnergy: requested,
				authorized,
				fundedEnergy: funded,
				unmetEnergy: authorized ? 0 : requested,
				fundingFraction: authorized ? 1 : 0
			});
			remaining -= funded;
			continue;
		}

		const funded = Math.min(requested, remaining);
		allocations.push({
			index,
			kind: demand.kind,
			requestedEnergy: requested,
			authorized: true,
			fundedEnergy: funded,
			unmetEnergy: Math.max(0, requested - funded),
			fundingFraction:
				requested <= 0 ? 1 : Math.max(0, Math.min(1, funded / requested))
		});
		remaining -= funded;
	}

	const allocatedEnergy = spendableEnergy - remaining;
	return {
		inputValid,
		authorityAvailable,
		reserveSnapshot,
		protectedReserve: protectedAmount,
		spendableEnergy,
		allocatedEnergy,
		remainingSpendableEnergy: remaining,
		allocations
	};
}
