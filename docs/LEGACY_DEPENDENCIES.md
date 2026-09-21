# Legacy Dependency Management Policy

## Overview

The historical root application (Webpack, Babylon.js 3, Cannon physics) maintains 176 identified npm vulnerabilities (18 critical, 82 high) across its dependency graph. This document establishes the containment and lifecycle policy for legacy dependencies during the modernization campaign.

## Status

**Current state**: The root application is the working MVP and current product trunk. Its dependency graph is legacy/security-sensitive, but the application is not a disposable reference build. Modernization replaces dependency and subsystem ownership incrementally behind explicit seams while keeping the MVP playable.

**Known vulnerabilities**: 
- 18 critical vulnerabilities
- 82 high-severity vulnerabilities  
- 56 moderate vulnerabilities
- 20 low-severity vulnerabilities

**Security-relevant packages** identified in Dependabot:
- `js-yaml@3.13.1` → upgradeable to 3.15.2 (prototype-pollution fixes)
- `browserslist@4.6.6` → updateable to 4.28.7 (browser-data transitive chain)
- Cordova-Android in `/release/pwa/` (generated artifact, deprecated)

## Containment Policy

### 1. Legacy Application Scope

The root application currently serves as:
- the playable MVP and primary product surface;
- the behavioral baseline for modernization;
- the integration host for certified subsystem replacements;
- historical regression evidence for original mechanics.

**Modern work SHOULD NOT** deepen obsolete infrastructure:
- avoid adding dependencies to the root `package.json` when an isolated modern module/package can own the capability;
- avoid extending Webpack-specific architecture beyond what is needed to keep the MVP build operational;
- avoid new Babylon 3 or Cannon ownership where a certified replacement seam is being introduced.

New product behavior may still land in the MVP. Prefer implementing it through modern isolated modules/adapters and integrating those into the working game rather than building the feature only in a separate replacement application.

### 2. Dependency Management

**What we DO**:
- Record the actual package manager and resolved tree during certification
- Capture npm/yarn audit output as evidence
- Address **only** high/critical issues that block certification or normal builds
- Make minimal isolated patches when required (not opportunistic modernization)

**What we DO NOT**:
- Auto-fix or rewrite the entire historical dependency graph
- Merge stale lockfile patches that create false confidence
- Create or commit new root npm lockfiles (Yarn legacy lock is source)
- Treat the legacy surface as production-ready

### 3. Specific Vulnerabilities

#### js-yaml (CVSS 7.5)
**Status**: Prototype-pollution in versions < 3.13.1, complexity/DOS risks in 3.13.1-3.14.x

**Decision**: If required for certification integrity, upgrade to 3.15.2 in a minimal patch PR. Do not opportunistically upgrade other packages alongside it.

#### browserslist transitive chain
**Status**: Browser-data package updates. Non-critical for compilation or certification.

**Decision**: Leave as-is unless blocking a certification run. The transitive chain does not affect the shipped browser application.

#### Cordova-Android in `/release/pwa/`
**Status**: Generated artifact under PWA cleanup initiative (#31). Cordova 7 → 15 is a many-major jump not suitable for inline merge.

**Decision**: Leave as-is. Address only as part of dedicated PWA cleanup from #31 when the modern browser route reaches parity.

## Exit Condition

Close #152 and retire this policy when:
1. production-owned browser seams no longer depend on the legacy npm/Webpack/Babylon 3/Cannon graph;
2. each migrated subsystem has integrated MVP certification rather than lab-only parity;
3. remaining historical dependencies are no longer needed for build, rollback, reference, or certification;
4. obsolete root tooling can be removed without switching users to a separately rebuilt application.

The expected end state is an evolved MVP whose internals have been replaced incrementally, not a greenfield application that supersedes it in one release.

## Evidence from Certification

Document for each local certification run:
- Node version and npm/yarn version used
- Package manager that successfully reconstructs the baseline
- Raw output from `npm audit` / `yarn audit` in report-only mode
- List of transitive packages that contain code shipped to the browser (vs build-time-only)
- Any blocking vulnerabilities encountered and how they were addressed

## References

- **Issue #152**: Contain legacy dependency security risk  
- **Issue #31**: Modernize the toolchain through behavior-preserving stages  
- **docs/LOCAL_CERTIFICATION.md**: Certification procedures for legacy baseline  
- **Dependabot PRs**: #69 (browserslist), #70 (Cordova), #71 (js-yaml) — closed as evidence, not required for merge

