# Defend Storybook Lab

This package is an isolated modern browser workshop for Defend experiments. It intentionally does not participate in the legacy root Webpack/TypeScript build.

## Requirements

- Node.js 20.19 or newer.
- Install dependencies from this directory only.
- Install Playwright Chromium before browser tests when it is not already present.

## Commands

```sh
cd experiments/storybook
npm install
npx playwright install chromium
npm run storybook
npm run build-storybook
npm run test-storybook
```

Commit the generated lockfile only after local installation confirms the pinned dependency set is coherent.

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

Do not broadly expose the repository filesystem through Vite. When a story needs a pure root module, add the narrowest explicit Vite allow-list/alias required and document it in the PR. Modules coupled to the historical Webpack runtime should instead receive a dedicated adapter or standalone fixture.
