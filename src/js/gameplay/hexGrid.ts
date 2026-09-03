interface HexCell {
	q: number;
	r: number;
}

interface HexCube {
	q: number;
	r: number;
	s: number;
}

interface WorldPoint2D {
	x: number;
	z: number;
}

const SQRT_3 = Math.sqrt(3);
const MIN_HEX_SIZE = 0.000001;
const MAX_HEX_SCALAR = 1e100;

function finiteScalar(value: number, fallback = 0): number {
	if (value !== value) {
		return fallback;
	}
	if (value > MAX_HEX_SCALAR) {
		return MAX_HEX_SCALAR;
	}
	if (value < -MAX_HEX_SCALAR) {
		return -MAX_HEX_SCALAR;
	}
	return value;
}

function positive(value: number): number {
	return Math.max(0, finiteScalar(value));
}

function hexSize(size: number): number {
	return Math.max(MIN_HEX_SIZE, Math.abs(finiteScalar(size, 1)));
}

function normalizedDirection(direction: number): number {
	const integerDirection = Math.floor(finiteScalar(direction));
	return ((integerDirection % 6) + 6) % 6;
}

const HEX_DIRECTIONS: ReadonlyArray<Readonly<HexCell>> = Object.freeze([
	Object.freeze({ q: 1, r: 0 }),
	Object.freeze({ q: 1, r: -1 }),
	Object.freeze({ q: 0, r: -1 }),
	Object.freeze({ q: -1, r: 0 }),
	Object.freeze({ q: -1, r: 1 }),
	Object.freeze({ q: 0, r: 1 })
]);

function hexToCube(cell: HexCell): HexCube {
	const q = finiteScalar(cell.q);
	const r = finiteScalar(cell.r);
	return {
		q,
		r,
		s: finiteScalar(-q - r)
	};
}

function cubeToHex(cube: HexCube): HexCell {
	return { q: finiteScalar(cube.q), r: finiteScalar(cube.r) };
}

function hexToWorld(cell: HexCell, size: number): WorldPoint2D {
	const safeSize = hexSize(size);
	const q = finiteScalar(cell.q);
	const r = finiteScalar(cell.r);
	return {
		x: finiteScalar(safeSize * SQRT_3 * (q + r / 2)),
		z: finiteScalar(safeSize * 1.5 * r)
	};
}

function worldToFractionalHex(point: WorldPoint2D, size: number): HexCell {
	const safeSize = hexSize(size);
	const x = finiteScalar(point.x);
	const z = finiteScalar(point.z);
	return {
		q: finiteScalar(((SQRT_3 / 3) * x - z / 3) / safeSize),
		r: finiteScalar(((2 / 3) * z) / safeSize)
	};
}

/**
 * Cube rounding with an explicit tie convention. When two axes have the same
 * rounding error, correction prefers the later axis in q → r → s order
 * (`s`, then `r`, then `q`). This preserves the original draft's boundary
 * behavior and gives the Rust mirror a precise rule for exact edge/vertex hits.
 */
function roundHex(cell: HexCell): HexCell {
	const cube = hexToCube(cell);
	let q = Math.round(cube.q);
	let r = Math.round(cube.r);
	let s = Math.round(cube.s);

	const qDiff = Math.abs(q - cube.q);
	const rDiff = Math.abs(r - cube.r);
	const sDiff = Math.abs(s - cube.s);

	if (qDiff > rDiff && qDiff > sDiff) {
		q = -r - s;
	} else if (rDiff > sDiff) {
		r = -q - s;
	} else {
		s = -q - r;
	}

	return cubeToHex({ q, r, s });
}

function canonicalHex(cell: HexCell): HexCell {
	return roundHex(cell);
}

function worldToHex(point: WorldPoint2D, size: number): HexCell {
	return roundHex(worldToFractionalHex(point, size));
}

function hexNeighbor(cell: HexCell, direction: number): HexCell {
	const origin = canonicalHex(cell);
	const delta = HEX_DIRECTIONS[normalizedDirection(direction)];
	return {
		q: origin.q + delta.q,
		r: origin.r + delta.r
	};
}

function hexNeighbors(cell: HexCell): HexCell[] {
	const origin = canonicalHex(cell);
	return HEX_DIRECTIONS.map(delta => ({
		q: origin.q + delta.q,
		r: origin.r + delta.r
	}));
}

function hexDistance(a: HexCell, b: HexCell): number {
	const ac = hexToCube(canonicalHex(a));
	const bc = hexToCube(canonicalHex(b));
	return Math.max(
		Math.abs(ac.q - bc.q),
		Math.abs(ac.r - bc.r),
		Math.abs(ac.s - bc.s)
	);
}

function hexRing(cell: HexCell): number {
	return hexDistance({ q: 0, r: 0 }, cell);
}

function isHexWithinRadius(cell: HexCell, radius: number): boolean {
	return hexRing(cell) <= Math.floor(positive(radius));
}

function isHexProtected(cell: HexCell, protectedRadius: number): boolean {
	return hexRing(cell) <= Math.floor(positive(protectedRadius));
}

/**
 * Classify a logical cell into one of six world-relative sectors without atan2.
 *
 * For pointy-top axial coordinates, the dot products against the six 60-degree
 * world directions reduce to these common-factor linear scores:
 *
 *   0:  2q + r      3: -2q - r
 *   1:   q + 2r     4:  -q - 2r
 *   2:  -q + r      5:   q - r
 *
 * The highest score is the nearest sector axis. Exact boundary ties choose the
 * lowest sector id, making classification deterministic without floating-point
 * angle behavior and straightforward to mirror in Rust/WASM.
 *
 * `size` is retained for API compatibility with the first draft. Positive scale
 * cannot affect sector identity; it is normalized only so invalid size input is
 * not silently accepted as a meaningful topology parameter.
 */
function hexSector(cell: HexCell, size: number = 1): number {
	hexSize(size);
	const canonical = canonicalHex(cell);
	if (canonical.q === 0 && canonical.r === 0) {
		return -1;
	}

	const q = canonical.q;
	const r = canonical.r;
	const scores = [
		2 * q + r,
		q + 2 * r,
		-q + r,
		-2 * q - r,
		-q - 2 * r,
		q - r
	];
	let sector = 0;
	let bestScore = scores[0];

	for (let index = 1; index < scores.length; index += 1) {
		if (scores[index] > bestScore) {
			bestScore = scores[index];
			sector = index;
		}
	}

	return sector;
}

function hexKey(cell: HexCell): string {
	const canonical = canonicalHex(cell);
	return `${canonical.q},${canonical.r}`;
}

export {
	HexCell,
	HexCube,
	WorldPoint2D,
	HEX_DIRECTIONS,
	hexToCube,
	cubeToHex,
	hexToWorld,
	worldToFractionalHex,
	roundHex,
	worldToHex,
	hexNeighbor,
	hexNeighbors,
	hexDistance,
	hexRing,
	isHexWithinRadius,
	isHexProtected,
	hexSector,
	hexKey
};
