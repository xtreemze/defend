import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";

import { towerGlobals, enemyGlobals, mapGlobals } from "./variables";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position = { x: -25, z: -25 },
    scene: BABYLON.Scene
  ) {
    const name = `tower${level}` as string;
    const levelTop = `towerTop${level}` as string;

    let tower = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: towerGlobals.height,
        updatable: false
      },
      scene
    ) as BABYLON.Mesh;

    this.revive(scene, tower, position, level, levelTop);
  }

  revive(
    scene: BABYLON.Scene,
    tower: BABYLON.Mesh,
    position: any,
    level: number,
    levelTop: string
  ) {
    const towerMaterial = scene.getMaterialByID(
      "towerMaterial"
    ) as BABYLON.Material;
    const projectileMaterial = scene.getMaterialByID(
      "projectileMaterial"
    ) as BABYLON.Material;

    tower.position = new BABYLON.Vector3(
      position.x,
      towerGlobals.height / 2,
      position.z
    ) as BABYLON.Vector3;

    tower.material = towerMaterial as BABYLON.Material;

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        const outerTurret = BABYLON.MeshBuilder.CreateBox(
          "outerTurret",
          {
            size: towerGlobals.height * level,
            height: (towerGlobals.height * level) / level,
            width: towerGlobals.height * level,
            updatable: false
          },
          scene
        ) as BABYLON.Mesh;
        const innerTurret = BABYLON.MeshBuilder.CreateBox(
          "innerTurret",
          {
            size: towerGlobals.height * level * 0.8,
            height: (towerGlobals.height * level) / level,
            width: (towerGlobals.height * level) / 1.5,
            updatable: false
          },
          scene
        ) as BABYLON.Mesh;
        innerTurret.position = new BABYLON.Vector3(
          0,
          0,
          -0.2 * level
        ) as BABYLON.Vector3;

        const outerCSG = BABYLON.CSG.FromMesh(outerTurret);
        const innterCSG = BABYLON.CSG.FromMesh(innerTurret);

        innerTurret.dispose();
        outerTurret.dispose();

        const towerCSG = outerCSG.subtract(innterCSG);

        const towerTurret = towerCSG.toMesh(
          tower[levelTop],
          null,
          scene,
          false
        ) as BABYLON.Mesh;

        tower[levelTop] = towerTurret;

        towerTurret.position = new BABYLON.Vector3(
          position.x,
          towerGlobals.height * level * 1.5,
          position.z
        ) as BABYLON.Vector3;

        const flash = BABYLON.MeshBuilder.CreateIcoSphere(
          name,
          {
            radius: level,
            subdivisions: 1,
            updatable: false
          },
          scene
        ) as BABYLON.Mesh;

        const flashLocal = new BABYLON.Vector3(0, 0, 4) as BABYLON.Vector3;
        const flashSpace = towerTurret.getDirection(
          flashLocal
        ) as BABYLON.Vector3;

        flash.position = towerTurret.position.subtract(flashSpace);
        flash.rotation = towerTurret.rotation.clone();
        towerTurret.material = towerMaterial as BABYLON.Material;
        towerTurret.addChild(flash);
        flash.isPickable = false as boolean;
        flash.setEnabled(false);
        flash.material = projectileMaterial as BABYLON.Material;

        const rayLocal = new BABYLON.Vector3(0, 0, -1);
        const rayLocalOrigin = new BABYLON.Vector3(0, 0, -5);
        const turretDirection = towerTurret.getDirection(rayLocalOrigin);

        const ray = new BABYLON.Ray(
          flash.getAbsolutePosition(),
          turretDirection,
          towerGlobals.range * level
        ) as BABYLON.Ray;

        if (towerGlobals.raysOn) {
          var rayHelper = new BABYLON.RayHelper(ray) as BABYLON.RayHelper;
          rayHelper.show(scene, new BABYLON.Color3(1, 1, 0.3));
        }
        scene.registerBeforeRender(() => {
          ray.direction = towerTurret.getDirection(rayLocal) as BABYLON.Vector3;
        });

        this.enemyWatch(scene, tower, levelTop, flash, ray, level);

        const pillar = BABYLON.MeshBuilder.CreateBox(name, {
          size: level / 2,
          height: towerGlobals.height * level,
          updatable: false
        }) as BABYLON.Mesh;
        pillar.position = new BABYLON.Vector3(
          position.x,
          towerGlobals.height * level * 0.5,
          position.z
        ) as BABYLON.Vector3;

        pillar.material = towerMaterial;

        BABYLON.Tags.AddTagsTo(pillar, "tower");
        BABYLON.Tags.AddTagsTo(towerTurret, "tower");
        break;
    }

    tower.physicsImpostor = new BABYLON.PhysicsImpostor(
      tower,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {
        mass: towerGlobals.mass * level,
        restitution: towerGlobals.restitution
      },
      scene
    ) as BABYLON.PhysicsImpostor;

    mapGlobals.allImpostors.unshift(tower.physicsImpostor);
    BABYLON.Tags.AddTagsTo(tower, "tower");
    towerGlobals.allTowers.unshift(tower);
  }

  rayClearsTower(scene: any, ray: any, tower: BABYLON.Mesh) {
    let result = false as boolean;
    scene.pickWithRay(ray, (mesh: BABYLON.Mesh) => {
      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const element = towerGlobals.allTowers[index];

        if (element === mesh && mesh !== tower) {
          result = true as boolean;
        }
      }
    });
    return result as boolean;
  }

  enemyWatch(
    scene: BABYLON.Scene,
    tower: BABYLON.Mesh,
    levelTop: string = "",
    flash: BABYLON.Mesh,
    ray: any,
    level: number = 1 | 2 | 3
  ) {
    let deltaTime = Date.now();
    scene.registerBeforeRender(() => {
      if (
        enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
        mapGlobals.allImpostors.length < mapGlobals.impostorLimit
      ) {
        const enemyDistances = [] as any;
        for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
          const enemy = enemyGlobals.allEnemies[index];

          if (
            enemy.position.y <= towerGlobals.range * level &&
            enemy.position.y > 0 &&
            enemy.hitPoints >= enemyGlobals.deadHitPoints &&
            BABYLON.Vector3.Distance(
              tower[levelTop].position,
              enemy.position
            ) <=
              towerGlobals.range * level &&
            this.rayClearsTower(scene, ray, tower)
          ) {
            enemyDistances.push([
              BABYLON.Vector3.Distance(
                tower[levelTop].position,
                enemy.position
              ),
              [enemy]
            ]);
          }
        }
        if (enemyDistances.length > 0) {
          this.rotateTurret(enemyDistances.sort()[0][1][0], tower, levelTop);

          if (
            Date.now() - deltaTime > towerGlobals.rateOfFire * level &&
            towerGlobals.shoot
          ) {
            deltaTime = Date.now();
            setTimeout(() => {
              flash.setEnabled(false);
            }, 4);
            flash.setEnabled(true);

            setTimeout(() => {
              fire(scene, tower[levelTop], level);
            }, 1);
          }
        }
      }
    });
  }

  rotateTurret(
    sortedDistances: any,
    tower: BABYLON.Mesh,
    levelTop: string = ""
  ) {
    tower[levelTop].lookAt(sortedDistances.position);
  }
}

