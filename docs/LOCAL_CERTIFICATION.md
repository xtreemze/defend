# Local certification campaigns

Defend is developed by online GitHub executors and, less frequently, by a local executor with a real checkout/runtime. Local execution is expensive in coordination time, so each session should be treated as a **campaign** that certifies several related surfaces in one pass.

The live queue and exact SHAs belong in issue #92. This document contains the stable operating procedure.

## 1. Never use the shared development checkout for certification

The shared checkout may contain concurrent work. Do not switch it to PR branches, stash, reset, clean, create/remove worktrees, install dependencies, or run commands that rewrite tracked files.

Use a separate persistent sibling clone only for certification:

```sh
git clone https://github.com/xtreemze/defend.git ../defend-certification
cd ../defend-certification
git fetch --all --prune
```

For each target, detach at the exact SHA recorded in #92:

```sh
git checkout --detach <exact-sha>
```

A certification clone can be recreated when necessary because it owns no development work. The shared development checkout cannot.

## 2. Cut the campaign immediately before local work begins

Before a rare local session, the online GitHub executor should update #92 with:

- current `master` SHA;
- exact candidate PR heads;
- current stacked-PR ancestry;
- merged foundations that now require runtime confirmation;
- known install/runtime blockers;
- evidence priorities that unblock the most downstream work.

Do not rely on an old issue comment merely because the PR number is unchanged. Certification attaches to an exact SHA.

## 3. Record an evidence header once per target

Record:

```text
repository SHA:
branch / PR:
date/time:
OS + architecture:
Node / npm / pnpm:
Rust / cargo / wasm-pack:
browser + exact version:
git status --short before:
```

After each command, record its exit code and material output. End each target with `git status --short` again.

Classify results explicitly as `PASS`, `FAIL`, or `BLOCKED`.

## 4. Campaign lanes

### Lane A — current master baseline

Certify the current integrated game before judging behavior-preserving PRs.

Capture at least:

- historical dependency-install result and exact resolved environment;
- terminating production build result;
- non-mutating lint/type diagnostics where available;
- browser startup and console output;
- starting/ramp energy;
- tower placement and upgrade costs;
- projectile hit → enemy HP loss + energy recovery;
- bank collision damage;
- enemy finite-life decay;
- knockback/ejection;
- tower degradation/removal;
- wave progression, victory, defeat and restart;
- central occupancy/placement behavior;
- pointer/touch behavior where available.

Prefer one coherent recorded browser session over repeated restarts for every issue.

#### Historical root command status

#35 has merged. The ordinary root validation commands now have safe semantics for certification:

- `npm run lint` is non-mutating; use `npm run lint:fix` only for an intentional source-editing task;
- `npm run build` is a terminating one-shot production build;
- `npm run build:watch` is the explicitly non-terminating watch variant;
- `npm run soundTest` uses the valid hot-reload flag.

Subsequent repository-safety cleanup also removed the historical package commands/helpers that staged/versioned/pushed Git state, recursively deleted `node_modules`, invoked unpinned PWA Builder code, or exposed broken archive/config-check workflows.

The historical export path is deliberately still present. `preexportp` removes/rebuilds `dist/`, so do not run `npm run exportp` as an ordinary build gate; use it only when the campaign explicitly includes historical export/PWA-output characterization.

The root has no committed npm lockfile and still contains a historical Yarn lockfile. Record which package manager actually reconstructs the baseline, capture the resolved dependency tree/audit as evidence, and do not silently create or commit a new root lockfile during certification.

### Lane B — modern browser laboratories

Use the package-manager root and exact workspace head recorded in #92.

Before a shared modern workspace is promoted, package-local Storybook commands remain valid for a package-local target. When #92 points to a workspace candidate, install from that workspace root and use its shared lockfile/policy instead of independently resolving each child package.

For a package-local Storybook target, the established commands are:

```sh
cd experiments/storybook
pnpm install
pnpm exec playwright install chromium   # only when needed
pnpm typecheck
pnpm build
pnpm test
```

