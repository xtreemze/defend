# Energy Flow, Extraction, Evacuation, and World Ecology

**Status:** Game-design manual chapter / focused design supplement  
**Parent manual:** `docs/GAME_DESIGN_MANUAL.md`  
**Related design threads:** #29, #72, #73, #74  

---

## 1. Purpose

Energy in Defend should not behave like an abstract score that teleports between entities. It is the single most important substance in the game: health, construction budget, defended resource, recovered combat value, raiding capital, mothership reserve, and the reason factions move between defense and predation.

The world should therefore make energy **physically legible**.

The canonical direction is:

- teal energy displaced from raiders spills into the physical world;
- it lands on the arena as liquid-like droplets and pools;
- separate deposits merge visually and economically;
- the resulting energy oozes and streams toward the defending silo over time;
- energy is credited to the silo as it physically arrives rather than instantly at the moment of damage;
- when raiders breach a silo, stored energy is siphoned upward as the same teal liquid toward the mothership;
- surviving raiders are entrained into that same ascending stream and evacuate to the mothership;
- after extraction, the mothership chooses whether to establish/return to a defensive state or continue raiding another visible energy source;
- distant silos appear as teal energy signatures in the sky/strategic view rather than conventional mission icons.

The same material should explain combat reward, silo health, raid extraction, evacuation, travel decisions, and the larger ecology.

---

# 2. Canonical world rule: energy is conserved visible matter

Energy is not ordinary water, but it should behave with a readable **liquid metaphor**.

It can:

- break into droplets;
- splash and scatter;
- pool on surfaces;
- merge with nearby pools;
- stretch into rivulets;
- flow around geometry;
- collect into larger streams;
- accelerate toward an energy sink;
- be pulled upward against gravity when a mothership establishes an extraction field;
- separate again under violent impacts or interruption.

The player does not need a scientific explanation for why the substance can behave as a fluid on the ground and ascend when attracted by a silo or mothership. The behavior should remain internally consistent and visually unmistakable.

Economic conservation matters more than literal fluid simulation. A visual pool representing 400 energy must still represent 400 energy regardless of how many particles happen to render it.

---

# 3. Defensive energy recovery

## 3.1 Damage liberates energy

The current baseline immediately adds recovered energy to the silo when a projectile damages an enemy. That should evolve into a two-stage transaction:

1. **Liberation:** a successful hit removes viability from the raider and releases the recoverable fraction of that loss as teal energy at or near the collision.
2. **Collection:** the released energy reaches the ground, coalesces, then flows toward the silo. Only energy that reaches the intake is added to the reserve.

The existing recovery ratio can remain a baseline quantity while this presentation/transfer model is developed. The important change is that recovery has space and time.

## 3.2 Hit behavior

A projectile impact should produce an energy response proportional to the energy actually liberated.

Small impacts:

- a few droplets;
- a small splash;
- thin rivulets.

Large T3 impacts:

- a larger burst;
- wider scatter;
- more visible pooling;
- a substantial stream once collected.

This reinforces the difference between granular T2 fire and large T3 packets without inventing a new damage type.

## 3.3 Ground collection

Released energy should initially obey local momentum and gravity sufficiently to feel attached to the collision.

After reaching a stable surface, it transitions from ballistic droplets into collectible fluid packets/pools.

Pools should:

- attract nearby smaller deposits;
- merge without losing represented energy;
- deform around tower foundations and terrain;
- prefer downhill movement where meaningful;
- ultimately be biased by the silo's collection field.

The defending silo is therefore not magically credited at impact. The battlefield visibly carries the result of the fight back home.

## 3.4 Streams to the silo

The silo creates a low, persistent attraction or collection field for free teal energy on its surface.

At first a new spill may look chaotic. Over a few moments it should organize into one or more readable streams heading toward the silo.

As separate pools converge:

- rivulets thicken;
- nearby paths blend;
- isolated droplets join larger flows;
- the final approach becomes a strong visible current into the silo.

The reserve meter should rise as that material actually enters the silo.

This delay gives the player useful feedback and makes resource generation feel earned rather than numerical.

---

