# Raid planning and mothership navigation

**Status:** Focused game-design chapter  
**Parent manual:** `../GAME_DESIGN_MANUAL.md`  
**Related:** #29, #72, #73, #74, #79, #80, #83

## Design statement

The raider phase should feel like commanding a finite-energy physical vessel above a spherical defended world, not selecting units from an RTS bar. The mothership has weight, inertia, limited hover energy, an exclusion relationship with the defending silo, and a short planning horizon for the next three raid sets.

The player chooses what to commit and approximately where to commit it; physics and AI then resolve the consequences.

## 1. Three-set raid planning horizon

The mothership may define the composition of the upcoming **three raid sets**.

Each set can specify, at minimum:

- number of R1 / R2 / R3 bodies;
- relative formation/spacing where applicable;
- intended target sector / insertion region;
- launch timing or hold state.

The purpose is not to queue a long build order. Three sets provide enough planning depth to create feints, pressure, and follow-through while preserving immediacy.

### Example tactical patterns

- R1 probe → R2 breaker → R3 commitment;
- R1 swarm → hold → R1/R2 exploitation;
- R3 route disruption → R1 follow-up → R2 cleanup;
- hold → hold → single carefully timed expensive raid.

## 2. Opting not to raid

The player may deliberately leave one or more upcoming raid slots empty / on hold.

This is strategically meaningful because:

- hover still consumes mothership energy;
- enemy defenses may age or geothermal conditions may change;
- waiting can allow an eruption to pass;
- waiting can allow a defender source to recover, which may be bad;
- waiting may preserve raider construction energy for a better sector;
- indefinite waiting still loses because the mothership reserve is finite.

A hold is therefore a tactical decision, not a free pause.

## 3. Commitment semantics

Energy committed to constructing a raider should be visible leaving the mothership core.

Once launched, that energy is embodied in the raider and is no longer free reserve.

Use the conceptual accounting already established for the mothership:

- total energy;
- free reserve;
- committed/in-transit energy;
- critical lift reserve.

Do not expose these as four currencies unless testing proves necessary. The central core and launch sequence should communicate most of the state.

## 4. Mothership movement is physical

The camera is attached to a physical mothership, so camera movement must inherit the vessel's mass and inertia.

### Input contract

The player selects a desired orbital/surface-relative position by tapping/clicking a sector or moving a target reticle.

That action does **not** teleport the camera or ship.

Instead:

1. input sets a desired mothership target position;
2. propulsion applies bounded acceleration toward it;
3. velocity persists;
4. damping/steering corrects overshoot;
5. movement consumes a small amount of teal reserve;
6. the camera follows/orbits the actual moving ship.

This should feel heavy and deliberate without becoming sluggish or nauseating.

## 5. Camera inertia

Camera motion should be derived from mothership motion but may use a damped visual rig to preserve comfort.

Recommended hierarchy:

- authoritative mothership transform;
- camera anchor attached to mothership;
- spring/damped offset from anchor;
- player orbit/look adjustment around that anchor within limits.

Do not let the camera instantly jump to the tapped sector while the ship remains behind.

### Comfort constraints

- avoid abrupt roll tied directly to every steering correction;
- limit camera angular acceleration;
- provide reduced-motion / steadier-camera option without changing ship physics;
- preserve horizon/surface orientation cues;
- avoid forced cockpit view.

## 6. Silo exclusion / attraction rule

The mothership cannot safely fly directly above the defending silo.

### Physical rationale

The same teal material tends to coalesce/pool. The silo is deeply rooted into the planet and coupled to a much larger grounded energy system. A mothership carrying exposed mobile teal reserve that enters the silo's strongest attraction region cannot maintain stable separation; the grounded silo system overpowers the mothership's finite suspension/propulsion.

This is a world rule, not an arbitrary no-fly cylinder.

### Gameplay rule

Define an exclusion/instability field centered on the silo.

As the mothership approaches:

- lateral/vertical energy attraction toward the silo grows;
- stabilization energy cost rises;
- camera/ship cues show the pull;
- the desired-position solver should normally reject or project targets out of the unsafe core region;
- entering the warning region remains possible if inertia carries the ship there, but recovery becomes costly;
- entering the critical region should risk irreversible capture/pull-down unless the rules explicitly provide enough reserve/velocity to escape.

Exact radii and force curves are experimental.

### Important constraint

Do not implement this as invisible instant death at a radius boundary.

The player should see and feel the growing attraction before failure.

## 7. Target sector selection

The player or AI can tap/select a sector on the surface.

That chosen sector determines the **general drop region** for the next raid set, not the exact landing point of every raider.

This preserves uncertainty and physics.

### Drop location derivation

Possible inputs:

- selected ground sector;
- current mothership position and velocity;
- safe launch geometry / exclusion field;
- raider type and size;
- launch impulse;
- surface curvature;
- local obstacles;
- bounded dispersion.

The resulting raiders should emerge physically from the mothership and travel to the intended area rather than spawning directly on the ground.

## 8. Why the mothership does not need to hover over the target

