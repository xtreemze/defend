# Defend / Return Fire — Game Design Manual

**Status:** Living design source of truth  
**Last major synthesis:** 2026-09-03  
**Baseline code reference:** `master` at `f429d68de64d53bf05bc48014fdc29435a467853`  
**Primary design threads:** #29, #72, #73, #74  
**Behavioral certification:** #30

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
- should remain useful in late game for distinct tactical reasons.

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

A projectile has at least two important effects:

1. reduces viability/HP;
2. transfers physical momentum.

Balance changes should measure both.

A weapon that kills slowly but repeatedly alters trajectory can be strategically strong. A weapon that does high damage but transfers little useful momentum may be inappropriate for the game’s identity.

## 9.2 Damage should affect economics

Defender perspective:

- hits restore some energy;
- reducing enemy HP lowers damage if it reaches the silo.

Raider perspective:

- damage reduces eventual extraction value;
- a raid can physically succeed but economically fail.

This symmetry is important. Damage is not merely a binary route to death.

## 9.3 Overkill matters

Large packets create overkill risk.

This is one of T3’s intended trade-offs. A heavy shot spent on a nearly dead R1 should be less efficient than T2 granular fire, even if both towers have similar nominal throughput.

## 9.4 Misses matter

Projectile travel and collision should remain meaningful enough that a miss can create tactical exposure.

T3 misses should generally be more consequential because of its slower cadence.

Do not make all shots effectively hitscan unless a future engine requires it for accessibility/performance and an equivalent physical trade-off is preserved.

---

# 10. Raid deterrence system

## 10.1 Purpose

The campaign should not escalate enemy numbers forever. Rational attackers should stop committing resources to a target that consistently produces losses.

Deterrence connects gameplay mastery to the story inversion.

## 10.2 Hidden raid confidence

**Experimental model.** Track a rolling expected-value/confidence state based on recent raid outcomes.

Possible inputs:

- fraction of raiders reaching the silo;
- energy extracted per raid;
- attacker energy invested versus extracted;
- average remaining HP of successful raiders;
- kill rate;
- ejection rate;
- expiry/decay rate;
- average time to silo;
- observed defensive investment;
- current silo reward potential.

Use this value diagnostically during development. The final player-facing experience should rely mainly on behavior rather than a visible “raid confidence: 17%” stat.

## 10.3 Behavioral response

As confidence declines, attackers should change strategy before quitting:

1. reduce expensive commitments;
2. increase cheap probes;
3. vary insertion/origin;
4. lengthen intervals;
5. attempt isolated scouting raids;
6. stop when repeated probes remain unprofitable.

This creates foreshadowing for the later player-controlled raider economy.

## 10.4 Deterrence is not a punishment for good play

The player should initially perceive fewer raids as success. The later resource consequence should feel like a systemic truth, not an arbitrary “you defended too well” penalty.

The fortress should survive for a meaningful quiet period before crisis becomes unavoidable.

---

# 11. Mothership design

## 11.1 Function

The mothership is:

- the transformed energy silo;
- the player’s health/energy reserve;
- the camera/observation platform;
- the dropship origin for raiders;
- a visual explanation for the original enemies’ aerial origin.

## 11.2 It must remain the same object conceptually

Do not replace the silo with an unrelated spaceship asset.

The mothership should retain recognizable:

- proportions or sub-volumes;
- energy core language;
- materials;
- damage/depletion states;
- procedural construction vocabulary.

## 11.3 Camera

The raider-phase camera should feel attached to or associated with the mothership rather than becoming an omniscient RTS sky camera.

The camera establishes:

- where raiders come from;
- which insertion areas are physically plausible;
- the mothership’s vulnerability and position;
- continuity with the transformation scene.

Camera motion should preserve spatial comprehension and avoid excessive cinematic movement.

---

# 12. Raider control model

## 12.1 Pre-deployment decisions

The player should control:

- raider tier;
- number committed where multi-body deployment is allowed;
- insertion point within valid airspace;
- drop timing;
- formation spacing;
- initial drop/approach vector.

These are high-leverage physical decisions.

## 12.2 Post-deployment influence

Avoid frame-by-frame RTS micromanagement.

Possible limited interventions:

