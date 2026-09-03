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
- Babylon.js 9.23.0
- Rust 1.98.0 / edition 2024
- Bevy modular crates 0.19.1
- wasm-bindgen 0.2.127
- wasm-pack 0.15.0
- Rapier JS 0.20.0
- Babylon Havok 1.3.14

Versions are pinned for reproducible experiments. They should be updated deliberately rather than floating on `latest` during certification.

## Run locally

Install `wasm-pack` 0.15.0 and use Node 24 LTS, then from this directory:

```sh
pnpm install
pnpm dev
```

`pnpm dev` first compiles `rust/` to `pkg/`, then starts Vite.

Use `?inspect=1` to start Babylon's headless Inspector bridge for agent-driven scene inspection.

## Current fixture

The first fixture creates 128 semantic bodies in the Rust/Bevy ECS runtime and returns flat xyz triples every frame. Babylon creates lightweight instances and renders those positions.

The deliberately simple copy boundary gives us a measurable baseline for:

- WASM initialization cost;
- JS↔WASM transform copy cost;
- per-frame snapshot size;
- Babylon frame time;
- Bevy ECS fixed-step/update cost;
- bundle size and cold-start behavior.

Do not introduce shared memory or binary protocol complexity until this baseline shows that the copy is material.

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

- `pnpm install` succeeds and produces a committed lockfile without touching the repository root dependency graph.
- `wasm-pack build ./rust --target web --out-dir ../pkg --out-name defend_hybrid_runtime` succeeds.
- `cargo fmt --check`, `cargo clippy`, and `cargo test` succeed for the runtime crate.
- `pnpm check`, `pnpm test`, and `pnpm build` succeed.
- Browser fixture renders all 128 bodies with no console errors.
- Babylon Inspector bridge works when requested.
- Record raw/compressed JS+WASM sizes, initialization time, first interactive frame, steady FPS and transform-copy cost.
- Confirm no Bevy renderer/window dependencies appear in `cargo tree`.

## Scope boundary

This lab is evidence, not a production migration. Production ownership should only move after the comparative fixtures demonstrate better determinism, maintainability, performance, or cross-platform reuse at acceptable startup and bundle cost.
