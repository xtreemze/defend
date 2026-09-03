# Tower Deployment, Geothermal Drilling, Turret Slew, and Deformable Terrain

**Status:** focused game-design chapter  
**Parent:** `docs/GAME_DESIGN_MANUAL.md`  
**Related:** #29, #72, #82, #86, #88, #89

---

## 1. Purpose

Defensive structures should feel constructed into a living physical planet rather than spawned onto a flat board.

This chapter defines four connected rules:

1. tower placement is permissive, while geothermal firing power is discovered after placement;
2. tower construction and upgrades are visible staggered physical processes;
3. turrets have finite angular acceleration and slew rather than snapping to targets;
4. the surface is subtly deformable and records foundations, volcanic activity, raider impacts, and missed shots.

These rules make geology, time, mass, maintenance, and player placement decisions visible in the world.

---

## 2. Placement is not power availability

### Canonical principle

A tower may be placed wherever the surface can physically support its footprint. A geothermal source is **not** a placement prerequisite.

For T2/T3, construction includes a subsurface drilling/siphon phase after the base is established.

The tower searches:

- downward first;
- then through a bounded local subsurface radius;
- for a reachable active teal magma/energy stream.

If the search succeeds, the siphon bends through the subsurface toward the source and the tower becomes powered.

If it fails:

- the tower remains built;
- it remains an obstacle;
- it continues aging;
- it may still shape raider routes and surface-energy drainage;
- its turret may track targets for feedback, but it cannot fire;
- its exposed energy path remains dark or visibly dry.

This distinction is important: **construction guarantees structure, not ammunition supply.**

T1 has no firing requirement and therefore does not require a geothermal feed.

---

## 3. Drill search and conduit behavior

The drill should not behave as a straight-line ray that either succeeds or fails instantly.

A readable deployment sequence can show:

1. a central probe descending beneath the foundation;
2. one or more short lateral probing branches or a searching curved tip;
3. teal response when an active source enters search range;
4. the final flexible siphon growing into the discovered source;
5. the energy path filling from source to tower.

The final conduit may curve and need not be straight. Its route is constrained by a finite total length/reach budget.

Search should use low-count geothermal graph/state data rather than simulating literal drilling through thousands of terrain voxels.

### Source movement

A connection can later fail because its local geothermal stream depletes or retreats under #82.

That should not destroy the tower immediately. The tower enters an unpowered/dry state and can continue functioning as physical geometry.

---

## 4. Maintenance and renovation retry

Maintenance/renovation should trigger another geothermal search for T2/T3.

This creates a useful long-timescale interaction with geothermal migration:

- a tower built in a dry location may become useful later;
- a formerly powered tower may reconnect to a new nearby stream;
- the player can deliberately preserve a strategically placed dry structure while waiting for geology to change;
- renovation becomes more than resetting an age timer.

A retry should still obey the same finite drill/conduit reach. Renovation must not magically connect a tower across the planet.

Recommended visible feedback:

- old dry conduit retracts or goes dark;
- drill mechanism reactivates;
- probing motion resumes;
- successful discovery produces an obvious teal fill/reconnection pulse;
- failed discovery ends in a quiet dormant state rather than repeated visual spam.

Automatic retry may happen at long intervals, but active player maintenance should be the clear intentional retry action.

---

## 5. Staggered construction language

### Canonical principle

Tower construction and upgrading should never be represented as all geometry appearing on the same frame.

The build sequence communicates tower identity and tier.

A common visual grammar:

1. **ground contact** — foundation marker/footprint appears and settles;
2. **terrain stabilization** — local surface subtly shifts toward a support plane;
3. **base growth** — blocky foundation unfolds or rises in stepped sections;
4. **geothermal probe** — T2/T3 drill descends;
5. **pillar growth** — firing tower support rises from the base;
6. **turret assembly** — turret pieces grow/rotate/lock into place;
7. **internals exposed** — braces, energy path, and mechanical gaps remain visible;
8. **power fill** — if connected, teal energy rises through the conduit/internal path;
9. **initialization sweep** — turret moves through a small restrained calibration arc;
10. **rest** — turret settles pointing away from the silo until a target is acquired.

T1 stops after the foundation/base sequence and should read immediately as a barrier rather than an incomplete gun.

---

## 6. Tier-specific deployment identity

### T1 — Barrier

- shortest deployment;
- strongest emphasis on ground contact and foundation spreading;
- no drill, pillar, turret, or power-fill sequence;
- visually communicates that it is terrain/route control.

### T2 — Interceptor

- brisk mechanical sequence;
- drill search begins early;
- pillar and turret can overlap slightly in time;
- turret components assemble in several quick staggered movements;
- first powered motion feels responsive.

### T3 — Siege Cannon

- heavier and slower sequence;
- foundation settles more deliberately;
- larger drill/siphon visibly engages;
- pillar rises in heavier stages;
- turret assembly has more inertia and fewer but larger movements;
- final calibration/slew should make its mass obvious.

Deployment timings remain experimental, but the player should be able to identify the tier from the construction motion even without UI text.

---

## 7. Rest heading: away from the silo

An idle firing tower should not point along an arbitrary global axis.