- choose one of a small set of objectives;
- issue a directional impulse/order with cooldown or energy cost;
- redirect toward a breach;
- stop reinforcing a failing raid;
- deploy a second body to exploit a newly created path.

Once deployed, physics should remain authoritative.

## 12.3 Desired feeling

The player should feel like they are **committing bodies into a physical system**, not puppeteering units around hazards.

A good insertion can be more valuable than many later corrections.

---

# 13. AI defenders

AI-controlled defenders appear primarily after the role inversion but can also support simulation, tutorials, and sandbox testing.

## 13.1 Fairness rule

AI uses the same:

- energy budget;
- tower costs;
- tower lifetimes;
- ranges;
- cadence;
- projectile damage;
- projectile mass;
- physics;
- placement rules;
- degradation rules.

No hidden stat bonuses.

Difficulty should come from decision quality, planning horizon, composition, geometry, and constrained reaction time.

## 13.2 Tower policy

### T1 AI

Use barriers to:

- lengthen routes;
- create chokepoints;
- protect the silo;
- separate likely approach lanes;
- create edge redirection opportunities;
- support firing lanes.

### T2 AI

Prioritize:

- nearby changing threats;
- light raiders;
- exposed low-HP targets where granular fire avoids overkill;
- targets that are about to escape a firing window.

### T3 AI

Prioritize situations where a heavy packet matters:

- R3 or heavy R2 threats;
- distant high-value targets;
- targets approaching the silo with high remaining viability;
- edge-ejection opportunities;
- clear long-range firing lanes.

## 13.3 AI readability

The player should be able to infer why an AI fortress is effective from its layout and behavior.

Avoid apparently psychic rebuilds or instantaneous perfect counter-placement.

---

# 14. Progression and difficulty

## 14.1 No conventional power ladder

The player should not simply unlock stronger numerical versions of existing tools.

Progression should mostly come from:

- harder physical problems;
- more complex mixed compositions;
- more demanding resource margins;
- new arena geometry;
- new drop/origin directions;
- intelligent defensive layouts;
- altered raid confidence behavior;
- increased need to combine all six roles.

## 14.2 Knowledge is progression

A significant part of mastery should be the player learning:

- how far bodies travel after impacts;
- which gaps admit which raiders;
- when a barrier is worth more than a gun;
- when T2 cadence is preferable to T3 packet size;
- when an apparently successful raid is economically bad;
- when preserving energy is more important than spending it;
- how to use edges;
- how finite life changes route value.

## 14.3 Difficulty knobs

Prefer adjusting:

- composition;
- timing;
- insertion origin;
- defender layout quality;
- operating pressure;
- available reserve;
- arena geometry;
- AI planning sophistication;
- confidence persistence;
- simultaneous-body count.

Be cautious with simply multiplying HP/damage.

---

# 15. Wave and encounter design

The historical wave table already demonstrates useful variety among pure and mixed compositions. Future encounter design should become more intentional about tactical purpose.

## 15.1 Encounter archetypes

### Probe

Mostly R1. Tests coverage, target switching, and small gaps.

### Breaker push

R2-heavy. Tests sustained control and route integrity.

### Titan commitment

R3-centered. Tests long-range engagement and large-body routing.

### Screen and hammer

R1 swarm protects or distracts from R2/R3.

### Mixed geometry

Different sizes make one route attractive to R1 while larger bodies require another.

### Edge threat

Insertion emphasizes ejection opportunities and risks.

### Resource trap

A wave that is easy to kill but expensive to overbuild against, testing restraint.

## 15.2 Encounter goals

Every encounter should be able to answer:

- Which existing player habit is being tested?
- Which tower/raider role gets an opportunity to matter?
- What physical interaction is likely to be memorable?
- What resource decision does the encounter create?

Avoid waves that differ only by larger counts.

---

# 16. Level and arena design

## 16.1 Arena readability

The battlefield should remain geometrically simple enough that the player can visually parse:

- the silo;
- tower footprints;
- major routes;
- edge hazards;
- incoming bodies;
- projectile lines;
- energy state.

## 16.2 Procedural/parametric geometry

Prefer generated or parameterized environments over bespoke decorative meshes where practical.

Variation can come from:

- platform shape;
- holes/gaps;
- slopes;
- raised or lowered sectors;
- friction zones if clearly communicated;
- obstacles;
- spawn/dropship orientation;
- silo position;
- usable tower-grid coverage.

## 16.3 Avoid decorative collision ambiguity

If an object appears solid, its collision behavior should be predictable. Keep decorative geometry from obscuring tactical boundaries.

---

# 17. Failure, success, and recovery

## 17.1 Defender failure

Primary failure occurs when the energy reserve is exhausted or the silo can no longer survive.

The player should understand whether loss resulted from:

- direct high-HP silo impact;
- overspending;
- poor routing;
- tower decay at a bad moment;
- inadequate target coverage;
- repeated resource inefficiency.

## 17.2 Raider failure

The mothership fails when it cannot sustain operating costs or finance viable raids.

A raid itself can fail in several ways:

- all bodies destroyed;
- bodies ejected;
- bodies expire through decay;
- bodies reach the silo with too little viability to repay cost;
- player invests too many reinforcements into a bad attempt.

## 17.3 Soft failure and recovery

Where possible, let poor decisions create deteriorating positions rather than immediate binary game-over states.

Examples:

- losing a T3 leaves a weaker T2 rather than nothing;
- a damaged raider can still extract some energy;
- an expensive failed raid reduces future options rather than instantly ending the run.

This supports strategic tension and learning.

---

# 18. Onboarding

## 18.1 Start from a working system

The player begins with a fortress that already functions. This allows learning by observation before construction.

## 18.2 Teach through need

Suggested onboarding sequence:

1. observe T2 engaging incoming R1s;
2. see T1 physically alter an approach;
3. witness T3 produce a large displacement;
4. receive enough energy from engagement to make the combat-resource link noticeable;
5. have one tower age/degrade visibly;
6. invite the player to replace or reshape one part of the fortress;
7. introduce mixed raider sizes so corridor geometry becomes obvious.

## 18.3 Minimal textual guidance

Use concise context prompts only where the world cannot clearly communicate the rule.

Avoid long tutorial modal sequences.

---

# 19. Interaction and input

## 19.1 Direct world manipulation

The default interaction model should remain grounded in the 3D battlefield.

Defender actions:

- point/tap/click ground to place T1;
- select/tap an existing tower to upgrade where allowed;
- inspect energy and lifecycle states from the world itself;
- manipulate camera without entering a separate build screen.

Raider actions:

- select body tier;
- point/tap/click valid insertion space;
- drag/aim or otherwise specify initial vector where appropriate;
- make sparse later interventions.

## 19.2 Input parity

Support should be designed for:

- mouse;
- touch;
- keyboard;
- gamepad/controller;

The exact gesture can differ, but strategic capability should not.

## 19.3 Avoid precision traps

Physics strategy benefits from precision, but mobile/touch interaction must not require tiny targets or pixel-perfect selection.

Use generous hit regions, snapping, previews, and clear invalid-placement feedback.

---

# 20. Camera design

## 20.1 Defender camera

The camera should provide enough overview to reason spatially while preserving the feeling of a physical arena rather than an abstract board.

Requirements:

- clear silo visibility;
- readable edges;
- enough depth cues to judge projectile travel and vertical motion;
- controllable without constant adjustment.

## 20.2 Mothership camera

After transformation, camera ownership migrates upward with the mothership.

This is both narrative and mechanical.

The player should immediately understand that:

- they are now occupying the attackers’ former perspective;
- the mothership is the deployment origin;
- drop position is spatially grounded.

## 20.3 Motion comfort

Avoid unnecessary camera shake or forced sweeping motions. Heavy impacts can be communicated through world motion, sound, and subtle camera response without compromising readability or accessibility.

---

# 21. Visual design language

## 21.1 Core aesthetic

**Canonical principle.** Preserve a procedural, abstract, geometric science-fiction identity.

Prefer:

- primitive/generated geometry;
- low-poly forms;
- wireframes where useful;
- simple strong silhouettes;
- emissive energy;
- material transitions;
- fragments and physical breakup;
- meaningful scale differences.

Avoid turning the game into asset-heavy military realism or character-centric sci-fi.

## 21.2 Current color language

Current baseline broadly establishes:

