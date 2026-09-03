// Pure tier-scaling rules extracted from the legacy Babylon/Cannon call sites.
// Keep these calculations engine-independent so modernization can certify balance
// without coupling tests to rendering or physics APIs.

function levelSquared(level: number): number {
	return level * level;
}

function levelCubed(level: number): number {
	return level * level * level;
}

function projectileHitPoints(baseHitPoints: number, level: number): number {
	return baseHitPoints * levelCubed(level);
}

function projectileImpulse(baseSpeed: number, level: number): number {
	return baseSpeed * levelCubed(level);
}

function projectileMass(baseMass: number, level: number): number {
	return baseMass * levelSquared(level);
}

function towerShotInterval(baseRateOfFire: number, level: number): number {
	return baseRateOfFire * levelCubed(level);
}

export {
	projectileHitPoints,
	projectileImpulse,
	projectileMass,
	towerShotInterval
};
