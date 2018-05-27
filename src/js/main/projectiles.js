// @ts-check

import * as BABYLON from "babylonjs";

class Projectile {
  constructor(level, position = { x: -45, z: -45 }, scene) {
    this.name = `projectile${level}`;
    this.level = level;
    this.hitPoints = level * 10;

    const projectileMaterial = new BABYLON.StandardMaterial(
      "projectileMaterial",
      scene
    );
    projectileMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

    this[this.name] = BABYLON.MeshBuilder.CreateBox(
      this.level,
      {
        size: 3,
        height: 1.5,
        width: 1.5
      },
      scene
    );

    this[this.name].position = new BABYLON.Vector3(position.x, 3, position.z);

    this[this.name].material = projectileMaterial;

    BABYLON.Tags.AddTagsTo(this[this.name], "projectile");
  }

  destroy() {
    this[this.name].dispose();
  }
}

export default function projectiles(scene) {
  const projectile1 = new Projectile(1, { x: 5, z: 15 }, scene);
  const projectile2 = new Projectile(1, { x: 5, z: 25 }, scene);
  const projectile3 = new Projectile(1, { x: 5, z: 35 }, scene);
}
