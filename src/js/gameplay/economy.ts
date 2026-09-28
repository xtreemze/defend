function projectileEnergyRecovery(
	projectileHitPoints: number,
	energyRecoveryRatio: number
): number {
	return projectileHitPoints * energyRecoveryRatio;
}

function applyProjectileEnergyRecovery(
	currentBalance: number,
	projectileHitPoints: number,
	energyRecoveryRatio: number,
	maxBalance: number
): number {
	const recoveredBalance =
		currentBalance +
		projectileEnergyRecovery(projectileHitPoints, energyRecoveryRatio);

	return recoveredBalance > maxBalance ? maxBalance : recoveredBalance;
}

function enemyBankDamage(enemyHitPoints: number): number {
	return enemyHitPoints / 2;
}

function applyEnemyBankDamage(
	currentBalance: number,
	enemyHitPoints: number
): number {
	return currentBalance - enemyBankDamage(enemyHitPoints);
}

export {
	projectileEnergyRecovery,
	applyProjectileEnergyRecovery,
	enemyBankDamage,
	applyEnemyBankDamage
};
