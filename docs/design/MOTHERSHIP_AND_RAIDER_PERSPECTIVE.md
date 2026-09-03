# Mothership and Raider Perspective

**Status:** Focused game-design chapter  
**Parent manual:** `../GAME_DESIGN_MANUAL.md`  
**Primary issues:** #29, #72, #73, #74, #76, #79  

---

## 1. Purpose

The raider phase must feel like the same game seen from the other side, not a second game grafted onto the campaign.

The mothership therefore has to obey the same fundamental principles already established for the fortress:

- energy is finite and shared across survival and action;
- physics is gameplay;
- time is a weapon;
- visual state should expose system state;
- objects should be simple, generated, geometric and physically legible;
- every resource transfer should have an origin, a path and a destination;
- the player should interact with the world rather than manage abstract menus;
- defeat should happen through the simulation rather than only through UI state.

The mothership is not an invulnerable command platform. It is a physical lifecycle state of the same energy ecology as the silo.

---

# 2. Canonical visual split

## 2.1 Defense is rectilinear and rooted

The defensive side should continue to read as constructed architecture:

- low broad silo geometry;
- square/grid-aligned footprints;
- rectangular tower bases;
- vertical pillars;
- blocky turret structures;
- static obstacles;
- strong relationship to the ground plane.

The player should read defensive geometry as something **built into place**.

## 2.2 Raiding is spherical and mobile

The raider side should use the opposing visual grammar:

- spheres and faceted curved shells;
- low-poly geodesic surfaces;
- rings and radial struts;
- visible cavities and internals;
- bodies that roll, tumble, drift, fall and collide;
- no implication that raiders were constructed as buildings.

The player should read raider geometry as something **assembled around energy and sent into motion**.

## 2.3 Family resemblance

The mothership should immediately appear related to Raider 1/2/3.

A useful hierarchy is:

- R1 — small faceted spherical shell;
- R2 — larger/deeper spherical shell with more visible mass/internals;
- R3 — very large heavy shell, visually dense and difficult to redirect;
- mothership — enormous incomplete spherical system whose central energy core is visibly exposed.

The relationship should be obvious through shape language rather than labels.

---

# 3. Mothership form

## 3.1 Central energy reservoir

The mothership is organized around a centrally located teal energy reservoir.

This is not merely an indicator placed inside the model. It is the primary object around which the ship is constructed.

The reservoir should be:

- visible from ordinary raider-phase camera distances;
- readable from multiple angles;
- large enough to communicate abundance/depletion physically;
- partially liquid/volumetric in appearance;
- mechanically connected to the rest of the ship by visible conduits or struts;
- never completely hidden behind an opaque hull.

The ship's silhouette should read as **a machine surrounding a finite resource**.

## 3.2 Outer shell

Preferred outer shell language:

- incomplete faceted sphere or polyhedral cage;
- large open cutaways;
- repeated simple panels instead of detailed hull plating;
- major shell pieces large enough to remain recognizable when broken;
- shell thickness implied through duplicated/simple nested geometry rather than high-detail modeling;
- radial rather than longitudinal spacecraft construction.

Avoid:

- wings;
- cockpit windows;
- conventional nose/tail orientation;
- guns;
- missile racks;
- sci-fi panel noise;
- smooth authored fuselage shapes;
- military camouflage;
- humanoid/animal silhouette cues.

## 3.3 Exposed internals

Visible internal structures should remain simple:

- radial beams;
- toroidal rings;
- spherical field nodes;
- short conduits;
- exposed energy channels;
- launch/recovery rails or rings;
- structural gaps.

This should feel intentionally skeletal, not unfinished.

## 3.4 Transformation continuity

The ground silo transforms into this mothership.

The blocky fortress does not need to retain its exact rectangular silhouette after conversion. What must remain continuous is the conserved system:

- the central energy reserve is recognizably the same resource;
- teal energy moves into the transforming body rather than teleporting;
- some defensive volumes may fold, split or reorganize into the radial shell;
- components that were static foundations can become structural ballast/shell segments;
- the final spherical visual grammar marks the lifecycle transition from rooted defense to mobile raiding.