# 4. Tactical consequences of physical collection

The energy-flow system should create light tactical consequences without turning the game into plumbing management.

## 4.1 Delayed income

Energy earned from a hit is not immediately spendable.

This creates a natural lag between successful combat and renewed construction capacity. The player can see incoming resources and make plans around them.

The delay should be long enough to be perceptible but not so slow that basic defense feels unresponsive.

## 4.2 Geometry can shape flow

Tower foundations and large bodies may divert streams. This is desirable when legible, because it makes the battlefield feel physically coherent.

However, ordinary placement should not permanently imprison the player's earned energy. The collection field should eventually route around normal obstacles or allow sufficiently energetic fluid to creep around them.

A sophisticated future arena may deliberately contain terrain that affects collection routes, but this should be introduced only after the basic loop is readable.

## 4.3 Edge loss

Energy thrown completely off the arena can be lost.

This creates a subtle trade-off around dramatic edge-ejection strategies: ejecting an enemy can be the safest defensive outcome, but may recover less of its remaining energy than destroying/weakening it over the arena.

This is an experimental balance lever and must not punish edge play so strongly that ejection stops being useful.

## 4.4 Contested energy

Do not initially require raiders to steal loose surface pools. The first implementation should keep ownership simple: liberated defensive energy naturally seeks the defending silo.

Later experiments may test whether an active siphon can capture nearby loose energy, but this is not required for the core design.

---

# 5. Performance model: simulate value, render fluidity

Do **not** make thousands of energy droplets full rigid-body actors merely because the resource looks liquid.

The economic system should operate on a small number of conserved **energy packets/aggregates**.

A packet can store:

- energy value;
- 3D position;
- velocity while ballistic;
- state: airborne / pooling / flowing / collected / siphoned;
- current flow target;
- optional visual radius/volume proxy.

The renderer may represent one economic packet with many particles.

Recommended conceptual layers:

1. **Authoritative energy state** — deterministic scalar values and coarse positions.
2. **Flow/navigation field** — inexpensive vector/potential field guiding surface packets toward the silo while avoiding large obstacles.
3. **Visual fluid layer** — GPU particles, ribbons, metaball-like blobs, trails, splashes, or instanced droplets that interpolate the authoritative state.
4. **Audio layer** — spatial energy sounds derived from aggregate volume and velocity rather than one source per visual particle.

This lets the game look materially rich without exceeding the project’s performance budget.

Where practical, flow-field updates and procedural visual preparation can run away from the main gameplay/render thread. Core gameplay must not wait for cosmetic particle work.

---

# 6. Silo intake and visible reserve

The silo should visibly consume incoming teal streams.

Potential presentation:

- streams enter along seams, vents, or the existing energy-meter volume;
- the internal teal core/meter brightens and grows as reserve increases;
- low reserve is physically dimmer/thinner rather than communicated only through text;
- a large incoming stream visibly replenishes the structure;
- the final droplets can continue arriving after combat has ended, creating a natural decompression period.

The existing numeric reserve remains accessible, but the world itself should communicate abundance and scarcity.

---

# 7. Breach changes the direction of gravity

When a raider successfully reaches the silo, the energy interaction should not be an instantaneous numeric subtraction.

A breach establishes a **mothership extraction field**.

The crucial visual reversal is that teal energy which previously crawled inward across the ground now begins moving **upward**.

The player should immediately understand that the same substance is being stolen.

## 7.1 Extraction sequence

A first design sequence:

1. one or more raiders make successful contact with the silo;
2. a narrow teal thread forms upward toward the mothership;
3. the thread strengthens into a continuous liquid column/stream;
4. silo energy deforms toward the extraction point and begins climbing;
5. the mothership's core brightens as energy arrives;
6. loose nearby energy may be pulled into the upward stream where appropriate;
7. remaining raiders disengage from the ground assault and move toward the extraction current;
8. raiders become entrained and ascend through the same stream;
9. the stream narrows as extraction completes;
10. the mothership departs or returns to strategic choice.

The stream should feel like a coherent flowing substance, not a conventional science-fiction teleport beam.

## 7.2 Extraction rate

