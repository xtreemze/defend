export interface AudioBatchInput {
  sourceIds: Uint32Array;
  sourcePositions: Float32Array;
  sourceVelocities: Float32Array;
  sourceImportance: Float32Array;
  listenerPosition: readonly [number, number, number];
  listenerVelocity: readonly [number, number, number];
  maxRenderedVoices: number;
  speedOfSound: number;
}

export interface AudioBatchResult {
  sourceIds: Uint32Array;
  distances: Float32Array;
  priorities: Float32Array;
  dopplerRatios: Float32Array;
}

function requireVec3Length(name: string, values: Float32Array, count: number): void {
  if (values.length !== count * 3) {
    throw new Error(`${name} must contain exactly ${count * 3} scalar values`);
  }
}

function finiteOrZero(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

interface RankedSource {
  index: number;
  distance: number;
  priority: number;
  dopplerRatio: number;
}

/**
 * Worker-side source prioritization and motion-control preparation.
 * Audio rendering itself belongs in AudioWorklet; this function only produces
 * lower-rate control data that can be interpolated sample-accurately there.
 */
export function planAudioBatch(input: AudioBatchInput): AudioBatchResult {
  const count = input.sourceIds.length;
  requireVec3Length("sourcePositions", input.sourcePositions, count);
  requireVec3Length("sourceVelocities", input.sourceVelocities, count);
  if (input.sourceImportance.length !== count) {
    throw new Error("sourceImportance must match sourceIds length");
  }

  const listenerX = finiteOrZero(input.listenerPosition[0]);
  const listenerY = finiteOrZero(input.listenerPosition[1]);
  const listenerZ = finiteOrZero(input.listenerPosition[2]);
  const listenerVelocityX = finiteOrZero(input.listenerVelocity[0]);
  const listenerVelocityY = finiteOrZero(input.listenerVelocity[1]);
  const listenerVelocityZ = finiteOrZero(input.listenerVelocity[2]);
  const speedOfSound = Math.max(1, finiteOrZero(input.speedOfSound));
  const maxRenderedVoices = Math.max(
    0,
    Math.min(count, Math.floor(finiteOrZero(input.maxRenderedVoices))),
  );
  const ranked: RankedSource[] = [];

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const relativeX = finiteOrZero(input.sourcePositions[offset]) - listenerX;
    const relativeY = finiteOrZero(input.sourcePositions[offset + 1]) - listenerY;
    const relativeZ = finiteOrZero(input.sourcePositions[offset + 2]) - listenerZ;
    const distance = Math.hypot(relativeX, relativeY, relativeZ);
    const inverseDistance = distance > Number.EPSILON ? 1 / distance : 0;
    const radialX = relativeX * inverseDistance;
    const radialY = relativeY * inverseDistance;
    const radialZ = relativeZ * inverseDistance;

    // The radial basis points from listener to source. Source-positive therefore
    // means moving away, while listener-positive means moving toward the source.
    // The classical moving-source/listener ratio in that convention is
    // (c + listenerTowardSource) / (c + sourceAwayFromListener).
    const sourceRadialVelocity =
      finiteOrZero(input.sourceVelocities[offset]) * radialX +
      finiteOrZero(input.sourceVelocities[offset + 1]) * radialY +
      finiteOrZero(input.sourceVelocities[offset + 2]) * radialZ;
    const listenerRadialVelocity =
      listenerVelocityX * radialX +
      listenerVelocityY * radialY +
      listenerVelocityZ * radialZ;
    const denominator = Math.max(1, speedOfSound + sourceRadialVelocity);
    const dopplerRatio = clamp(
      (speedOfSound + listenerRadialVelocity) / denominator,
      0.5,
      2,
    );
    const importance = Math.max(0, finiteOrZero(input.sourceImportance[index]));
    const distanceAttenuation = 1 / (1 + distance * distance * 0.0025);
    const approachBoost = sourceRadialVelocity < 0 ? 1.2 : 1;
    const priority = importance * distanceAttenuation * approachBoost;

    ranked.push({ index, distance, priority, dopplerRatio });
  }

  ranked.sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }
    return input.sourceIds[left.index] - input.sourceIds[right.index];
  });

  const selected = ranked.slice(0, maxRenderedVoices);
  const sourceIds = new Uint32Array(selected.length);
  const distances = new Float32Array(selected.length);
  const priorities = new Float32Array(selected.length);
  const dopplerRatios = new Float32Array(selected.length);

  for (let index = 0; index < selected.length; index += 1) {
    const source = selected[index];
    sourceIds[index] = input.sourceIds[source.index];
    distances[index] = source.distance;
    priorities[index] = source.priority;
    dopplerRatios[index] = source.dopplerRatio;
  }

  return { sourceIds, distances, priorities, dopplerRatios };
}
