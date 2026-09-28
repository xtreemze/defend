# Defend UI package

This package is the modern DOM presentation boundary for Defend. It is deliberately small and subordinate to the game runtime.

## Ownership

- Babylon owns the 3D world, camera, picking, direct manipulation, and browser rendering.
- Rust/WASM + modular Bevy own authoritative semantic simulation.
- This package consumes presentation-safe view models and renders DOM accessibility/status/application surfaces.
- Components may emit user intents, but they must not directly mutate authoritative simulation state or create a second gameplay store.

## Stack

- Lit 3.3.3 for custom elements.
- Native CSS for component styling and responsive/adaptive behavior.
- Web Awesome 3.13.0 only for conventional application controls that benefit from a maintained accessible primitive.

Import Web Awesome through the explicit `@defend/ui/webawesome` entrypoint. That module cherry-picks the controls Defend has approved; do not replace it with a package-wide component import.

## Current witness

`<defend-status-panel>` consumes a plain immutable `DefendStatusViewModel`. It has no Babylon, Bevy, physics, worker, timer, or global-store dependency. Storybook owns the first browser fixture under `UI/Status Panel`.

This package remains in the experiments workspace until the production browser route is ready to promote it into the final `packages/*` layout from issue #66.
