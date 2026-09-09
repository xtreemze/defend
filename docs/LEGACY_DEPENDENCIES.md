# Legacy Dependency Management Policy

## Overview

The historical root application (Webpack, Babylon.js 3, Cannon physics) maintains 176 identified npm vulnerabilities (18 critical, 82 high) across its dependency graph. This document establishes the containment and lifecycle policy for legacy dependencies during the modernization campaign.

## Status

**Current state**: Legacy root remains the behavioral-parity reference during modernization. No new production features should depend on the historical Webpack/Babylon/Cannon graph.

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

The root application serves **solely** for:
- Behavioral-parity testing during modernization
- Historical regression validation
- Documentation of original mechanics

**New features DO NOT**:
- Add dependencies to the root `package.json`
- Extend the Webpack graph
- Introduce new Babylon 3 or Cannon integrations

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
1. The modern pnpm workspace (experiments/) reaches behavioral-parity certification
2. The modern browser route can replace the historical Webpack application
3. Legacy dependencies are no longer needed for reference or certification
4. The historical root can be archived or removed from the main repository

## Evidence from Certification

Document for each local certification run:
- Node version and npm/yarn version used
- Package manager that successfully reconstructs the baseline
- Raw output from `npm audit` / `yarn audit` in report-only mode
- List of transitive packages that contain code shipped to the browser (vs build-time-only)
- Any blocking vulnerabilities encountered and how they were addressed

## References

- **Issue #152**: Contain legacy dependency security risk  
- **Issue #31**: Retire the historical root when modernization reaches parity  
- **docs/LOCAL_CERTIFICATION.md**: Certification procedures for legacy baseline  
- **Dependabot PRs**: #69 (browserslist), #70 (Cordova), #71 (js-yaml) — closed as evidence, not required for merge

