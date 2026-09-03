# Defend / Return Fire — Game Design Manual

**Status:** Living design source of truth  
**Last major synthesis:** 2026-09-03  
**Baseline code reference:** `master` at `f429d68de64d53bf05bc48014fdc29435a467853`  
**Primary design threads:** #29, #72, #73, #74, #76, #79  
**Behavioral certification:** #30

> Focused implementation-facing chapters extend this manual under `docs/design/`, including physical energy flow/world ecology and the raider mothership perspective. They use the same Canonical / Current baseline / Experimental semantics as this manual.

---

## How to use this manual

This manual defines the intended identity, systems, campaign structure, tactical roles, presentation rules, and balance philosophy for **Defend / Return Fire**. It is not a snapshot of every legacy implementation detail and it is not a license to preserve defects merely because they exist in old code.

Every substantial design statement should be understood as one of three classes:

- **Canonical principle** — part of the game’s identity and should not be changed casually. Changing it requires an explicit design decision in GitHub issues.
- **Current baseline** — a measurable property of the existing game. It is useful for parity and comparison, but may be intentionally rebalanced or reimplemented.
- **Experimental hypothesis** — a proposed rule, number, pacing model, or progression structure that must be tested before becoming canonical.

When implementation and this manual disagree, first determine whether the discrepancy is a bug, an obsolete implementation technique, a deliberate newer design decision, or a manual defect. GitHub issues are the durable place for resolving that disagreement.

The guiding rule from #29 remains:

> Preserve the principle and observed gameplay outcome, not necessarily the legacy implementation technique.

---

# 1. High concept

## 1.1 One-sentence pitch

**Defend is a physics-driven resource-survival strategy game in which the player first protects a finite energy silo with temporary defenses, then discovers that successful deterrence causes resource starvation and is forced to transform that silo into a mothership and raid other fortresses using the same physical units they once defended against.**

## 1.2 Player fantasy

The player is not primarily a commander collecting units or a builder maximizing a tech tree. The player is a **custodian of a fragile physical system**.

At first, that means holding a fortress together:

- preserve the energy reserve;
- use a small inherited defensive network intelligently;
- reshape enemy movement with obstacles and momentum;
- decide when scarce energy is worth converting into temporary defenses;
- survive without overbuilding.

Later, the same responsibility changes form. The player becomes the custodian of a mothership whose finite energy can only be replenished through risky raids. The moral role changes, but the systemic responsibility does not.

The game should consistently make the player feel:

- **responsible** for a finite resource;
- **clever** when spatial/physical interactions solve a problem without brute force;
- **vulnerable** because every defense and raid has an opportunity cost;
- **surprised** when apparently successful strategies reveal longer-term consequences;
- **complicit** when the player eventually performs the same actions once perceived as hostile.

## 1.3 Genre position

Defend is adjacent to tower defense, physics strategy, survival, and tactical resource management, but should not collapse into any one of them.

It is specifically **not** intended to become:

- a fixed-path lane tower-defense game;
- a conventional RTS with large unit-selection and command layers;
- a clicker/resource-idle game;
- a stat-heavy RPG progression system;
- a damage-type rock-paper-scissors game;
- a cinematic character-driven science-fiction game detached from the simulation.

Its identity comes from **physical systems, finite energy, direct world interaction, temporary infrastructure, and perspective reversal**.

---

# 2. Core design pillars

## 2.1 Energy is everything

**Canonical principle.** Energy is simultaneously:

1. the player’s health/survival reserve;
2. the construction budget for defensive structures;
3. the resource being defended or stolen;
4. the means by which combat activity sustains the system;
5. later, the mothership’s launch budget and operating reserve.

Avoid introducing parallel currencies unless a future design proves that a separate resource is indispensable. The elegance of the game depends on many decisions competing for the same reserve.

A unit of energy spent on a tower is energy that is no longer available as a safety margin. A raider launched from the mothership is energy exposed to risk. Damage and resource economics should remain visibly related.

## 2.2 Physics is gameplay

**Canonical principle.** Mass, size, momentum, collision, obstruction, friction, gravity, inertia, line of fire, projectile travel, knockback, rolling, bouncing, falling, and ejection are not cosmetic simulation details. They are tactical variables.

A good outcome may be achieved by:

- destroying an enemy;
- weakening it;
- delaying it until finite-life decay reduces its value;
- redirecting it;
- blocking it;
- trapping it temporarily;
- forcing it into a worse approach;
- pushing it off the arena;
- causing it to collide with other bodies or geometry;
- making a valuable raider arrive too damaged to be economically profitable.

