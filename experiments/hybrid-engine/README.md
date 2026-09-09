# Defend hybrid engine lab

This isolated experiment tests the architecture proposed in #66:

- Babylon.js 9 owns browser rendering, camera, picking and diagnostics.
- A headless Bevy 0.19 ECS app compiled to WASM owns semantic body state.
- Rapier 0.20 and Babylon Havok are pinned for subsequent same-scene physics comparisons.
- The historical Webpack 4 / Babylon 3 / Cannon application is untouched.

## Why this shape

The useful combination is **Bevy as a modular simulation framework + Babylon as the browser renderer**. Running both complete render engines in one production page would duplicate GPU resources, transforms, scene graphs and debugging surfaces.

The initial runtime intentionally uses only `bevy_app`, `bevy_ecs` and `bevy_math`. It does not enable Bevy rendering, windows, UI, input or audio.

## Toolchain

- Node 24.20 LTS
- pnpm 11.25.0
- Vite 8.2.2
- TypeScript 7.0.2
- Biome 2.5.11
- Vitest 4.1.11
- Babylon.js 9.23.0
- Rust 1.98.0 / edition 2024
- Bevy modular crates 0.19.1
- wasm-bindgen 0.2.127
- wasm-pack 0.15.0
- Rapier JS 0.20.0
- Babylon Havok 1.3.14

Node and pnpm are owned by the `experiments/` workspace root. Direct package versions remain pinned for reproducible experiments and should be updated deliberately rather than floating on `latest` during certification.

## Run locally

Install `wasm-pack` 0.15.0 and use Node 24 LTS, then install from the shared modern workspace root:

```sh
cd experiments
pnpm install
pnpm --filter @defend/hybrid-engine-lab typecheck
pnpm --filter @defend/hybrid-engine-lab test
pnpm --filter @defend/hybrid-engine-lab check
pnpm --filter @defend/hybrid-engine-lab build
pnpm --filter @defend/hybrid-engine-lab dev
```

The hybrid package's `build` and `dev` scripts first compile `rust/` to `pkg/`.

Use `?inspect=1` to start Babylon's headless Inspector bridge for agent-driven scene inspection.

## Current fixture

The fixture creates 128 semantic bodies in the Rust/Bevy ECS runtime. Babylon creates lightweight instances and renders a copied xyz snapshot from the authoritative runtime.

Two protocol rules are explicit even in this first lab:

1. **Stable external identity.** The runtime assigns monotonic public body ids and keeps a registry mapping them to Bevy `Entity` handles. Babylon never treats ECS query/archetype iteration order as object identity.
2. **Fixed authoritative time.** The runtime advances only through exact 120 Hz `step_fixed(n)` calls. The browser converts render-frame time into fixed ticks using a pure bounded accumulator. Render cadence and catch-up policy therefore do not become simulation state.

The browser fetches the stable id table once for this no-lifecycle fixture, then receives flat xyz triples in the same registry order each frame. Future spawn/despawn behavior must become explicit lifecycle protocol events rather than relying on array positions.

## Deterministic tests

Rust tests currently cover:

- monotonic public body ids and stable snapshot order;
- fixed-step partition invariance: advancing 240 ticks in one batch equals advancing 60 then 180 ticks.

Vitest tests cover the browser-side fixed-step accumulator:

- 60 Hz and 120 Hz render cadences produce the same authoritative tick count;
- fractional render frames accumulate correctly;
- long frames use bounded catch-up and record discarded backlog;
- a zero catch-up budget has explicit behavior;
- non-finite timing input is sanitized.

These tests are committed as executable contracts but remain uncertified until run locally.

## Baseline measurements

The deliberately simple copy boundary gives us a measurable baseline for:

- WASM initialization cost;
- JS↔WASM transform copy cost;
- per-frame snapshot size;
- Babylon frame time;
- Bevy ECS fixed-step/update cost;
- bundle size and cold-start behavior;
- catch-up behavior under artificial long frames.

Do not introduce shared memory, raw WASM memory views or binary protocol complexity until this baseline shows that the copy is material.

## Next backend comparisons

Use the same visual fixture and seeded initial conditions for:

1. Babylon + JS state only.
2. Babylon + Rapier JS/WASM 0.20.
3. Babylon + Bevy ECS WASM (this baseline).
4. Babylon + Bevy ECS + Rust Rapier WASM.
5. Babylon + Havok 1.3.14.
6. A separate full-Bevy web sample for renderer/startup comparison only.

For physics variants, compare contact/knockback behavior against Defend's characterized Cannon baseline before selecting an engine.

## Required local certification before promotion

- `pnpm install` from `experiments/` succeeds and produces one committed `experiments/pnpm-lock.yaml` without touching the repository root dependency graph.
- `wasm-pack build ./rust --target web --out-dir ../pkg --out-name defend_hybrid_runtime` succeeds from the hybrid package.
- `cargo fmt --check`, `cargo clippy`, and `cargo test` succeed for the runtime crate.
- workspace-filtered `pnpm typecheck`, `pnpm check`, `pnpm test`, and `pnpm build` succeed.
- Browser fixture renders all 128 bodies with no console errors.
- 60/120/144 Hz display cadences preserve the expected fixed simulation rate.
- an artificial long frame cannot trigger an unbounded catch-up spiral and reports dropped backlog.
- Babylon Inspector bridge works when requested and disconnects on teardown.
- record raw/compressed JS+WASM sizes, initialization time, first interactive frame, steady FPS, simulation-step time and transform-copy cost.
- confirm no Bevy renderer/window dependencies appear in `cargo tree`.

## Scope boundary

This lab is evidence, not a production migration. Production ownership should only move after the comparative fixtures demonstrate better determinism, maintainability, performance, or cross-platform reuse at acceptable startup and bundle cost.
