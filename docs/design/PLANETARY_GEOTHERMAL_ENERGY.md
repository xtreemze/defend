# Planetary geothermal energy and tower power

**Status:** Focused game-design chapter  
**Parent manual:** `../GAME_DESIGN_MANUAL.md`  
**Related:** #29, #72, #73, #76, #79, #82

## Design statement

The defending world is a spherical physical body whose surface rests over a deep teal energy-bearing molten layer. Defensive towers do not create projectile energy. They siphon the same conserved teal material from subsurface reservoirs and convert it into projectiles.

This makes geology, tower placement, firing cadence, local depletion, recovery, migration, and eruptions part of the same physical energy ecology as enemies, the silo, and the mothership.

> **Canonical principle:** energy should always have a visible source, a path through the world, and a physical consequence when concentrated, moved, consumed, or released.

## 1. Planet structure

The world should read as a small spherical planet rather than an infinite plane.

For game purposes the planet contains:

1. a solid inner core / deep structural mass;
2. a teal energy-bearing molten mantle;
3. a comparatively thin solid crust / playable surface;
4. local near-surface magma streams, pockets and vents connected to the deeper mantle.

This is a stylized physical world model rather than a literal Earth geology simulation. The internal layers may be shown through translucent cutaway shells, horizon curvature, scanner/inspection modes, fractures, vents, and exposed cross-sections.

### Rendering rule

Internal layers should be visually available but subordinate to surface play:

- low opacity by default;
- stronger visibility near exposed cracks, eruption events, selected towers, or inspection views;
- no constant bright internal shell that competes with enemies/towers;
- use the same teal family as conserved energy, with depth/temperature communicated through emissive intensity, motion and density rather than unrelated colors.

## 2. Tower power source

### 2.1 No free ammunition

Tower 2 and Tower 3 projectile energy must come from a reachable geothermal source.

Tower 1 remains meaningful as a passive physical barrier and therefore does not require a firing feed merely to exist.

### 2.2 Flexible siphon / conduit

A firing tower connects to nearby magma through a visible flexible conduit, hose, cable or capillary-like siphon.

The conduit:

- has finite maximum length;
- may curve around obstacles and need not be a straight line;
- visually connects the tower base/internals to a surface vent, crack, pool or subsurface access point;
- carries moving teal material/pulses toward the tower when it fires;
- must not become an invisible radius bonus.

**Placement consequence:** a tower can only be built/upgraded into a firing tower when at least one viable geothermal source can be reached within the conduit-length budget.

This introduces spatial scarcity without replacing the existing energy construction cost.

## 3. Local geothermal reservoirs

The molten mantle is enormous relative to a single projectile, but near-surface access is locally finite.

Represent this as a small number of authoritative reservoirs/stream segments rather than individual fluid particles.

Each source should track at least:

- position / path;
- accessible energy amount;
- replenishment connection to deeper mantle;
- local pressure / concentration;
- connected towers;
- recent draw rate;
- depletion duration;
- eruption pressure / instability state.

Visual particle count must not determine economic capacity.

## 4. Projectile consumption

When T2/T3 fires:

1. the tower requests energy from its connected source;
2. teal energy visibly travels along the conduit;
3. the projectile is formed/energized at the tower;
4. the source loses the corresponding amount;
5. the projectile enters the existing physical simulation.

The exact conversion between projectile damage/mass/impulse and geothermal energy is experimental.

### Balance requirement

Do not use geothermal ammunition simply as a second conventional ammo counter. The important decision is **where sustained fire is physically supportable**.

A tower should normally be able to fire through ordinary encounters without constant starvation, while concentrated continuous firing by multiple towers drawing from one small zone can exhaust local access.

## 5. Shared-source depletion

Several towers may connect to the same rich source if conduit length allows.

That creates an intentional trade-off:

- clustered towers are easy to supply initially;
- overlapping fire can be tactically strong;
- sustained simultaneous firing draws the same local reservoir down rapidly;
- a depleted cluster may lose firing capability together.