Do not replace these outcomes with hidden dice-roll abstractions simply to simplify balancing or testing.

## 2.3 Time is a weapon

**Canonical principle.** Enemies/raiders are finite-lived. Their viability decays over time.

This means delay itself has value. A Tower 1 barrier that never deals damage can still be strategically decisive if it forces an attacker to spend enough time moving around it.

The same principle becomes economically legible after the campaign inversion: a delayed raider loses extraction value as its health decays.

## 2.4 Temporary defense, not permanent accumulation

**Canonical principle.** Towers age and degrade. Defensive construction is an expenditure that buys a period of control, not permanent ownership of battlefield power.

Higher tower levels should represent a deeper temporary commitment rather than permanent technological superiority.

The lifecycle concept is:

`Tower 3 → Tower 2 → Tower 1 → gone`

The exact timing may change through balance work, but the principle of degradation should remain.

## 2.5 Offense sustains defense

**Canonical principle.** Successful engagement with raiders replenishes energy. The player is not rewarded for passive invulnerability alone.

In the current baseline, projectile hits restore energy in proportion to projectile damage. This creates a productive tension:

- combat is dangerous;
- combat is also economically useful;
- preventing all future combat eventually becomes its own strategic problem.

This relationship is the foundation of the campaign’s deterrence twist.

## 2.6 Every type must have a reason to exist

**Canonical principle.** All three tower types and all three raider/enemy types must remain meaningfully selectable or threatening throughout the game.

No type should become a strict obsolete predecessor once another type is available.

Differences should primarily emerge from:

- size;
- mass;
- momentum transfer;
- range;
- cadence;
- projectile packet size;
- obstruction;
- spatial footprint;
- finite lifetime;
- cost and risk concentration;
- target-switching reliability;
- corridor access;
- tactical context.

Prefer continuous physical trade-offs over hidden type bonuses or immunities.

## 2.7 The game should explain itself through the world

**Canonical principle.** The player should learn through geometry, motion, color, sound, and consequences rather than through heavy text exposition.

The campaign’s central reveal should be understandable without dialogue:

**The thing the player defended becomes the thing that launched the enemies the player was defending against.**

---

# 3. Core systemic loop

The game has two perspectives on one underlying economy.

## 3.1 Defender loop

1. Protect the energy silo.
2. Observe incoming raid composition and approach geometry.
3. Reposition strategic emphasis through Tower 1 placement and tower upgrades.
4. Damage, delay, redirect, or eject attackers.
5. Recover energy through successful engagement.
6. Spend some of that energy maintaining or reshaping the defense.
7. Survive long enough to face evolving raid behavior.
8. Eventually become so effective that the target is no longer worth raiding.
9. Discover that peace also means loss of resource inflow.
10. Watch defenses age while the reserve declines toward transformation.

## 3.2 Raider loop

1. Observe an AI-defended silo from the mothership.
2. Evaluate the defensive geometry and likely return.
3. Commit finite energy to one or more raider bodies.
4. Choose insertion position, timing, formation, and initial vector.
5. Allow physics and limited tactical interventions to govern the approach.
6. Preserve raider viability long enough to reach the silo.
7. Extract energy according to surviving viability.
8. Compare extraction against launch and operating costs.
9. Use successful raids to keep the mothership alive and finance future attempts.
10. Decide whether continued attacks on this fortress remain economically rational.

The second half should feel like the player has been taught the opposing side’s mechanics in advance rather than being switched into a different game.

---

# 4. Campaign structure

## 4.1 Act I — Custodian

The game begins with a **prebuilt, functional, minimal fortress**.

The player should not begin on an empty board. Starting from an inherited structure immediately creates responsibility and teaches preservation.

The fortress should contain all three tower roles from the beginning.

### Experimental starting layout

A strong baseline candidate is:

- central energy silo;
- one Tower 1 barrier;
- one Tower 2 interceptor;
- one Tower 3 siege cannon.

At current construction economics, the replacement value of one of each is:

- T1: 3,000;
- fresh-cell T2: 3,000 + 6,000 = 9,000;
- fresh-cell T3: 3,000 + 6,000 + 9,000 = 18,000;
- total: **30,000**, exactly the current maximum silo reserve.

This is a useful narrative/economic alignment: the inherited minimal fortress is roughly equivalent to an entire full reserve and therefore cannot be casually duplicated.

Test variants with additional T1 barriers if one-of-each proves too sparse for readable onboarding.

### Early lessons

The first encounters should teach, through play:

1. the silo is the thing that matters;
2. energy is finite;
3. each tower has a different physical role;
4. enemies are also potential resource events;
5. barriers can be useful without dealing damage;
6. enemies can be defeated by displacement or delay;
7. towers are temporary.

