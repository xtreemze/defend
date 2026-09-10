# Parallel system execution prototype

This directory is an experimental execution boundary for the modern hybrid-engine lab. It does **not** move authoritative gameplay state out of the Bevy/WASM fixed-step runtime.

## Execution domains

- **simulation/render host** — owns fixed-step advancement, lifecycle, authoritative physics/combat acceptance, and Babylon presentation;
- **combat worker** — batch target selection and intercept/lead calculations;
- **AI worker** — batch neighborhood/perception-style steering calculations;
- **audio worker** — lower-rate source ranking, distance and Doppler control preparation;
- **AudioWorklet** — hard-real-time procedural sample generation and declicking.

Workers are persistent by system. Do not create a worker per enemy, turret, projectile, or sound emitter.

## Deterministic authority boundary

Every worker request/result carries the simulation `sourceTick`. Worker output is advisory and must be rejected when it exceeds the caller-owned lag budget. Integration must additionally validate entity identity/lifecycle and the current authoritative firing/movement rules before applying a result.

The main simulation must never block waiting for a worker. If a result is late, stale, invalid, or a worker fails, authoritative simulation continues without that advisory result or uses a measured fallback.

## Data boundary

The baseline protocol uses contiguous typed arrays and transferable `ArrayBuffer`s. Do not require `SharedArrayBuffer`, cross-origin isolation, or mutable shared ECS memory. A shared-memory ring buffer is a later profiling decision only if transfer/copy overhead is demonstrated to be material.

## Cadence

Scheduling is deliberately multi-rate and simulation-tick based. The prototype defaults to:

- near/high-interest: every 2 ticks at the current 120 Hz hybrid fixed step;
- standard: every 6 ticks;
- far/low-interest: every 24 ticks.

These are measurement defaults, not gameplay constants. Tune them from worker latency, stale-result rate, frame-time impact, and perceptual/behavioral quality rather than display refresh rate.

## Audio boundary

`audioPlanner.ts` prepares lower-rate controls only. `proceduralAudio.worklet.ts` owns sample generation. The worklet smooths voice gain so voice start/stop and virtualization do not introduce hard discontinuities.

The current sine renderer is a transport/DSP baseline, not final sound design. Integration under #196 should consume the canonical spatial-audio semantics from #60/#61/#62/#99 rather than promoting the local simplified ranking formula as a second policy.

## Validation before promotion

From `experiments/` with the repository-pinned toolchain:

```sh
pnpm --filter @defend/hybrid-engine-lab typecheck
pnpm --filter @defend/hybrid-engine-lab test
pnpm --filter @defend/hybrid-engine-lab check
pnpm --filter @defend/hybrid-engine-lab build
```

Then use #195 and #196 for browser/runtime integration and performance evidence. Keep this prototype isolated until worker bundling, AudioWorklet loading, stale-result behavior, deterministic command acceptance, failure fallback, and representative 128/500/1000+ entity/source stress cases are demonstrated.
