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

const HEX_DIRECTIONS: HexCell[] = [
	{ q: 1, r: 0 },
	{ q: 1, r: -1 },
	{ q: 0, r: -1 },
	{ q: -1, r: 0 },
	{ q: -1, r: 1 },
	{ q: 0, r: 1 }
];

function hexToCube(cell: HexCell): HexCube {
	return {
		q: cell.q,
		r: cell.r,
		s: -cell.q - cell.r
	};
}

function cubeToHex(cube: HexCube): HexCell {
	return { q: cube.q, r: cube.r };
}

function hexToWorld(cell: HexCell, size: number): WorldPoint2D {
	return {
		x: size * SQRT_3 * (cell.q + cell.r / 2),
		z: size * 1.5 * cell.r
	};
}

function worldToFractionalHex(point: WorldPoint2D, size: number): HexCell {
	return {
		q: ((SQRT_3 / 3) * point.x - point.z / 3) / size,
		r: ((2 / 3) * point.z) / size
	};
}

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

function worldToHex(point: WorldPoint2D, size: number): HexCell {
	return roundHex(worldToFractionalHex(point, size));
}

function hexNeighbor(cell: HexCell, direction: number): HexCell {
	const normalizedDirection = ((direction % 6) + 6) % 6;
	const delta = HEX_DIRECTIONS[normalizedDirection];
	return {
		q: cell.q + delta.q,
		r: cell.r + delta.r
	};
}

function hexNeighbors(cell: HexCell): HexCell[] {
	return HEX_DIRECTIONS.map(delta => ({
		q: cell.q + delta.q,
		r: cell.r + delta.r
	}));
}

function hexDistance(a: HexCell, b: HexCell): number {
	const ac = hexToCube(a);
	const bc = hexToCube(b);
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
	return hexRing(cell) <= radius;
}

function isHexProtected(cell: HexCell, protectedRadius: number): boolean {
	return hexRing(cell) <= protectedRadius;
}

function hexSector(cell: HexCell, size: number = 1): number {
	if (cell.q === 0 && cell.r === 0) {
		return -1;
	}

	const point = hexToWorld(cell, size);
	let angle = Math.atan2(point.z, point.x);
	if (angle < 0) {
		angle += Math.PI * 2;
	}

	return Math.floor((angle + Math.PI / 6) / (Math.PI / 3)) % 6;
}

function hexKey(cell: HexCell): string {
	return `${cell.q},${cell.r}`;
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
