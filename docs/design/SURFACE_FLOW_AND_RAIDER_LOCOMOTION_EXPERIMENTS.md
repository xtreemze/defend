# Surface Flow and Raider Locomotion Experiments

Related: `SURFACE_FLOW_AND_RAIDER_LOCOMOTION.md`, #30, #72, #76, #82.

## Drainage fixtures

Measure for every fixture:

- total liberated energy;
- total collected energy;
- total stranded/in-transit energy;
- time to first collection;
- time to 50% and 95% collection;
- maximum active authoritative packets;
- route length and obstacle contacts;
- frame time / mesh count.

Fixtures:

1. unobstructed radial path;
2. one T1 wall between spill and silo;
3. two staggered walls requiring an S-route;
4. U-shaped pocket;
5. sealed ring;
6. sealed ring opened after five seconds;
7. wall expiration while energy is pooled;
8. eruption-destroyed wall releasing pooled energy;
9. simultaneous pools on four sides of the fortress.

Expected qualitative contract:

- open paths collect;
- walls/towers are not traversed;
- local steering may find nearby gaps;
- a sealed barrier strands/pools energy rather than allowing magical bypass;
- opening topology releases previously stranded value without creating or deleting energy.

## Raider locomotion fixtures

Use identical geometry and initial energy/momentum where possible.

Measure:

- time to silo;
- path length;
- steering impulses / decision count;
- barrier collision count;
- peak/mean speed;
- structural damage or displacement;
- remaining HP/viability at arrival;
- failure mode: destroyed / expired / ejected / blocked / silo reached.

Required scenarios:

1. open field;
2. narrow gap that fits R1 but not R3;
3. moderate gate suitable for R1/R2;
4. short blocked route versus long open detour;
5. downhill route versus flatter direct route;
6. barrier removed mid-run;
7. mixed R1/R2/R3 deployment through one fortress;
8. post-eruption changed topology.

Role expectations:

- R1: highest route awareness, preferentially finds viable gaps and low-cost paths;
- R2: trades route efficiency against deliberate barrier impacts;
- R3: lowest steering frequency, strongest momentum dependence, broad/direct/downhill preference, cannot use openings smaller than its physical body.

## Combined readability fixture

Place loose energy and one of each raider tier outside the same defensive layout. Record the resulting routes without debug overlays, then with diagnostic overlays.

A successful design lets observers correctly infer the reasons for the different routes from visible geometry and body size alone.