The player should understand that the silo **became** the mothership rather than being replaced by it.

---

# 4. The mothership is not a weapon

## 4.1 No direct fire

Canonical rule: the mothership does not shoot.

It should have no:

- turret;
- beam weapon;
- missile system;
- bombardment attack;
- passive damage aura;
- hidden automatic attack.

The mothership's power comes from the finite energy reserve it can risk through deployed raiders.

## 4.2 Functional roles

The mothership exists to:

1. remain aloft;
2. carry the finite teal reserve;
3. anchor the player's camera/perspective;
4. reposition above the target;
5. assemble/deploy raiders;
6. receive surviving raiders;
7. siphon energy from a breached silo;
8. decide whether continued raiding is economically viable;
9. travel/settle into a future defensive state;
10. physically fail if it can no longer sustain itself.

This makes it a logistics organism rather than a combat ship.

---

# 5. Raiders use their bodies as weapons

## 5.1 Shell-as-weapon principle

Raiders do not need a separate attack system.

Their offensive capability comes from their physical body:

- mass;
- momentum;
- inertia;
- collision;
- rolling;
- bouncing;
- ramming;
- persistence;
- route access;
- shell integrity;
- remaining viability when they reach the silo.

A raider's shell is therefore simultaneously:

- armor;
- vehicle;
- kinetic weapon;
- resource container;
- extraction carrier.

## 5.2 Why this matters

Adding ranged weapons would undermine several established systems:

- Tower 1 geometry would matter less if raiders simply fired over/through it;
- corridor design would become less important;
- size/mass differentiation would become secondary to DPS;
- the physical identity of the game would weaken;
- R1/R2/R3 could collapse into weapon-stat variants.

Raider variety should remain physical.

## 5.3 Physical attack outcomes

A successful raider may:

- hit a barrier and move it only if the barrier rules allow it;
- push/deflect against other raiders;
- force a crowded path;
- use a collision to redirect itself;
- roll through an opening;
- be slowed enough to become economically worthless;
- reach the silo with substantial remaining energy;
- be ejected from the arena before contact.

The simulation should decide the outcome.

---

# 6. Mothership energy model

## 6.1 One resource

Do not create a separate fuel currency.

The mothership uses the same teal energy reserve for:

- staying airborne;
- meaningful movement/repositioning;
- assembling raiders;
- launch impulse where applicable;
- emergency/accelerated recovery actions if later justified;
- long-term survival.

This preserves the game's central resource elegance.

## 6.2 Conceptual energy states

The simulation may distinguish several states internally without presenting them as separate currencies:

### Total energy

All energy physically associated with the mothership system.

### Free reserve

Energy currently available for hover, movement or new launches.

### Committed energy

Energy converted into raider bodies or otherwise deployed into the raid.

### In-transit energy

Energy currently flowing through extraction/recovery streams.

### Critical lift reserve

The minimum free reserve required to maintain safe suspension.

These should remain accounting states of one resource.

## 6.3 Conservation

The mothership must obey conservation rules similar to the defender-side energy flow:

- launching a raider reduces free reserve;
- the deployed raider carries that committed value/risk;
- destroyed or unrecovered bodies do not magically return full value;
- extracted energy must visibly arrive before becoming free reserve;
- recovered raiders may return residual embodied value;
- visual particle count never determines authoritative value.

---

# 7. Hover drain

## 7.1 Canonical pressure

The mothership spends a small continuous amount of energy to remain aloft.

This rule is essential because it prevents an infinite-duration raid and gives the defender a meaningful win condition through delay.

## 7.2 Desired feel

Hover drain should create strategic urgency, not twitch pressure.

The player should have time to:

- inspect the fortress;
- understand firing lanes;
- choose a drop point;
- wait briefly for a useful opening;
- evaluate whether another raider is worth deploying.

But the player should not be able to:

- wait forever;
- keep the raid open indefinitely after all viable units are lost;
- observe without consequence until AI behavior produces a guaranteed opening.

