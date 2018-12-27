# Defend [![Build Status](https://travis-ci.org/xtreemze/defend.svg?branch=master)](https://travis-ci.org/xtreemze/defend)

In “Defend” you’re placed in the center of a stronghold contained within a 3D world. You will be immediately faced with a constant onslaught of attacks from aggressive spherical objects who seek to destroy your energy reserves as this is the only source of life in this world. Repel the attacks and maintain your stronghold with a sustainable level of resources.

“Defend” will challenge you to constantly question and reevaluate your strategies. You could surround your energy resources with a wall, however, these have a limited life and will fall apart with time. Without turrets to extract the blue energy from the attackers, you will not proceed beyond the first waves.

You’ll quickly learn that the best defense is a strategic offensive.

## A Procedurally Generated Tower Defense WebGame

When loaded, three cameras rotate in an interactive orbit around a plane where towers are randomly placed. Enemies will fall from the sky in the unoccupied areas and will make their way to the center.

![Defend](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot2.png)

## Towers

1. A wall which acts as a non-permeable barrier
2. A turret that has the same capabilities as #1 but with the added turret which shoots projectiles able to reduce the hitpoints of the enemy spheres and push them away.
3. A more powerful variant of #2, taller and more powerful but slower rate of fire. Projectiles are heavier and have greater pushing power.

Towers have a fixed lifespan and will downgrade to the lower level until they dissapear.

![Defend](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot3.png)

## Enemies

1. A sphere which attempts to move toward the middle of the plane. It's life becomes shorter with every decision taken.
2. This is a larger version of the first enemy with increased hitpoint values and increased mass. As a result, it moves slower.
3. A larger version of #2, heavier, stronger, but slower.

Enemies take damage from projectiles. If they fall off the plane they die.