Its natural rest heading is the horizontal direction from the silo through the tower and outward.

This has three benefits:

- the fortress visually looks outward toward expected threats;
- newly built towers appear intentionally oriented rather than randomly aligned;
- their initial acquisition time becomes spatially meaningful.

A tower on the north side of the silo should generally rest facing north; one on the west side should generally rest west.

The rest pose need not be mathematically exact. Small procedural offsets can avoid sterile perfect symmetry, provided the dominant direction remains outward.

---

## 8. Finite turret slew

### Current baseline

The legacy turret computes a predicted target heading and effectively applies `lookAt()` immediately. This produces visually impossible target snapping.

### Canonical direction

Targeting chooses a **desired heading**. The turret then physically slews toward it.

Turret state should include at least:

- current yaw/pitch;
- target yaw/pitch;
- angular velocity;
- angular acceleration limit;
- maximum slew rate;
- braking/damping;
- aim tolerance required to fire.

The system should use shortest-angle rotation and should not teleport across the wrap boundary.

### T2 versus T3

T2 is the responsive interceptor:

- higher angular acceleration;
- higher maximum slew rate;
- tighter reacquisition against small moving targets.

T3 is the heavy siege cannon:

- lower angular acceleration;
- lower maximum slew rate;
- longer settle time after large target changes;
- greater punishment for rapidly switching between opposite sectors.

This strengthens their tactical identities without changing nominal DPS.

---

## 9. Aim tolerance and firing readiness

A tower should not fire merely because its cooldown expired while its barrel is still crossing the battlefield.

Recommended firing gate:

- target exists and is valid;
- tower is geothermal-powered;
- tower is not in deployment/maintenance state;
- cooldown is ready;
- line-of-fire rule is satisfied when enabled;
- angular error is below an experimental firing tolerance.

This makes acquisition time a real part of tower performance.

A T2 can therefore be better against R1 not through a hidden damage multiplier but because it can physically reacquire small fast targets more effectively.

A T3 remains powerful against large predictable R2/R3 trajectories and distant threats but can waste time traversing between separated targets.

---

## 10. Predictive aiming remains useful

Finite slew should not remove the existing predictive-target idea.

The target solver can still estimate a future intercept position using enemy velocity and projectile characteristics. The difference is:

- target solver produces a desired orientation;
- turret dynamics approach that orientation over time;
- firing occurs only when the real barrel is sufficiently aligned.

Prediction accuracy, slew inertia, projectile travel, and raider motion therefore interact naturally.

---

## 11. Terrain is subtly deformable

### Canonical principle

The battlefield surface should not remain a perfectly flat immutable plane.

Elevation variations should remain subtle enough that the arena reads clearly, but significant enough to influence:

- energy drainage;
- spherical raider motion;
- foundation seating;
- geothermal exposure;
- projectile impact history;
- eruption geometry.

The terrain is not a voxel sandbox. Deformation is bounded, smooth, and strategically legible.

---

## 12. Foundation stabilization

Creating a tower or wall stabilizes a bounded area beneath and immediately around its foundation.

The intended operation is approximately:

1. sample terrain heights under/near the footprint;
2. compute a local representative/average support height;
3. gently move nearby terrain toward that height with radial falloff;
4. preserve some pre-existing slope at the outer edge;
5. place the structure on the resulting support plane.

This should remove severe local bumps that would make blocky foundations visually float or clip, while preserving the broader landscape.

### Not full flattening

Foundation stabilization must not erase drainage design.

A wall placed across a shallow channel may partially stabilize its immediate footprint, but it should not flatten an enormous region or fill an entire valley.

The player should not gain unrestricted terrain sculpting simply by repeatedly placing/removing walls.

Possible protections:

- bounded radius;
- maximum per-build height delta;
- diminishing changes on already stabilized terrain;
- restoration/recovery rules after structure removal only where appropriate.

---

## 13. Surface changes from volcanic activity

Geothermal pressure and eruptions can deform terrain upward before failure:

- subtle swelling;
- raised seams;
- cracking;
- localized bulge;
- rupture and post-eruption depression or displaced material.

The deformation should feed the same terrain representation used for movement and energy drainage rather than being purely visual.

A pre-eruption bulge may therefore change a stream route or alter the approach of spherical raiders before the eruption actually occurs.

---

## 14. Raider drop and collision deformation

Large incoming bodies should be able to leave limited physical evidence.

Candidate effects:

- hard R1 drop: tiny compression mark;
- R2 impact: visible shallow depression;
- R3 hard landing/collision: broader deformation with stronger radial falloff.

Do not deform terrain merely because a raider is resting on it. Deformation should correspond to meaningful impact energy/normal velocity.

This should use the same bounded deformation model as other impacts.

---

## 15. Missed projectile terrain impacts

Tower projectiles are physical bodies. A projectile that misses its target and hits the ground should not disappear without consequence.

It should create a small indentation whose profile derives from physical impact variables such as:

- projectile mass;
- normal impact speed;
- effective radius;
- terrain compliance/stabilization;
- hard depth cap.

The reusable terrain-deformation contract merged with #88 should be treated as the mathematical seam for this behavior.

