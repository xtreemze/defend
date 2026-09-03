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

#### Legacy root script warning

Until #35 is certified and merged, the root package still has historical unsafe command semantics:

- `npm run lint` contains `--fix` and mutates source;
- `npm run build` contains `--watch` and does not terminate normally;
- `npm run soundTest` contains the invalid `--hots` flag.

Do not use those commands as ordinary certification gates before #35. Use the installed tool binaries directly with non-mutating/one-shot arguments and record the exact commands.

The root has no committed npm lockfile. Prefer an install that does not create/update one in the certification clone, and capture the resolved dependency tree as evidence rather than silently committing it.

### Lane B — Storybook laboratory

From `experiments/storybook/`:

```sh
pnpm install
pnpm exec playwright install chromium   # only when needed
pnpm typecheck
pnpm build
pnpm test
```

Exercise the deterministic stories and their controls, including maximum-size stress fixtures. Record console warnings and verify stories that claim to be passive do not leave AudioContexts, Workers, animation loops, timers, or other persistent resources behind.

If the generated lockfile is coherent, preserve its checksum/resolution as evidence. Commit it later in a narrow reviewed PR rather than mixing it into unrelated local work.

### Lane C — Rust and Babylon/Bevy experiments

For the dependency-light Rust core:

```sh
cargo test -p defend-core
rustup target add wasm32-unknown-unknown   # only when missing
cargo check -p defend-core --features wasm --target wasm32-unknown-unknown
```

Record native/WASM parity samples, generated JS/WASM size, compile time and debugging/source-map ergonomics.

For `experiments/hybrid-engine/`, run the declared pnpm/Rust validation, then exercise the Babylon/Bevy fixture in a browser. Record fixed-step behavior, WASM initialization, first interactive frame, steady frame time/FPS, simulation step cost, JS↔WASM snapshot cost, payload size and Babylon Inspector behavior.

Use `cargo tree` to confirm the intended modular Bevy dependency boundary remains intact.

### Lane D — live behavior-preserving PRs

Issue #92 owns the current ordered queue. Test exact PR heads in the certification clone, not in the shared checkout.

Prioritize tooling safety first, then economy/tower/projectile/enemy parity work. Post the evidence back to each PR so its merge decision remains self-contained.

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

When a campaign cannot cover everything, prefer this order:

1. current `master` historical build/browser baseline;
2. #35 tooling safety;
3. Storybook laboratory;
4. live behavior-preserving PR queue from #92;
5. Rust core and hybrid-engine base;
6. top stacked design experiments;
7. deeper performance, audio and PWA investigations.

This order is chosen to maximize how much later online development can proceed without another local session.