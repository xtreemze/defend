# Defend Storybook Lab

This package is an isolated modern browser workshop for Defend experiments. It intentionally does not participate in the legacy root Webpack/TypeScript build.

## Requirements

- Node.js 24.20.x LTS.
- pnpm 11.25.0, pinned by the `experiments/` workspace root.
- Install dependencies from `experiments/` so Storybook and the hybrid-engine lab share one resolved dependency graph and lockfile.
- Install Playwright Chromium before browser tests when it is not already present.

## Commands

```sh
cd experiments
pnpm install
pnpm --filter @defend/storybook-lab exec playwright install chromium
pnpm --filter @defend/storybook-lab typecheck
pnpm --filter @defend/storybook-lab dev
pnpm --filter @defend/storybook-lab build
pnpm --filter @defend/storybook-lab test
```

The compatibility aliases `pnpm storybook`, `pnpm build-storybook`, and `pnpm test-storybook` remain available when commands are run directly against the Storybook package.

Commit the generated `experiments/pnpm-lock.yaml` only after local installation confirms the pinned dependency set is coherent. Installation/build/test must not mutate the legacy root dependency graph.

## Story taxonomy

Use these stable prefixes:

- `Diagnostics/*`
- `Foundations/Topology/*`
- `Foundations/Physics/*`
- `Audio/Materials/*`
- `Audio/Spatial/*`
- `Audio/Visualization/*`
- `Arena/Camera/*`
- `Arena/Interaction/*`
- `Gameplay/Towers/*`
- `Gameplay/Enemies/*`
- `Gameplay/Projectiles/*`

Tag stories according to their intended use. Prefer `test` and `visual` for deterministic browser-testable stories; use `experimental`, `manual-audio`, or `performance` for states that should not become ordinary blocking gates.

## Ownership boundary

Storybook may mount DOM, SVG, Canvas, Web Audio controls, or explicitly-created Babylon scenes. Stories should import renderer-independent project modules when practical rather than duplicating formulas.

Do not use this package as the sole certification environment for AudioWorklet latency/underruns, full production physics timing, PWA/service-worker behavior, SharedArrayBuffer deployment headers, or long-running soak tests.

## Lifecycle rule

Every story that starts a `requestAnimationFrame` loop, Worker, AudioContext/AudioWorklet, Babylon engine/scene, event subscription, timer, or similar resource must provide deterministic teardown when the story is replaced or reset. Experimental fixtures must not leak state into the next story.

The initial capability story intentionally creates no persistent background work and can therefore serve as the smoke test for the lab itself.

## Root-source imports

The lab exposes one explicit alias, `@defend/*`, mapped only to the repository's `src/js/` tree. Use it for renderer-independent modules that are already safe foundations on `master`, for example:

```ts
import { hexToWorld } from "@defend/gameplay/hexGrid";
import { terrainImpactProfile } from "@defend/gameplay/terrainDeformation";
import { spatialRenderHints } from "@defend/audio/spatialAudio";
```

The Vite filesystem allow-list is limited to the repository root so those explicit imports can resolve; do not turn it into an unrestricted filesystem allow-list. A story importing legacy runtime-coupled modules should receive a dedicated adapter or standalone fixture rather than pulling the historical application graph into Storybook.

The current deterministic domain playgrounds deliberately consume the merged source contracts directly:

- `Foundations/Topology/Hex Grid` inspects canonical cells, rings, protected core cells, and six-sector classification;
- `Foundations/Physics/Terrain Deformation` visualizes bounded impact profiles and recovery;
- `Audio/Spatial/Voice Budget` visualizes moving emitters, Doppler/priority hints, renderer tiers, and virtualization without creating an AudioContext.

These stories certify presentation and deterministic fixture behavior only after the local Storybook package itself passes install/typecheck/build/browser tests. They do not promote the underlying calibration values to production gameplay/audio constants.

## Workspace role

This package is a member of the modern `experiments/` pnpm workspace introduced under #143. It should eventually become the canonical `apps/storybook` package from #66 rather than spawning a second Storybook surface. Preserve the story taxonomy and browser-test lifecycle if/when relocation is locally certified.