Extraction should take visible time.

Potential governing factors:

- raider viability that successfully established the breach;
- number of successful raiders;
- current silo reserve;
- mothership capacity/energy state;
- campaign balance.

Do not make the rate so slow that a won raid becomes a waiting screen.

## 7.3 Continued defensive pressure

Recommended experiment: defenders may continue firing during at least the early extraction/evacuation phase.

This has several benefits:

- reaching the silo is not necessarily an instantaneous binary victory;
- defenders can reduce final extraction by damaging exposed raiders;
- the ascent becomes a dramatic retreat under fire;
- T2 target switching and T3 long-range coverage remain meaningful through the raid climax.

If this proves frustrating, the combat-to-resolution boundary can become more forgiving, but the visual extraction should remain.

---

# 8. Raider evacuation through the energy stream

Once extraction begins, all surviving raiders should use the same upward current to return to the mothership.

This resolves several narrative questions at once:

- raiders do not simply disappear after a successful raid;
- their origin above the map becomes physically explicit;
- the mothership is visibly both observer and dropship;
- surviving raiders feel like recoverable investments rather than disposable scripted enemies;
- the campaign inversion becomes readable through motion rather than exposition.

## 8.1 Entrainment

Raiders should not teleport to the mothership.

They can be pulled into the current using a strong force-field/constraint behavior:

- first drift or roll toward the stream;
- become buoyant/entrained near its core;
- rotate and rise with the flow;
- retain enough inertia to feel physical;
- disappear into/attach to the mothership only on actual arrival.

Larger bodies should visibly distort the stream more than smaller ones.

R1 may rise rapidly in clusters. R3 should look heavy even while being lifted.

## 8.2 Return value

Do not automatically convert surviving raiders into free permanent inventory.

Their recovered state can influence the mothership's energy balance, next launch cost, repair/refabrication cost, or simply be dissolved back into energy after docking.

The simplest initial economic model remains energy-first: raiders are commitments of mothership energy, and successful return primarily preserves or recovers some value. Exact reuse rules remain experimental.

---

# 9. The mothership after a raid

A successful extraction should end in a **strategic choice**, not an automatic next wave.

The mothership has two broad survival modes:

1. **Defend / settle** — establish or return to a silo state and become a defended energy store again.
2. **Continue raiding** — remain mobile and select another external teal energy signature.

This turns the defender/raider inversion into a repeating strategic ecology rather than a one-time campaign gimmick.

---

# 10. Defend / settle option

The exact fiction can remain sparse, but mechanically the mothership should be capable of returning to a defensive lifecycle.

A candidate loop:

1. choose a viable surface/site;
2. descend;
3. transform the mothership back into an energy silo/core installation;
4. spend carried reserve to establish a sparse initial defensive network;
5. become a visible energy target;
6. attract raids according to reward and perceived defensive profitability;
7. defend, accumulate, deter, starve, and potentially mobilize again.

This is the full systemic cycle:

`SILO → DEFEND → DETER → STARVE → MOTHERSHIP → RAID → SETTLE → SILO`

The campaign does not need to force the player through every state indefinitely, but the world model should support the idea that these are lifecycle states of the same kind of system.

---

# 11. Strategic sky: distant teal signatures

Other silos should not initially appear as conventional mission cards, numbered levels, or map pins.

From the mothership, the player sees **teal points/signatures** in the distance. They can read as stars, planets, or remote installations until approached.

The important information is encoded in light.

## 11.1 Bright signatures

Very bright teal sources imply:

- large stored energy and/or high recent energy throughput;
- frequent raid activity;
- defenders that have had continuing opportunities to replenish energy through combat;
- maintained or dense defensive infrastructure;
- a highly visible target known to many raiders;
- high potential reward;
- high expected difficulty.

These are rich, dangerous worlds.

Their brightness is effectively an ecological signal: the installation is active enough that conflict keeps feeding its defensive economy.

## 11.2 Dim signatures

Weak/dim teal sources imply:

- little stored energy;
- low recent throughput;
- fewer incoming raids;
- less combat-derived replenishment;
- more opportunity for defensive infrastructure to age into disrepair;
- lower extraction reward;
- generally easier defenses.