function towerGenerator(scene: BABYLON.Scene, quantity: number = 0) {
  let newLocation = positionGenerator();

  while (
    towerGlobals.occupiedSpaces.find(
      (existingLocation) =>
        existingLocation[0] === newLocation.x &&
        existingLocation[1] === newLocation.z
    ) !== undefined
  ) {
    newLocation = positionGenerator();
  }
  towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

  new Tower(
    3,
    {
      x: towerGlobals.occupiedSpaces[0][0],
      z: towerGlobals.occupiedSpaces[0][1]
    },
    scene
  ) as Tower;

  for (let index = 2; index < quantity; index += 1) {
    let newLocation = positionGenerator();

    while (
      towerGlobals.occupiedSpaces.find(
        existingLocation =>
          existingLocation[0] === newLocation.x &&
          existingLocation[1] === newLocation.z
      ) !== undefined
    ) {
      newLocation = positionGenerator();
    }
    towerGlobals.occupiedSpaces.unshift([newLocation.x, newLocation.z]);

    new Tower(
      randomNumberRange(1, 3),
      {
        x: towerGlobals.occupiedSpaces[0][0],
        z: towerGlobals.occupiedSpaces[0][1]
      },
      scene
    ) as Tower;
  }
}

export default function towers(scene: BABYLON.Scene) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber)
  );
}