Avoid front-loading abstract numeric explanations.

## 4.2 Act II — Fortification

Raid compositions become more varied. The player begins modifying the inherited defense rather than merely preserving it.

The important progression is not “unlock stronger tower.” All three tower types are already conceptually present. Progression comes from:

- greater spatial complexity;
- mixed raider compositions;
- more difficult approach geometry;
- tighter energy margins;
- greater consequences for poor placement;
- learning when not to spend;
- learning to exploit edges, corridors, and momentum.

During this act, the game begins tracking the economic success of attacking factions.

## 4.3 Act III — Deterrence

As the player becomes consistently effective, attacks should change behavior rather than scale upward forever.

Desired progression:

1. normal raids;
2. altered compositions intended to probe weaknesses;
3. more cheap scouts and fewer expensive commitments;
4. longer pauses between attacks;
5. isolated scouting attempts;
6. cessation when repeated attempts are clearly unprofitable.

The player should initially interpret this as victory.

The atmosphere should become quieter. Towers continue aging. Energy stops rebounding because there is no combat. The fortress becomes increasingly difficult to sustain.

The absence of enemies becomes a threat.

## 4.4 Act IV — Last Reserve

At a critical energy threshold, the silo initiates a survival protocol.

The transformation should happen **physically in the existing world**.

The current resource silo is already an abstract low 40×40 structure with an energy-meter volume. The mothership should emerge by reconfiguring this existing visual language:

- segments separate or unfold;
- the energy meter becomes a visible core;
- static support volumes become propulsion/deployment structures;
- emissive energy states become engine/launch cues;
- the object lifts away from the grid;
- the camera migrates with it.

The original fortress remains visible below as a deteriorating relic when performance and framing allow.

The player should recognize the transformation before text explains it.

## 4.5 Act V — Raider

The camera now belongs to the mothership above another fortress.

This reveals the origin of the first act’s enemies: they entered from above because they were deployed from equivalent motherships.

The player now uses Raider 1/2/3 against AI-controlled Tower 1/2/3 defenses.

The same physical rules should apply to both sides.

### Mothership identity

The raider mothership is a large spherical/faceted relative of the raiders, not a flying tower. Its centrally located teal energy reservoir remains visibly exposed through a simple cage/ring/strut structure. It does not shoot. Its reserve pays for suspension, meaningful movement, raider construction/deployment and survival.

Raiders likewise do not shoot: their shells, mass, inertia, collision and remaining viability are their weapons.

A raid cannot remain open indefinitely. Hover consumes a small amount of the same teal reserve. If the mothership fails to replenish itself and can no longer sustain lift, it physically falls under gravity and remains as a recognizable hulk that may be visible to a defending survivor.

The detailed visual, camera, energy, crash and PoC contract is maintained in `docs/design/MOTHERSHIP_AND_RAIDER_PERSPECTIVE.md` and issue #79.

## 4.6 Act VI — Break, accept, or reshape the cycle

**Open design space, not yet canonical.**

Late campaign content should leave room for a deeper systemic conclusion rather than endless raid repetition.

Possible directions include:

- discovering a slow sustainable source that reduces but does not erase scarcity;
- forming a distributed energy-sharing network;
- restoring abandoned installations;
- creating an ecology in which deterrence does not become complete isolation;
- confronting a fortress so optimized for defense that it is already dying from its own success;
- choosing whether to perpetuate the cycle or restructure it.

The thematic question is:

**Can a system survive without forcing another system into scarcity?**

Do not commit to a single ending until the core loops are proven enjoyable from both perspectives.

---

# 5. The energy economy

## 5.1 Defensive economy

### Current baseline

- maximum / initial full reserve: 30,000;
- Tower 1 construction: 3,000;
- current upgrade construction cost is full target-level cost, producing cumulative empty-cell investments of 3,000 / 9,000 / 18,000 for T1/T2/T3;
- projectile-hit energy recovery ratio: 0.14 × projectile hit value;
- silo collision loss: remaining enemy HP / 2.

These numbers are baseline observations, not immutable final balance.

### Design intent

Energy decisions should create tension between:

- immediate survival buffer;
- spending on geometry;
- spending on higher-tier firepower;
- preserving enough reserve to absorb mistakes;
- accepting that towers will decay.

A player with a full reserve should still have meaningful reasons not to spend all of it.

## 5.2 Raider economy

### Experimental symmetric model

Candidate launch cost:

`launchCost(level) = 3000 × level²`

Candidate extraction rule:

`grossExtraction = remainingRaiderHP / 2`

