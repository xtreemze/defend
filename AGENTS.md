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

## Modernization policy

The repository contains a stale backlog of dependency-update PRs from the historical toolchain. Treat them as evidence of obsolete/security-sensitive dependencies, not as a required merge sequence. Follow issue #31 and migrate the stack coherently.

Favor incremental boundaries that make later changes easier: explicit gameplay calculations, typed entity metadata, owned lifecycle cleanup, isolated rendering/audio effects, and testable state transitions. Avoid a big-bang engine/ECS rewrite unless measured evidence shows it is necessary.
