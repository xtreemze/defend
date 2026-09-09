# pnpm 12 Evaluation Report

**Status**: Post-bootstrap evaluation of pnpm 12 compatibility  
**Date**: 2026-09-09  
**Context**: Baseline established on pnpm 11.25.0 per #158; ready for major-version evaluation

## Evaluation Scope

This document records the compatibility assessment of pnpm 12 against the certified workspace baseline established under pnpm 11.25.0. The evaluation follows the 10-point checklist defined in #158.

## Current Baseline (Certified)

- **pnpm version**: 11.25.0
- **Node version**: 24.20.0
- **Lockfile**: experiments/pnpm-lock.yaml (v9.0, 365 packages)
- **Workspace policy**: saveExact, sharedWorkspaceLockfile, engineStrict, minimumReleaseAge, strictDepBuilds, verifyDepsBeforeRun, blockExoticSubdeps, trustLockfile=false

## pnpm 12 Context

- **Status**: Released, Rust/pacquet-based rewrite
- **Channel**: Major-specific (not default `latest` tag)
- **Known issues**: Post-release regressions accepted upstream; some formerly-supported flags rejected
- **Rationale for separate evaluation**: Behavior changes and Rust reimplementation warrant isolated testing

## Planned Evaluation Checklist

### 1. Shared Workspace Lockfile Compatibility
- [ ] Both pnpm 11.25.0 and 12.x can read existing `experiments/pnpm-lock.yaml`
- [ ] lockfileVersion 9.0 is recognized and preserved
- [ ] Three importers (., hybrid-engine, storybook) resolve identically

### 2. Workspace Policy Enforcement
- [ ] `saveExact: true` respected in both versions
- [ ] `sharedWorkspaceLockfile: true` enforced
- [ ] `engineStrict: true` rejects incompatible Node/pnpm
- [ ] `minimumReleaseAge` policy enforced in both versions

### 3. Frozen Lockfile Rejection
- [ ] `pnpm install --frozen-lockfile` correctly rejects stale manifests
- [ ] Error messages unchanged or improved

### 4. Recursive/Filter Commands
- [ ] `pnpm -r run typecheck` behavior identical
- [ ] `pnpm --filter @defend/* run check` behavior identical
- [ ] `pnpm test` with project filters unchanged

### 5. Storybook Playwright Integration
- [ ] Browser tests execute without regressions
- [ ] Vitest + Playwright project resolution unchanged
- [ ] Test output and diagnostics equivalent

### 6. Hybrid Engine WASM Build
- [ ] `pnpm wasm` builds WASM successfully
- [ ] Generated `pkg/` directory structure unchanged
- [ ] `pnpm build` (with wasm chain) succeeds
- [ ] Output WASM byte size within tolerance (±5% of baseline)

### 7. Lifecycle/Build Script Execution
- [ ] No unexpected postinstall/build scripts trigger
- [ ] strictDepBuilds policy still honored
- [ ] esbuild: false allowlist still respected

### 8. Performance Comparison
- [ ] Install time (fresh): Baseline vs pnpm 12
- [ ] Install time (warm): Baseline vs pnpm 12
- [ ] Store size: Baseline vs pnpm 12
- [ ] Lockfile format stability (no gratuitous churn)

### 9. Dependabot Automation
- [ ] Dependabot can understand pnpm 12 lockfile format
- [ ] Security patches apply cleanly
- [ ] Lockfile regeneration remains deterministic

### 10. Upstream Regression Review
- [ ] Catalog of known pnpm 12 regressions reviewed
- [ ] None identified as blocking our command surface
- [ ] Documentation link: https://github.com/pnpm/pnpm/releases/tag/v12.0.0

## Evaluation Timeline

1. **Phase 1 (Pre-eval)**: Document baseline, plan test matrix
2. **Phase 2 (Execution)**: Run 10 checks locally
3. **Phase 3 (Reporting)**: Document findings and recommendations
4. **Phase 4 (Decision)**: Decide promotion path or defer to future

## Recommendations (TBD after evaluation)

- [ ] Promote to pnpm 12 when ready
- [ ] Schedule pnpm 12 upgrade for a future separate PR
- [ ] Defer pending upstream stability
- [ ] Identify minimal subset for earlier trial

## Notes

- This evaluation is **not blocking** any current development
- The pnpm 11.25.0 baseline remains the production workspace version
- Any promotion will be isolated from dependency updates and feature work per #158
- Results will be documented in this file and tracked in issue #158

---

**Next step**: Run the 10-point evaluation checklist and update this document with findings.