- towers: green living/construction language;
- raider energy/health: cyan/blue;
- projectile energy: orange emissive;
- damaged/dead states: red/orange family;
- hit/structural/wireframe states: darker purple/magenta language.

Exact colors may evolve, but semantic consistency matters more than specific RGB values.

## 21.3 Silhouette hierarchy

Players should identify type at a glance through shape and scale before relying on color.

- T1: broad, low barrier block;
- T2: moderate pillar/turret;
- T3: taller/larger artillery silhouette;
- R1: small coarse sphere;
- R2: medium sphere;
- R3: unmistakably large body.

## 21.4 Degradation

Tower aging should become visually legible before disappearance.

Use combinations of:

- material state changes;
- emissive reduction;
- wireframe exposure;
- fragmentation;
- structural collapse/reconfiguration;
- subtle motion or sound.

Do not rely only on a hidden timer.

## 21.5 Mothership transformation

The transformation should be a climax of the procedural visual language:

- existing volumes detach and reorganize;
- energy channels activate;
- static mass becomes suspended structure;
- the same materials acquire new function;
- no visual discontinuity suggesting a completely different asset set.

---

# 22. Effects

## 22.1 Effects communicate state

VFX should prioritize tactical readability:

- firing origin;
- projectile travel;
- impact location;
- damage state;
- ejection/fall;
- energy transfer;
- tower degradation;
- mothership energy expenditure/extraction.

## 22.2 Performance hierarchy

When performance pressure rises, reduce in this order where practical:

1. decorative particles;
2. glow/bloom complexity;
3. secondary fragments;
4. nonessential trails;
5. distant visual detail.

Preserve:

- body positions;
- physics fidelity;
- collision readability;
- projectile timing;
- tactical silhouettes.

---

# 23. Audio design

## 23.1 Audio is spatial simulation feedback

Sound should communicate physical events and distance rather than merely play UI samples.

The long-term target is **object-based spatial audio** in which relevant emitters have:

- 3D position;
- velocity vector;
- event/type metadata;
- importance/priority;
- distance from the listener/camera;
- lifecycle state.

## 23.2 Motion-aware sound

Projectile and body motion should support effects such as:

- Doppler shift;
- approach/recede cues;
- projectile fly-by / whoosh;
- impact localization;
- rolling/sliding motion where meaningful.

A projectile passing close to the camera should sound materially different from one crossing the far side of the arena.

## 23.3 Procedural audio

Prefer procedural or parameterized sound where it strengthens the abstract identity.

Parameters can include:

- tier;
- mass;
- velocity;
- impact energy;
- material type;
- distance;
- remaining energy;
- degradation stage.

## 23.4 Prioritization

Performance and clarity require sound prioritization.

Nearby, dangerous, or player-relevant emitters should take precedence over distant low-value events.

Potential priority inputs:

- distance to listener;
- threat to silo/mothership;
- event energy;
- whether event is currently visible;
- whether sound class is already saturated.

## 23.5 Threading/workers

Where platform capabilities allow, procedural sound generation and event processing should be isolated from the main gameplay/render loop using audio worklets/workers or equivalent independent execution.

The simulation should publish compact sound events rather than blocking on audio synthesis.

## 23.6 Dynamic mix across campaign

The deterrence act should use silence intentionally.

As raids cease:

- combat density drops;
- environmental/structural hum becomes more apparent;
- tower aging and energy depletion become audible;
- absence of threat becomes unsettling.

The mothership transformation should recontextualize familiar energy and tower sounds rather than replacing them with a completely unrelated soundtrack vocabulary.

---

# 24. Music

Music should support state without overwhelming the simulation.

Potential model:

- sparse ambient bed during observation;
- procedural/intensity layers during active raids;
- reduced or absent combat layer during deterrence;
- transformation motif assembled from existing tonal/material sounds;
- raider phase reuses earlier musical material from the opposing perspective.

Avoid constant high-intensity scoring that flattens tactical pacing.

---

# 25. UI and information design

## 25.1 World first

Whenever possible, critical information should be visible in or near the world:

- silo energy;
- tower state;
- health/viability;
- valid placement;
- selected raider tier;
- insertion preview.

## 25.2 Minimal persistent HUD

Persistent HUD should focus on decisions the world cannot express clearly:

