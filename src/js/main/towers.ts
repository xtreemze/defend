import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import {
  towerGlobals,
  enemyGlobals,
  mapGlobals,
  projectileGlobals
} from "./variables";

class Tower {
  constructor(
    level = 1,
    position = { x: -25, z: -25 },
    scene = BABYLON.Scene.prototype
  ) {
    const name = `tower${level}`;
    const levelTop = `towerTop${level}`;

    let tower = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: towerGlobals.height,
        updatable: false
      },
      scene
    );

    this.revive(scene, tower, position, level, levelTop);
  }

  revive(scene, tower, position, level, levelTop) {
    const towerMaterial = scene.getMaterialByID("towerMaterial");
    const projectileMaterial = scene.getMaterialByID("projectileMaterial");

    tower.position = new BABYLON.Vector3(
      position.x,
      towerGlobals.height / 2,
      position.z
    );

    tower.material = towerMaterial;

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        const outerTurret = BABYLON.MeshBuilder.CreateBox(
          "outerTurret",
          {
            size: 4,
            height: towerGlobals.height,
            width: 4,
            updatable: false
          },
          scene
        );
        const innerTurret = BABYLON.MeshBuilder.CreateBox(
          "innerTurret",
          {
            size: 3,
            height: towerGlobals.height / 2,
            width: 4 / 1.5,
            updatable: false
          },
          scene
        );
        innerTurret.position = new BABYLON.Vector3(0, 0, -0.5);

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
        );

        tower[levelTop] = towerTurret;

        towerTurret.position = new BABYLON.Vector3(
          position.x,
          towerGlobals.height * 4,
          position.z
        );

        const flash = BABYLON.MeshBuilder.CreateIcoSphere(
          name,
          {
            radius: 3,
            subdivisions: 1,
            updatable: false
          },
          scene
        );

        const flashLocal = new BABYLON.Vector3(0, 0, -3);
        const flashSpace = towerTurret.getDirection(flashLocal);
        flashSpace.normalize();

        flash.position = towerTurret.position.add(flashSpace);
        flash.rotation = towerTurret.rotation.clone();
        towerTurret.material = towerMaterial;
        towerTurret.addChild(flash);
        flash.isPickable = false;
        flash.setEnabled(false);
        flash.material = projectileMaterial;

        const rayLocal = new BABYLON.Vector3(0, 0, -1);
        const rayLocalOrigin = new BABYLON.Vector3(0, 0, -4);
        const turretDirection = towerTurret.getDirection(rayLocalOrigin);

        const ray = new BABYLON.Ray(
          flash.getAbsolutePosition(),
          turretDirection,
          towerGlobals.range
        );

        if (towerGlobals.raysOn) {
          var rayHelper = new BABYLON.RayHelper(ray);
          rayHelper.show(scene, new BABYLON.Color3(1, 1, 0.3));
        }
        scene.registerBeforeRender(() => {
          ray.direction = towerTurret.getDirection(rayLocal);
        });

        // tower.addChild(towerTurret);
        this.enemyWatch(scene, tower, levelTop, flash, ray);

        const pillar = BABYLON.MeshBuilder.CreateBox(name, {
          size: 1,
          height: towerGlobals.height * 3,
          updatable: false
        });
        pillar.position = new BABYLON.Vector3(
          position.x,
          towerGlobals.height * 2,
          position.z
        );

        pillar.material = towerMaterial;

        BABYLON.Tags.AddTagsTo(pillar, "tower");
        BABYLON.Tags.AddTagsTo(towerTurret, "tower");
        // towerTurret.isPickable = false;
        // pillar.isPickable = false;
        break;
    }

    tower.physicsImpostor = new BABYLON.PhysicsImpostor(
      tower,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: towerGlobals.mass, restitution: towerGlobals.restitution },
      scene
    );

    mapGlobals.allImpostors.unshift(tower.physicsImpostor);
    BABYLON.Tags.AddTagsTo(tower, "tower");
    towerGlobals.allTowers.unshift(tower);
  }

  rayClearsTower(scene, ray, tower) {
    let result = false;
    scene.pickWithRay(ray, mesh => {
      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const element = towerGlobals.allTowers[index];

        if (element === mesh && mesh !== tower) {
          result = true;
        }
      }
    });
    return result;
  }

  enemyWatch(
    scene = BABYLON.Scene.prototype,
    tower = BABYLON.Mesh.prototype,
    levelTop = "",
    flash = BABYLON.Mesh.prototype,
    ray
  ) {
    // const rotateDelay = 200;
    let deltaTime = Date.now();

    // this.slowRotateTurret(scene, rotateDelay, tower, levelTop);

    scene.registerBeforeRender(() => {
      if (
        enemyGlobals.allEnemies.length <= enemyGlobals.limit &&
        mapGlobals.allImpostors.length < mapGlobals.impostorLimit
      ) {
        const enemyDistances = [];
        for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
          const enemy = enemyGlobals.allEnemies[index];

          if (
            enemy.position.y <= towerGlobals.range &&
            enemy.position.y > 1 &&
            enemy.hitPoints > enemyGlobals.deadHitPoints &&
            BABYLON.Vector3.Distance(
              tower[levelTop].position,
              enemy.position
            ) <= towerGlobals.range &&
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
            Date.now() - deltaTime > towerGlobals.rateOfFire &&
            towerGlobals.shoot
          ) {
            deltaTime = Date.now();
            const flashTimer = setTimeout(() => {
              flash.setEnabled(false);
            }, 4);
            flash.setEnabled(true);
            const fireTimer = setTimeout(() => {
              fire(scene, tower[levelTop]);
            }, 1);
          }
        }
      }
    });
  }

  rotateTurret(sortedDistances, tower: any = BABYLON.Mesh, levelTop = "") {
    tower[levelTop].lookAt(sortedDistances.position);
  }

  slowRotateTurret(
    scene = BABYLON.Scene.prototype,
    rotateDelay = 0,
    tower = BABYLON.Mesh.prototype,
    levelTop = ""
  ) {
    tower[levelTop].rotationQuaternion = BABYLON.Quaternion.Identity();
    let lookTarget = enemyGlobals.allEnemies[0];
    let lookTargetPos = lookTarget.position.clone();

    let orgQuat = tower[levelTop].rotationQuaternion.clone();
    tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
    let lookQuat = tower[levelTop].rotationQuaternion.clone();
    let percent = 0;
    let percentAdd = 100;

    setInterval(() => {
      if (
        enemyGlobals.allEnemies !== undefined &&
        enemyGlobals.allEnemies.length > 0
      ) {
        lookTarget = enemyGlobals.allEnemies[0];
        lookTargetPos = lookTarget.position.clone();
      }
    }, rotateDelay);

    scene.registerBeforeRender(() => {
      if (enemyGlobals.allEnemies.length > 0) {
        if (lookTarget === null) {
          // lookTarget = enemyGlobals.allEnemies[0];

          lookTargetPos = lookTarget.position.clone();

          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);

          orgQuat = tower[levelTop].rotationQuaternion.clone();
          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
          lookQuat = tower[levelTop].rotationQuaternion.clone();
        }
        if (
          // Reset the rotation values when the target has moved

          BABYLON.Vector3.Distance(lookTargetPos, lookTarget.position) >
          BABYLON.Epsilon
        ) {
          orgQuat = tower[levelTop].rotationQuaternion.clone();
          tower[levelTop].lookAt(lookTarget.position, 0, -Math.PI / 2, 0);
          lookQuat = tower[levelTop].rotationQuaternion.clone();
          lookTargetPos = lookTarget.position.clone();
          percent = 0;
        }

        // Set the tower[levelTop] rotation, increase the percentage
        if (percent !== 1) {
          tower[levelTop].rotationQuaternion = BABYLON.Quaternion.Slerp(
            orgQuat,
            lookQuat,
            percent
          );
          percent += percentAdd;
          if (percent > 1) {
            percent = 1;
          }
        }
      }
    });
  }
}

function towerGenerator(scene = BABYLON.Scene.prototype, quantity = 0) {
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
  );

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
    );
  }
}

export default function towers(scene = BABYLON.Scene.prototype) {
  towerGenerator(
    scene,
    randomNumberRange(towerGlobals.minNumber, towerGlobals.maxNumber)
  );
}
