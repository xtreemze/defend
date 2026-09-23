# Lint and anti-pattern policy

Defend treats linting as an executable architecture contract, not only a formatting check.

## Maintained modern path

The modern workspace uses the most opinionated stable Biome preset available to its pinned version:

- `preset: "all"` enables every stable Biome lint rule;
- the `project`, `types`, and `test` domains are enabled at `all` so cross-file, type-aware, dependency, cycle, and test rules participate;
- the unrelated Qwik domain is explicitly disabled rather than allowing framework-specific false positives;
- `biome lint` runs with `--error-on-warnings`, so opinionated warnings are promotion-blocking rather than advisory.

Rules that are genuinely incompatible with an intentional Defend architecture decision must be disabled narrowly and documented here. Do not downgrade the global preset to make a branch green. `noUnresolvedImports` is disabled because TypeScript already owns package/export resolution for this TypeScript workspace and Biome documents that its duplicate check is usually unnecessary for TypeScript; `useImportExtensions` is disabled because Vite/TypeScript bundler resolution intentionally owns extensionless source imports. Node-module imports are allowed only in `scripts/**`, and default exports are allowed only in tool configuration files.

## Defend-specific policy lint

`experiments/hybrid-engine/scripts/defend-lint.mjs` uses the TypeScript parser to enforce invariants that generic lint rules cannot express reliably.

It rejects:

- `Math.random()` in maintained game code; stochastic behavior must receive a seeded/random source;
- `Date.now()`; authoritative behavior derives time from fixed simulation ticks;
- ambient `setTimeout` / `setInterval`; use authoritative ticks or an explicitly owned render/audio lifecycle;
- Worker construction outside `src/workers/`;
- AudioContext construction outside `src/audio/`;
- `SharedArrayBuffer` in the baseline path;
- a hidden `fortressStrength` oracle;
- Babylon imports or browser globals from domain/simulation/protocol/worker boundaries;
- competing renderers/frameworks, historical Cannon/Webpack packages, and legacy lint tooling in the modern hybrid package.

The purpose is not to prohibit future evidence-backed changes. It makes architecture changes explicit: change the governing decision and the lint contract together instead of silently bypassing a boundary.

## Exceptions

A local exception is deliberately expensive and must be attached to the exact violating line or the immediately preceding line:

```ts
// defend-lint-allow determinism/no-wall-clock -- Presentation-only profiling timestamp; never persisted into simulation state.
const timestamp = Date.now();
```

The reason must be concrete. Bare disables such as `temporary`, `TODO`, or a rule suppression without rationale do not pass the policy linter. Prefer moving code behind the correct ownership boundary to suppressing a rule.

## Historical root

The root Webpack/Babylon 3/Cannon application remains a behavioral-parity reference under `docs/LEGACY_DEPENDENCIES.md`. This policy intentionally does not add dependencies, perform a broad formatting rewrite, or pretend the historical ESLint 5/TSLint-era graph is the maintained lint platform.

New production work belongs in the modern workspace. The historical root may receive minimal, isolated compatibility fixes required for certification, but lint modernization must not destroy its value as a reference implementation.

## Required checks

For modern hybrid changes:

```sh
cd experiments
pnpm check
pnpm test
pnpm build
```

Hosted hybrid smoke and GitHub Pages builds run `pnpm check` before building, so violations block promotion and deployment.