These are poor but accessible targets.

The player should immediately understand the risk/reward trade-off:

**bright = plentiful but dangerous; dim = scarce but vulnerable.**

## 11.3 Brightness should be informative, not exact

Brightness is a physical signature, not a perfect tactical dossier.

It should correlate strongly with target value and activity but need not expose exact energy, tower count, or raid history.

Distance, atmospheric/space occlusion, temporal variation, and recent events can introduce uncertainty without making the signal meaningless.

## 11.4 Signature dynamics

Teal targets should change over campaign time.

A world may:

- brighten after repeated profitable conflict;
- dim after a long quiet period;
- pulse during active combat;
- suddenly flare during a major extraction;
- weaken as towers and reserve decay;
- disappear when a silo converts into a mothership;
- later reappear elsewhere if that mothership settles.

The strategic sky can therefore become a visual representation of the game's larger resource ecology.

---

# 12. Why the brightest worlds are well defended

The brightness/difficulty relationship should emerge from the same economy rather than from arbitrary level scaling.

A frequently attacked silo experiences more danger, but it also experiences more opportunities to liberate and collect teal energy from attacking raiders.

If it survives:

- combat supplies energy;
- energy maintains/replaces temporary defenses;
- maintained defenses enable future survival;
- large reserves make the silo more attractive to future raiders;
- repeated conflict creates a bright, rich, battle-hardened target.

A weakly attacked silo experiences the opposite:

- fewer opportunities for combat income;
- defensive structures age without replacement;
- reserve gradually becomes scarcer;
- the target becomes less attractive;
- reduced attention makes it even quieter;
- eventually it may enter the same starvation-to-mothership transition as the player.

This creates a self-reinforcing but dynamic ecology rather than a conventional difficulty ladder.

---

# 13. Target-selection gameplay

Target choice should be a tactical economic decision made from the mothership perspective.

Useful variables include:

- visible signature brightness;
- distance/travel energy cost;
- current mothership reserve;
- likely defense condition inferred from brightness/history;
- previous knowledge from scouting or failed raids;
- raider mix available/affordable;
- operating drain during travel;
- potential extraction ceiling.

A bright distant target may be worth the risk when the mothership has enough reserve for a heavy raid.

A dim nearby target may be the only survivable choice after a failed attack, even if its reward is poor.

The player should be able to make these judgments primarily from the world view with minimal menu abstraction.

---

# 14. Travel cost and target distance

Distance should eventually matter economically so selecting a target is not simply "pick the brightest dot."

Candidate costs:

- continuous operating drain during travel;
- discrete propulsion cost based on distance;
- time during which other targets may brighten/dim/change state;
- increased uncertainty for very distant signatures.

Do not make navigation tedious. Travel exists to add strategic weight to target selection, not to simulate orbital mechanics.

---

# 15. Scouting and information

The game can progressively reveal more about a target without becoming a spreadsheet strategy layer.

Possible information states:

### Distant

- teal brightness;
- approximate distance;
- rough apparent size/activity.

### Approaching

- visible fortress geometry;
- tower silhouettes;
- silo energy-core intensity;
- evidence of recent damage/repair/disrepair.

### Raid-ready

- actual physical arena;
- insertion opportunities;
- line-of-fire geometry;
- observable tower coverage through motion/aiming rather than abstract ranges where possible.

This preserves direct spatial reasoning.

---

# 16. Moral and narrative consequences

The strategic sky makes the scarcity cycle visible without exposition.

The player will eventually notice:

- some bright targets look prosperous because they are constantly attacked;
- some dim targets resemble the player's old fortress during the quiet decline;
- some lights vanish instead of dying, implying conversion into motherships;
- raiders seen elsewhere may have originated from worlds that once looked like those targets;
- attacking a weak dim silo may be easier precisely because it is already starving.

This deepens the inversion. The player is not choosing between abstract difficulty nodes; they are choosing which struggling or prosperous system to exploit for survival.

The game should not lecture the player about this. The ecology should make the implication unavoidable.

---

