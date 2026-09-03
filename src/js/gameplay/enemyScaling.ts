// Pure enemy tier-scaling rules extracted from the legacy Babylon/Cannon call sites.
// These intentionally preserve the current arithmetic, including restitution values
// that can become negative, so physics migration can compare behavior explicitly.

function levelSquared(level: number): number {
	return level * level;
}

function enemyDiameter(level: number): number {
	return levelSquared(level) + 5;
}

function enemyHitPoints(baseHitPoints: number, level: number): number {
	return levelSquared(level) * baseHitPoints + level * 440;
}

function enemyMass(baseMass: number, level: number): number {
	return baseMass * levelSquared(level);
}

function enemyMoveImpulse(baseSpeed: number, level: number): number {
	return baseSpeed * levelSquared(level);
}

function enemyRestitution(baseRestitution: number, level: number): number {
	return baseRestitution - levelSquared(level) / 10;
}

export {
	enemyDiameter,
	enemyHitPoints,
	enemyMass,
	enemyMoveImpulse,
	enemyRestitution
};
