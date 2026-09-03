export interface GeothermalPoint {
	x: number;
	y: number;
	z: number;
}

export interface GeothermalSource extends GeothermalPoint {
	id: string;
	active: boolean;
}

export interface GeothermalDrillResult {
	sourceId: string | null;
	distance: number | null;
	connected: boolean;
}

function finite(value: number, fallback = 0): number {
	return Number.isFinite(value) ? value : fallback;
}

function positive(value: number): number {
	return Math.max(0, finite(value));
}

export function geothermalDistance(
	origin: GeothermalPoint,
	source: GeothermalPoint
): number {
	const dx = finite(source.x) - finite(origin.x);
	const dy = finite(source.y) - finite(origin.y);
	const dz = finite(source.z) - finite(origin.z);
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Search downward/outward for the nearest active source inside the drill budget.
 * Sources above the tower's drilling origin are intentionally ignored.
 */
export function findReachableGeothermalSource(
	origin: GeothermalPoint,
	sources: GeothermalSource[],
	maxReach: number
): GeothermalDrillResult {
	const reach = positive(maxReach);
	let bestId: string | null = null;
	let bestDistance = Number.POSITIVE_INFINITY;

	sources.forEach(source => {
		if (!source.active || finite(source.y) > finite(origin.y)) {
			return;
		}
		const distance = geothermalDistance(origin, source);
		if (distance <= reach && distance < bestDistance) {
			bestDistance = distance;
			bestId = source.id;
		}
	});

	return {
		sourceId: bestId,
		distance: bestId === null ? null : bestDistance,
		connected: bestId !== null
	};
}

export function geothermalSourceStillReachable(
	origin: GeothermalPoint,
	source: GeothermalSource,
	maxReach: number
): boolean {
	return (
		source.active &&
		finite(source.y) <= finite(origin.y) &&
		geothermalDistance(origin, source) <= positive(maxReach)
	);
}