## 7.3 Drain tuning target

Exact values are experimental.

A useful target is that baseline hover alone consumes only a modest fraction of the reserve during a well-executed raid, while repeated failures and long indecision make depletion increasingly important.

The dominant costs should remain tactical commitments, especially raider launches, rather than passive hover tax.

## 7.4 Movement costs

Meaningful mothership repositioning may cost additional energy.

This should discourage exploiting unlimited perfect drop angles without making ordinary camera adjustment expensive.

Distinguish:

- **camera orbit/look** — normally free;
- **small stabilization drift** — included in hover cost;
- **actual mothership translation** — small energy cost;
- **large altitude change/rapid relocation** — greater cost if later needed.

The camera should not become a fuel-consuming input device.

---

# 8. Visible energy state

## 8.1 World-first UI

The mothership itself should communicate reserve state.

The HUD may provide a precise number when useful, but the object should communicate the trend.

## 8.2 High reserve

At high reserve:

- central teal reservoir is large/bright;
- flow conduits are strongly illuminated;
- suspension is stable;
- shell field nodes pulse coherently;
- launch ring is visibly energized;
- audio is stable and full-bodied.

## 8.3 Medium reserve

At medium reserve:

- core volume is visibly smaller;
- secondary shell accents dim;
- hover has subtle low-frequency movement;
- launch pulses become more localized;
- internal flow appears thinner.

## 8.4 Critical reserve

Near critical lift reserve:

- core is visibly small;
- shell lighting is sparse;
- hover altitude begins to sag;
- orientation corrections are less stable;
- exposed shell pieces may oscillate;
- suspension audio becomes irregular;
- raider launch opportunities should visibly feel dangerous.

## 8.5 Accessibility

Do not rely on teal brightness alone.

Use redundant signals:

- reservoir volume;
- visible flow thickness;
- shell illumination count;
- altitude;
- motion stability;
- audio stability;
- optional HUD precision.

---

# 9. Camera perspective

## 9.1 Mothership-anchored, not cockpit

The raider camera should be anchored to the mothership but should not be a literal cockpit view.

The player needs to see:

- the defended surface;
- approach geometry;
- the mothership's own physical presence;
- the central energy core when framing allows;
- launch/recovery origin.

## 9.2 Preferred framing

A useful default is an elevated trailing/orbital camera:

- mothership occupies part of the upper/side foreground;
- battlefield fills most of the view below;
- camera can orbit around the mothership within limits;
- mothership translation changes the world-relative drop origin;
- camera look does not necessarily move the ship.

## 9.3 Perspective continuity

The defender should sometimes see the mothership overhead as an actual object.

Later, when the player becomes the raider, the camera relationship should make the earlier spawn behavior immediately understandable.

The reveal works when the player thinks:

> This is where those spheres were coming from.

No exposition is required.

---

# 10. Raider assembly and launch

## 10.1 No free spawn

A raider should not simply appear beneath the mothership.

The resource conversion should be visible.

## 10.2 Candidate assembly sequence

1. player chooses R1/R2/R3;
2. target launch socket/ring becomes active;
3. teal energy flows outward from the central core;
4. a faceted shell begins assembling/condensing around that transferred energy;
5. shell size makes the investment tier immediately visible;
6. the mothership core decreases correspondingly;
7. the completed raider is released;
8. chosen initial vector/impulse determines insertion.

The sequence should be short enough not to interrupt play.

## 10.3 Shell construction language

Assembly can be represented using:

- a few shell triangles/panels appearing radially;
- ring segments rotating into place;
- simple struts extending;
- energy coalescing into the center;
- brief procedural vibration/settling.

Avoid elaborate fabrication animations.

## 10.4 Launch as physics

Once released, the raider becomes an ordinary physical body.

The launch should establish:

- position;
- initial velocity/impulse;
- orientation/spin if relevant;
- tier-specific mass;
- finite lifetime;
- authoritative physics ownership.

The player should not retain perfect direct control after release.

