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
import { removeTower, addTower } from "../main/sound";
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

  tower.freezeWorldMatrix();
  switch (level) {
    case 1:
    default:
      const deltaTime = Date.now();
      let disposeTimeout: any;
      const disposeTower = () => {
        if (
          Date.now() - deltaTime > towerGlobals.lifeTime &&
          !tower.isDisposed()
        ) {
          tower.unregisterAfterRender(disposeTower);
          tower.material = materialGlobals.hitMaterial;
          removeTower(tower, level); // sound
          disposeTimeout = setTimeout(() => {
            removeTower(tower, level); // sound
            tower.dispose();
          }, towerGlobals.disposeTime);
        }
      };
      tower.registerAfterRender(disposeTower);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          () => {
            window.clearTimeout(disposeTimeout);

            destroyTower(scene, tower);
          },
          undefined,
          true
        );
      }

      break;
    case 2:

      let turretMesh = towerGlobals.turretMeshL3.clone("turret" + name, undefined, undefined, true) as TowerTurret;

      turretMesh.position = new Vector3(
        position.x,
        towerGlobals.height * level * 1.5,
        position.z
      ) as Vector3;

      const flashMesh = MeshBuilder.CreateIcoSphere(
        "flash" + name,
        { radius: level * 2, subdivisions: 1, updatable: false },
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
      flashMesh.visibility = 0;
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

      tower.registerBeforeRender(() => {
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
      pillarMesh.freezeWorldMatrix();

      Tags.AddTagsTo(pillarMesh, "obstacle");
      Tags.AddTagsTo(turretMesh, "obstacle");

      const deltaTime2 = Date.now();
      let disposeTimeout2: any;
      const disposeTower2 = () => {
        if (
          Date.now() - deltaTime2 > towerGlobals.lifeTime &&
          !tower.isDisposed()
        ) {
          tower.unregisterAfterRender(disposeTower2);
          tower.material = materialGlobals.hitMaterial;
          pillarMesh.material = materialGlobals.hitMaterial;
          turretMesh.material = materialGlobals.hitMaterial;
          removeTower(tower, level); // sound
          disposeTimeout2 = setTimeout(() => {
            removeTower(tower, level); // sound
            tower.dispose();
            economyGlobals.currentBalance +=
              (level - 1) * towerGlobals.baseCost;
            new Tower(level - 1, tower.position, scene, physicsEngine);
          }, towerGlobals.disposeTime);
        }
      };

      tower.registerAfterRender(disposeTower2);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          () => {
            window.clearTimeout(disposeTimeout2);
            destroyTower(scene, tower, pillarMesh, turretMesh, flashMesh);
          },
          undefined,
          true
        );
      }

      pillarMesh.physicsImpostor = new PhysicsImpostor(
        pillarMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: towerGlobals.restitution },
        scene
      ) as PhysicsImpostor;

      mapGlobals.allImpostors.unshift(pillarMesh.physicsImpostor);
      break;
    case 3:


      let turretMesh = towerGlobals.turretMeshL2.clone("turret" + name, undefined, undefined, true) as TowerTurret;

      turretMesh.position = new Vector3(
        position.x,
        towerGlobals.height * level * 1.5,
        position.z
      ) as Vector3;

      const flashMesh = MeshBuilder.CreateIcoSphere(
        "flash" + name,
        { radius: level * 2, subdivisions: 1, updatable: false },
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
      flashMesh.visibility = 0;
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

      tower.registerBeforeRender(() => {
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
      pillarMesh.freezeWorldMatrix();

      Tags.AddTagsTo(pillarMesh, "obstacle");
      Tags.AddTagsTo(turretMesh, "obstacle");

      const deltaTime2 = Date.now();
      let disposeTimeout2: any;
      const disposeTower2 = () => {
        if (
          Date.now() - deltaTime2 > towerGlobals.lifeTime &&
          !tower.isDisposed()
        ) {
          tower.unregisterAfterRender(disposeTower2);
          tower.material = materialGlobals.hitMaterial;
          pillarMesh.material = materialGlobals.hitMaterial;
          turretMesh.material = materialGlobals.hitMaterial;
          removeTower(tower, level); // sound
          disposeTimeout2 = setTimeout(() => {
            removeTower(tower, level); // sound
            tower.dispose();
            economyGlobals.currentBalance +=
              (level - 1) * towerGlobals.baseCost;
            new Tower(level - 1, tower.position, scene, physicsEngine);
          }, towerGlobals.disposeTime);
        }
      };

      tower.registerAfterRender(disposeTower2);

      if (tower.onDisposeObservable) {
        tower.onDisposeObservable.add(
          () => {
            window.clearTimeout(disposeTimeout2);
            destroyTower(scene, tower, pillarMesh, turretMesh, flashMesh);
          },
          undefined,
          true
        );
      }

      pillarMesh.physicsImpostor = new PhysicsImpostor(
        pillarMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: towerGlobals.restitution },
        scene
      ) as PhysicsImpostor;

      mapGlobals.allImpostors.unshift(pillarMesh.physicsImpostor);
      break;
  }

  if (tower.physicsImpostor !== undefined && tower.physicsImpostor !== null) {
    mapGlobals.allImpostors.unshift(tower.physicsImpostor);
  }
  Tags.AddTagsTo(tower, "obstacle");
  towerGlobals.allTowers.unshift(tower);

  economyGlobals.currentBalance -= towerGlobals.baseCost * level;
}

export { TowerTurret, towerBorn };
