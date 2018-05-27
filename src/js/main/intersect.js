// @ts-check

import * as BABYLON from "babylonjs";

export default function intersect(scene) {
  const projectiles = scene.getMeshesByID("projectile");
  const enemies = scene.getMeshesByID("enemy");

  for (let index = 0; index < projectiles.length; index += 1) {
    const element = projectiles[index];
    for (let index2 = 0; index2 < enemies.length; index2 += 1) {
      const element2 = enemies[index2];
      if (element.intersectsMesh(element2)) {
        console.log("collide");
      }
    }
  }
}
