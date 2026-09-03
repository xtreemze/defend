export type RaiderTier = 1 | 2 | 3;

export interface RaidSectorTarget {
	x: number;
	z: number;
}

export interface RaidSetPlan {
	r1: number;
	r2: number;
	r3: number;
	sector: RaidSectorTarget | null;
}

export interface RaidCommitmentWeights {
	r1: number;
	r2: number;
	r3: number;
}

const RAID_HORIZON = 3;
const MAX_COUNT_FOR_SUMMARY = 2147483647;

function finite(value: number, fallback = 0): number {
	if (value !== value || value === Infinity || value === -Infinity) {
		return fallback;
	}
	return value;
}

function nonNegativeInteger(value: number, maximum: number): number {
	const limit = Math.max(0, Math.floor(finite(maximum)));
	return Math.max(0, Math.min(limit, Math.floor(finite(value))));
}

function copySector(sector: RaidSectorTarget | null): RaidSectorTarget | null {
	if (sector === null) {
		return null;
	}
	return { x: finite(sector.x), z: finite(sector.z) };
}

export function emptyRaidSet(): RaidSetPlan {
	return { r1: 0, r2: 0, r3: 0, sector: null };
}

export function normalizeRaidSet(
	plan: RaidSetPlan,
	maximumPerTier: number
): RaidSetPlan {
	return {
		r1: nonNegativeInteger(plan.r1, maximumPerTier),
		r2: nonNegativeInteger(plan.r2, maximumPerTier),
		r3: nonNegativeInteger(plan.r3, maximumPerTier),
		sector: copySector(plan.sector)
	};
}

/**
 * Always return exactly three upcoming raid sets. Missing entries become HOLD;
 * extra entries are intentionally discarded so callers cannot silently grow
 * an unbounded plan horizon.
 */
export function createRaidPlan(
	initial: RaidSetPlan[],
	maximumPerTier: number
): RaidSetPlan[] {
	const result: RaidSetPlan[] = [];
	for (let index = 0; index < RAID_HORIZON; index += 1) {
		const plan = initial[index];
		result.push(
			plan === undefined ? emptyRaidSet() : normalizeRaidSet(plan, maximumPerTier)
		);
	}
	return result;
}

function tierKey(tier: RaiderTier): "r1" | "r2" | "r3" {
	return tier === 1 ? "r1" : tier === 2 ? "r2" : "r3";
}

export function setRaidTierCount(
	queue: RaidSetPlan[],
	index: number,
	tier: RaiderTier,
	count: number,
	maximumPerTier: number
): RaidSetPlan[] {
	const next = createRaidPlan(queue, maximumPerTier);
	if (index < 0 || index >= RAID_HORIZON) {
		return next;
	}
	const key = tierKey(tier);
	next[index] = {
		r1: next[index].r1,
		r2: next[index].r2,
		r3: next[index].r3,
		sector: copySector(next[index].sector)
	};
	next[index][key] = nonNegativeInteger(count, maximumPerTier);
	return next;
}

export function adjustRaidTierCount(
	queue: RaidSetPlan[],
	index: number,
	tier: RaiderTier,
	delta: number,
	maximumPerTier: number
): RaidSetPlan[] {
	const normalized = createRaidPlan(queue, maximumPerTier);
	if (index < 0 || index >= RAID_HORIZON) {
		return normalized;
	}
	const key = tierKey(tier);
	return setRaidTierCount(
		normalized,
		index,
		tier,
		normalized[index][key] + finite(delta),
		maximumPerTier
	);
}

export function holdRaidSet(
	queue: RaidSetPlan[],
	index: number,
	maximumPerTier: number
): RaidSetPlan[] {
	const next = createRaidPlan(queue, maximumPerTier);
	if (index < 0 || index >= RAID_HORIZON) {
		return next;
	}
	next[index] = {
		r1: 0,
		r2: 0,
		r3: 0,
		sector: copySector(next[index].sector)
	};
	return next;
}

export function assignRaidSector(
	queue: RaidSetPlan[],
	index: number,
	sector: RaidSectorTarget | null,
	maximumPerTier: number
): RaidSetPlan[] {
	const next = createRaidPlan(queue, maximumPerTier);
	if (index < 0 || index >= RAID_HORIZON) {
		return next;
	}
	next[index] = {
		r1: next[index].r1,
		r2: next[index].r2,
		r3: next[index].r3,
		sector: copySector(sector)
	};
	return next;
}

export function advanceRaidPlan(
	queue: RaidSetPlan[],
	maximumPerTier: number
): RaidSetPlan[] {
	const normalized = createRaidPlan(queue, maximumPerTier);
	return [normalized[1], normalized[2], emptyRaidSet()].map(plan =>
		normalizeRaidSet(plan, maximumPerTier)
	);
}

export function raidSetIsHold(plan: RaidSetPlan): boolean {
	return plan.r1 <= 0 && plan.r2 <= 0 && plan.r3 <= 0;
}

export function raidSetBodyCount(plan: RaidSetPlan): number {
	return (
		nonNegativeInteger(plan.r1, MAX_COUNT_FOR_SUMMARY) +
		nonNegativeInteger(plan.r2, MAX_COUNT_FOR_SUMMARY) +
		nonNegativeInteger(plan.r3, MAX_COUNT_FOR_SUMMARY)
	);
}

/**
 * Commitment is deliberately caller-weighted. The gameplay contract owns queue
 * semantics, not final launch costs or the temporary 1/4/9 lab visualization.
 */
export function raidSetCommitment(
	plan: RaidSetPlan,
	weights: RaidCommitmentWeights
): number {
	return (
		Math.max(0, finite(plan.r1)) * Math.max(0, finite(weights.r1)) +
		Math.max(0, finite(plan.r2)) * Math.max(0, finite(weights.r2)) +
		Math.max(0, finite(plan.r3)) * Math.max(0, finite(weights.r3))
	);
}

/**
 * A set may snapshot a sector in advance or defer until launch. Returning a
 * copy prevents later UI/navigation mutation from changing the resolved target.
 */
export function resolveRaidSector(
	plan: RaidSetPlan,
	currentSector: RaidSectorTarget
): RaidSectorTarget {
	const chosen = plan.sector === null ? currentSector : plan.sector;
	return { x: finite(chosen.x), z: finite(chosen.z) };
}
