# Surface Energy Flow, Defensive Permeability, and Raider Locomotion

**Status:** Focused game-design chapter  
**Parent manual:** `docs/GAME_DESIGN_MANUAL.md`  
**Related:** #29, #72, #76, #82, #83

---

## 1. Core spatial rule

Defensive geometry is physically real to every system that occupies the surface.

Walls, tower foundations, terrain lips, wreckage, and other sufficiently solid structures must obstruct free teal-energy flow as well as raider bodies. Energy must not ghost through a fortress merely because it belongs to the defender.

This creates a deliberate tension:

> A fortress must be difficult for raiders to penetrate but permeable enough for recovered energy to drain toward the silo.

The player is therefore designing both a defensive maze and a drainage basin.

This is a **canonical principle**. Exact flow-field resolution, clearance widths, rates, and AI algorithms remain experimental.

---

## 2. Drainage corridors

Recovered teal energy spills where it is liberated, settles under gravity, pools in low areas, and is biased toward the silo's collection field.

Solid tower/wall geometry blocks that surface flow.

The player should normally preserve one or more open drainage corridors from likely combat areas to the silo. These corridors need not be straight. They can curve around walls, pass through deliberate gates, merge into broader channels, or follow low terrain.

Good layouts therefore balance:

- raider exclusion;
- firing lanes;
- geothermal conduit reach;
- tower source redundancy;
- recovered-energy drainage;
- eruption escape space;
- future repair/replacement access.

A completely sealed ring may be excellent against bodies but economically poor if recovered energy accumulates outside it.

---

## 3. No magical obstacle bypass

The silo's attraction field may bias free energy toward the center, but it does not grant collision immunity.

Energy may:

- flow around a wall if a route exists;
- pool against a foundation;
- join adjacent pools;
- slowly seek a nearby opening;
- remain stranded outside a completely sealed barrier;
- be redistributed later if geometry is destroyed, moved, melted, or expires.

Energy should not climb over an arbitrarily tall wall or tunnel through a tower simply because the pathfinder knows the silo is behind it.

This makes temporary towers, structural damage, and eruptions capable of changing the resource topology during a battle.

---

## 4. Terrain and low surfaces

Gravity remains authoritative.

Surface energy naturally prefers local depressions and downhill paths before the silo attraction field bends it toward collection. Raiders likewise experience terrain physically and therefore tend to roll, settle, and accelerate through lower surfaces even before AI steering is applied.

The game should avoid making terrain merely visual. Valleys, ridges, craters, eruption scars, tower ruins, and wall gaps can all alter both:

- where raiders travel;
- where energy accumulates and drains.

This creates readable common geography without requiring identical navigation logic for fluid and raiders.

---

## 5. Flow implementation principle

Do not run general-purpose global pathfinding for every visual droplet.

Authoritative energy aggregates should use a bounded surface-flow representation such as:

- coarse potential/height field;
- obstacle occupancy grid;
- short-range steering around blockers;
- low-count flow graph;
- periodic route refresh when geometry changes.

Rendered droplets/ribbons may interpolate that aggregate path.

A useful rule is:

> Fluid may know the local gradient and collection bias, but it should not behave like an intelligent agent.

If a sealed wall prevents a route, the fluid pools rather than solving the fortress like a raider.

---

## 6. Raider locomotion must differ by type

All three raider tiers share gravity, collision, finite life, and the goal of reaching the silo. They should not share identical movement intelligence.

Their navigation should reinforce their physical identities.

### R1 — Scout / Swarm Navigator

R1 is small, light, agile, and numerous.

Preferred behavior:

- most pathfinding-aware tier;
- frequently reevaluates local routes;
- prefers openings, low terrain, narrow corridors, and low collision-cost paths;
- exploits gaps that R2/R3 cannot fit through;
- avoids unnecessary direct wall impacts when an open route is nearby;
- can split around obstacles and reconverge;
- remains vulnerable to displacement and edge ejection.

R1 should feel like liquid pressure finding cracks in the defense, but remains a physical spherical body rather than a ghosting navigation agent.

### R2 — Breaker

R2 is the intermediate body and should combine navigation with deliberate force.

Preferred behavior:

- uses coarse path planning;
- prefers reasonably direct routes;
- assigns a finite cost to breakable/temporary defensive geometry rather than treating all obstacles as impassable;
- can choose to push into a barrier or congested gap when that route is competitive;
- uses sustained mass and repeated collision to compromise a defensive lane;
- can exploit a breach created by another R2/R3;
- remains more steerable than R3.

