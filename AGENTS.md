# Defend executor contract

This repository is expected to be developed by multiple highly capable AI executors working concurrently through GitHub and, separately, by a local Codex executor with a synchronized checkout.

## Source of truth

- `master` is the integration branch.
- GitHub issues are the durable source for design decisions, investigations, findings, disagreements, and future work.
- Pull requests are the unit of implementation. Keep them narrow enough to review and merge independently.
- Start with issue #29 for the game principles and modernization program. Preserve those principles unless a later issue records an explicit design decision to change them.

## Before changing code

1. Inspect open issues and pull requests for overlapping work.
2. State a clear ownership boundary in the issue/PR.
3. Prefer a new focused branch/PR over expanding an unrelated branch.
4. Do not assume old code is intentional merely because it exists; distinguish observed gameplay, documented intent, and implementation defects.

## Gameplay invariants

Modernization must preserve Defend's identity unless an issue explicitly changes it:

- energy is health, construction budget, and the defended resource;
- projectile damage replenishes energy, so offense sustains defense;
- towers are temporary and higher levels degrade over time;
- physics is gameplay: mass, collision, obstruction, momentum, knockback, and ejection matter;
- enemies are finite-lived and can be mitigated by damage, delay, blocking, redirection, or being pushed off the arena;
- stronger tower levels are trade-offs in range, cadence, mass, damage, and control rather than simple linear upgrades;
- direct interaction with the 3D battlefield is preferred over menu-heavy control;
- procedural/abstract visuals and spatial/procedural sound are part of the product identity;
- visual effects may degrade for performance before core simulation fidelity does.

Issue #30 owns the behavioral certification contract. When a refactor and legacy implementation disagree, use certification evidence and #29 rather than preserving an obvious bug by accident.

## Parallel-work rules

- Keep PRs orthogonal where practical. Avoid broad formatting or mechanical rewrites that create unnecessary conflicts.
- Do not rewrite files outside the stated ownership boundary just to make them stylistically uniform.
- Nearby defects may be fixed in the same PR when they are directly exposed by the change, low risk, and tested. Otherwise record them in an issue.
- Never force-update another executor's branch or repurpose another PR without explicit coordination.
- Rebase/update only the branch you own and only when needed to resolve real integration drift.
- If another PR lands in the same area, reassess overlap before continuing rather than blindly replaying old assumptions.

## Local Codex executor

The local executor is the authority for actions that require a real checkout/runtime: dependency installation, builds, browser execution, physics interaction, profiling, screenshots, PWA/offline checks, audio checks, and local certification.

Local sessions are expected to be infrequent. Follow `docs/LOCAL_CERTIFICATION.md` and the live campaign queue in issue #92 so one session certifies several related surfaces. Prefer a separate persistent certification clone over branch-switching or installing dependencies in the shared development checkout.

When working in a checkout that may contain concurrent work:

- do not `reset --hard`, `clean`, stash, or overwrite unrelated changes;
- do not switch the shared working copy to another branch or create/remove worktrees unless explicitly coordinated;
- prefer fetch/inspect operations and narrowly scoped edits;
- record the starting commit and existing dirty paths before modifications;
- commit only files owned by the task;
- post runtime/build/certification findings back to the relevant GitHub issue or PR so online agents can use them.

## Validation

Each PR should explain what was validated and what could not be validated online. Do not claim runtime, physics, browser, audio, or PWA verification unless it was actually performed. When local verification is required, leave an explicit checklist for the local executor and update the PR with the results.

Prefer behavioral assertions over snapshots of implementation details. Preserve deterministic seams for stochastic behavior where practical, but do not replace emergent physics with a fake deterministic simulation merely to make tests easy.

## GitHub review and promotion contract

GitHub state must communicate the real readiness of a change rather than merely whether Git can merge it.

- **Draft PR** means implementation, investigation, or required certification is incomplete. Runtime-sensitive work remains draft until the local executor posts the required evidence.
- **Ready for review** means the PR's stated validation contract has evidence against the current head SHA. Do not mark a PR ready merely because GitHub reports it as conflict-free.
- Record substantive online architectural/static review as a formal PR review tied to the exact head being reviewed. If the head moves materially afterward, treat that review as stale until the delta is inspected.
- Before promotion or merge, inspect the current head/base, changed files, unresolved review threads, submitted reviews, branch drift, commit status, and any available workflow results.
- `mergeable=true` only means Git can currently construct a merge. It is never validation or certification.
- Merge with an expected/current head SHA when the API supports it so a concurrent push cannot silently change what is being merged.
- Do not force-update another executor's branch to remove an inconvenient behind count. Update an owned branch only when the integration delta is actually needed.
- For stacked PRs, keep the child branch based on the current parent head. Prefer a normal fast-forward/merge commit over history rewriting; verify that the child diff relative to its parent contains only the intended additional scope.

### GitHub write safety

- Never probe a write API by creating placeholder files/commits/refs.
- Do not use Git data/ref operations against `master` for experimentation.
- Blob/tree/commit/ref primitives are appropriate for deliberate atomic multi-file work or non-destructive merges on branches this executor owns.
- Ref updates should be fast-forward by default. Force updates require explicit coordination and a concrete reason.

### CI and Actions

The project intentionally distinguishes local runtime certification from hosted CI.

- Absence of a status check or workflow run is not a passing check.
- Do not add hosted CI solely because Actions APIs are available; local Codex remains the authority for expensive/historical/browser/physics/audio/PWA certification unless the project explicitly adopts a hosted gate.
- If workflows are introduced, inspect the run, jobs, steps/logs, and relevant artifacts before acting on the result.
- Retry only failed jobs/runs when the failure is plausibly transient or the underlying cause has been corrected; do not rerun repeatedly to obtain a green result by chance.
- Preserve exact head-SHA linkage between workflow/local evidence and the PR being promoted.

## Modernization policy

The repository contains a stale backlog of dependency-update PRs from the historical toolchain. Treat them as evidence of obsolete/security-sensitive dependencies, not as a required merge sequence. Follow issue #31 and migrate the stack coherently.

Favor incremental boundaries that make later changes easier: explicit gameplay calculations, typed entity metadata, owned lifecycle cleanup, isolated rendering/audio effects, and testable state transitions. Avoid a big-bang engine/ECS rewrite unless measured evidence shows it is necessary.