---

# 11. Raider control

## 11.1 Before release

The most meaningful player choices are:

- tier;
- launch position;
- launch timing;
- initial vector;
- initial impulse within allowed bounds;
- formation/spacing if multiple bodies are committed.

## 11.2 After release

Post-release control should remain sparse.

Possible future tools:

- one limited redirection impulse;
- objective preference;
- delayed second-body deployment;
- abort further investment.

Avoid:

- WASD-style continuous steering of every raider;
- selection boxes;
- ability hotbars;
- attack commands;
- conventional RTS unit micromanagement.

The physical commitment should matter.

---

# 12. Successful breach and extraction

## 12.1 Flow reversal

On breach, the energy-flow direction reverses.

The silo should visibly lose teal energy into a stream that rises toward the mothership.

## 12.2 Shared evacuation stream

Surviving raiders use the same upward stream to return.

This is important because it ties:

- extraction;
- evacuation;
- spatial explanation;
- visual language;
- economy

into one event.

## 12.3 Raider recovery

Recovered bodies may:

- dock as intact shells;
- partially disassemble into the mothership;
- dissolve into teal energy plus reusable shell components;
- enter visible holding rings.

The exact representation is experimental.

Whatever the representation, the player should understand that surviving bodies are physically returning rather than being deleted.

## 12.4 Continued danger

Experiment with allowing defenders to continue firing during the early extraction/recovery window.

This could create a meaningful retreat-under-fire phase where:

- breaching is not instant total victory;
- surviving raiders remain vulnerable;
- the extraction stream is a temporary high-value event;
- the mothership must decide when enough has been recovered.

Do not canonize interruption rules until tested.

---

# 13. Raider-side failure states

## 13.1 Tactical failure

A raid can fail because:

- deployed units are destroyed;
- units are ejected;
- units decay before reaching the silo;
- the player spends more energy than can be recovered;
- the player waits too long;
- the mothership reserve approaches critical lift.

## 13.2 Withdrawal

Where campaign rules permit, the player should be able to stop investing and leave before total collapse.

Withdrawal may still cost travel energy and produce a strategic loss.

This prevents every poor raid from requiring a forced crash while preserving crash as catastrophic failure.

## 13.3 Catastrophic depletion

If free reserve can no longer sustain suspension, the mothership loses lift.

This should be physical and irreversible for that vessel state.

---

# 14. Loss-of-lift sequence

## 14.1 Foreshadowing

The crash should not arrive from a hidden threshold without warning.

Signals should build:

1. core depletion;
2. weaker suspension motion/audio;
3. slight altitude loss;
4. orientation instability;
5. shell/strut oscillation;
6. larger downward corrections;
7. final loss of lift.

## 14.2 Transition to physics

At final loss of lift:

- artificial suspension force decays/ceases;
- gravity becomes dominant;
- existing lateral velocity remains meaningful;
- mothership orientation/angular momentum continue;
- the huge body falls rather than playing a canned animation.

## 14.3 Impact

Impact should derive from actual:

- mass;
- velocity;
- angle;
- ground contact;
- shell segmentation.

The ship may:

- bounce slightly if physics supports it;
- roll/tumble;
- break major shell pieces;
- deform procedurally through segment detachment;
- settle under gravity.

Avoid a conventional explosion that erases the object.

---

# 15. The mothership hulk

## 15.1 Persistence

The failed mothership should leave a recognizable hulk when practical.

This wreck is environmental evidence of the raid's failure.

## 15.2 Defender meaning

For the defending player, the wreck communicates:

- the raid had a finite source;
- the attacker was also managing scarcity;
- surviving long enough can defeat a raid economically;
- the airborne object was not decorative;
- another faction has now lost its mobile survival system.

This is a powerful story beat without dialogue.

## 15.3 Wreck appearance

Keep major identifying features:

- broken spherical cage;
- exposed radial struts;
- central core cavity;
- large faceted shell fragments;
- residual teal traces if any energy remains;
- same material family, now unpowered/dim.

