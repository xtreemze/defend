import {
  Scene,
  Vector3,
  MeshBuilder,
  Mesh,
  Tags,
  Material,
  PhysicsImpostor,
  Ray,
  RayHelper,
  Color3,
  CSG
} from "babylonjs";
import fire from "../projectile/Projectile";
import positionGenerator from "../utility/positionGenerator";
import randomNumberRange from "../utility/randomNumberRange";

import { towerGlobals, enemyGlobals, mapGlobals } from "../main/globalVariables";

class Tower {
  constructor(
    level: number = 1 | 2 | 3,
    position = { x: -25, z: -25 },
    scene: Scene
  ) {
    const name = `tower${level}` as string;

    let tower = MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: towerGlobals.height,
        updatable: false
      },
      scene
    ) as Mesh;

    this.revive(scene, tower, position, level);
  }

  revive(scene: Scene, tower: Mesh, position: any, level: number) {
    const towerMaterial = scene.getMaterialByID("towerMaterial") as Material;
    const projectileMaterial = scene.getMaterialByID(
      "projectileMaterial"
    ) as Material;

    tower.position = new Vector3(
      position.x,
      towerGlobals.height / 2,
      position.z
    ) as Vector3;

    tower.material = towerMaterial as Material;

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        const outerTurret = MeshBuilder.CreateBox(
          "outerTurret",
          {
            size: towerGlobals.height * level,
            height: (towerGlobals.height * level) / level,
            width: towerGlobals.height * level,
            updatable: false
          },
          scene
        ) as Mesh;
        const innerTurret = MeshBuilder.CreateBox(
          "innerTurret",
          {
            size: towerGlobals.height * level * 0.8,
            height: (towerGlobals.height * level) / level,
            width: (towerGlobals.height * level) / 1.5,
            updatable: false
          },
          scene
        ) as Mesh;
        innerTurret.position = new Vector3(0, 0, -0.2 * level) as Vector3;

        const outerCSG = CSG.FromMesh(outerTurret);
        const innterCSG = CSG.FromMesh(innerTurret);

        innerTurret.dispose();
        outerTurret.dispose();

        const towerCSG = outerCSG.subtract(innterCSG);

        const towerTurret = towerCSG.toMesh(
          "towerTurret" as any,
          null,
          scene,
          false
        ) as Mesh;

        towerTurret.position = new Vector3(
          position.x,
          towerGlobals.height * level * 1.5,
          position.z
        ) as Vector3;

        const flash = MeshBuilder.CreateIcoSphere(
          name,
          {
            radius: level,
            subdivisions: 1,
            updatable: false
          },
          scene
        ) as Mesh;

        const flashLocal = new Vector3(0, 0, 4) as Vector3;
        const flashSpace = towerTurret.getDirection(flashLocal) as Vector3;

        flash.position = towerTurret.position.subtract(flashSpace) as Vector3;
        flash.rotation = towerTurret.rotation.clone() as Vector3;
        towerTurret.material = towerMaterial as Material;
        towerTurret.addChild(flash) as Mesh;
        flash.isPickable = false as boolean;
        flash.setEnabled(false);
        flash.material = projectileMaterial as Material;

        const rayLocal = new Vector3(0, 0, -1);
        const rayLocalOrigin = new Vector3(0, 0, -5);
        const turretDirection = towerTurret.getDirection(rayLocalOrigin);

        const ray = new Ray(
          flash.getAbsolutePosition(),
          turretDirection,
          towerGlobals.range * 3
        ) as Ray;

        if (towerGlobals.raysOn) {
          var rayHelper = new RayHelper(ray) as RayHelper;
          rayHelper.show(scene, new Color3(1, 1, 0.3));
        }
        scene.registerBeforeRender(() => {
          ray.direction = towerTurret.getDirection(rayLocal) as Vector3;
        });

        this.enemyWatch(scene, tower, towerTurret, flash, ray, level);

        const pillar = MeshBuilder.CreateBox(name, {
          size: level / 2,
          height: towerGlobals.height * level,
          updatable: false
        }) as Mesh;
        pillar.position = new Vector3(
          position.x,
          towerGlobals.height * level * 0.5,
          position.z
        ) as Vector3;

        pillar.material = towerMaterial;

        Tags.AddTagsTo(pillar, "tower");
        Tags.AddTagsTo(towerTurret, "tower");

        break;
    }

    tower.physicsImpostor = new PhysicsImpostor(
      tower,
      PhysicsImpostor.BoxImpostor,
      {
        mass: towerGlobals.mass * level,
        restitution: towerGlobals.restitution
      },
      scene
    ) as PhysicsImpostor;

    mapGlobals.allImpostors.unshift(tower.physicsImpostor);
    Tags.AddTagsTo(tower, "tower");
    towerGlobals.allTowers.unshift(tower);
  }

  rayClearsTower(scene: any, ray: any, tower: Mesh) {
    let result = false as boolean;
    scene.pickWithRay(ray, (mesh: Mesh) => {
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
    scene: Scene,
    tower: Mesh,
    towerTurret: Mesh,
    flash: Mesh,
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
            enemy.position.y <= towerGlobals.range * 3 &&
            enemy.position.y > 0 &&
            //@ts-ignore
            enemy.hitPoints >= enemyGlobals.deadHitPoints &&
            Vector3.Distance(towerTurret.position, enemy.position) <=
              towerGlobals.range * 3 &&
            this.rayClearsTower(scene, ray, tower)
          ) {
            enemyDistances.push([
              Vector3.Distance(towerTurret.position, enemy.position),
              [enemy]
            ]);
          }
        }
        if (enemyDistances.length > 0) {
          this.rotateTurret(enemyDistances.sort()[0][1][0], towerTurret);

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
              fire(scene, towerTurret, level);
            }, 1);
          }
        }
      }
    });
  }

  rotateTurret(sortedDistances: any, towerTurret: Mesh) {
    towerTurret.lookAt(sortedDistances.position);
  }
}

function towerGenerator(scene: Scene, quantity: number = 0) {
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

export default function towers(scene: Scene) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber)
  );
}
