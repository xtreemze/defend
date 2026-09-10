export const NO_TARGET_ID = 0xffffffff;

export interface CombatBatchInput {
  turretIds: Uint32Array;
  turretPositions: Float32Array;
  targetIds: Uint32Array;
  targetPositions: Float32Array;
  targetVelocities: Float32Array;
  projectileSpeed: number;
  maxRange: number;
}

export interface CombatBatchResult {
  turretIds: Uint32Array;
  targetIds: Uint32Array;
  aimPoints: Float32Array;
  interceptSeconds: Float32Array;
}

function requireVec3Length(
  name: string,
  values: Float32Array,
  count: number,
): void {
  if (values.length !== count * 3) {
    throw new Error(`${name} must contain exactly ${count * 3} scalar values`);
  }
}

function finitePositive(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function smallestPositiveRoot(a: number, b: number, c: number): number | null {
  const epsilon = 1e-7;
  if (Math.abs(a) <= epsilon) {
    if (Math.abs(b) <= epsilon) {
      return null;
    }
    const root = -c / b;
    return root > 0 && Number.isFinite(root) ? root : null;
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0 || !Number.isFinite(discriminant)) {
    return null;
  }

  const sqrt = Math.sqrt(discriminant);
  const first = (-b - sqrt) / (2 * a);
  const second = (-b + sqrt) / (2 * a);
  let best = Number.POSITIVE_INFINITY;
  if (first > 0 && Number.isFinite(first)) {
    best = first;
  }
  if (second > 0 && Number.isFinite(second)) {
    best = Math.min(best, second);
  }
  return Number.isFinite(best) ? best : null;
}

function interceptTime(
  relativeX: number,
  relativeY: number,
  relativeZ: number,
  velocityX: number,
  velocityY: number,
  velocityZ: number,
  projectileSpeed: number,
): number | null {
  const speedSquared = projectileSpeed * projectileSpeed;
  const velocitySquared =
    velocityX * velocityX + velocityY * velocityY + velocityZ * velocityZ;
  const a = velocitySquared - speedSquared;
  const b =
    2 * (relativeX * velocityX + relativeY * velocityY + relativeZ * velocityZ);
  const c = relativeX * relativeX + relativeY * relativeY + relativeZ * relativeZ;
  return smallestPositiveRoot(a, b, c);
}

/**
 * Resolve one data-oriented batch of turret target selection and lead solutions.
 * The result remains advisory: the simulation must validate source tick, target
 * lifecycle, line of sight, and firing gates before mutating authoritative state.
 */
export function solveCombatBatch(input: CombatBatchInput): CombatBatchResult {
  const turretCount = input.turretIds.length;
  const targetCount = input.targetIds.length;
  requireVec3Length("turretPositions", input.turretPositions, turretCount);
  requireVec3Length("targetPositions", input.targetPositions, targetCount);
  requireVec3Length("targetVelocities", input.targetVelocities, targetCount);

  const projectileSpeed = finitePositive(input.projectileSpeed);
  const maxRange = finitePositive(input.maxRange);
  const maxRangeSquared = maxRange * maxRange;
  const resultTargetIds = new Uint32Array(turretCount);
  resultTargetIds.fill(NO_TARGET_ID);
  const aimPoints = new Float32Array(turretCount * 3);
  const interceptSeconds = new Float32Array(turretCount);
  interceptSeconds.fill(-1);

  if (projectileSpeed === 0 || maxRange === 0) {
    return {
      turretIds: input.turretIds.slice(),
      targetIds: resultTargetIds,
      aimPoints,
      interceptSeconds,
    };
  }

  for (let turretIndex = 0; turretIndex < turretCount; turretIndex += 1) {
    const turretOffset = turretIndex * 3;
    const turretX = input.turretPositions[turretOffset];
    const turretY = input.turretPositions[turretOffset + 1];
    const turretZ = input.turretPositions[turretOffset + 2];
    let bestTime = Number.POSITIVE_INFINITY;
    let bestTargetIndex = -1;

    for (let targetIndex = 0; targetIndex < targetCount; targetIndex += 1) {
      const targetOffset = targetIndex * 3;
      const relativeX = input.targetPositions[targetOffset] - turretX;
      const relativeY = input.targetPositions[targetOffset + 1] - turretY;
      const relativeZ = input.targetPositions[targetOffset + 2] - turretZ;
      const distanceSquared =
        relativeX * relativeX + relativeY * relativeY + relativeZ * relativeZ;
      if (distanceSquared > maxRangeSquared) {
        continue;
      }

      const time = interceptTime(
        relativeX,
        relativeY,
        relativeZ,
        input.targetVelocities[targetOffset],
        input.targetVelocities[targetOffset + 1],
        input.targetVelocities[targetOffset + 2],
        projectileSpeed,
      );
      if (time !== null && time < bestTime) {
        bestTime = time;
        bestTargetIndex = targetIndex;
      }
    }

    if (bestTargetIndex < 0) {
      continue;
    }

    const targetOffset = bestTargetIndex * 3;
    resultTargetIds[turretIndex] = input.targetIds[bestTargetIndex];
    interceptSeconds[turretIndex] = bestTime;
    aimPoints[turretOffset] =
      input.targetPositions[targetOffset] +
      input.targetVelocities[targetOffset] * bestTime;
    aimPoints[turretOffset + 1] =
      input.targetPositions[targetOffset + 1] +
      input.targetVelocities[targetOffset + 1] * bestTime;
    aimPoints[turretOffset + 2] =
      input.targetPositions[targetOffset + 2] +
      input.targetVelocities[targetOffset + 2] * bestTime;
  }

  return {
    turretIds: input.turretIds.slice(),
    targetIds: resultTargetIds,
    aimPoints,
    interceptSeconds,
  };
}