- current energy;
- selected construction/raider action;
- essential campaign state;
- optional diagnostic information in development builds.

Avoid a wall of cooldowns, upgrade trees, and unit stat panels.

## 25.3 Explain costs before commitment

Before spending energy, the player should be able to see:

- cost;
- resulting remaining reserve;
- invalid placement state;
- selected tier.

Raider deployment should similarly expose launch cost and resulting reserve.

## 25.4 Diagnostics are not player UI

Development may expose:

- raid confidence;
- actual HP;
- physical mass;
- impulse vectors;
- target selection;
- line-of-fire rays;
- frame/physics cost;
- sound emitter counts.

Do not assume these should become permanent player-facing metrics.

---

# 26. Accessibility

Accessibility should preserve strategic equivalence across presentation modes.

## 26.1 Color independence

Do not encode tower/raider identity or damage state through color alone. Shape, scale, motion, outline, material pattern, or iconography should provide redundant cues.

## 26.2 Motion

Provide reduced camera response and reduced nonessential motion without disabling the underlying physics simulation.

## 26.3 Audio alternatives

Important spatial audio events should have visual equivalents where practical:

- incoming heavy projectile;
- silo impact;
- tower degradation;
- mothership critical energy;
- successful extraction.

## 26.4 Input remapping

Keyboard/gamepad actions should be remappable where supported. Touch gestures should have accessible alternatives rather than being the sole way to perform a critical action.

## 26.5 Readability scaling

HUD text and essential indicators should scale independently from world resolution.

---

# 27. Performance and scalability

## 27.1 Performance is a gameplay requirement

The game’s identity depends on physical simulation remaining responsive. Visual fidelity should degrade before core simulation correctness.

## 27.2 Priority order under load

Preserve first:

1. input responsiveness;
2. simulation step integrity;
3. collision/event correctness;
4. projectile timing;
5. camera stability;
6. essential spatial audio cues.

Degrade first:

- particles;
- post-processing;
- secondary fragments;
- distant decorative audio;
- cosmetic animation.

## 27.3 Entity/sound budgets

Use explicit budgets and prioritization for:

- physics bodies;
- fragments;
- projectiles;
- audio emitters;
- expensive lights/post-processing.

Budgets should favor objects near the camera/listener and objects with current tactical relevance.

## 27.4 Constrained/mobile support

The abstract vector/simple-geometry visual style should be treated as an optimization advantage.

Avoid adding presentation systems that require high-end hardware to preserve gameplay legibility.

---

# 28. Technical simulation constraints

This manual is not an engine specification, but some implementation constraints protect game design.

## 28.1 Simulation authority

Gameplay state should increasingly be separable from rendering objects so behavior can be certified and modernized without rewriting design rules.

## 28.2 Engine modernization

Babylon/Cannon implementation details are not sacred. The project may adopt modern Babylon, Bevy/WASM, Rust simulation cores, or other appropriate architecture where measured evidence supports it.

However, engine changes must preserve:

- physical outcomes;
- direct input latency;
- body scale/mass relationships;
- timing;
- collision semantics;
- deterministic seams where useful;
- broad device support.

## 28.3 Do not fake physics for testability

Pure calculation seams and deterministic fixtures are encouraged, but production outcomes should not be replaced with scripted pseudo-physics solely because they are easier to snapshot-test.

---

# 29. Balance philosophy

## 29.1 Balance means choices remain contextual

A balanced game is not one in which every unit has equal DPS or identical efficiency.

A balanced game is one in which:

- all six core types remain meaningful;
- different situations produce different optimal responses;
- no strategy dominates across geometry, composition, and resource state;
- failure can be traced to understandable trade-offs;
- physical skill/understanding produces advantage without making numbers irrelevant.

## 29.2 Prefer soft counters

Good counters emerge naturally:

- R1 swarms stress T3 cadence;
- T2 handles frequent light targets;
- T3 high impulse matters against R3 inertia;
- T1 delay weakens all finite-lived raiders;
- R1 can exploit narrow channels inaccessible to R3;
- R3 can challenge geometry that small bodies cannot physically pressure in the same way.

Avoid hidden “T3 does +50% to R3” rules unless exhaustive testing proves physical differentiation is insufficient.

