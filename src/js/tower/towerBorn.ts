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
  CSG,
  PhysicsEngine
} from "babylonjs";

import {
  towerGlobals,
  mapGlobals,
  materialGlobals,
  economyGlobals
} from "../main/globalVariables";
import { destroyTower, Tower } from "./Tower";
import { trackSpheres } from "./trackSpheres";
import { removeTower } from "../main/sound";
import { updateEconomy } from "../gui/updateEconomy";
import { Position2D } from "../enemy/Enemy";

interface LiveTower extends Mesh {
  hitPoints: number;
}

interface TowerTurret extends Mesh {
  hitPoints: number;
  turretRayHelper: RayHelper;
  ray: Ray;
}

function towerBorn(
  scene: Scene,
  tower: Mesh,
  position: Position2D,
  level: number,
  physicsEngine: PhysicsEngine
) {
  tower.position = new Vector3(
    position.x,
    towerGlobals.height / 2,
    position.z
  ) as Vector3;
  tower.material = materialGlobals.towerMaterial;
  switch (level) {
    case 1:
    default:
      const disposeTimer = setTimeout(() => {
        tower.material = materialGlobals.hitMaterial;
        setTimeout(() => {
          removeTower(tower, level);
          tower.dispose();
        }, towerGlobals.disposeTime);
      }, towerGlobals.lifeTime);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          () => {
            window.clearTimeout(disposeTimer);

            destroyTower(scene, tower);
          },
          undefined,
          true
        );
      }

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
      innerTurret.position = new Vector3(
        0,
        0,
        -0.1 * (towerGlobals.height * level)
      ) as Vector3;
      const outerCSG = CSG.FromMesh(outerTurret);
      const innterCSG = CSG.FromMesh(innerTurret);
      innerTurret.dispose();
      outerTurret.dispose();
      const towerCSG = outerCSG.subtract(innterCSG);
      const turretMesh = towerCSG.toMesh(
        ("turret" + name) as any,
        null,
        scene,
        false
      ) as TowerTurret;
      turretMesh.convertToUnIndexedMesh();

      turretMesh.isPickable = false as boolean;

      turretMesh.position = new Vector3(
        position.x,
        towerGlobals.height * level * 1.5,
        position.z
      ) as Vector3;

      const flashMesh = MeshBuilder.CreateIcoSphere(
        "flash" + name,
        {
          radius: level,
          subdivisions: 1,
          updatable: false
        },
        scene
      ) as Mesh;

      const flashLocal = new Vector3(0, 0, 4) as Vector3;
      const flashSpace = turretMesh.getDirection(flashLocal) as Vector3;
      flashMesh.position = turretMesh.position.subtract(flashSpace) as Vector3;
      flashMesh.rotation = turretMesh.rotation.clone() as Vector3;
      turretMesh.material = materialGlobals.towerMaterial as Material;
      turretMesh.addChild(flashMesh) as Mesh;

      flashMesh.isPickable = false as boolean;
      flashMesh.convertToUnIndexedMesh();
      flashMesh.setEnabled(false);
      flashMesh.material = materialGlobals.projectileMaterial as Material;

      const rayLocal = new Vector3(0, 0, -1);

      const turretRay = new Ray(
        turretMesh.getAbsolutePosition(),
        turretMesh.getDirection(rayLocal),
        towerGlobals.range * level
      ) as Ray;

      if (towerGlobals.raysOn) {
        turretMesh.turretRayHelper = new RayHelper(turretRay) as RayHelper;

        turretMesh.turretRayHelper.show(scene, new Color3(1, 1, 0.3));
      }

      scene.registerBeforeRender(() => {
        turretRay.direction = turretMesh.getDirection(rayLocal) as Vector3;
      });

      trackSpheres(
        scene,
        tower,
        turretMesh,
        flashMesh,
        turretRay,
        level,
        physicsEngine
      );

      const pillarMesh = MeshBuilder.CreateBox("pillar" + name, {
        size: level / 1.5,
        height: towerGlobals.height * level,
        updatable: false
      }) as Mesh;

      pillarMesh.position = new Vector3(
        position.x,
        towerGlobals.height * level * 0.5,
        position.z
      ) as Vector3;

      pillarMesh.material = materialGlobals.towerMaterial as Material;
      pillarMesh.isPickable = false as boolean;
      pillarMesh.convertToUnIndexedMesh();

      Tags.AddTagsTo(pillarMesh, "obstacle");
      Tags.AddTagsTo(turretMesh, "obstacle");

      const disposeTimer2 = setTimeout(() => {
        tower.material = materialGlobals.hitMaterial;
        setTimeout(() => {
          removeTower(tower, level);
          tower.dispose();
          economyGlobals.currentBalance += (level - 1) * towerGlobals.baseCost;
          new Tower(level - 1, tower.position, scene, physicsEngine);
        }, towerGlobals.disposeTime);
      }, towerGlobals.lifeTime);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          () => {
            window.clearTimeout(disposeTimer2);
            destroyTower(scene, tower, pillarMesh, turretMesh, flashMesh);
          },
          undefined,
          true
        );
      }

      pillarMesh.physicsImpostor = new PhysicsImpostor(
        pillarMesh,
        PhysicsImpostor.BoxImpostor,
        {
          mass: 0,
          restitution: towerGlobals.restitution
        },
        scene
      ) as PhysicsImpostor;

      mapGlobals.allImpostors.unshift(pillarMesh.physicsImpostor);
      break;
  }
  tower.physicsImpostor = new PhysicsImpostor(
    tower,
    PhysicsImpostor.BoxImpostor,
    {
      mass: 0,
      restitution: towerGlobals.restitution
    },
    scene
  ) as PhysicsImpostor;

  mapGlobals.allImpostors.unshift(tower.physicsImpostor);
  Tags.AddTagsTo(tower, "obstacle");
  towerGlobals.allTowers.unshift(tower);

  economyGlobals.currentBalance -= towerGlobals.baseCost * level;
  updateEconomy(scene);
}

export { TowerTurret, towerBorn };