This prevents the richest geothermal spot from automatically being the universally optimal defensive location.

### Readability

As a source depletes:

- stream thickness decreases;
- surface glow recedes;
- conduit pulses become smaller/slower;
- tower firing may stutter or visibly wait for charge;
- nearby cracks cool/dim;
- audio loses liquid/pressure density.

## 6. Retreat and migration

If a near-surface stream stays depleted for a meaningful period, it can retreat deeper into the mantle.

A depleted access route may therefore disappear rather than instantly refilling in place.

Over longer times the conserved deeper system can open or strengthen another vent/stream elsewhere on the planet.

This produces a slowly changing defensive topology:

- old firing positions can become unsustainable;
- new geothermal opportunities appear;
- tower networks may need adaptation;
- rebuilding becomes spatial strategy rather than merely replacing expired towers in the same cells.

Migration must be slow and legible enough to plan around. Do not randomize the tower-placement map every few seconds.

## 7. Accumulation and eruption

Unused geothermal energy can also become dangerous.

If an accessible zone receives deep-mantle inflow for a long period while little energy is consumed, local pressure/concentration can rise.

Past a tested threshold, an eruption may occur.

### 7.1 Eruption sequence

A readable eruption should develop through stages:

1. local teal concentration increases;
2. ground glow/fracture signals intensify;
3. crust bulges upward;
4. fractures widen and displace surface geometry;
5. the crust ruptures;
6. hot teal energy/magma is expelled as particles/streams/chunks;
7. nearby terrain may remain lifted, cracked or altered after the event;
8. the local reservoir pressure falls sharply.

Avoid a surprise damage circle with no physical warning.

### 7.2 Eruption is faction-neutral

The eruption damages anything in its physical path:

- Raider 1/2/3;
- Tower 1/2/3;
- potentially loose wreckage and other physical objects.

Heat/contact can melt or structurally destroy tower geometry rather than applying an arbitrary anti-tower modifier.

Raiders may be burned, redirected, launched, trapped, or destroyed by the same eruption physics.

### 7.3 Eruption energy recovery

Energy liberated from raiders during an eruption still belongs to the defender-side collection ecology.

It spills onto the surface and flows toward the silo using the same conserved-energy rules as projectile-hit recovery.

Eruption material itself should not automatically become free silo income merely because it surfaced. Distinguish:

- geothermal energy still belonging to the planet/source system;
- energy liberated from raider bodies;
- energy already owned by the silo/mothership.

Ownership must remain explicit.

## 8. Eruptions as strategy, not random punishment

Eruptions should create planning rather than roulette.

Players may intentionally influence pressure by:

- placing firing towers near a rich zone and consuming energy;
- avoiding a volatile source;
- spreading draw across several sources;
- allowing a zone to build pressure because an eruption could disrupt a likely raid path.

But eruption farming must not become the dominant defense strategy.

Possible balancing constraints:

- long telegraph time;
- uncertain but bounded fracture footprint;
- equal danger to towers;
- local source retreat after eruption;
- temporary loss of good tower-supply territory;
- structural terrain changes.

## 9. Spherical surface gameplay

The planet should eventually become geometrically spherical in simulation/presentation, but that does not require converting all gameplay immediately.

### Staged approach

1. **Visual sphere/cutaway PoC:** prove crust/mantle/core language and local geothermal streams.
2. **Local tangent arena:** existing gameplay remains approximately planar in a small surface patch while curvature is visible at distance.
3. **Spherical coordinates / gravity:** entities use local surface normal and gravity toward planetary center.
4. **Multiple sectors:** raids and defenses can occur at different surface regions.
5. **Strategic planet view:** mothership selects sectors from orbit without turning the game into a menu-heavy globe interface.

A local tangent-plane implementation is acceptable during modernization if the player-facing physical relationships remain consistent.

## 10. Tower placement contract

A proposed tower placement should expose geothermal viability before commitment.

For a firing tower show:

- candidate source(s);
- conduit route;
- route length versus maximum;
- approximate source richness/pressure;
- existing draw by other towers;
- whether the source is depleted/retreating/volatile.

