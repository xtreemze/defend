# Defend

Defend is a physics-driven resource-defense game played on a procedural 3D battlefield. You protect the energy reserve at the center of the arena from waves of spherical attackers while using that same energy to construct temporary defenses.

Energy is simultaneously your health, your construction budget, and the resource you are defending. Turret projectiles damage enemies and recover energy, so offense is part of the economy rather than merely a way to eliminate threats. An enemy that reaches the reserve drains energy according to its remaining hit points, which means weakening, delaying, redirecting, or ejecting an attacker can all be useful even when it is not destroyed outright.

Walls and turrets are not permanent. They age, higher tower levels eventually degrade into lower ones, and the player must continually rebuild the stronghold while deciding how aggressively to harvest energy from the incoming waves.

You’ll quickly learn that the best defense is a strategic offensive.

## A Procedurally Generated Physics Tower Defense Web Game

The game uses an interactive orbit camera around a procedural arena. Enemies fall from above in available areas and use physics-driven movement biased toward the central energy reserve. The player taps the battlefield to place towers on the grid and taps existing towers to upgrade them.

The simulation deliberately makes mass, collision, projectile impulse, knockback, obstruction, and falling from the arena meaningful. Enemies also lose hit points over time, so the game is not limited to a single “damage race” solution.

![Defend](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot2.png)

## Towers

1. A wall that acts as a physical barrier.
2. A turret that retains the barrier role and adds projectiles that reduce enemy hit points and physically push attackers away.
3. A taller, more powerful turret whose projectiles are heavier and have greater pushing power, balanced by a slower rate of fire.

Towers have a fixed lifespan. Higher-level towers degrade to lower levels over time and eventually disappear.

![Defend](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot3.png)

## Enemies

1. A sphere that attempts to move toward the center of the arena and loses hit points as it continues making movement decisions.
2. A larger enemy with increased hit points and mass, making it stronger but slower.
3. A still larger, heavier, stronger, and slower variant.

Enemies take damage from physical projectiles. Pushing an enemy off the arena also removes it from play.

## Development principles

Defend is being modernized while preserving the mechanics that give the game its identity. The durable development contract is documented in [`AGENTS.md`](./AGENTS.md), with architectural and gameplay decisions coordinated through GitHub issues. In particular, modernization should preserve the closed energy economy, temporary defenses, physical projectiles and knockback, finite-lived enemies, direct battlefield interaction, procedural presentation, and the ability to reduce visual effects before sacrificing simulation behavior on constrained devices.