Using current baseline HP values:

| Raider | Launch cost | Full-health extraction | Gross return / cost | Break-even remaining HP |
| --- | ---: | ---: | ---: | ---: |
| R1 | 3,000 | 7,720 | 2.57× | 38.9% |
| R2 | 12,000 | 30,440 | 2.54× | 39.4% |
| R3 | 27,000 | 68,160 | 2.52× | 39.6% |

This near-common ~40% health break-even is desirable because it allows tier choice to be governed by tactics rather than one unit having an obviously superior economic curve.

### Desired raid outcome bands

- **65–100% remaining viability:** strong success; meaningful surplus.
- **40–65%:** marginal success; small surplus after costs.
- **Below ~40%:** Pyrrhic success; physically reaching the silo may still lose energy overall.

Exact thresholds must be tuned after representative fixtures.

## 5.3 Operating pressure

The mothership should incur a modest operating drain or periodic overhead.

Purpose:

- prevent infinite passive waiting;
- make target selection meaningful;
- create pressure after failed raids;
- mirror the fortress’s dependence on continued interaction.

The drain must be slow enough to preserve observation and planning. It should not become an arcade timer.

The mothership perspective chapter further requires this operating pressure to be physically legible through the exposed central reserve and suspension stability. The operating drain, movement, raider deployment and survival remain one teal-energy economy rather than separate fuel/ammunition resources.

## 5.4 No dominant farming exploit

The defender must never be incentivized to deliberately allow attackers to strike the silo as the best way to farm energy.

The economy should ensure:

- projectile engagement rewards fighting;
- actual silo contact remains dangerous;
- deterrence responds to attacker outcomes, not merely tower count;
- intentionally under-defending produces real loss risk;
- the player cannot perfectly manufacture profitable incoming raids.

---

# 6. Tower system

The three tower levels are not three grades of the same gun. They are three distinct battlefield tools.

## 6.1 Tower 1 — Barrier / Deflector

### Identity

**Cheapest spatial-control tool. No direct weapon.**

Tower 1 exists to change routes, time, and collision geometry.

### Current baseline

- directly placeable;
- 10 × 10 base footprint;
- height 3;
- static physics body (`mass: 0`);
- restitution 0;
- no turret;
- no projectile;
- current construction cost 3,000;
- current active lifetime approximately 25 s followed by an approximately 4 s terminal/degradation interval.

### Tactical purposes

- lengthen paths;
- create choke points;
- funnel enemies toward coverage;
- protect vulnerable approach directions;
- redirect rolling bodies;
- create collision opportunities;
- set up edge ejections;
- separate a mixed raid;
- consume time so finite-life decay weakens attackers;
- act as physical cover/obstruction where line-of-fire rules make that meaningful.

### Design requirement

Tower 1 must remain useful even when the player can afford Tower 3.

It should never be redesigned as a weak automatic turret simply for conventional progression clarity.

## 6.2 Tower 2 — Interceptor

### Identity

**Frequent, granular, responsive fire.**

Tower 2 is the primary anti-swarm and mixed-threat control tower.

### Current baseline

- acquired by upgrading T1;
- 10 × 10 base;
- approximately 1.33-wide × 6-high pillar;
- approximately 6-wide turret body;
- static structure;
- range: 90;
- shot interval: approximately 208 ms;
- projectile damage/HP: 1,760;
- projectile mass: 120;
- projectile launch impulse magnitude: 26,560;
- projectile geometry roughly 0.8 wide × 0.73 high × 6 long;
- nominal direct-damage throughput: ~8,462 HP/s;
- nominal launch-impulse throughput: ~127,692 impulse units/s;
- degrades to T1 after its lifetime.

### Tactical purposes

- light-raider suppression;
- rapid target switching;
- continuous steering/knockback;
- low-overkill damage delivery;
- reliable fire into mixed groups;
- frequent corrections when targets change direction;
- holding congested approaches where a missed shot should not create a long exposure window.

### Weaknesses

- shorter range than T3;
- smaller single-hit momentum transfer;
- less capable of one-shot dramatic displacement of very heavy bodies;
- frequent shots can be consumed by low-value targets or obstruction.

## 6.3 Tower 3 — Siege / Impulse Cannon

### Identity

**Long-range, high-consequence physical intervention.**

Tower 3 should be selected because the player wants a large momentum packet at long range, not because it simply produces more DPS.

### Current baseline

