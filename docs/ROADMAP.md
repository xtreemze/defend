# Defend development roadmap

This document is the canonical integration roadmap for Defend. It answers four questions for maintainers and AI executors:

1. What game are we building?
2. What architecture is allowed to own each responsibility?
3. What is the minimum complete playable target?
4. In what order should implementation be promoted?

It does **not** replace the [Game Design Manual](./GAME_DESIGN_MANUAL.md), focused design issues, or certification evidence. It connects them into one implementation sequence so parallel work does not accidentally create competing architectures or partial versions of the game.

## Source-of-truth hierarchy

When documents overlap, use this order:

1. **Game identity and durable design rules:** [`GAME_DESIGN_MANUAL.md`](./GAME_DESIGN_MANUAL.md) and explicit later design decisions recorded in GitHub issues.
2. **Integration order, MCP scope, and cross-system development priorities:** this roadmap.
3. **Modernization coordination and invariants:** issue #29.
4. **Hybrid engine architecture:** issue #66.
5. **Causal legibility, conservation, deterrence, and inversion refinement:** issue #103.
6. **Layered attacker belief/economics/deterrence integration:** issue #128.
7. **Local/runtime certification:** [`LOCAL_CERTIFICATION.md`](./LOCAL_CERTIFICATION.md) and the live local-executor queue in issue #92.
8. **Focused implementation issues and PRs:** authoritative for their owned seam only after required evidence and promotion gates are satisfied.

Experimental implementation does not become canonical merely because it exists in a branch or Storybook fixture.

Exact dependency versions written inside older planning issues are historical snapshots. Repository toolchain files, lockfiles, manifests, and explicitly approved upgrade PRs are the authority for the version actually being certified.

## Product direction

Defend is a physics-driven strategy game about finite energy, temporary defenses, and the economic consequence of successful deterrence.

The project is not being modernized into a conventional lane-based tower-defense game, damage-per-second optimization game, or menu-heavy RTS. The defining loop remains:

`finite energy -> physical defensive commitment -> combat / delay / displacement -> conserved recovery or loss -> attacker adaptation -> deterrence -> reduced incoming investment -> strategic starvation -> defender/raider inversion`

The game should communicate this loop primarily through geometry, motion, sound, visible energy flow, world residue, and repeated systems rather than hidden modifiers or explanatory HUD layers.

## Architecture contract

The target browser architecture is deliberately hybrid:

- **Babylon.js** owns browser rendering, camera, picking, input integration, WebGL/WebGPU presentation, accessibility integration, Inspector diagnostics, and interpolation of authoritative simulation snapshots.
- **Rust/WASM with modular Bevy crates** owns deterministic fixed-step semantic simulation where it improves correctness, portability, testing, or performance.
- **One physics authority** owns authoritative collision/integration. Rapier is the leading candidate, but production ownership follows comparative evidence rather than preference. Babylon/Havok may remain a benchmark/control path.
- **Web Audio / AudioWorklet** owns browser audio rendering. Procedural/spatial audio objects originate from semantic simulation state; an ordinary Worker may perform lower-rate prioritization/control planning.
- **Workers are advisory system lanes**, not alternate authorities. Combat targeting, AI planning, and audio planning may run in persistent batched workers when profiling justifies the boundary. Every result is tick-stamped and revalidated by authoritative simulation before it can affect gameplay.
- **SharedArrayBuffer is optional**, never a baseline requirement. Start with explicit structures and transferable typed arrays; optimize transport only after measurement.
- **The historical application remains runnable** until the replacement path reaches behavioral parity and certification. Migration is by subsystem seam, not a repository-wide rewrite.

The browser must never run two production 3D render authorities or two competing physics authorities for the same world.

## Minimum Complete Playable (MCP)

The MCP is the smallest build that expresses Defend's complete systemic meaning from both sides of the conflict. A technically playable defense sandbox is not enough.

A certified MCP contains:

- one complete battlefield with a central finite reserve, meaningful placement topology/geometry, and at least one energy source;
- the three defensive physical roles: barrier/delay, responsive interception/control, and heavy committed displacement;
- R1/R2/R3 raiders differentiated by physical/temporal behavior rather than hidden type bonuses;
- authoritative projectile collision, impulse, knockback/ejection, finite raider viability, breach, and extraction;
- a conserved energy loop in which attacker investment, loose/recoverable teal energy, collection, loss/dissipation, tower expenditure, and extraction reconcile without particle-count economics;
- temporary tower lifecycle/degradation and the resulting maintenance pressure;
- causally legible interaction and world feedback: important outcomes provide anticipation, visible causation, and residue;
- adaptive attackers that reason from lossy observable evidence rather than omniscient fortress state;
- emergent progression from contested attacks through adaptation/probing into deterrent quiet and strategic starvation, without a scripted wave cutoff;
- a defender-to-raider/mothership inversion that reuses the same energy, physics, tower, raider, and risk model;
- a finite outcome after the inversion so a player can complete one systemic conflict and reinterpret the first half through the second.