The living and dead states should be visibly related.

## 15.4 Placement experiments

### Perimeter crash

Ship falls beyond the primary construction area but remains visible.

Advantages:

- low gameplay disruption;
- reliable composition;
- still provides narrative payoff.

### Arena-edge crash

Ship impacts a playable edge and becomes obstacle/terrain.

Advantages:

- stronger physical consequence;
- persistent battlefield history;
- potential tactical novelty.

Risks:

- random obstruction;
- unfair path changes;
- performance cost;
- collision complexity.

Test both before choosing a default.

## 15.5 Residual energy

A crashed mothership may contain small recoverable residual energy.

This is an experimental possibility, not yet canonical.

If used, residual teal should leak physically and be collected through the same energy-flow system rather than awarded instantly.

This could make a hard-fought defensive survival produce a small visible salvage reward.

Do not make mothership crashing a dominant farming strategy.

---

# 16. Defender interaction with the mothership

## 16.1 Default vulnerability is economic

The defender should not normally target the mothership like a boss.

Its primary vulnerability is that:

- hovering costs energy;
- launching costs energy;
- failed raiders do not return enough value;
- delay extends hover cost;
- repeated failure eventually removes lift reserve.

This keeps defensive play focused on the arena.

## 16.2 Exceptional physical interaction

Future experiments may test whether very low-altitude motherships can be affected by extreme physical events.

Examples might include:

- a launched/ejected Titan colliding with it;
- crash debris interacting with arena geometry;
- extreme T3 projectile trajectories reaching exposed shell components.

These should remain emergent exceptions, not the primary defender objective.

---

# 17. Strategic timing implications

Hover drain makes time a shared resource across both perspectives.

## Defender

Delay is valuable because it:

- reduces raider viability;
- extends mothership hover expense;
- forces additional launches;
- increases attacker opportunity cost.

## Raider

Speed matters because it:

- preserves raider HP/energy;
- reduces hover drain;
- increases extraction ROI;
- leaves more reserve for the next target.

This means Tower 1's non-damaging delay becomes even more strategically important.

---

# 18. Mothership movement

## 18.1 Physical presence

The mothership should have a real position and motion state.

Its movement influences:

- launch origin;
- extraction stream direction;
- camera anchor;
- crash trajectory;
- spatial audio;
- target visibility/occlusion where relevant.

## 18.2 Controlled suspension

The ship may be simulated as a massive body supported by controlled upward/suspension forces rather than being kinematically pinned in the air.

This supports:

- natural sag;
- depletion instability;
- physically continuous crash transition;
- external perturbation experiments.

The final model should remain stable enough for comfortable camera use.

## 18.3 Energy-linked stabilization

A useful model is that available free reserve determines the strength/precision of stabilization.

High reserve:

- tight altitude control;
- damped rotations.

Low reserve:

- weaker damping;
- lower target altitude;
- slower correction.

Critical:

- insufficient upward force;
- gravity wins.

This produces visible state from the same simulation variable.

---

# 19. Audio identity

The mothership should sound like a large physical energy system, not an engine-loop spaceship.

## 19.1 Suspension

Procedural layers can derive from:

- reserve fraction;
- lift force;
- correction force;
- shell oscillation;
- distance from observer.

## 19.2 Deployment

Raider creation should emit localized energy-transfer pulses tied to:

- transferred value;
- shell size;
- launch impulse.

## 19.3 Extraction

The upward energy stream should have:

- moving object-based emitters;
- flow intensity tied to transfer rate;
- vertical motion cues;
- growing mothership-core resonance as energy arrives.

## 19.4 Crash

Crash audio derives from:

- ship mass;
- velocity;
- impact location;
- surface type;
- major fragment events.

A defending observer should hear the mothership descending through space, including Doppler/fly-by effects where relative motion warrants them.

---

# 20. Performance

The mothership should look structurally rich through composition, not polygon count.

Prefer:

- reused primitive meshes;
- instanced/faceted shell panels;
- low-segment spheres/polyhedra;
- shared materials;
- bounded fragment counts;
- LOD for distant defender views;
- aggregate spatial audio emitters;
- simplified far-distance core rendering.

The crash can temporarily increase visual complexity, but simulation fidelity should remain prioritized over debris count.

---

# 21. Accessibility

## 21.1 Energy state

Communicate reserve with:

- core size;
- brightness;
- motion stability;
- altitude;
- shell activation;
- sound;
- optional numeric indicator.

## 21.2 Critical warning

Critical lift state should have escalating redundant cues without requiring flashing effects.

## 21.3 Camera

Mothership motion must not force excessive camera motion.

Provide:

- comfortable damping;
- adjustable shake;
- camera-relative look control separate from physical ship translation;
- reduced-motion presentation where necessary.

---

# 22. Proof-of-concept roadmap

Implement this perspective in independently testable slices.

## PoC A — silhouette and core

Build only:

- large faceted spherical shell;
- exposed central teal core;
- radial struts/rings;
- simple hover above an empty arena;
- orbit/trailing camera.

Questions:

- Does it read as a raider-family object?
- Does it remain visually distinct from towers?
- Is the core obvious?

## PoC B — finite hover

Add:

- deterministic reserve;
- hover drain;
- core shrink/dimming;
- reserve-linked stabilization/sag.

Questions:

- Is depletion visible without HUD dependence?
- Is the pressure slow enough for planning?

## PoC C — crash

Add:

- critical lift threshold;
- controlled-force decay;
- gravity takeover;
- large-body impact;
- persistent hulk.

Test from:

- raider camera;
- defender camera.

## PoC D — R1 assembly and deployment

Add only Raider 1:

- visible core transfer;
- simple shell assembly;
- launch point;
- initial impulse;
- free physical motion after launch.

Do not add AI-defender complexity yet.

## PoC E — tier scaling

Extend assembly/launch to R2/R3 and validate visual/mass/risk readability.

## PoC F — extraction/recovery

Connect #76 upward stream:

- silo drain;
- mothership refill;
- surviving raider ascent;
- recovery/docking/reintegration.

Only after these work should the mothership connect to strategic target selection.

---

# 23. Measurement and certification

For each PoC capture:

- reserve at start/end;
- hover energy consumed;
- movement energy consumed;
- launch energy committed;
- active/committed energy;
- crash threshold;
- time from critical threshold to ground impact;
- ship altitude profile;
- stabilization error at high/medium/critical reserve;
- active mesh count;
- frame-time impact;
- screenshot/video from raider and defender views.

Visual certification questions:

1. Does the mothership look related to R1/R2/R3?
2. Is it obviously not a tower or flying fortress?
3. Can the player see the finite central reservoir?
4. Does raider launch visibly consume that reserve?
5. Does low reserve make the ship feel increasingly unsustainable?
6. Does gravity-driven failure look physically continuous?
7. Does the resulting hulk remain recognizable?
8. Does the defending player understand that surviving the raid defeated the enemy mothership?

---

# 24. Non-goals

Do not turn the mothership into:

- a gunship;
- an RTS base in the sky;
- a tech-tree screen;
- a boss health bar;
- an invulnerable spectator object;
- a conventional spacecraft asset;
- an infinite spawn source;
- a separate fuel-economy minigame;
- a cinematic set piece disconnected from physics.

---

# 25. Canonical summary

The raider side follows one visual and systemic idea:

**Energy becomes spherical mobile matter.**

The mothership is a large spherical cage around a visible finite teal reserve. It spends that reserve to float, move and construct smaller spherical raider shells. Those raiders do not shoot; their mass, shells and remaining energy are their weapons. Successful raiders return through the same teal flow that extracts energy from a breached silo.

If the raid fails for long enough, the mothership cannot sustain itself. Its core fades, its suspension weakens, gravity takes over, and the entire vessel falls as a massive physical hulk. A surviving defender may see that wreck remain on the horizon or battlefield edge.

The attackers therefore never come from nowhere. They are the disposable extensions of another finite system trying to survive.