# 17. Visual language

## 17.1 Teal remains the resource color

Teal/cyan should consistently mean active/stored/flowing energy across:

- enemy/raider energy state;
- liberated droplets;
- ground pools;
- collection rivulets;
- silo core/meter;
- extraction columns;
- mothership core;
- distant silo signatures.

This continuity is important to the story reveal.

## 17.2 Liquid rendering

The energy fluid should remain stylized and procedural.

Possible techniques:

- emissive particles with size based on packet volume;
- short ribbons between nearby particles;
- metaball-like pooling surfaces;
- animated flow textures on coarse pool meshes;
- instanced droplets;
- sparse splash particles on impact;
- spline/ribbon rendering for coherent larger streams.

Avoid realistic translucent water rendering that fights the established abstract style or creates large GPU cost.

## 17.3 Stream hierarchy

Visual density should scale with represented energy:

- droplets → tiny amounts;
- beads/rivulets → modest flows;
- narrow stream → meaningful recovery;
- thick stream → major post-combat recovery or raid extraction;
- large upward column → catastrophic/major silo siphon.

The player should be able to read magnitude without consulting numbers.

---

# 18. Audio language

Energy flow should have object-based spatial audio tied to the authoritative aggregate packets/streams rather than every visual particle.

Candidate layers:

- faint granular trickle for small loose droplets;
- coherent liquid/electrical shimmer as pools merge;
- directional flowing sound as a stream moves toward the silo;
- low resonant intake sound as energy is collected;
- rising tension/pitch and vertical motion cues during siphoning;
- a large spatial upward "pull" as raiders enter the extraction stream;
- distant subtle tonal cues from bright teal target signatures when selected/focused.

Emitter position and velocity should be available so moving streams and ascending raiders can produce appropriate spatial motion and Doppler-like behavior where useful.

Distance and tactical importance should prioritize voices. Decorative individual droplets should not consume the sound budget.

---

# 19. Controls and camera

## 19.1 Defensive phase

Ground-level energy recovery requires no new primary control. The player reads it visually while continuing to place/upgrade defenses.

## 19.2 Extraction phase

Camera framing should reveal both:

- the draining silo below;
- the mothership above;
- the continuous teal connection between them;
- raiders joining the stream.

This is one of the campaign's most important explanatory images and should remain readable at a glance.

## 19.3 Strategic phase

After evacuation, camera scale expands.

The mothership remains the reference point while distant teal signatures become selectable physical targets.

Selection should feel like pointing at something in space rather than opening a mission list.

Support mouse, touch, keyboard/controller, and accessible focus equivalents without requiring fine pointer precision.

---

# 20. AI ecology

AI-controlled raiders and defenders should respond to the same world signals.

A raiding AI can use estimated target value based on:

- energy signature;
- known/recent defense success;
- travel cost;
- expected extraction;
- recent losses.

This gives a systemic basis for deterrence.

A target that becomes too difficult becomes less attractive even if it remains bright. A very dim target may be ignored because the reward cannot justify travel and launch cost.

This preserves the principle that raids should stop for rational economic reasons rather than because a fixed wave counter says so.

---

# 21. Interaction with tower/raider roles

Physical energy flow should reinforce the six-role battlefield system.

## T1 Barrier

- delays raiders, reducing their extraction viability;
- can subtly shape ground energy streams without becoming a permanent resource trap;
- can keep fights over the arena rather than at the edge, potentially improving recovery.

## T2 Interceptor

- produces frequent small energy liberation events;
- visually generates many droplets/rivulets;
- provides steady incoming resource flow during sustained combat.

## T3 Siege Cannon

- produces fewer but much larger liberation events;
- can fling energy widely with high-impact collisions;
- may trade collection efficiency for decisive ejection/safety.

## R1 Scout/Swarm

- low individual extraction volume;
- many bodies can form multiple small siphon contributions;
- cheap enough to probe dim targets.

## R2 Breaker

- balanced extraction/risk;
- natural default for middling targets.

## R3 Titan

- can establish a very large siphon if it survives;
- creates a dramatic upward energy column;
- represents severe committed-energy risk if it fails before extraction.

