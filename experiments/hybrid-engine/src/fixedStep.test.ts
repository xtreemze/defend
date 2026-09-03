import { describe, expect, it } from "vitest";
import {
  INITIAL_FIXED_STEP_STATE,
  advanceFixedStep,
  type FixedStepPolicy,
  type FixedStepState,
} from "./fixedStep";

const policy: FixedStepPolicy = {
  fixedDeltaSeconds: 1 / 120,
  maxCatchUpSteps: 8,
  maxFrameDeltaSeconds: 0.25,
};

function simulateFrames(frameCount: number, frameDeltaSeconds: number): {
  ticks: number;
  state: FixedStepState;
} {
  let state = INITIAL_FIXED_STEP_STATE;
  let ticks = 0;

  for (let frame = 0; frame < frameCount; frame += 1) {
    const advance = advanceFixedStep(state, frameDeltaSeconds, policy);
    state = advance.state;
    ticks += advance.steps;
  }

  return { ticks, state };
}

describe("advanceFixedStep", () => {
  it("produces the same tick count at 60 Hz and 120 Hz render cadence", () => {
    const sixtyHz = simulateFrames(60, 1 / 60);
    const oneTwentyHz = simulateFrames(120, 1 / 120);

    expect(sixtyHz.ticks).toBe(120);
    expect(oneTwentyHz.ticks).toBe(120);
    expect(sixtyHz.state.droppedSeconds).toBe(0);
    expect(oneTwentyHz.state.droppedSeconds).toBe(0);
  });

  it("accumulates fractional render frames without changing simulation time", () => {
    const first = advanceFixedStep(INITIAL_FIXED_STEP_STATE, 1 / 240, policy);
    expect(first.steps).toBe(0);
    expect(first.alpha).toBeCloseTo(0.5, 8);

    const second = advanceFixedStep(first.state, 1 / 240, policy);
    expect(second.steps).toBe(1);
    expect(second.alpha).toBeCloseTo(0, 8);
  });

  it("bounds catch-up and reports discarded backlog after a long frame", () => {
    const advance = advanceFixedStep(INITIAL_FIXED_STEP_STATE, 1, policy);

    expect(advance.steps).toBe(policy.maxCatchUpSteps);
    expect(advance.state.accumulatorSeconds).toBeCloseTo(0, 8);
    expect(advance.state.droppedSeconds).toBeCloseTo(
      policy.maxFrameDeltaSeconds -
        policy.fixedDeltaSeconds * policy.maxCatchUpSteps,
      8,
    );
  });

  it("treats a zero catch-up budget as deliberate full virtualization of time", () => {
    const advance = advanceFixedStep(
      { accumulatorSeconds: 0.01, droppedSeconds: 0.02 },
      0.03,
      { ...policy, maxCatchUpSteps: 0 },
    );

    expect(advance.steps).toBe(0);
    expect(advance.alpha).toBe(0);
    expect(advance.state.accumulatorSeconds).toBe(0);
    expect(advance.state.droppedSeconds).toBeCloseTo(0.06, 8);
  });

  it("sanitizes non-finite timing inputs", () => {
    const advance = advanceFixedStep(
      { accumulatorSeconds: Number.NaN, droppedSeconds: Number.POSITIVE_INFINITY },
      Number.NaN,
      {
        fixedDeltaSeconds: Number.NaN,
        maxCatchUpSteps: Number.NaN,
        maxFrameDeltaSeconds: Number.NaN,
      },
    );

    expect(advance.steps).toBe(0);
    expect(advance.alpha).toBe(0);
    expect(advance.state.accumulatorSeconds).toBe(0);
    expect(advance.state.droppedSeconds).toBe(0);
  });
});
