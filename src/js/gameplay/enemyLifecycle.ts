// Pure finite-lifetime calculations extracted from the legacy enemy loop.
// Preserve the current arithmetic exactly so runtime modernization can compare
// behavior without depending on Babylon meshes or render callbacks.

function decayEnemyHitPoints(hitPoints: number, decayRate: number): number {
	return hitPoints - decayRate;
}

function enemyHealthMeterScale(
	hitPoints: number,
	baseHitPoints: number,
	level: number
): number {
	return 1 / ((level * level * baseHitPoints) / hitPoints);
}

export { decayEnemyHitPoints, enemyHealthMeterScale };
