import * as BABYLON from "babylonjs";
import fire from "./projectiles";
import positionGenerator from "./positionGenerator";
import randomNumberRange from "./randomNumberRange";
import { towerGlobals, enemyGlobals, mapGlobals } from "./variables";

class Tower {
  constructor(
    level = 1,
    position = { x: -25, z: -25 },
    scene = BABYLON.Scene.prototype
  ) {
    const name = `tower${level}`;
    const levelTop = `towerTop${level}`;

    const tower = BABYLON.MeshBuilder.CreateBox(
      name,
      {
        size: 10,
        height: towerGlobals.height
      },
      scene
    );
    BABYLON.Tags.AddTagsTo(tower, "tower");

    towerGlobals.allTowers.unshift(this);

    this.revive(scene, tower, position, level, levelTop);
  }

  revive(scene, tower, position, level, levelTop) {
    tower.position = new BABYLON.Vector3(
      position.x,
      towerGlobals.height / 2,
      position.z
    );

    tower.physicsImpostor = new BABYLON.PhysicsImpostor(
      tower,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: towerGlobals.mass, restitution: towerGlobals.restitution },
      scene
    );

    mapGlobals.allImpostors.unshift(tower.physicsImpostor);

    tower.material = scene.getMaterialByID("towerMaterial");

    switch (level) {
      case 1:
      default:
        break;
      case 2:
      case 3:
        tower[levelTop] = BABYLON.MeshBuilder.CreateBox(
          levelTop,
          {
            size: 2,
            height: towerGlobals.height,
            width: 4
          },
          scene
        );
        tower[levelTop].position = new BABYLON.Vector3(
          position.x,
          towerGlobals.height * 1.5,
          position.z
        );
        tower[levelTop].physicsImpostor = new BABYLON.PhysicsImpostor(
          tower[levelTop],
          BABYLON.PhysicsImpostor.BoxImpostor,
          { mass: towerGlobals.mass, restitution: towerGlobals.restitution },
          scene
        );

        mapGlobals.allImpostors.unshift(tower[levelTop].physicsImpostor);

        tower[levelTop].material = scene.getMaterialByID("towerMaterial");
        // tower.addChild(tower[levelTop]);
        this.enemyWatch(scene, tower, levelTop);

        break;
    }
  }

  enemyWatch(
    scene = BABYLON.Scene.prototype,
    tower = BABYLON.Mesh.prototype,
    levelTop = ""
  ) {
    const rotateDelay = 200;

    let deltaTime = Date.now();

    // this.slowRotateTurret(scene, rotateDelay, tower, levelTop);

    scene.registerBeforeRender(() => {
      const enemyDistances = [];

      for (let index = 0; index < enemyGlobals.allEnemies.length; index++) {
        const enemy = enemyGlobals.allEnemies[index];
        if (
          enemy.position.y < 4 &&
          enemy.position.y > 1 &&
          enemy.hitPoints > enemyGlobals.deadHitPoints &&
          BABYLON.Vector3.Distance(tower[levelTop].position, enemy.position) <=
            towerGlobals.range
        ) {
          enemyDistances.push([
            BABYLON.Vector3.Distance(tower[levelTop].position, enemy.position),
            [enemy]
          ]);
        }
      }

      const sortedDistances = enemyDistances.sort();
      if (sortedDistances.length > 0) {
        this.rotateTurret(sortedDistances[0][1][0], tower, levelTop);

        if (Date.now() - deltaTime > towerGlobals.rateOfFire) {
          deltaTime = Date.now();

          fire(scene, tower[levelTop]);
        }
      }
    });
  }

  rotateTurret(sortedDistances, tower = BABYLON.Mesh.prototype, levelTop = "") {
    tower[levelTop].lookAt(
      new BABYLON.Vector3(
        sortedDistances.position.x,
        tower[levelTop].position.y,
        sortedDistances.position.z
      )
    );
  }

  slowRotateTurret(
    scene = BABYLON.Scene.prototype,
    rotateDelay = 0,
    tower = BABYLON.Mesh.prototype,
    levelTop = "",
    turretRotation = BABYLON.Quaternion.prototype
  ) {
    tower[levelTop].rotationQuaternion = BABYLON.Quaternion.Identity();
    let lookTarget = enemyGlobals.allEnemies[0];
    let lookTargetPos = lookTarget.position.clone();

    // let lookTarget = scene.getMeshByID("ground");
    // let lookTargetPos = lookTarget.position.clone();
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
        fire(scene, tower[levelTop]);
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
