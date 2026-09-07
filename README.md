<div align="center">

# Defend

**A physics-driven strategy game about finite energy, temporary defenses, and the cost of perfect deterrence.**

[Play the historical web build](https://xtreemze.github.io/defend/) · [Game design manual](./docs/GAME_DESIGN_MANUAL.md) · [Development contract](./AGENTS.md) · [Issues](https://github.com/xtreemze/defend/issues)

</div>

![Defend battlefield](./release/screenshot2.png)

## Overview

Defend is a strategy game about keeping a fragile physical system alive.

You begin inside a procedural 3D stronghold protecting a central energy reserve from incoming spherical raiders. That reserve is not merely a score or a health bar: **the same energy is your survival margin, your construction budget, the resource being defended, and the economic consequence of combat.** Every defensive commitment therefore makes the fortress more capable while also spending part of the thing it exists to protect.

Combat is intentionally broader than a damage race. Mass, momentum, collision, obstruction, projectile impulse, line of fire, terrain, gravity, and time can all decide an encounter. A wall can succeed by delaying an attacker until its finite life decays. A projectile can be valuable because it redirects a threat rather than destroys it. Knocking a raider off the arena can be more important than reducing its hit points. The battlefield is a physical system to manipulate, not a path for enemies to follow.

Defenses are temporary. Towers age, higher tiers degrade into lower ones, and the fortress must be continually maintained rather than permanently solved. Successful engagement can replenish energy, so offense sustains defense and passive invulnerability is not automatically optimal.

The larger campaign is built around a systemic inversion: **becoming too successful at defense eventually changes the economy that made the stronghold sustainable.** The player's relationship to the same resource, units, and physical rules then reverses. The intended story is expressed primarily through mechanics and consequences rather than exposition.

## What makes Defend distinct

| Principle | Gameplay consequence |
| --- | --- |
| **Energy is everything** | Health, construction, defended resource, combat recovery, and later strategic operating cost compete in one closed economy. |
| **Physics is gameplay** | Mass, momentum, obstruction, knockback, falling, collision, and spatial clearance are tactical variables rather than visual decoration. |
| **Time is a weapon** | Raiders are finite-lived, so delay, trapping, rerouting, and forcing inefficient approaches can be as valuable as direct damage. |
| **Infrastructure is temporary** | Defensive power degrades. Building buys a period of control rather than permanent accumulation. |
| **One system, two perspectives** | The campaign is designed so the mechanics learned while defending remain legible when the player's strategic role changes. |
| **The world explains itself** | Geometry, motion, color, sound, and visible resource movement should communicate state before text or hidden modifiers do. |

These principles are canonicalized in the [Game Design Manual](./docs/GAME_DESIGN_MANUAL.md). Experimental numbers and implementation approaches are kept separate from identity-level rules.

## The defensive loop

1. Protect the central energy reserve.
2. Read incoming composition, approach geometry, and the condition of the stronghold.
3. Spend finite energy on barriers and progressively stronger temporary towers.
4. Damage, delay, redirect, obstruct, or eject attackers using the physical battlefield.
5. Recover energy through successful engagement while preventing surviving raiders from draining the reserve.
6. Rebuild as defenses age and degrade.
7. Adapt when a locally successful strategy creates a larger economic consequence.

![Defend towers and attackers](./release/screenshot3.png)

### Towers

- **Tower 1 — barrier:** low-cost physical control that blocks bodies and shapes routes without needing direct damage.
- **Tower 2 — interceptor:** a more responsive projectile tower that combines obstruction with active defense.
- **Tower 3 — heavy turret:** a slower, higher-commitment weapon whose stronger projectile impulse rewards deliberate placement and timing.

Tower tiers are a lifecycle as well as an upgrade path: higher levels eventually degrade through lower levels and disappear.

### Raiders

Raiders share the same physical world but differ through size, mass, momentum, survivability, movement behavior, and corridor access. The design deliberately prefers continuous physical trade-offs over hidden type bonuses and immunities. Weakening, delaying, redirecting, trapping, or ejecting a raider can all be strategically valid outcomes.

## Repository status

Defend is an older playable web game undergoing a deliberate modernization. The repository keeps the historical implementation available while new architecture and gameplay contracts are developed beside it and certified before they are allowed to replace production ownership.

| Area | Role today |
| --- | --- |
| `src/` + root Webpack app | **Playable historical baseline.** BabylonJS 3, Cannon physics, procedural audio, PWA delivery, and the original browser gameplay remain the behavior reference while migration work is validated. |
| [`docs/GAME_DESIGN_MANUAL.md`](./docs/GAME_DESIGN_MANUAL.md) | **Canonical game-design source of truth.** Separates enduring principles, measured/current baseline behavior, and experimental hypotheses. |
| [`docs/design/`](./docs/design/) | **Focused system chapters and experiments** for energy flow, world ecology, mothership/raider play, geothermal power, locomotion, terrain, and related mechanics. |
| [`crates/defend-core/`](./crates/defend-core/) | **Dependency-light deterministic Rust core** for formulas, topology, and contracts that benefit from portable executable tests. |
| [`experiments/storybook/`](./experiments/storybook/) | **Interactive systems laboratory** for deterministic fixtures, design experiments, visual inspection, and behavior certification. |
| [`experiments/hybrid-engine/`](./experiments/hybrid-engine/) | **Architecture experiment, not production migration.** Babylon 9 renders while a headless modular Bevy/Rust WASM runtime owns semantic simulation state. |

### Modernization direction

The current architecture direction is intentionally hybrid rather than a wholesale engine rewrite:

- Babylon.js remains the browser presentation/rendering authority.
- Rust/WASM is introduced where deterministic simulation, testing, portability, or performance justify it.
- Modular Bevy ECS/app/time crates are evaluated as a headless simulation framework without bringing a second renderer into the browser path.
- Physics backends are compared against characterized gameplay behavior before ownership changes.
- Storybook and isolated labs are used to prove contracts before production integration.
- The historical app stays runnable until replacement paths meet parity and certification gates.

See [issue #66](https://github.com/xtreemze/defend/issues/66) for the architecture program and [`docs/LOCAL_CERTIFICATION.md`](./docs/LOCAL_CERTIFICATION.md) for the evidence model used before promotion.

## Explore the project

- **Design:** [`docs/GAME_DESIGN_MANUAL.md`](./docs/GAME_DESIGN_MANUAL.md)
- **Focused design chapters:** [`docs/design/`](./docs/design/)
- **Development invariants and agent guidance:** [`AGENTS.md`](./AGENTS.md)
- **Local certification:** [`docs/LOCAL_CERTIFICATION.md`](./docs/LOCAL_CERTIFICATION.md)
- **Storybook laboratory:** [`experiments/storybook/`](./experiments/storybook/)
- **Hybrid engine laboratory:** [`experiments/hybrid-engine/`](./experiments/hybrid-engine/)
- **Architecture modernization:** [issue #66](https://github.com/xtreemze/defend/issues/66)
- **Open work and design discussions:** [GitHub issues](https://github.com/xtreemze/defend/issues)

## Development entry points

The root application intentionally retains its historical dependency graph during migration. For current certification commands and environment expectations, use [`docs/LOCAL_CERTIFICATION.md`](./docs/LOCAL_CERTIFICATION.md).

Historical browser app:

```sh
npm install --package-lock=false --no-audit --no-fund
npm run dev
```

Deterministic Rust core:

```sh
cargo test -p defend-core
```

Storybook laboratory:

```sh
cd experiments/storybook
pnpm install
pnpm typecheck
pnpm build
pnpm test
```

The hybrid-engine experiment has its own reproducible toolchain and run instructions in [`experiments/hybrid-engine/README.md`](./experiments/hybrid-engine/README.md).

## Development philosophy

Modernization should preserve the mechanics that give Defend its identity rather than preserving obsolete implementation techniques. Gameplay changes, architecture changes, and balance changes should remain reviewable independently where practical, with GitHub issues providing durable design context and experiments providing evidence before promotion.

In particular, preserve the closed energy economy, temporary defenses, physical projectiles and knockback, finite-lived raiders, direct battlefield interaction, procedural presentation, and the ability to reduce presentation cost before sacrificing simulation behavior on constrained devices.

## License

Defend is licensed under the [GNU General Public License v3.0](./LICENSE).