## 29.3 Equal throughput can be desirable

The current T2/T3 relationship—similar nominal damage and impulse throughput but different packet size/cadence—is a useful example of contextual balance.

Do not automatically “fix” equal DPS by making T3 universally stronger.

## 29.4 Risk concentration

Higher tiers should often concentrate risk rather than simply improve value.

Examples:

- a T3 upgrade ties more of the reserve to one location;
- a Titan raid puts much more launch energy into one body;
- a T3 miss creates a longer exposure window;
- a Titan trapped behind geometry is a larger financial disaster than losing an R1.

---

# 30. Required balance measurements

Before significant numeric rebalance, measure at minimum:

## 30.1 Tower-versus-raider matrix

For every T1/T2/T3 × R1/R2/R3 pairing:

- time to kill;
- time to ejection;
- displacement per hit;
- hit/miss rate;
- overkill;
- energy recovered by defender;
- remaining HP if raider reaches silo;
- economic outcome from both perspectives.

## 30.2 Spatial fixtures

Test:

- central field;
- near edge;
- one-cell corridor;
- two-cell corridor;
- staggered barriers;
- dense fortress;
- open fortress;
- mixed-body congestion.

## 30.3 Lifecycle fixtures

Measure:

- tower active lifetime;
- degradation transitions;
- no-damage raider lifetime;
- delay contribution to loss of extraction value;
- quiet-period fortress survival.

## 30.4 Economy fixtures

Measure:

- energy spent vs recovered;
- full-HP and partial-HP silo contact;
- launch-cost break-even;
- mothership operating drain;
- under-defense farming attempts;
- repeated failed raid recovery possibilities.

---

# 31. Current baseline matchup reference

Ignoring travel, misses, obstruction, decay, and momentum effects, current baseline values imply approximately:

| Raider | T2 hits / cadence time | T3 hits / cadence time |
| --- | ---: | ---: |
| R1 | 9 / ~1.87 s | 3 / ~2.11 s |
| R2 | 35 / ~7.28 s | 11 / ~7.72 s |
| R3 | 78 / ~16.22 s | 23 / ~16.15 s |

This reinforces the design intent that T2 and T3 should differentiate through packet size, target switching, range, geometry, momentum, and reliability rather than nominal DPS.

These numbers are reference points, not final targets.

---

# 32. Resource-pressure narrative logic

The story depends on the player understanding three truths in sequence.

## Truth 1: Raiders are dangerous

They threaten the energy reserve and must be stopped.

## Truth 2: Raiders are useful

Fighting them replenishes energy and sustains the fortress.

## Truth 3: Raiders may be necessary

When deterrence becomes complete, the system loses its resource flow and begins to fail.

The role inversion then reveals a fourth truth:

## Truth 4: The raiders were solving the same survival problem

The player’s enemies may have been former defenders whose fortresses entered the same starvation state.

The game should reveal these through mechanics before explicit exposition.

---

# 33. Worldbuilding rules

## 33.1 Avoid simplistic factions

Do not immediately define one side as inherently noble and the other inherently evil.

The strongest interpretation is systemic scarcity:

- defended energy is valuable;
- raiding is dangerous but economically necessary;
- deterrence can produce isolation;
- successful defenders can become future raiders.

## 33.2 Environmental storytelling

Use repeated geometry to imply history:

- abandoned fortresses resembling the player’s first base;
- dormant towers in degradation states;
- mothership forms visibly derived from silo architecture;
- familiar barrier and turret placements under AI control;
- damaged platforms showing previous raids.

## 33.3 Minimal exposition

Text, logs, or brief transmissions can add context, but should not carry the core reveal alone.

---

# 34. Replayability and sandbox

## 34.1 Simulation sandbox

A sandbox mode is valuable for both players and development.

Useful controls may include:

- spawn specific raider tier;
- place specific tower tier;
- select arena geometry;
- toggle edge conditions;
- inspect mass/velocity/HP;
- freeze/step simulation;
- alter energy;
- test deterrence transitions.

Development diagnostics can be richer than player sandbox controls.

## 34.2 Scenario challenges

Potential challenge types:

