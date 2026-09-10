import { describe, expect, it } from "vitest";
import { planAiBatch } from "./aiPlanner";
import { planAudioBatch } from "./audioPlanner";
import { NO_TARGET_ID, solveCombatBatch } from "./combatPlanner";
import {
  intervalForDistanceTier,
  resultIsFresh,
  shouldScheduleTick,
  tickDelta,
} from "./workerProtocol";

describe("parallel worker protocol", () => {
  it("supports multi-rate scheduling and stale-result rejection", () => {
    expect(intervalForDistanceTier("near")).toBe(2);
    expect(intervalForDistanceTier("standard")).toBe(6);
    expect(intervalForDistanceTier("far")).toBe(24);
    expect(shouldScheduleTick(11, 10, 2)).toBe(false);
    expect(shouldScheduleTick(12, 10, 2)).toBe(true);
    expect(resultIsFresh(100, 102, 2)).toBe(true);
    expect(resultIsFresh(100, 103, 2)).toBe(false);
    expect(tickDelta(1, 0xffffffff)).toBe(2);
  });
});

describe("combat planner", () => {
  it("selects an interceptable target and predicts its lead point", () => {
    const result = solveCombatBatch({
      turretIds: new Uint32Array([7]),
      turretPositions: new Float32Array([0, 0, 0]),
      targetIds: new Uint32Array([11, 12]),
      targetPositions: new Float32Array([10, 0, 0, 30, 0, 0]),
      targetVelocities: new Float32Array([0, 0, 0, 0, 0, 0]),
      projectileSpeed: 20,
      maxRange: 100,
    });

    expect(result.targetIds[0]).toBe(11);
    expect(result.interceptSeconds[0]).toBeCloseTo(0.5, 5);
    expect(result.aimPoints[0]).toBeCloseTo(10, 5);
  });

  it("fails closed when no target is in range", () => {
    const result = solveCombatBatch({
      turretIds: new Uint32Array([1]),
      turretPositions: new Float32Array([0, 0, 0]),
      targetIds: new Uint32Array([2]),
      targetPositions: new Float32Array([100, 0, 0]),
      targetVelocities: new Float32Array([0, 0, 0]),
      projectileSpeed: 20,
      maxRange: 10,
    });

    expect(result.targetIds[0]).toBe(NO_TARGET_ID);
    expect(result.interceptSeconds[0]).toBe(-1);
  });
});

describe("AI planner", () => {
  it("produces bounded desired velocities toward the objective", () => {
    const result = planAiBatch({
      agentIds: new Uint32Array([1, 2]),
      positions: new Float32Array([10, 0, 0, 10, 0, 1]),
      velocities: new Float32Array(6),
      objective: [0, 0, 0],
      preferredSpeed: 4,
      separationRadius: 3,
      separationWeight: 1,
    });

    expect(result.agentIds).toEqual(new Uint32Array([1, 2]));
    expect(Math.hypot(...result.desiredVelocities.slice(0, 3))).toBeCloseTo(4, 5);
    expect(Math.hypot(...result.desiredVelocities.slice(3, 6))).toBeCloseTo(4, 5);
    expect(result.desiredVelocities[0]).toBeLessThan(0);
    expect(result.desiredVelocities[3]).toBeLessThan(0);
  });
});

describe("audio planner", () => {
  it("uses canonical spatial priority to virtualize low-value distant voices", () => {
    const result = planAudioBatch({
      sourceIds: new Uint32Array([1, 2, 3]),
      sourcePositions: new Float32Array([2, 0, 0, 40, 0, 0, 100, 0, 0]),
      sourceVelocities: new Float32Array([-20, 0, 0, 0, 0, 0, 5, 0, 0]),
      sourceImportance: new Float32Array([1, 1, 0]),
      listenerPosition: [0, 0, 0],
      listenerVelocity: [0, 0, 0],
      maxRenderedVoices: 2,
      speedOfSound: 343,
    });

    expect(Array.from(result.sourceIds)).toEqual([1, 2]);
    expect(result.dopplerRatios[0]).toBeGreaterThan(1);
    expect(result.dopplerRatios[0]).toBeLessThanOrEqual(2);
    expect(result.distances[0]).toBeCloseTo(2, 5);
  });

  it("pitches a receding source downward and a listener moving toward it upward", () => {
    const receding = planAudioBatch({
      sourceIds: new Uint32Array([9]),
      sourcePositions: new Float32Array([10, 0, 0]),
      sourceVelocities: new Float32Array([20, 0, 0]),
      sourceImportance: new Float32Array([1]),
      listenerPosition: [0, 0, 0],
      listenerVelocity: [0, 0, 0],
      maxRenderedVoices: 1,
      speedOfSound: 343,
    });
    const listenerApproach = planAudioBatch({
      sourceIds: new Uint32Array([9]),
      sourcePositions: new Float32Array([10, 0, 0]),
      sourceVelocities: new Float32Array([0, 0, 0]),
      sourceImportance: new Float32Array([1]),
      listenerPosition: [0, 0, 0],
      listenerVelocity: [20, 0, 0],
      maxRenderedVoices: 1,
      speedOfSound: 343,
    });

    expect(receding.dopplerRatios[0]).toBeLessThan(1);
    expect(listenerApproach.dopplerRatios[0]).toBeGreaterThan(1);
  });
});