MCP certification question:

> Can one player complete both sides of a single systemic conflict and understand, primarily through the simulation itself, why increasingly successful defense reduced incoming investment and eventually pushed the same scarcity logic onto the attacking side?

Multiple campaigns, many biomes, large progression trees, multiplayer, extensive narrative exposition, large content libraries, final cosmetics, and every planned terrain/audio phenomenon are post-MCP expansion unless they become necessary to prove the core loop.

## Implementation sequence

### Phase 0 — certify the development foundation

Establish one reproducible modern workspace before promoting additional architecture.

Current dependency order:

- #163: combined modern pnpm workspace + safe Rust baseline certification assembly;
- #169: root Cargo-workspace consolidation, explicitly after #163;
- #162: hosted CI/smoke infrastructure where it complements rather than replaces local runtime certification;
- #155: Dependabot policy for the maintained modern workspace after workspace/lockfile ownership is stable;
- deliberate Babylon/tooling upgrades follow the certified workspace rather than bypassing it.

Gate: a fresh local executor can reconstruct the modern workspace using pinned tools and committed lockfiles, run deterministic/unit/build checks, exercise browser fixtures, and attach evidence to the exact tested head.

### Phase 1 — establish one deterministic simulation authority

Promote the smallest real `defend-core` / `defend-runtime` path that owns semantic state independent of Babylon objects.

Required seams:

- stable external entity identity;
- fixed simulation ticks;
- versioned snapshot/event protocol;
- spawn/despawn/lifecycle events;
- transforms and velocities;
- energy/economy events;
- replay seed and deterministic fingerprints;
- Babylon presentation consumes/interpolates snapshots and does not mutate authoritative state directly.

Gate: repeated seeded runs produce equivalent semantic state and presentation can be destroyed/recreated without changing simulation outcome.

### Phase 2 — measured system-level parallelism

PR #197 is the current prototype substrate. #195 owns measured combat/AI integration and #196 owns spatial/procedural audio integration.

Target lanes:

- combat Worker: batched target acquisition, intercept/lead, later LOS/ranking;
- AI Worker: batched neighborhood/perception/steering/utility planning;
- audio Worker: lower-rate source importance, virtualization, Doppler/control preparation;
- AudioWorklet: hard-real-time procedural sample rendering and declicking.

Gate: compare synchronous/main-thread and worker paths at representative 128 / 500 / 1000+ body/emitter counts. Worker output must remain advisory, stale results must fail closed, worker failure must not stall the simulation, and the boundary must demonstrate value where messaging overhead is material.

Do not create a Worker per entity.

### Phase 3 — select and integrate authoritative physics

Use the shared fixture to compare candidate ownership paths, especially Rust Rapier vs transitional JS Rapier and Babylon/Havok control behavior.

The chosen path must preserve Defend-specific mechanics:

- mass/inertia differences;
- projectile impulse;
- knockback and ejection;
- collision/obstruction;
- finite-lived raiders where delay matters;
- terrain/geometry interaction;
- deterministic or reproducible-enough certification behavior.

Gate: one physics authority passes characterized fixtures and replaces legacy ownership only for a certified vertical slice.

### Phase 4 — build the first authoritative defensive vertical slice

Do not independently productionize every planned subsystem. Build one causal chain end to end:

`energy source -> finite defender reserve -> tower deployment/operation -> physical projectile/impulse -> raider damage/delay/displacement/expiry -> released embodied energy -> geometry-dependent drainage -> collection into reserve -> breach/extraction`

Integrate the interaction contracts and role distinctions rather than using placeholder DPS semantics.

Gate: a player can predict and explain representative outcomes using the physical world, all three tower roles have contextual utility, and reserve accounting reconciles.

### Phase 5 — make the conflict economy physically conserved

Promote the conserved settlement work only after its experimental contracts are certified/reconciled.

Required principles:

- raiders carry bounded embodied committed energy;
- combat cannot create unbounded resource through repeated damage;
- loose energy only credits the defender when physically collected;
- successful breaches extract finite target-bounded value;
- defender recovery, attacker returned capital, captured capital, stranded/lost/dissipated energy, and operating cost reconcile;
- geometry may improve defense while worsening resource recovery.

Gate: representative encounter and long-horizon fixtures conserve the intended quantities and intentional breach farming does not dominate competent defense.

### Phase 6 — integrate evidence-based adaptive attackers

Compose the layered model from #128:

`world truth -> observable evidence -> contextual belief -> expected-value/probe decision -> physical raid -> conserved settlement -> observable outcome -> belief update`

