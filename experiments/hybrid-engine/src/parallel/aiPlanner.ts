export interface AiBatchInput {
  agentIds: Uint32Array;
  positions: Float32Array;
  velocities: Float32Array;
  objective: readonly [number, number, number];
  preferredSpeed: number;
  separationRadius: number;
  separationWeight: number;
}

export interface AiBatchResult {
  agentIds: Uint32Array;
  desiredVelocities: Float32Array;
}

function requireVec3Length(name: string, values: Float32Array, count: number): void {
  if (values.length !== count * 3) {
    throw new Error(`${name} must contain exactly ${count * 3} scalar values`);
  }
}

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function normalizeTo(
  x: number,
  y: number,
  z: number,
  magnitude: number,
): readonly [number, number, number] {
  const length = Math.hypot(x, y, z);
  if (length <= Number.EPSILON || magnitude <= 0) {
    return [0, 0, 0];
  }
  const scale = magnitude / length;
  return [x * scale, y * scale, z * scale];
}

/**
 * Experimental worker-side enemy steering primitive.
 *
 * It intentionally owns expensive neighborhood evaluation only. Collision,
 * movement integration, damage, and final command acceptance remain simulation
 * authority. A later AI planner can replace the objective/separation policy
 * without changing the worker protocol or tick-validation boundary.
 */
export function planAiBatch(input: AiBatchInput): AiBatchResult {
  const count = input.agentIds.length;
  requireVec3Length("positions", input.positions, count);
  requireVec3Length("velocities", input.velocities, count);

  const preferredSpeed = finiteNonNegative(input.preferredSpeed);
  const separationRadius = finiteNonNegative(input.separationRadius);
  const separationWeight = finiteNonNegative(input.separationWeight);
  const separationRadiusSquared = separationRadius * separationRadius;
  const objectiveX = finiteOrZero(input.objective[0]);
  const objectiveY = finiteOrZero(input.objective[1]);
  const objectiveZ = finiteOrZero(input.objective[2]);
  const desiredVelocities = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const x = finiteOrZero(input.positions[offset]);
    const y = finiteOrZero(input.positions[offset + 1]);
    const z = finiteOrZero(input.positions[offset + 2]);
    const towardObjective = normalizeTo(
      objectiveX - x,
      objectiveY - y,
      objectiveZ - z,
      preferredSpeed,
    );

    let separationX = 0;
    let separationY = 0;
    let separationZ = 0;
    if (separationRadius > 0 && separationWeight > 0) {
      for (let otherIndex = 0; otherIndex < count; otherIndex += 1) {
        if (otherIndex === index) {
          continue;
        }
        const otherOffset = otherIndex * 3;
        const dx = x - finiteOrZero(input.positions[otherOffset]);
        const dy = y - finiteOrZero(input.positions[otherOffset + 1]);
        const dz = z - finiteOrZero(input.positions[otherOffset + 2]);
        const distanceSquared = dx * dx + dy * dy + dz * dz;
        if (
          distanceSquared <= Number.EPSILON ||
          distanceSquared >= separationRadiusSquared
        ) {
          continue;
        }
        const distance = Math.sqrt(distanceSquared);
        const proximity = 1 - distance / separationRadius;
        const inverseDistance = 1 / distance;
        separationX += dx * inverseDistance * proximity;
        separationY += dy * inverseDistance * proximity;
        separationZ += dz * inverseDistance * proximity;
      }
    }

    const combined = normalizeTo(
      towardObjective[0] + separationX * separationWeight,
      towardObjective[1] + separationY * separationWeight,
      towardObjective[2] + separationZ * separationWeight,
      preferredSpeed,
    );
    desiredVelocities[offset] = combined[0];
    desiredVelocities[offset + 1] = combined[1];
    desiredVelocities[offset + 2] = combined[2];
  }

  return {
    agentIds: input.agentIds.slice(),
    desiredVelocities,
  };
}
