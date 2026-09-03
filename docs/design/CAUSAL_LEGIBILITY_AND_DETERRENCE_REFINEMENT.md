# Causal Legibility and Deterrence Refinement

**Status:** design refinement proposal  
**Parent:** #29  
**Related:** #72, #73, #74, #76, #79, #86, #103

## Purpose

Defend already has a strong systemic core: one finite energy economy, temporary defenses, finite-lived raiders, physics as strategy, and a campaign inversion in which the defended silo becomes the mothership that launches the same raider bodies the player previously fought.

The next design gain should not come from adding more systems. It should come from making the existing system easier to **predict, read, attribute, and master** while preserving its physical ambiguity and emergent depth.

The central design question is therefore:

> Can the player understand why an outcome occurred without reducing the game to explicit numeric overlays?

This document refines the design around causal legibility, energy conservation, deterrence pacing, anti-farming equilibrium, mastery progression, and player-facing validation.

---

## 1. Causal-legibility contract

Every strategically important mechanic should expose three world-readable stages whenever practical.

### 1.1 Anticipation

Before an event, the player should have enough perceptual evidence to form a qualitative prediction.

Examples:

- Tower 3 visibly and audibly commits to a slower, heavier shot before launch.
- Raider 3 carries obvious inertia and cannot pivot with Raider 1 agility.
- An aging tower visibly approaches degradation before stepping down.
- A narrow opening visibly admits a small raider while excluding a titan.
- A dimming mothership or silo visibly approaches loss of operational capability.

The player need not predict exact numbers. The goal is to support judgments such as:

- "that shot will probably eject it";
- "that route is too narrow for the Titan";
- "that wall delays the scout long enough";
- "this fortress is becoming energetically unstable."

### 1.2 Causation

During an event, the player should be able to perceive the important causal chain.

Examples:

- projectile impulse visibly changes a raider's vector rather than merely subtracting health;
- delay visibly consumes raider viability;
- loose teal energy physically follows available drainage instead of crossing barriers magically;
- extraction reverses the established energy-flow direction;
- mothership movement, hover, and deployment visibly spend the same finite reserve.

### 1.3 Residue

Important outcomes should leave enough temporary or persistent evidence for the player to infer what happened.

Examples:

- stranded teal pools reveal that defensive geometry obstructed recovery;
- debris, scars, or hulks communicate failed expensive commitments;
- a recently extracted silo remains visibly depleted;
- a barrier's disappearance leaves an obvious new route;
- a fallen mothership remains as a physical consequence rather than disappearing as a completed wave state.

The goal is **causal traceability**, not explanatory UI.

A skilled player should increasingly be able to say:

> I know why that happened.

---

## 2. Conserved conflict economy

#76 already establishes teal energy as conserved visible matter. Tighten the underlying interpretation so that combat income is understandable as transfer rather than arbitrary generation.

### Canonical direction

- Raiders carry energy committed by their source system.
- Damage may liberate a bounded fraction of that embodied value into recoverable teal matter.
- Destroyed, expired, or ejected bodies may leave recoverable or lost energy depending on physical outcome.
- Defender combat income should therefore read primarily as **captured opposing investment**.
- Reserve credit occurs only when authoritative energy reaches the receiving system.
- Visual particle count must never determine economic value.
- The same committed value must never be repeatedly harvested through damage loops.

The exact mapping between current hit recovery, launch cost, raider embodied value, decay, and collectible spill remains experimental.

This interpretation strengthens the campaign's larger logic: energy circulates because systems risk, lose, capture, defend, and steal it from one another.

---

## 3. Anti-farming equilibrium

The game should allow players to influence raid attractiveness. It should not make intentional weakness the dominant survival strategy.

The desired long-horizon relationship is:

`EV(competent defense) > EV(intentional breach farming)`

while still preserving the short- and medium-horizon relationship:

`EV(active combat) > EV(passive isolation)`

This creates the intended paradox:

- fighting can sustain the fortress;
- enemy penetration remains dangerous;
- strong defense is locally rational;
- perfect deterrence becomes strategically unsustainable.