The attacker must not receive authoritative hidden fortress state. Approach/tier/sector knowledge remains contextual so one failed route does not reveal every possible route.

Gate: seeded headless sweeps generate adaptation, probing, quiet, stale-information re-probes, and renewed commitment after genuinely better evidence without scripted state transitions or invisible underdog bonuses.

### Phase 7 — certify deterrence and strategic starvation

Use the integrated physical economy and attacker model to prove the campaign hinge:

`competent defense -> rising perceived attack cost -> reduced heavy commitment -> cheaper probes -> deterrent quiet -> reduced captured incoming investment -> maintenance pressure -> strategic starvation`

Gate: players can infer this causal chain without a permanent numeric confidence/ROI meter and without suspecting that spawning has simply broken.

### Phase 8 — implement the raider/mothership inversion

Reuse the same systemic language from the opposite side.

High-agency pre-commitment decisions include tier, insertion point, initial vector, timing/spacing/formation, and whether to risk additional bodies. Post-deployment intervention remains sparse and physically/economically legible rather than continuous RTS puppetry.

Mothership movement, deployment, survival, and extraction must consume the same finite-energy logic rather than use a separate attacker-only economy.

Gate: the player recognizes the relationship between the original raiders and their new strategic position through reused mechanics, not exposition.

### Phase 9 — complete MCP world memory and certification

Promote bounded world residue so history remains visible: impacts, wrecks, depleted regions, fortress remnants, stranded-energy evidence, and consequential hulks where appropriate.

Run full MCP certification across deterministic simulation, browser presentation, interactions, accessibility equivalents, spatial/procedural audio, performance tiers, replay evidence, and both campaign perspectives.

Only after this gate should the legacy implementation be considered eligible for retirement as the primary gameplay path.

## Current critical path

The immediate priority is not breadth. It is to get from experiments to **one certified causal vertical slice** while preserving the eventual full MCP dependency chain.

1. Stabilize/certify the modern workspace and toolchain (#163, then dependent workspace work).
2. Reconcile and certify the parallel-worker prototype (#197), then measure #195/#196 rather than assuming more threads are automatically better.
3. Establish the authoritative fixed-step semantic boundary and select physics ownership through fixtures.
4. Implement the defensive vertical slice through real conserved collection/extraction.
5. Feed its observable outcomes into the layered attacker model (#128).
6. Prove deterrence/starvation behavior before adding campaign breadth.
7. Reuse the same systems for the raider/mothership inversion and finish MCP certification.

This order intentionally prioritizes `deterministic authority -> measured parallelism -> physical causation -> conserved economy -> intelligible interaction -> adaptive AI -> deterrence/starvation -> inversion -> polish/expansion`.

## Promotion rules for parallel work

A substantial PR should advance one dependency or evidence gate in this roadmap and clearly state its ownership boundary.

- A lab may explore alternatives without implying a production decision.
- A production integration PR should identify which roadmap phase/gate it advances.
- Gameplay, architecture, balance, and presentation changes should remain reviewable independently where practical.
- Runtime-sensitive work stays draft until required evidence is attached to the current head SHA.
- Mechanically mergeable is not equivalent to certified.
- New broad systems should not bypass an unresolved prerequisite merely because they can be implemented in parallel.
- If concurrent work changes a shared seam, update the relevant issue/PR description rather than allowing documented ownership to drift from the actual diff.

## Guardrails

Until evidence explicitly changes them:

- no second production renderer beside Babylon;
- no duplicate physics authority;
- no worker-side mutation of authoritative ECS state;
- no SharedArrayBuffer/COOP/COEP requirement for baseline play;
- no hidden global `fortressStrength` oracle;
- no scripted `stop spawning after N wins` deterrence shortcut;
- no separate probe currency or attacker-only economic cheat;
- no unbounded energy generation from combat;
- no damage-type rock-paper-scissors or RPG progression added merely to manufacture depth;
- no menu-heavy control layer replacing direct physical interaction;
- no big-bang legacy rewrite before parity evidence;
- no retirement of the historical path before the replacement satisfies the relevant certification gates.

## Definition of alignment

The project is aligned when architecture, game design, experiments, PR descriptions, and implementation all agree on these boundaries:

- Babylon presents; deterministic simulation decides.
- Physics is causal gameplay, not decoration.
- Workers advise; authoritative simulation validates.
- Audio rendering is real-time isolated; semantic audio remains part of the world model.
- Energy is conserved strategic substance, not an arbitrary reward counter.
- Attackers adapt from evidence, not hidden knowledge.
- Perfect defense has an intelligible economic consequence.
- The raider half reuses the defender half instead of becoming a different game.
- Expansion follows a certified complete systemic loop rather than substituting breadth for coherence.