---

# 22. Balance questions to certify

Before production implementation, measure:

1. how long recovered energy should take to reach the silo at common combat distances;
2. whether delayed recovery changes tower affordability too abruptly;
3. whether edge-ejection causes too much lost potential recovery;
4. how much flow-path obstruction should matter;
5. how aggressively loose pools should merge;
6. the maximum number of authoritative energy packets needed for performance;
7. visual particle count required to make coarse packets look fluid;
8. extraction rate versus remaining raider viability;
9. whether defenders can meaningfully contest the extraction phase without making successful raids feel unresolved;
10. how quickly raiders should be evacuated once the stream is established;
11. whether returned raiders preserve economic value or dissolve/refabricate;
12. what brightness function best correlates stored energy, recent throughput, and target activity;
13. how accurately brightness should predict defensive strength;
14. travel-energy cost needed to keep target selection non-trivial;
15. how target signatures evolve while the player is elsewhere;
16. whether dim-target raiding becomes too safe or too low-yield to be interesting;
17. whether bright-target reward compensates for expected losses;
18. whether the player can exploit target ecology by repeatedly farming one weak installation;
19. whether settling/defending again is strategically competitive with continuous raiding;
20. whether visual/audio energy motion remains readable on constrained/mobile hardware.

---

# 23. Implementation/certification direction

Create experimental arena fixtures before production integration.

Required prototypes:

### A. Ground-spill fixture

- fixed projectile hit values;
- deterministic spill positions;
- pool merging;
- collection field to silo;
- measured time-to-collection and conserved energy.

### B. Obstacle-flow fixture

- T1/T2/T3 footprints between spill and silo;
- verify routing around geometry;
- ensure earned energy cannot become permanently stranded in ordinary layouts.

### C. Edge-loss fixture

- identical liberated value at center and near arena edge;
- measure collected/lost energy.

### D. Siphon fixture

- fixed silo reserve;
- controlled raider breach;
- upward flow rate;
- exact energy delivered to mothership;
- interruption behavior.

### E. Evacuation fixture

- R1/R2/R3 entrainment into the same stream;
- ascent time and physical readability;
- tower fire interaction during ascent if enabled.

### F. Strategic-signature fixture

- several simulated silos with differing reserve, raid frequency, and defense condition;
- map those states to teal brightness;
- test whether players can correctly infer broad risk/reward without exact numbers.

### G. Ecology simulation

- run multiple abstract silo/mothership agents over time;
- verify frequent conflict can maintain bright defended systems;
- verify over-deterrence can lead to starvation and conversion;
- verify weak targets can dim and become less attractive;
- verify the world does not collapse into one permanently optimal target type.

---

# 24. Design guardrails

- Energy must never visually teleport when a physical transfer can communicate the same event.
- Visual particle count must not define economic value.
- Do not implement a full expensive fluid simulation simply for realism.
- The liquid metaphor should remain stylized, emissive, procedural, and consistent with existing geometry.
- Resource collection should add readable delay, not tedious micromanagement.
- Successful raid extraction should be a visible event, not an instant score popup.
- Raider evacuation should physically explain where enemies came from.
- The strategic layer should remain world-first rather than becoming a conventional node/menu campaign map.
- Brightness should encode ecology and reward/danger, not arbitrary mission difficulty.
- Bright targets should generally be richer and better defended because of their history, not because the game silently multiplies stats.
- Dim targets should generally be poorer and more deteriorated, not simply "easy mode" copies.
- The player must remain free to choose between defense/settlement and continued raiding once that larger loop is available.

---

# 25. Core design statement

**Energy should always have somewhere it came from, somewhere it is physically going, and a visible reason for changing ownership.**

On defense, combat spills teal life onto the battlefield and the fortress slowly gathers it home.

On offense, a successful breach reverses that flow: the silo itself liquefies upward into the mothership, and the surviving raiders ride the same current back to where they came from.

From there, the player looks outward and sees other teal points in the dark. The brightest promise abundance and resistance. The faintest promise vulnerability and scarcity. Choosing which light to approach becomes the next survival decision.