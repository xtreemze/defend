export interface GeothermalPoint {
	x: number;
	y: number;
	z: number;
}

export interface GeothermalSource extends GeothermalPoint {
	id: string;
	active: boolean;
}

export interface GeothermalStream {
	id: string;
	active: boolean;
	points: GeothermalPoint[];
}

export interface GeothermalDrillResult {
	sourceId: string | null;
	distance: number | null;
	connected: boolean;
}

export interface GeothermalStreamDrillResult extends GeothermalDrillResult {
	contactPoint: GeothermalPoint | null;
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

function clamp01(value: number): number {
	return Math.max(0, Math.min(1, finite(value)));
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

export function nearestPointOnGeothermalSegment(
	origin: GeothermalPoint,
	start: GeothermalPoint,
	end: GeothermalPoint
): GeothermalPoint {
	const sx = finite(start.x);
	const sy = finite(start.y);
	const sz = finite(start.z);
	const vx = finite(end.x) - sx;
	const vy = finite(end.y) - sy;
	const vz = finite(end.z) - sz;
	const lengthSquared = vx * vx + vy * vy + vz * vz;
	if (lengthSquared <= 1e-12) {
		return { x: sx, y: sy, z: sz };
	}
	const ox = finite(origin.x) - sx;
	const oy = finite(origin.y) - sy;
	const oz = finite(origin.z) - sz;
	const t = clamp01((ox * vx + oy * vy + oz * vz) / lengthSquared);
	return {
		x: sx + vx * t,
		y: sy + vy * t,
		z: sz + vz * t
	};
}

/**
 * Search downward/outward for the nearest active point source inside the drill
 * budget. This remains useful for simple fixtures and isolated vents.
 */
export function findReachableGeothermalSource(
	origin: GeothermalPoint,
	sources: GeothermalSource[],
	maxReach: number
): GeothermalDrillResult {
	const reach = positive(maxReach);
	let bestId: string | null = null;
	let bestDistance = Infinity;

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

/**
 * Search a polyline magma stream rather than a nominal source center. The drill
 * may connect to the nearest point on any active segment that lies at or below
 * the tower origin and within the finite reach budget.
 */
export function findReachableGeothermalStream(
	origin: GeothermalPoint,
	streams: GeothermalStream[],
	maxReach: number
): GeothermalStreamDrillResult {
	const reach = positive(maxReach);
	let bestId: string | null = null;
	let bestDistance = Infinity;
	let bestPoint: GeothermalPoint | null = null;

	streams.forEach(stream => {
		if (!stream.active || stream.points.length === 0) {
			return;
		}
		if (stream.points.length === 1) {
			const point = stream.points[0];
			if (finite(point.y) <= finite(origin.y)) {
				const distance = geothermalDistance(origin, point);
				if (distance <= reach && distance < bestDistance) {
					bestDistance = distance;
					bestId = stream.id;
					bestPoint = { x: finite(point.x), y: finite(point.y), z: finite(point.z) };
				}
			}
			return;
		}

		for (let index = 0; index < stream.points.length - 1; index += 1) {
			const contact = nearestPointOnGeothermalSegment(
				origin,
				stream.points[index],
				stream.points[index + 1]
			);
			if (finite(contact.y) > finite(origin.y)) {
				continue;
			}
			const distance = geothermalDistance(origin, contact);
			if (distance <= reach && distance < bestDistance) {
				bestDistance = distance;
				bestId = stream.id;
				bestPoint = contact;
			}
		}
	});

	return {
		sourceId: bestId,
		distance: bestId === null ? null : bestDistance,
		connected: bestId !== null,
		contactPoint: bestPoint
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