R2 should make the defender ask whether a drainage gate or narrow corridor is sufficiently protected against brute force.

### R3 — Titan / Siege Boulder

R3 is large, heavy, persistent, and highly inertial.

Preferred behavior:

- least dependent on detailed pathfinding;
- strongly influenced by terrain slope and existing momentum;
- prefers broad low routes and large openings when available;
- otherwise takes a direct or gently corrected approach and accepts major collisions;
- treats many temporary structures as things to push through, displace, or become stuck against rather than navigate elegantly around;
- steering should be slow enough that insertion angle and early momentum matter greatly;
- cannot exploit narrow drainage corridors simply because a route graph says one exists.

R3 should feel like a geological event the defense must redirect rather than an intelligent unit threading a maze.

---

## 7. Soft counters emerge from shared geometry

This rule should create counters without hidden damage typing.

Examples:

- a narrow drainage opening can admit teal energy and R1 while physically excluding R3;
- a wider gate improves energy throughput but creates a viable R2 approach;
- several small drainage paths can reduce R1 concentration while remaining unusable by R3;
- a single broad channel drains efficiently but can become a Titan avenue;
- T1 barriers can redirect R3 while accidentally trapping defender income outside the fortress;
- an eruption can destroy a wall and suddenly create both a new raider route and a new energy-drain route.

The same geometry therefore has economic and combat meaning.

---

## 8. Placement feedback

The game should help the defender reason about permeability without turning placement into a spreadsheet.

When placing or upgrading a wall/tower, experimental previews may show:

- likely drainage direction;
- whether the placement closes the last known path from a major collection basin;
- geothermal conduit reach;
- approximate raider-size clearance for R1/R2/R3;
- existing pooled energy that would become stranded.

Avoid hard prohibition on sealed layouts. A player may intentionally choose temporary economic isolation for survival.

The important requirement is that consequences are predictable.

---

## 9. Dynamic topology

Routes should change when physical structures change.

Topology invalidation events include:

- tower construction;
- tower expiration/degradation;
- tower destruction;
- eruption damage;
- mothership wreckage where relevant;
- terrain deformation;
- major raider collision that moves/destructs geometry.

Neither fluid nor raider navigation should recompute the entire world every frame. Recompute coarse navigation/flow state only when topology changes or at bounded intervals.

---

## 10. AI defender implications

AI defenders must obey the same drainage constraint.

A competent AI should not simply maximize wall closure. Its placement scoring should eventually consider:

- silo exposure;
- raider path length;
- firing coverage;
- geothermal supply;
- drainage capacity;
- eruption risk;
- body-size clearance.

Higher AI difficulty should improve this planning quality rather than grant energy-flow exceptions.

---

## 11. Raider-side tactical reading

From the mothership, the player should be able to infer meaningful surface structure:

- visible gates and channels;
- pooled teal energy indicating poor drainage;
- heavily trafficked collection streams revealing openings toward the silo;
- depleted geothermal sectors indicating sustained defender fire;
- wall damage or eruption scars that create new routes.

This creates a useful information trade-off for the defender: good drainage keeps the economy alive but can also reveal paths through the fortress.

The raid planner can exploit that information when assigning the next three raid sets.

---

## 12. Proof-of-concept requirements

### Energy-flow obstruction

Test:

1. open field → energy reaches silo;
2. single wall → stream diverts around edge;
3. U-shaped wall → pooling and delayed escape;
4. sealed ring → energy remains outside;
5. open one gate → pooled energy drains through it;
6. destroy/expire one wall → route immediately becomes viable;
7. multiple simultaneous pools remain bounded in CPU/mesh cost.

### Raider locomotion

Use identical arena geometry for all tiers and compare:

- R1 selecting narrow/open routes;
- R2 choosing between detour and barrier impact;
- R3 preserving momentum and preferring broad/direct/downhill routes;
- route changes after wall removal;
- corridor clearance against existing approximate diameters 6 / 9 / 14;
- time-to-silo, collision count, structural damage, distance travelled, and steering energy/impulse.

### Combined fixture

The most important fixture uses the same fortress layout for fluid and all three raider tiers.

Success means a tester can explain why:

- the teal stream chose its route;
- R1 chose a different route;
- R2 attempted a barrier;
- R3 could not use the narrow opening;

without consulting hidden debug state.
