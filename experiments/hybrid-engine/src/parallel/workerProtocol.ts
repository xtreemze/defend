export type WorkerLane = "combat" | "ai" | "audio";

export type UpdateDistanceTier = "near" | "standard" | "far";

export interface MultiRateTickPolicy {
  nearIntervalTicks: number;
  standardIntervalTicks: number;
  farIntervalTicks: number;
}

export interface TickStampedRequest<TPayload> {
  lane: WorkerLane;
  jobId: number;
  sourceTick: number;
  payload: TPayload;
}

export interface TickStampedResponse<TResult> {
  lane: WorkerLane;
  jobId: number;
  sourceTick: number;
  result: TResult;
}

export const DEFAULT_MULTI_RATE_TICK_POLICY: MultiRateTickPolicy = {
  nearIntervalTicks: 2,
  standardIntervalTicks: 6,
  farIntervalTicks: 24,
};

function nonNegativeInteger(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

/** Unsigned tick distance, including the ordinary u32 wrap-around case. */
export function tickDelta(currentTick: number, earlierTick: number): number {
  return (
    (nonNegativeInteger(currentTick) - nonNegativeInteger(earlierTick)) >>> 0
  );
}

export function intervalForDistanceTier(
  tier: UpdateDistanceTier,
  policy: MultiRateTickPolicy = DEFAULT_MULTI_RATE_TICK_POLICY,
): number {
  switch (tier) {
    case "near":
      return Math.max(1, nonNegativeInteger(policy.nearIntervalTicks));
    case "standard":
      return Math.max(1, nonNegativeInteger(policy.standardIntervalTicks));
    case "far":
      return Math.max(1, nonNegativeInteger(policy.farIntervalTicks));
  }
}

export function shouldScheduleTick(
  currentTick: number,
  lastScheduledTick: number | null,
  intervalTicks: number,
): boolean {
  if (lastScheduledTick === null) {
    return true;
  }
  return (
    tickDelta(currentTick, lastScheduledTick) >=
    Math.max(1, nonNegativeInteger(intervalTicks))
  );
}

/**
 * Worker output is advisory until the authoritative simulation accepts it.
 * Results older than the caller-owned lag budget are discarded rather than
 * being applied to a newer world snapshot.
 */
export function resultIsFresh(
  sourceTick: number,
  currentTick: number,
  maxLagTicks: number,
): boolean {
  return tickDelta(currentTick, sourceTick) <= nonNegativeInteger(maxLagTicks);
}