- acquired by upgrading T2;
- 10 × 10 base;
- approximately 2-wide × 9-high pillar;
- approximately 9-wide turret body;
- range: 135;
- shot interval: approximately 702 ms;
- projectile damage/HP: 5,940;
- projectile mass: 270;
- projectile launch impulse magnitude: 89,640;
- projectile geometry roughly 1.36 wide × 1.21 high × 22 long;
- nominal damage and launch-impulse throughput are almost equal to T2 because packet size and cadence scale together;
- each individual shot is 3.375× the T2 damage/impulse packet while cadence is 3.375× slower;
- degrades to T2, then eventually T1.

### Tactical purposes

- early long-range engagement;
- heavy-raider displacement;
- edge-ejection attempts;
- breaking dangerous momentum before the target reaches dense defensive geometry;
- concentrating force into high-value targets;
- punishing exposed approach lanes.

### Weaknesses

- large delay between shots;
- greater consequence for misses;
- greater overkill risk against light targets;
- larger projectile geometry may be more susceptible to obstruction;
- high capital concentration;
- slower target correction.

## 6.4 Tower relationship rule

T2 and T3 should remain **sidegrades across context**, not a simple DPS ladder.

A good player should be able to look at the battlefield and reasonably choose either:

- T2 because many small, changing, or partially damaged targets need granular control;
- T3 because one distant/heavy target needs decisive displacement or early interception.

## 6.5 Targeting

Current baseline behavior is nearest-target tracking.

Future targeting improvements may add lightweight policy without becoming menu-heavy.

Possible player-facing or AI policies:

- nearest;
- highest remaining threat;
- heaviest;
- closest to edge-ejection opportunity;
- closest to silo;
- preserve current target unless a significantly more urgent target appears.

Avoid complex per-tower configuration panels. Targeting should remain readable from world behavior.

---

# 7. Raider / enemy system

The same three physical bodies act as enemies during the defensive campaign and as player-deployed raiders after the inversion.

## 7.1 Shared principles

All raiders:

- are finite-lived;
- are physical bodies;
- can be damaged, blocked, redirected, delayed, or ejected;
- have extraction value tied to surviving viability;
- should interact with tower geometry through ordinary collision rules;
- should remain useful in late game for distinct tactical reasons;
- do not carry ranged weapons; their shell/body, mass, momentum and survival are their offensive capability.

## 7.2 Raider 1 — Scout / Swarm Raider

### Identity

**Cheap, small, numerous, flexible.**

### Current baseline

- IcoSphere subdivisions: 1;
- diameter: 6;
- mass: 5,400;
- HP: 15,440;
- movement impulse per decision: 7,400;
- full-health silo impact/extraction magnitude under current symmetry: 7,720;
- nominal no-damage decay-to-zero duration: ~85 s at configured cadence.

### Tactical purposes

- probe defenses;
- exploit narrow corridors;
- absorb or split tower targeting;
- test route geometry cheaply;
- create saturation;
- use numbers rather than durability;
- produce modest extraction without concentrating too much energy in one body;
- bait expensive T3 shots.

### Required late-game relevance

R1 should remain useful through position, numbers, timing, and geometry rather than inflated HP.

## 7.3 Raider 2 — Breaker

### Identity

**Medium/heavy pressure unit that challenges ordinary defensive integrity.**

### Current baseline

- IcoSphere subdivisions: 2;
- diameter: 9;
- mass: 21,600;
- HP: 60,880;
- movement impulse per decision: 29,600;
- full-health silo impact/extraction: 30,440;
- nominal natural decay duration: ~335 s;
- physical width close to one 10-unit tower/grid cell.

### Tactical purposes

- survive sustained interceptor pressure longer than R1;
- push through or destabilize ordinary routing plans;
- create reliable medium-cost pressure;
- exploit corridors that are marginal for large bodies;
- serve as the general-purpose raider when a Titan would concentrate too much risk.

### Design requirement

R2 should not merely be “smaller R3.” Its cost, geometry, and reliability should make it the dependable middle option.

## 7.4 Raider 3 — Titan / Siege Boulder

### Identity

**Large, persistent, high-risk/high-value physical commitment.**

### Current baseline

- IcoSphere subdivisions: 3;
- diameter: 14;
- mass: 48,600;
- HP: 136,320;
- movement impulse per decision: 66,600;
- full-health silo impact/extraction: 68,160;
- nominal natural decay duration: ~750 s;
- physically wider than one 10-unit grid footprint.

### Tactical purposes

- absorb large amounts of sustained fire;
- resist casual displacement;
- challenge corridor geometry through size;
- carry very high extraction potential;
- force defenders to commit heavy impulse or long-term control;
- create a strategic centerpiece around which cheaper raiders can be timed.

### Required weakness

R3 must represent risk concentration. Losing, trapping, delaying, or ejecting a Titan should be economically painful to the attacker.