Because the silo exclusion field prevents central hovering and movement has inertia/cost, deployment should work from offset positions.

This produces useful geometry:

- attack angles change with mothership orbit position;
- the same sector can be approached from different directions;
- R1/R2/R3 trajectories differ;
- tower obstruction and geothermal layout matter;
- defender AI can react to the mothership's visible orbital movement;
- the player cannot obtain a perfect top-down drop directly onto the silo.

## 9. Dynamic raid cadence

Raid sets should not be forced at a fixed interval.

The player chooses when to commit within the finite hover budget.

AI raiders should use the same logic class:

- evaluate expected extraction;
- evaluate mothership reserve and critical lift margin;
- observe defender tower layout / geothermal support where information is available;
- select a sector;
- choose next three-set composition;
- choose whether to hold;
- eventually withdraw/settle or risk crash.

This allows the original defender phase to feel less like fixed scripted waves and more like an opposing finite raider system.

## 10. Information available to raiders

The mothership should infer rather than magically know everything.

Potential observable information:

- tower positions/types;
- visible conduit routes;
- visible geothermal intensity/depletion;
- recent projectile activity;
- eruption warning signs;
- silo brightness/energy state at an approximate level;
- previous raid outcomes.

Hidden exact numeric reservoir values or perfect future eruption timing should not be granted automatically to AI or player.

## 11. Interaction with geothermal defense

The sector-selection system becomes more meaningful with geothermal tower power.

A good raid may target:

- a weakly supplied defensive sector;
- a source shared by too many firing towers;
- a route likely to force high sustained fire and drain local magma;
- a sector where a volatile eruption threatens both sides;
- a temporary gap created when a geothermal stream retreats.

This creates a dynamic battlefield without adding more unit classes.

## 12. Three-set queue UX

Keep the planning interface world-first and compact.

Possible presentation:

- three physical/diagrammatic slots near the mothership core or launch ring;
- each slot shows simple R1/R2/R3 silhouettes/counts;
- empty slot clearly means hold/no raid;
- energy commitment preview appears as a portion of the visible core;
- selecting a slot then tapping the planet assigns its target sector;
- drag/reorder may be supported if it remains legible across touch/controller/mouse.

Avoid a spreadsheet-like army composition screen.

## 13. Replanning

Experimental policy:

- future unlaunched sets may be edited freely or at low/no cost;
- a set currently assembling may have cancellation loss or delay;
- a launched set is committed and cannot be recalled except through the later extraction/recovery rules.

This keeps planning flexible without making commitment meaningless.

## 14. AI defender response

Because mothership position is visible and physical, AI defenders may use it as predictive information but should not target the mothership directly by default.

They can:

- infer likely approach sectors;
- prioritize rebuilding/supplying towers in threatened regions;
- preserve geothermal capacity for expected attack lanes;
- avoid overcommitting if the mothership feints/repositions.

This makes mothership movement strategically legible to both sides.

## 15. Mothership attraction failure

If the mothership enters the silo's critical attraction region:

- suspension force competes with growing energy attraction;
- reserve drains faster;
- ship trajectory bends toward the silo;
- if escape force is insufficient, it is pulled down.

A collision/capture should be a physical failure state distinct from ordinary hover-energy exhaustion.

Potential outcomes to test:

- catastrophic mothership impact near the silo, damaging both sides;
- energy transfer from mothership to silo on contact;
- hulk remaining near the fortress;
- defender survival depending on impact geometry.

Do not canonicalize the exact contact outcome until physics testing shows which is understandable and fair.

## 16. Performance model

Mothership steering should use a compact deterministic state:

- position;
- velocity;
- orientation;
- angular velocity;
- desired position;
- available thrust / stabilization force;
- current reserve;
- silo attraction force.

Camera smoothing is presentation state and should not modify authoritative mothership physics.

## 17. Certification

### Movement
- tap near/far sectors;
- observe acceleration, overshoot, braking and settle time;
- verify camera follows actual ship motion;
- verify movement energy cost;
- test rapid retargeting without teleportation.

### Silo field
- approach warning region slowly;
- cross warning region with lateral velocity;
- attempt recovery;
- test critical-region capture;
- confirm force is continuous rather than binary;
- verify AI target projection avoids invalid central hover.

### Raid queue
- three different compositions;
- empty/hold slots;
- reorder/edit before launch;
- launch one set while next two remain planned;
- verify reserve accounting;
- sector reassignment before launch.

### Deployment geometry
- same sector from different mothership positions;
- R1/R2/R3 dispersion;
- target near silo exclusion region;
- target near arena edge;
- target near geothermal eruption zone.

## 18. Non-goals

Avoid:

- direct WASD arcade spaceship combat as the primary raider loop;
- free-flying omniscient camera detached from the mothership;
- exact unit-by-unit RTS path commands;
- forced raids every N seconds;
- perfect AI knowledge;
- hovering directly over the silo for point-blank drops;
- a separate movement-fuel currency.

The mothership is a heavy finite-energy staging organism. The player chooses commitment, timing and general location; inertia and physics make those choices consequential.