- survive with barriers only;
- eject all enemies without killing them;
- defend with a capped reserve;
- complete a profitable raid using only R1;
- breach a fortress without losing more than a specified energy amount;
- survive prolonged peace with minimal spending.

These reinforce systemic mastery rather than arbitrary achievements.

---

# 35. Storybook / experimental playground strategy

Where the modernized UI/toolchain supports Storybook or equivalent isolated playgrounds, use them for visual/system experimentation rather than only static UI components.

Potential playgrounds:

- tower silhouettes and degradation states;
- raider scale comparisons;
- silo-to-mothership transformation states;
- energy meters;
- insertion previews;
- accessibility contrast/state variants;
- spatial audio emitter visualization;
- performance-budget visualizations.

Physics-heavy behavior still requires real runtime/browser fixtures; Storybook should complement rather than replace them.

---

# 36. Certification and design QA

## 36.1 Design changes require evidence

When changing balance or mechanics, record:

- hypothesis;
- expected player decision change;
- affected archetypes;
- before/after measurements;
- unintended side effects;
- browser/physics evidence where applicable.

## 36.2 Do not certify only kill time

A change can preserve TTK while radically changing the game through momentum or economy.

Certification should inspect:

- damage;
- displacement;
- ejection;
- route length;
- target selection;
- resource return;
- obstruction;
- lifecycle;
- performance.

## 36.3 Behavioral invariants

At minimum preserve unless explicitly changed:

- energy links health and spending;
- hits can replenish energy;
- silo damage depends on surviving threat;
- tower aging/degradation;
- finite raider life;
- physics-based mitigation;
- direct world interaction;
- meaningful all-tier roles.

---

# 37. Open design questions

These questions should remain visible rather than being silently decided in code.

1. Exact final tower lifetimes and degradation timing.
2. Whether Tower 1 should have any active non-damage behavior beyond physical obstruction.
3. Final line-of-fire/occlusion behavior through friendly structures.
4. Exact mobility differentiation for R1/R2/R3.
5. Final raider launch-cost function.
6. Whether `remaining HP / 2` is the final extraction rule or requires bounded scaling.
7. Mothership operating drain model.
8. How much post-deployment control raiders receive.
9. Whether the mothership itself can reposition over an arena and at what cost.
10. How raid confidence estimates fortress value and defense quality.
11. How strongly the player can intentionally influence deterrence without gaming it.
12. How AI decides when to build, upgrade, or conserve energy.
13. Final campaign ending / cycle-breaking mechanic.
14. Whether multiple silos/motherships eventually coexist in one scenario.
15. How persistent campaign progression should be across failures.
16. Whether enemy/raider collisions with one another should be exploited more deliberately.
17. How much destructible environment, if any, should exist beyond towers/bodies.
18. Whether tower targeting policy should be player-selectable or remain emergent/automatic.

Each should be resolved through focused issues and experiments rather than opportunistic implementation.

---

# 38. Non-goals / guardrails

Do not allow modernization or content expansion to drift into these defaults without deliberate design approval:

- permanent tower tech trees;
- dozens of tower types that dilute the three-role clarity;
- dozens of enemy classes distinguished mainly by stats;
- hard elemental damage typing;
- inventory/equipment systems unrelated to the energy loop;
- hero characters with RPG abilities;
- loot rarity;
- opaque randomized combat outcomes;
- cutscene-heavy narrative delivery;
- high-poly realism that obscures geometry;
- AI cheats that bypass shared physics/economy;
- infinite passive energy generation that removes scarcity;
- a second-half RTS that discards the direct physical interaction model.

Expansion should deepen the six-role physical system before broadening it.

---

# 39. Design success criteria

The game is succeeding when all of the following are true:

## Tactical

- A player can explain why they chose T1, T2, or T3 in a specific situation.
- Seeing R1, R2, or R3 changes how the player evaluates geometry and risk.
- Ejection, delay, and redirection are real alternatives to pure damage.
- Different arena positions change the value of the same tower.

## Strategic

- Spending energy feels consequential.
- A full reserve does not automatically mean “build everything.”
- The player sometimes wins by conserving rather than escalating.
- A physically successful raid can still be an economic failure.

## Narrative

- Reduced raid frequency initially feels like success.
- The later energy crisis follows logically from systems the player already understands.
- The silo-to-mothership transformation is visually legible.
- The player recognizes the new raider perspective as the origin of earlier enemies.
- The moral inversion emerges from play, not only text.