### 3.1 Raid attractiveness

Attacker interest should emerge from expected value, not scripted campaign stage or visible tower count.

A useful conceptual model is:

`expected raid value = perceived obtainable energy × perceived breach quality - expected committed loss - travel/operating cost`

Inputs can include:

- recent extraction success;
- average surviving raider viability;
- kill/ejection/expiration rates;
- time-to-silo;
- target energy signature;
- travel distance;
- observed defender behavior;
- recent attacker losses.

Do not expose a permanent numeric raid-confidence meter to the player.

A rich but intentionally weak fortress may attract attention, but the resulting penetrations must remain dangerous enough that the player cannot maintain a safe perpetual raid farm. A poor fortress should not attract expensive assaults merely because it is weak.

---

## 4. Deterrence should taper, not switch off

The campaign hinge should be a readable behavioral progression.

### Stage A — contested

- normal mixed raids;
- attackers still expect viable returns.

### Stage B — adaptation

- compositions shift in response to losses;
- cheaper probes become more common;
- expensive commitments become more selective;
- intervals lengthen.

### Stage C — probing

- isolated Raider 1/scout attempts;
- occasional route tests;
- distant mothership observation without heavy commitment;
- materially reduced combat income.

### Stage D — deterrent quiet

- attacks become rare enough that tower aging and reserve decline become foreground systems;
- the player initially reads this as success.

### Stage E — strategic starvation

- no incoming investment means little or no replenishment;
- the fortress's physical deterioration makes this relationship increasingly explicit;
- conversion becomes a systemic consequence rather than an arbitrary narrative trigger.

The goal is **negative space, not dead play**.

Cheap probes must not supply enough recoverable value to sustain a fully deterrent fortress indefinitely.

---

## 5. Strategic signatures should encode a living system

Preserve #76's core relationship:

**bright = plentiful but dangerous; dim = scarce but vulnerable.**

Avoid turning brightness into a disguised difficulty level.

Experiment with multiple world-readable qualities:

- **brightness / apparent energy volume:** approximate reserve or recent circulation;
- **pulse / flicker:** recent combat or throughput volatility;
- **stability / decay:** thriving, quiet, starving, converting, recently extracted;
- **distance / parallax:** travel and operating commitment.

The player should infer opportunity and risk from the strategic world rather than choose from mission cards containing explicit success probabilities.

Do not reveal exact tower counts, exact ROI, or hidden difficulty scores.

---

## 6. Mastery progression should teach prediction, not recipes

The inherited one-of-each fortress remains a strong starting structure. Do not hide defining systems until later. Instead, use early encounter geometry to isolate causal relationships while all three roles already exist.

Suggested sequence:

1. **Value:** one readable breach establishes that the silo matters.
2. **Delay:** a barrier causes a light raider to expire or arrive substantially weaker.
3. **Granularity:** Tower 2 controls multiple light threats through frequent smaller impulses.
4. **Commitment:** Tower 3 produces a slower but decisive displacement/ejection event.
5. **Geometry:** a narrow route differentiates R1 from R2/R3.
6. **Drainage:** a strong wall strands energy, revealing the defend-vs-drain trade-off from #86.
7. **Lifecycle:** tower degradation alters the same battlefield without adding a new rule.
8. **Economy:** replacing infrastructure visibly reduces survival margin.

Do not teach:

> Place Tower 2 here.

Teach:

> Frequent small impulses solve this class of physical problem.

The desired result is transferable reasoning.

---

## 7. Raider phase: commitment rather than puppetry

The second half should preserve the same physical decision character instead of becoming a conventional RTS or action-steering game.

### High-agency decisions before deployment

- raider tier;
- insertion location;
- initial vector / impulse;
- timing;
- spacing / formation;
- whether to commit additional bodies.

### Sparse interventions after deployment

Allow only interventions with clear physical and economic meaning, such as:

- bounded objective redirection;
- a limited impulse/order with cooldown or energy cost;
- stopping further investment;
- deploying another body to exploit a newly opened route.

Continuous frame-by-frame steering should not be required for high-level success.

R1/R2/R3 autonomy should preserve #86's roles:

- R1: navigator / swarm;
- R2: breaker;
- R3: inertia-first titan.

---

## 8. Difficulty should increase reasoning demands

Prefer progression through:

- more complex topology;
- mixed compositions;
- simultaneous commitments;
- tighter opportunity costs;
- harder target-selection decisions;
- adaptive but observable AI behavior;
- longer causal chains;
- higher risk concentration;
- incomplete but inferable strategic information.

Avoid relying on:

- hidden accuracy bonuses;
- arbitrary HP inflation;
- hard immunity matrices;
- rubber-banding;
- AI-only economic advantages.

Difficulty should deepen the player's model of the same rules rather than invalidate it.

---

## 9. Narrative should reveal structure, not assign simple morality

The defender-to-raider inversion should not announce that the player was secretly evil or that all raiders are morally equivalent.

The stronger interpretation is structural:

- defenders and raiders may be rationally responding to the same scarcity;
- successful defense can create isolation;
- isolation can turn a defender into a predator;
- the same mechanics feel ethically different from a different institutional position.

Let complicity emerge from recognition and action.

The strongest evidence should remain physical reuse:

- same silo architecture;
- same tower roles;
- same raider bodies;
- same teal energy;
- same degradation and failure states.

---

## 10. Player-facing design gates

Deterministic simulation fixtures remain necessary, but simulation correctness alone cannot prove that the design is readable.

### Prediction gate

After limited exposure, players should increasingly predict qualitative outcomes such as:

- which raider fits a route;
- which body is easiest to eject;
- whether a barrier will delay enough;
- whether energy can drain through a layout;
- whether a raid appears economically marginal.

### Causal-explanation gate

After an encounter, players should be able to explain the important cause.

Warning signs include:

- "random physics";
- assuming Tower 3 is simply higher DPS when impulse/range/packet size was decisive;
- inability to distinguish expiration from direct destruction;
- inability to see why drainage failed.

### Role-diversity gate

All six battlefield roles should remain contextually useful across successful strategies.

Equal pick rate is unnecessary. Contextual non-obsolescence is required.

### Anti-farming gate

Explicitly optimize deliberate under-defense across long horizons.

If safe leakage becomes the dominant economy, the design fails this gate.

### Deterrence-comprehension gate

Without explanatory text, players should infer:

`successful defense → reduced attacker commitment → reduced incoming energy → strategic starvation`

before or near conversion.

### Inversion-comprehension gate

After first operating as a raider, ask where the original enemies came from and why they attacked.

The preferred answer should be inferred from systems rather than recalled from exposition.

### Control-load gate

Measure post-deployment interventions per raider.

If successful play requires continuous steering, the raider phase is drifting toward RTS/action micromanagement.

### Multimodal-equivalence gate

Critical information conveyed through spatial audio must have visual, haptic, or otherwise accessible equivalents without removing the intended strategic challenge.

---

## 11. Guardrails

Until the above gates are measured:

- do not add currencies;
- do not add damage-type rock-paper-scissors;
- do not add RPG statistics to manufacture progression;
- do not add explanatory meters where world feedback can carry the same causal information;
- do not rebalance T2/T3 merely to create larger numeric differences;
- do not trigger deterrence through a fixed scripted wave cutoff;
- do not solve onboarding by removing the game's defining systems;
- do not expand planetary/ecological simulation unless it sharpens decisions in the proven core loop.

The next quality gain should come from making the existing game **more intelligible, more predictable, and more strategically exact** rather than larger.

## Success criterion

A skilled player should be able to inspect the battlefield, anticipate several plausible physical and economic consequences, make a commitment, watch the causal chain unfold, and understand the result without consulting hidden numbers.

The campaign should then reuse that learned model from the opposite side strongly enough that the role reversal feels less like learning a second game and more like discovering what the first game meant.