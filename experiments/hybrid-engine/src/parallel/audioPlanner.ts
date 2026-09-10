import {
  spatialRenderHints,
  type SpatialAudioCalibration,
  type SpatialAudioObjectState,
  type SpatialListenerState,
} from "../../../../src/js/audio/spatialAudio";

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

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, finiteOrZero(value)));
}

interface RankedSource {
  index: number;
  distance: number;
  priority: number;
  dopplerRatio: number;
}

/**
 * Worker-side spatial control preparation using the canonical #61 spatial math.
 * This adapter intentionally keeps the transferable SoA protocol while avoiding
 * a second Doppler/closest-approach/priority implementation in the worker lab.
 */
export function planAudioBatch(input: AudioBatchInput): AudioBatchResult {
  const count = input.sourceIds.length;
  requireVec3Length("sourcePositions", input.sourcePositions, count);
  requireVec3Length("sourceVelocities", input.sourceVelocities, count);
  if (input.sourceImportance.length !== count) {
    throw new Error("sourceImportance must match sourceIds length");
  }

  const listener: SpatialListenerState = {
    position: {
      x: finiteOrZero(input.listenerPosition[0]),
      y: finiteOrZero(input.listenerPosition[1]),
      z: finiteOrZero(input.listenerPosition[2]),
    },
    velocity: {
      x: finiteOrZero(input.listenerVelocity[0]),
      y: finiteOrZero(input.listenerVelocity[1]),
      z: finiteOrZero(input.listenerVelocity[2]),
    },
    forward: { x: 0, y: 0, z: 1 },
    up: { x: 0, y: 1, z: 0 },
  };
  const calibration: SpatialAudioCalibration = {
    speedOfSound: Math.max(1, finiteOrZero(input.speedOfSound)),
    maxRadialFractionOfSoundSpeed: 0.9,
    minDopplerRatio: 0.5,
    maxDopplerRatio: 2,
    referenceDistance: 12,
    rolloffExponent: 1.6,
    airAbsorptionPerUnit: 0.004,
    predictionHorizonSeconds: 1.5,
    energyReference: 0.5,
    proximityWeight: 0.25,
    closestApproachWeight: 0.3,
    energyWeight: 0.1,
    threatWeight: 0.25,
    continuityWeight: 0.1,
  };
  const maxRenderedVoices = Math.max(
    0,
    Math.min(count, Math.floor(finiteOrZero(input.maxRenderedVoices))),
  );
  const ranked: RankedSource[] = [];

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const importance = clamp01(input.sourceImportance[index]);
    const source: SpatialAudioObjectState = {
      id: String(input.sourceIds[index]),
      kind: "hybrid-body",
      acousticProfile: "procedural-body",
      position: {
        x: finiteOrZero(input.sourcePositions[offset]),
        y: finiteOrZero(input.sourcePositions[offset + 1]),
        z: finiteOrZero(input.sourcePositions[offset + 2]),
      },
      velocity: {
        x: finiteOrZero(input.sourceVelocities[offset]),
        y: finiteOrZero(input.sourceVelocities[offset + 1]),
        z: finiteOrZero(input.sourceVelocities[offset + 2]),
      },
      orientation: { x: 0, y: 0, z: 1 },
      directivity: 0,
      radius: 1,
      baseGain: 1,
      excitationEnergy: importance,
      threat: importance,
      continuity: 0.25,
      seed: input.sourceIds[index],
      sustained: true,
    };
    const hints = spatialRenderHints(source, listener, calibration);
    ranked.push({
      index,
      distance: hints.distance,
      priority: hints.priority,
      dopplerRatio: hints.doppler.ratio,
    });
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
