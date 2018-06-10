# Defend [![Build Status](https://travis-ci.org/xtreemze/defend.svg?branch=master)](https://travis-ci.org/xtreemze/defend)

## A Procedurally Generated Tower Defense WebGame

When loaded, three cameras rotate in an interactive orbit around a plane with 100 subdivisions where towers can randomly be placed. Enemies will fall from the sky in the unoccupied areas and will make their way to the center.

![alt](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot1.png)

## Towers

1.  A wall which acts as a non-permeable barrier
2.  A turret that has the same capabilities as #1 but with the added turret which shoots projectiles able to reduce the hitpoints of the enemy.
3.  A more powerful variant of #2

![alt](https://raw.githubusercontent.com/xtreemze/defend/master/release/screenshot3.png)

## Enemies

1.  A sphere which attempts to move toward the middle of the plane. It's life becomes shorter with every decision taken. Also takes damage from projectiles.
2.  This is a larger version of the first enemy with increased hitpoint values and increased mass. As a result, it moves slower.
3.  A larger version of #2, heavier, stronger, but slower.
