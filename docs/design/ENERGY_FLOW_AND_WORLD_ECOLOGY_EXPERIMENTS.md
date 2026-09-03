# Energy-flow and world-ecology certification experiments

Use this as an executor-facing checklist for experiments derived from `ENERGY_FLOW_AND_WORLD_ECOLOGY.md`.

## Ground recovery

1. Fixed-value hit spills a known conserved amount of teal energy.
2. Energy value is unchanged by visual particle count/LOD.
3. Droplets settle, pools merge, and the aggregate reaches the silo.
4. Silo reserve increases only on actual intake.
5. Time-to-collection is measured at several combat distances.
6. Ordinary tower geometry may divert flow but cannot permanently strand it.
7. Edge spill/loss is measured separately from combat damage.

## Siphon and evacuation

1. A controlled breach starts an upward stream from silo to mothership.
2. Exact siphoned value equals the authoritative transfer amount.
3. The stream remains visually continuous from source to destination.
4. R1/R2/R3 can be entrained into the same extraction stream.
5. Ascent remains physically readable by tier/mass.
6. If defensive fire remains active, measure how interruption changes final extraction.
7. No raider or energy packet disappears before reaching the mothership or a defined loss state.

## Strategic signatures

Create simulated silos spanning:

- high reserve / frequent raids / strong maintained defense;
- medium reserve / moderate activity;
- low reserve / low raid frequency / degraded defense;
- recently siphoned target;
- starving target approaching mothership conversion.

Validate that teal brightness lets a player infer broad reward/difficulty without exposing exact stats.

## Ecology

Run a lightweight multi-installation simulation over long time horizons and verify:

- frequently contested successful silos tend to stay rich and defended;
- excessive deterrence reduces raid frequency and combat income;
- isolated silos can enter starvation and mothership conversion;
- dim targets are easier but not always optimal due low yield/travel costs;
- bright targets are lucrative but can be net-negative when defenses are too strong;
- no target class becomes permanently dominant;
- settlement and continued raiding can both remain viable under some circumstances.

## Performance

Profile separately:

- authoritative packet count;
- flow-field update cost;
- visual particle/ribbon/metaball cost;
- audio emitter count;
- main-thread frame time;
- worker/worklet utilization where introduced.

Effects must degrade before economic/simulation fidelity.
