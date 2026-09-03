export interface FixedStepPolicy {
  fixedDeltaSeconds: number;
  maxCatchUpSteps: number;
  maxFrameDeltaSeconds: number;
}

export interface FixedStepState {
  accumulatorSeconds: number;
  droppedSeconds: number;
}

export interface FixedStepAdvance {
  state: FixedStepState;
  steps: number;
  alpha: number;
}

export const INITIAL_FIXED_STEP_STATE: FixedStepState = {
  accumulatorSeconds: 0,
  droppedSeconds: 0,
};

function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

function nonNegative(value: number): number {
  return Math.max(0, finiteOr(value, 0));
}

function nonNegativeInteger(value: number): number {
  return Math.max(0, Math.floor(finiteOr(value, 0)));
}

/**
 * Convert one render-frame delta into a bounded number of authoritative fixed
 * simulation ticks.
 *
 * The function is deliberately pure. Rendering owns wall-clock accumulation;
 * the Rust runtime owns only exact tick advancement. If the host falls too far
 * behind, excess catch-up time is recorded and dropped instead of creating an
 * unbounded spiral of death.
 */
export function advanceFixedStep(
  previous: FixedStepState,
  frameDeltaSeconds: number,
  policy: FixedStepPolicy,
): FixedStepAdvance {
  const fixedDeltaSeconds = Math.max(
    Number.EPSILON,
    nonNegative(policy.fixedDeltaSeconds),
  );
  const maxCatchUpSteps = nonNegativeInteger(policy.maxCatchUpSteps);
  const maxFrameDeltaSeconds = nonNegative(policy.maxFrameDeltaSeconds);
  const frameDelta = Math.min(
    nonNegative(frameDeltaSeconds),
    maxFrameDeltaSeconds,
  );
  const previousAccumulator = nonNegative(previous.accumulatorSeconds);
  const previousDropped = nonNegative(previous.droppedSeconds);

  if (maxCatchUpSteps === 0) {
    return {
      state: {
        accumulatorSeconds: 0,
        droppedSeconds: previousDropped + previousAccumulator + frameDelta,
      },
      steps: 0,
      alpha: 0,
    };
  }

  const maxAccumulatorSeconds = fixedDeltaSeconds * maxCatchUpSteps;
  const requestedAccumulator = previousAccumulator + frameDelta;
  const droppedThisAdvance = Math.max(
    0,
    requestedAccumulator - maxAccumulatorSeconds,
  );
  const boundedAccumulator = Math.min(
    requestedAccumulator,
    maxAccumulatorSeconds,
  );

  // Add a tiny scale-relative epsilon before flooring to prevent a value that
  // should represent an exact integral tick count from falling one tick short
  // due only to ordinary IEEE-754 accumulation noise.
  const tickEpsilon = fixedDeltaSeconds * 1e-9;
  const steps = Math.min(
    Math.floor((boundedAccumulator + tickEpsilon) / fixedDeltaSeconds),
    maxCatchUpSteps,
  );
  const accumulatorSeconds = Math.max(
    0,
    boundedAccumulator - steps * fixedDeltaSeconds,
  );

  return {
    state: {
      accumulatorSeconds,
      droppedSeconds: previousDropped + droppedThisAdvance,
    },
    steps,
    alpha: Math.min(1, accumulatorSeconds / fixedDeltaSeconds),
  };
}