This should be represented primarily in-world with the conduit and source visualization, supported by minimal UI.

### Placement validity

Experimental initial rule:

`valid firing tower = valid surface cell + construction energy available + geothermal conduit route within maximum length`

Do not make the conduit perfectly straight if a short curved path around simple geometry is still within the length budget.

## 11. Tower lifecycle interaction

Temporary tower aging remains important.

A geothermal source does not make a tower permanent.

When a tower degrades/dies:

- its conduit disconnects/retracts;
- its draw stops;
- the source begins recovering/pressurizing according to the local geology state;
- the same access point can potentially support a later structure.

This couples architectural decay with a slowly evolving resource field.

## 12. Defender economy relationship

Geothermal tower power and silo energy serve different immediate roles but represent the same material family.

Avoid turning them into two unrelated currencies.

Suggested conceptual separation:

- **silo reserve:** mobile/owned energy used for construction, survival and strategic transformation;
- **planetary geothermal energy:** locally accessible environmental energy used primarily to form/fire tower projectiles;
- **liberated raider energy:** becomes collectable surface energy and then silo reserve once it arrives.

The player should understand these distinctions from physical location and flow, not from blue-mana/red-ammo UI bars.

## 13. Raider-side implications

Raiders can exploit geothermal topology without gaining artificial anti-generator abilities.

Examples:

- attack through a sector supplied by one overdrawn source;
- force several towers to fire until local access collapses;
- use R3 mass to disrupt exposed conduit geometry where physically appropriate;
- choose drop sectors where tower coverage is poorly supplied;
- exploit an impending eruption or deliberately avoid it.

This gives raid planning information beyond tower count.

## 14. Audio

Geothermal energy should be object/spatial audio consistent with the broader design:

- subsurface low-frequency flow localized beneath the listener;
- conduit pulses that move from source to tower;
- pressure/boiling cues increasing before eruption;
- crust strain positioned at actual fracture zones;
- eruption roar/spray derived from position, pressure and expelled mass;
- Doppler/fly-by for fast ejected material where relevant.

Priority should scale with distance and tactical importance.

## 15. Performance architecture

Do not simulate a full volumetric mantle fluid at gameplay resolution.

Authoritative system:

- low-count reservoir graph / stream segments;
- scalar energy/pressure values;
- conduit ownership/routes;
- deterministic depletion/replenishment/migration transitions;
- sparse eruption events.

Presentation system:

- low-poly ribbons/tubes;
- procedural particles;
- emissive translucent shells;
- optional GPU effects;
- LOD/visibility culling for subsurface layers.

This separation lets the planet feel alive without making fluid simulation the frame-time owner.

## 16. Certification matrix

Before production integration measure:

### Placement
- candidate tower near/far from source;
- curved route versus straight-line distance;
- invalid over-length placement;
- multiple towers on one source;
- reconnect after tower degradation.

### Depletion
- T2 sustained fire alone;
- T3 sustained fire alone;
- mixed T2/T3 cluster;
- recovery after firing stops;
- retreat after prolonged depletion;
- new source emergence.

### Eruption
- telegraph duration/readability;
- crust displacement;
- tower damage/melting;
- R1/R2/R3 physical response;
- liberated-raider-energy collection;
- post-eruption source state;
- performance at peak particle count.

### Planet presentation
- surface readability with internal layers visible;
- opacity/LOD at normal play distance;
- horizon/curvature readability;
- camera comfort;
- accessibility when teal color cannot be relied upon alone.

## 17. Non-goals

Do not turn the system into:

- Minecraft-style resource mining;
- manually routed factory plumbing;
- dozens of geothermal resource types;
- a conventional ammo stockpile UI;
- unpredictable unavoidable volcano damage;
- full scientific geophysics simulation;
- an excuse to remove the original tower aging/economy loop.

The purpose is to make tower fire physically sourced, create meaningful spatial placement constraints, and deepen the conserved-energy ecology.