For a shared-workspace target, follow the exact aggregate/filter commands recorded on that PR/#92. Do not generate separate child lockfiles when the target declares a shared workspace lockfile.

Exercise the deterministic stories and their controls, including maximum-size stress fixtures. Record console warnings and verify stories that claim to be passive do not leave AudioContexts, Workers, animation loops, timers, or other persistent resources behind.

A generated lockfile belongs only to the dependency/workspace PR that explicitly owns it. Inspect it before committing and keep unrelated local work out of that commit.

### Lane C — Rust and Babylon/Bevy experiments

For the dependency-light Rust core:

```sh
cargo test -p defend-core
rustup target add wasm32-unknown-unknown   # only when missing and not already owned by a pinned toolchain
cargo check -p defend-core --features wasm --target wasm32-unknown-unknown
```

If the target contains a repository `rust-toolchain.toml`, let that exact toolchain own required components/targets and record the resolved `rustc`/Cargo versions before testing.

Record native/WASM parity samples, generated JS/WASM size, compile time and debugging/source-map ergonomics.

For `experiments/hybrid-engine/`, run the declared pnpm/Rust validation, then exercise the Babylon/Bevy fixture in a browser. Record fixed-step behavior, WASM initialization, first interactive frame, steady frame time/FPS, simulation step cost, JS↔WASM snapshot cost, payload size and Babylon Inspector behavior.

Use `cargo tree` to confirm the intended modular Bevy dependency boundary remains intact. When #92 requests a supply-chain/cache inspection for a known Rust incident, complete that check before committing a new Cargo lockfile or treating the dependency graph as certified.

### Lane D — live behavior-preserving PRs

Issue #92 owns the current ordered queue. Test exact PR heads in the certification clone, not in the shared checkout.

Prioritize the targets that unblock the most downstream work. Post evidence back to each PR so its merge decision remains self-contained.

Reuse dependency caches only when package metadata is unchanged. Reuse must not hide a dependency difference between targets.

### Lane E — stacked experimental labs

When a top child contains all parent experiments and preserves their pages/fixtures, certify the **top stack head once** and exercise every inherited page in that build. Do not spend a rare session installing and building every parent independently.

If stack ancestry has changed since #92 was updated, refresh it before testing.

Experiments that depend on a behavior-preserving parent PR should be tested only after that parent's parity contract succeeds.

## 5. Evidence fan-out

One runtime observation can support several issues, but copy the relevant excerpt to each owning issue/PR.

For example, one current-master browser session can cover wave cadence, level-3 upgrade semantics, occlusion, spawn occupancy and enemy health-meter observations without requiring five setups.

Attach screenshots/video only when they help establish a visual/physical state that text cannot capture well. Record exact browser version and tested SHA with every visual artifact.

## 6. Stop conditions

Do not consume an infrequent local session on broad remediation. Mark a lane `BLOCKED` and continue independent lanes when:

- historical installation requires broad dependency upgrades;
- a PR no longer represents its advertised ownership boundary;
- stack ancestry changed unexpectedly;
- a discrepancy requires a design decision rather than a narrow obvious fix;
- testing would require destructive changes to shared development state;
- unrelated local work would be overwritten or hidden.

If a small isolated compatibility fix is clearly required, record the blocker first and put the fix in its own narrow PR/commit rather than silently changing the certification target.

## 7. Promotion rule

A local result certifies only the exact SHA that was tested. Online executors must inspect any later delta before reusing the evidence.

Do not equate a clean install, a mergeable PR, or absence of console output with gameplay certification. Runtime-sensitive PRs become ready only when their stated behavior contract has evidence.

## 8. Time-limited priority

When a campaign cannot cover everything, follow the current ordering in #92. As a stable default, prefer:

1. current `master` historical build/browser baseline when it is stale or required for parity decisions;
2. dependency/workspace/toolchain targets that unblock many later PRs;
3. modern Storybook/browser laboratory gates;
4. live behavior-preserving PR queue from #92;
5. Rust core and hybrid-engine targets;
6. top stacked design experiments;
7. deeper performance, audio and PWA investigations.

This order is chosen to maximize how much later online development can proceed without another local session.
