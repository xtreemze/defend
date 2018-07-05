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

import { towerGlobals, mapGlobals } from "../main/globalVariables";
import { trackSpheres, destroyTower } from "./Tower";
export function revive(
  scene: Scene,
  tower: Mesh,
  position: any,
  level: number,
  physicsEngine: PhysicsEngine
) {
  const towerMaterial = scene.getMaterialByID("towerMaterial") as Material;
  const damagedMaterial = scene.getMaterialByID("hitMaterial") as Material;
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
      const disposeTimer = setTimeout(() => {
        tower.material = damagedMaterial;
        setTimeout(() => {
          tower.dispose();
        }, 3000);
      }, towerGlobals.lifeTime);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          (d, s) => {
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
      ) as Mesh;
      turretMesh.convertToUnIndexedMesh();
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
      turretMesh.material = towerMaterial as Material;
      turretMesh.addChild(flashMesh) as Mesh;

      flashMesh.isPickable = false as boolean;
      flashMesh.setEnabled(false);
      flashMesh.material = projectileMaterial as Material;

      const rayLocal = new Vector3(0, 0, -1);

      const ray = new Ray(
        turretMesh.getAbsolutePosition(),
        turretMesh.getDirection(rayLocal),
        towerGlobals.range * 3
      ) as Ray;

      if (towerGlobals.raysOn) {
        var rayHelper = new RayHelper(ray) as RayHelper;
        rayHelper.show(scene, new Color3(1, 1, 0.3));
      }
      scene.registerBeforeRender(() => {
        ray.direction = turretMesh.getDirection(rayLocal) as Vector3;
      });
      trackSpheres(
        scene,
        tower,
        turretMesh,
        flashMesh,
        ray,
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

      pillarMesh.material = towerMaterial;
      Tags.AddTagsTo(pillarMesh, "tower");
      Tags.AddTagsTo(turretMesh, "tower");

      const disposeTimer2 = setTimeout(() => {
        tower.material = damagedMaterial;
        setTimeout(() => {
          tower.dispose();
        }, 3000);
      }, towerGlobals.lifeTime);

      if (tower.onDisposeObservable) {
        // babylon 2.4+
        tower.onDisposeObservable.add(
          (d, s) => {
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
  Tags.AddTagsTo(tower, "tower");
  towerGlobals.allTowers.unshift(tower);
}