It must not dominate R1/R2 merely through efficiency.

## 7.5 Mobility differentiation

### Current baseline concern

Enemy movement impulse and mass both scale approximately with level², so `impulse / mass` is nearly constant across tiers. This means current translational response to AI movement impulses is broadly similar.

### Design target

The final movement model should create distinct perceived motion without abandoning physics.

Desired qualitative behavior:

- R1: quick to redirect, lively, sensitive to collision/knockback;
- R2: stable and persistent, moderate redirection cost;
- R3: deliberate, high inertia, slower to meaningfully alter course once committed.

Achieve this through real mass, impulse, friction, rotational behavior, control cadence, or force application—not hidden speed-class labels alone.

---

# 8. Physical battlefield design

## 8.1 The grid is placement structure, not a path network

Tower placement currently aligns to a 10-unit grid. This is useful for readable defensive construction, but enemies should remain free physical bodies rather than pathfinding tokens confined to grid lanes.

The grid should help players reason about:

- tower footprints;
- corridor widths;
- silo protection zones;
- likely passages;
- large-body accessibility.

## 8.2 Size should matter

Current diameters 6 / 9 / 14 against a 10-unit tower footprint naturally create useful spatial classes:

- R1 can comfortably navigate narrower openings;
- R2 is close to cell width and should experience marginal channels differently;
- R3 is wider than one cell and should require substantial clearance.

Level design and physics tuning should preserve this distinction.

## 8.3 Edges are tactical terrain

Falling or being ejected should remain a legitimate form of defeat.

Arena boundaries therefore create strategic zones:

- central areas favor sustained damage and routing;
- edge areas increase the value of impulse;
- barriers near edges can convert small redirections into eliminations;
- T3 gains situational value from high momentum transfer;
- attackers may choose safer longer routes over risky edge approaches.

## 8.4 Friendly obstruction

Projectiles and structures should obey clear line-of-fire rules.

Whether towers can fire through friendly geometry is a design-sensitive question tracked separately. The final rule should be physically legible.

If obstruction is enabled:

- barriers gain additional placement trade-offs;
- T3’s larger projectile becomes more context-sensitive;
- dense fortresses may become self-defeating;
- firing lanes become a first-class design concern.

Avoid invisible exceptions that cause projectiles to pass through objects the player expects to block them.

---

# 9. Combat model

## 9.1 Damage and momentum are co-equal

A projectile interaction has at least two important outputs:

- loss of enemy viability / HP;
- physical change in momentum.

Balance work must inspect both. A projectile can be strategically valuable even when its raw damage contribution is not exceptional.

## 9.2 Packet size matters

T2 and T3 intentionally have similar nominal damage/impulse throughput but different packet sizes and cadence.

This should produce differences in:

- overkill;
- miss cost;
- target switching;
- displacement per event;
- obstruction risk;
- timing windows;
- edge-ejection potential.

## 9.3 No hidden anti-type bonuses by default

Do not introduce rules such as:

- +50% damage against Titans;
- R1 immunity to T3;
- armor categories;
- elemental weaknesses.

If a matchup is weak, first adjust physical/economic properties that the player can perceive.

---

# 10. Finite life and delay

Enemy/raider health naturally decays over time.

This mechanic should remain strategically central.

Delay can come from:

- barriers;
- collision congestion;
- long routing;
- poor insertion;
- knockback;
- getting trapped against geometry;
- recovering from high-energy impacts.

After the inversion, finite life directly reduces raid extraction value, making delay economically visible from both sides.

---

# 11. Energy as physical matter

The detailed physical-energy contract is maintained in `docs/design/ENERGY_FLOW_AND_WORLD_ECOLOGY.md` and issue #76.

Canonical direction:

- recovered teal energy spills at the actual hit location;
- it pools/coalesces/streams toward the defending silo;
- ownership changes when energy physically arrives rather than by hidden teleportation;
- a successful raid reverses the flow from silo to mothership;
- surviving raiders use the same upward stream to evacuate;
- distant teal signatures represent the same energy ecology at strategic scale.

The implementation may use aggregate authoritative packets plus procedural/GPU visual fluid. Rendered particle count must never determine conserved economic value.

---

# 12. Mothership physical lifecycle

The detailed contract is maintained in `docs/design/MOTHERSHIP_AND_RAIDER_PERSPECTIVE.md` and issue #79.

Canonical direction:

- spherical/mobile raider-family geometry contrasts with rectilinear/rooted defense;
- central teal reserve is exposed and readable;
- mothership has no direct weapon;
- raiders use their bodies/shells as weapons;
- same reserve pays for hover, movement, launches and survival;
- hover drain prevents infinite raids;
- reserve depletion physically weakens suspension;
- loss of lift transitions continuously into gravity-driven failure;
- the crashed vessel remains a recognizable hulk;
- a defending survivor may witness that hulk as evidence that the attacking faction itself had finite resources.

This makes time pressure symmetric: delaying deployed raiders also consumes the mothership's operating reserve.

---

# 13. Strategic world ecology

Distant silos/mothership targets should be represented as teal energy signatures rather than mission cards.

Broad reading:

- brighter signatures tend to mean more energy/activity and therefore greater reward and stronger maintained defenses;
- dimmer signatures tend to mean less energy/activity and more deterioration, therefore easier but less rewarding raids;
- these relationships should emerge from energy throughput, raid frequency and maintenance rather than arbitrary difficulty tags;
- signatures may brighten, dim, flare, disappear on conversion, or reappear on settlement.

The strategic sky should be a live readout of the same scarcity ecology the player experiences locally.

---

# 14. AI defender fairness

Ground defenders in the raider phase should obey the same core constraints as player defenses:

- energy budget;
- tower costs;
- tower aging;
- range;
- cadence;
- projectile physics;
- obstruction;
- finite maintenance consequences.

The AI may be tactically competent, but it should not receive hidden damage/mass/range/cooldown bonuses.

The goal is for the player to recognize the same tower system from the other side.

---

# 15. Input and direct control

Defender play should remain world-first:

- point/tap to place or upgrade;
- camera movement should not require mode-heavy UI;
- important tower states should be visible in-world.

Raider play should likewise focus on physical commitments:

- choose raider tier;
- choose insertion position;
- choose timing;
- choose initial vector/impulse;
- optionally make sparse high-level interventions after launch.

Avoid continuous RTS-style unit steering, attack commands, selection boxes, or ability bars.

---

# 16. Camera

The defender camera should frame the arena as a physical tabletop/stronghold while preserving depth and edge awareness.

The raider camera belongs to the mothership but should not become a cockpit. Preferred direction:

- elevated/offset orbit anchored to the ship;
- enough hull/core remains visible to preserve physical ownership;
- battlefield below remains readable;
- camera look can remain largely free while actual mothership translation has economic/physical meaning;
- defender-view experiments should show the same mothership overhead and its possible crash.

---

# 17. Visual language

## 17.1 Geometry

Prefer:

- primitive/generated forms;
- low-poly faceting;
- visible structure;
- scale and motion over surface detail.

### Defense

- boxes;
- pillars;
- rectilinear bases;
- ground anchoring.

### Raiders / mothership

- spheres;
- faceted cages;
- toroidal/radial rings;
- exposed internals;
- mobile/rolling/falling bodies.

## 17.2 Color/material semantics

Color should carry state and family information but not be the only cue.

Current direction:

- teal/cyan — energy/resource/viability;
- green — defensive constructed infrastructure;
- purple/magenta — raider shells/living hostile physical bodies;
- orange — high-energy tower projectile/impulse events;
- damaged/depleted states — reduced emission, fragmentation, altered material response.

Use volume, motion, shape and audio redundantly for accessibility.

---

# 18. Audio

Object-based spatial/procedural audio is part of the intended product identity.

Important emitters include:

- projectiles in flight;
- projectile impacts;
- raider rolling/collisions;
- tower mechanisms;
- energy pooling/streaming;
- mothership suspension;
- raider assembly/launch;
- upward extraction;
- mothership loss of lift/crash;
- large fragments.

Each important moving emitter should expose:

- 3D position;
- velocity/vector;
- magnitude/intensity parameters;
- lifetime;
- listener-relative distance/importance.

Use Doppler/fly-by effects where relative motion justifies them. Prioritize nearby/tactically important sounds under load. Prefer worker/worklet separation where it improves main-loop stability.

---

# 19. Performance

Performance is a gameplay constraint.

Priorities:

1. simulation fidelity;
2. input responsiveness;
3. camera/visual stability;
4. tactical readability;
5. rich fluid/fragment effects.

Visual effects should degrade before core physical outcomes.

For energy fluid and mothership effects:

- authoritative aggregate simulation should be small;
- particle/mesh density may LOD aggressively;
- distant motherships/wrecks should simplify;
- crash fragment counts must be bounded;
- audio emitters should aggregate/prioritize.

---

# 20. Accessibility

The game should remain playable/readable without relying on one sensory channel.

Examples:

- energy reserve shown via shape/volume and optional number, not only teal brightness;
- critical mothership lift shown through sag/motion/audio as well as color;
- tower roles readable by geometry and cadence;
- focus/selection states use shape/outline/motion where appropriate;
- reduced camera shake/motion options;
- keyboard/controller/touch parity where feasible;
- sound should reinforce but not be required to perceive critical state changes.

---

# 21. Balance philosophy

A good balance state is not one where every unit has equal efficiency everywhere.

It is one where:

- every tower can be the right choice in some plausible context;
- every raider can be the right investment in some plausible context;
- physical geometry explains much of the matchup;
- expensive choices concentrate risk;
- delay, displacement and ejection can substitute for raw damage;
- the same systems remain meaningful from both perspectives.

Avoid balancing solely around aggregate DPS.

---

# 22. Required matchup measurement

For the T1/T2/T3 × R1/R2/R3 matrix, measure where applicable:

- time to kill;
- time to eject;
- displacement per shot/second;
- overkill;
- missed-shot cost;
- corridor access;
- time added by T1 barriers;
- energy recovered by defender;
- energy/viability remaining at silo;
- attacker launch cost;
- extraction return;
- mothership hover cost during the engagement;
- total attacker ROI.

Run center-field, choke and edge scenarios.

---

# 23. Campaign pacing experiments

Required experiments include:

- minimal prebuilt fortress viability;
- one-of-each tower replacement economics;
- raid confidence/deterrence progression;
- prolonged peace/defensive degradation;
- physical energy-flow collection delay;
- mothership hover drain timing;
- raider launch ROI;
- AI defense competence without cheats;
- successful extraction/evacuation duration;
- mothership critical reserve/crash readability;
- strategic bright/dim target selection.

---

# 24. Certification principles

Do not accept a balance or engine change based only on source-level equivalence when the behavior is physical.

Use:

- pure calculation tests for arithmetic;
- deterministic seams for clocks/RNG;
- browser/runtime fixtures for physics;
- visual/browser certification for geometry/readability;
- profiling for constrained-device impact;
- before/after evidence linked to exact commits.

Issue #30 remains the baseline behavioral contract.

---

# 25. Open design questions

Keep these experimental until evidence exists:

- exact final tower lifetimes;
- exact enemy decay timing model;
- final line-of-fire/friendly obstruction behavior;
- final R1/R2/R3 movement differentiation;
- exact deterrence confidence formula;
- final raider launch costs/extraction caps;
- exact mothership hover/movement drain;
- exact lift reserve threshold;
- whether withdrawal is always possible;
- whether defenders can exceptionally interact with low motherships;
- whether mothership wrecks become gameplay terrain;
- whether residual wreck energy is salvageable;
- final target travel costs;
- final campaign ending.

---

# 26. Non-goals / drift guardrails

Avoid turning Defend into:

- permanent tech-tree accumulation;
- dozens of stat-based unit variants;
- elemental damage typing;
- RPG/loot progression;
- conventional RTS micromanagement;
- a flying gunship game after the inversion;
- an invulnerable mothership spectator camera;
- separate fuel/ammo/energy currencies;
- infinite passive energy generation;
- AI stat cheats;
- authored cinematic spacecraft replacing the procedural visual language;
- a game where effects overwhelm simulation performance.

---

# 27. Development roadmap

A practical sequence is:

1. certify the legacy/current baseline (#30);
2. preserve/extract deterministic economy and scaling seams;
3. validate visible defender-side teal energy transfer (#77/#78);
4. validate mothership silhouette, exposed reserve, finite hover and crash (#79/#80/#81);
5. add R1 assembly/deployment from the mothership core;
6. extend to R2/R3 and validate physical differentiation;
7. implement upward silo extraction and shared raider evacuation;
8. implement AI-defended raider fixtures;
9. test deterrence and mothership operating economics together;
10. connect strategic teal-signature target ecology;
11. only then tune campaign pacing/end-state.

Each stage should remain independently inspectable and reversible.

---

# 28. Central design statement

**Defend is about survival through physical understanding under scarcity.**

The player first learns to protect a finite system from spherical raiders using temporary rectilinear defenses. Successful defense reveals that conflict itself was sustaining the economy. When deterrence becomes isolation, the silo transforms into a spherical mobile mothership whose visible reserve is spent to remain aloft and turn energy into raider bodies.

The player then confronts the same defenses from above. Raiders do not shoot; their own shells, mass, momentum and survival are their weapons. If the mothership cannot extract enough energy before its reserve is exhausted, its suspension fails and the ship itself falls into the world as a large inert hulk.

The role reversal therefore does not introduce a second game. It reveals that both sides have always been finite physical systems trying to survive the same scarcity cycle.