## Presentation

- The battlefield remains readable on modest hardware.
- Type silhouettes are distinct without relying on color.
- Spatial audio adds physical information.
- effects enrich rather than obscure simulation.

## Technical

- balance-critical formulas are inspectable/testable;
- engine changes can be compared against behavioral baselines;
- simulation remains responsive under representative entity counts;
- diagnostics make physical/economic outcomes measurable.

---

# 40. Glossary

**Energy** — shared survival reserve, build budget, defended resource, and later mothership operating/launch currency.

**Silo** — the central defended energy structure in the fortress phase; later transforms into the mothership.

**Mothership** — mobile form of the silo, camera platform and raider deployment origin.

**Tower 1 / Barrier / Deflector** — static non-firing spatial-control defense.

**Tower 2 / Interceptor** — rapid granular-fire tower optimized for responsive control and light/mixed targets.

**Tower 3 / Siege / Impulse Cannon** — long-range slow-cadence heavy-packet tower optimized for high-consequence displacement.

**Raider 1 / Scout / Swarm Raider** — small, cheap, flexible body.

**Raider 2 / Breaker** — medium, reliable pressure body.

**Raider 3 / Titan / Siege Boulder** — large, expensive, persistent high-risk body.

**Finite life / decay** — continuous or decision-based loss of raider viability over time.

**Deterrence** — reduction in raid willingness because expected raid return has become poor.

**Raid confidence** — development term for the hidden expected-value state used to shape attacker behavior.

**Extraction** — energy transferred from a target silo to the mothership when a raider reaches it.

**Ejection** — removal of a raider from the viable battlefield through physics rather than HP depletion.

**Packet size** — damage and momentum delivered by one projectile event; distinguishes T2 and T3 even when throughput is similar.

**Soft counter** — an advantage that emerges from physical/economic characteristics rather than explicit immunity or damage-type rules.

---

# 41. Immediate design-development roadmap

The manual establishes direction, but the next work should remain evidence-driven.

## Phase A — certify the six-role baseline

- deterministic T2/T3 projectile scaling;
- enemy size/mass/HP scaling;
- finite-life decay timing;
- tower degradation;
- line-of-fire behavior;
- spawn/occupancy correctness;
- 3×3 matchup arena.

## Phase B — build design playgrounds

- one-of-each starting fortress;
- barrier-only delay/ejection experiment;
- one-cell/two-cell corridor fixture;
- edge impulse fixture;
- mixed wave fixture;
- energy return dashboard;
- raider launch/extraction curve.

## Phase C — prototype deterrence

- raid confidence diagnostic;
- composition adaptation;
- interval tapering;
- scouting behavior;
- cessation threshold;
- under-defense farming test.

## Phase D — prototype inversion

- silo transformation state machine;
- mothership camera transition;
- raider selection/insertion control;
- AI-controlled tower defense;
- symmetric extraction economy.

## Phase E — campaign pacing

Only after both perspectives are demonstrably enjoyable:

- tune act duration;
- tune resource pressure;
- design environmental storytelling;
- develop late-cycle resolution choices;
- polish audio/visual transformation language.

---

# 42. Final design statement

Defend should remain a game about **survival through physical understanding under scarcity**.

The player begins believing that the objective is simply to keep enemies away from a valuable energy silo. Through play, they learn that attackers are also a source of the energy that keeps the fortress alive. As they become better at defense, they accidentally eliminate the interaction their system depends on. The fortress decays, the reserve runs out, and the thing they protected transforms into the same kind of mothership that once launched their enemies.

The player then learns the other side of every lesson:

- the barrier that once bought survival now destroys raid profitability through delay;
- the interceptor that once protected the silo now strips value from the player’s cheap raiders;
- the siege cannon that once saved the fortress now threatens a catastrophic loss of invested energy;
- the Titan that once seemed monstrous is now a dangerous financial commitment the player chose to make.

The strongest version of the game does not ask the player to memorize more systems after the twist. It asks them to **reinterpret the systems they already mastered**.

That symmetry—mechanical, economic, visual, and moral—is the central design promise of Defend / Return Fire.