### T2 miss

Expected presentation:

- small sharp impact;
- modest indentation;
- brief debris/energy flash;
- limited lasting topology change.

### T3 miss

Expected presentation:

- larger impulse and wider disturbed area;
- deeper but still bounded crater;
- visibly meaningful terrain scar;
- possible small route/drainage consequence after repeated nearby misses.

This gives heavy fire a physical accuracy cost without inventing a numerical miss tax.

---

## 16. Repeated-impact saturation

Repeated impacts at the same location must not produce unbounded excavation.

The terrain model should include:

- hard maximum depression depth;
- diminishing additional deformation as the cap is approached;
- optional slow recovery/settling where appropriate;
- local stabilization resistance around structural foundations.

A battlefield can become scarred, but should remain playable and computationally bounded.

---

## 17. Structural stabilization versus impact

A foundation should make the terrain immediately beneath it harder to deform than open ground.

This does not make towers immune to eruptions or direct damage. It means a small nearby projectile miss should not cause a rigid tower to hover over a newly formed crater.

Recommended model:

- foundation footprint has increased stabilization/resistance;
- deformation falls off as it approaches the supported footprint;
- sufficiently strong eruption/large-body events can still exceed this resistance and move/damage/melt the structure.

This preserves visual coherence while maintaining faction-neutral physical hazards.

---

## 18. Interaction with energy drainage

Every terrain change can alter the energy-flow field.

Examples:

- a stabilized wall foundation can slightly divert a rivulet;
- a missed T3 projectile can create a shallow basin that temporarily pools energy;
- repeated impacts can create a new low route toward the silo;
- volcanic uplift can block an old drainage path;
- an eruption fracture can open a new one.

Flow/navigation data should update on terrain topology changes rather than every visual frame.

---

## 19. Interaction with raider locomotion

The same updated terrain affects raiders:

- R1 can exploit new low paths quickly;
- R2 may choose a crater/gap as a lower-cost route;
- R3 naturally rolls/presses along broad slopes and depressions;
- large craters can become temporary traps or turning constraints.

Navigation must not ignore deformation simply because the visual surface changed after the nav state was generated.

---

## 20. Interaction with geothermal search

Surface deformation and magma movement are related but should remain computationally separable.

The drill searches a coarse geothermal reservoir/stream graph in subsurface coordinates. Surface height changes affect:

- starting drill depth;
- visible conduit length;
- possible exposure of near-surface streams;
- eruption state.

A tiny projectile crater should not require rebuilding a full mantle simulation.

---

## 21. Player readability

The player should be able to infer tower state from the world.

Suggested states:

### Building
- pieces visibly assembling;
- no firing.

### Searching
- drill/siphon animated;
- intermittent teal probing cues.

### Powered
- continuous or pulsed teal path from subsurface source through exposed internals;
- turret active.

### Dry/unpowered
- structure complete;
- conduit dark/retracted;
- turret can rest/track but does not fire;
- no need for large error text during ordinary play.

### Renovating
- localized structural activity;
- drill retry visibly restarts.

---

## 22. Performance architecture

Avoid rebuilding a high-resolution planet mesh for every impact.

Recommended architecture:

- authoritative low/medium-resolution height/displacement field;
- bounded deformation stamps/regions;
- dirty-region normal/bounds updates;
- coarse collision/nav/flow updates at topology-change cadence;
- visual interpolation/detail layer separate from gameplay resolution;
- deformation history compacted into the height field rather than retained as unlimited event objects.

Foundation stabilization and impact deformation should share this surface authority.

---

## 23. Prototype values versus production balance

The following remain experimental:

- drill search radius/depth;
- number/type of visible probing branches;
- construction phase durations;
- T2/T3 angular acceleration;
- maximum slew speed;
- aim tolerance;
- foundation stabilization radius/strength;
- natural terrain amplitude;
- crater depth/radius;
- recovery/settling rate.

Do not promote laboratory constants as campaign balance without measurement.

---

## 24. Required certification fixtures

### Deployment
- build T1/T2/T3 side by side;
- identify tier from motion with labels hidden;
- verify no firing before deployment completes.

### Drilling
- source directly below;
- source near edge of search range;
- no source in range;
- source migrates into range after dry build;
- maintenance retry connects successfully;
- connected source later retreats.

### Turret dynamics
- static target front/rear;
- R1 lateral crossing;
- rapid target switch across ~180 degrees;
- T2 versus T3 acquisition time;
- cooldown-ready while aim is outside tolerance.

### Terrain
- foundation on mild slope;
- several adjacent foundations;
- drainage channel beside foundation;
- T2 miss;
- T3 miss;
- repeated impacts to saturation;
- R3 hard drop;
- volcanic uplift followed by eruption.

Measure geometry displacement, acquisition time, angular acceleration/rate, aim error at firing, source connection outcome, deformation depth/radius, drainage route changes, locomotion changes, and frame-time cost.

---

## 25. Design test

A successful implementation should make the following statement true without relying on explanatory UI:

> The player can watch a tower establish itself in the terrain, understand whether it found power, see its mass when it turns, and later read the history of combat and geology in the shape of the ground around it.
