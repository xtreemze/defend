import { economyGlobals, enemyGlobals } from "../main/globalVariables";
import {
  MeshBuilder,
  Scene,
  Mesh,
  PhysicsImpostor,
  Material,
  Vector3,
  Tags
} from "babylonjs";

import { message } from "./titleScreen";
import { waves } from "../enemy/waves";

function displayEconomy(scene: Scene) {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

  const canvasParent = canvas.parentNode as Node;

  const currentBalance = document.createElement("div") as HTMLDivElement;
  currentBalance.id = "currentBalance";
  currentBalance.innerText = economyGlobals.currentBalance.toString();
  currentBalance.setAttribute(
    "style",
    `
    position: absolute;
    color: ${enemyGlobals.livingColor.toHexString()};
    top: 1.5rem;
    left: 2rem;
    text-align: left;
    font-weight: 100;
    font-family: fantasy;
    font-size: 1.2rem;
    user-select: none;
        `
  );

  canvasParent.insertBefore(currentBalance, canvas);

  const currencyTower = MeshBuilder.CreateBox(
    "currencyTower",
    {
      width: economyGlobals.bankSize,
      depth: economyGlobals.bankSize,
      height: economyGlobals.bankSize / 2,
      updatable: false
    },
    scene
  ) as Mesh;

  Tags.AddTagsTo(currencyTower, "tower");

  currencyTower.physicsImpostor = new PhysicsImpostor(
    currencyTower,
    PhysicsImpostor.BoxImpostor,
    {
      mass: 0,
      restitution: 0.2,
      friction: 1
    },
    scene
  ) as PhysicsImpostor;

  currencyTower.material = scene.getMaterialByName("hitMaterial") as Material;

  const hitPointsMeter = MeshBuilder.CreateBox(
    "currencyMeter", //@ts-ignore
    {
      width: economyGlobals.bankSize,
      depth: economyGlobals.bankSize,
      height: economyGlobals.bankSize / 2,
      updatable: false
    },
    scene
  ) as Mesh;

  hitPointsMeter.parent = currencyTower;

  currencyTower.position.y = -5;

  hitPointsMeter.material = scene.getMaterialByName(
    "enemyMaterial"
  ) as Material;

  rampUp(scene);
}

function rampUp(scene: Scene) {
  economyGlobals.currentBalance = 0;

  const interval1 = setInterval(() => {
    economyGlobals.currentBalance += 50;
    updateEconomy(scene);
    if (
      economyGlobals.currentBalance >= economyGlobals.initialBalance ||
      economyGlobals.currentBalance < 0
    ) {
      clearInterval(interval1);
    }
  }, 1000 / 60);
}
function updateEconomy(scene: Scene) {
  if (
    economyGlobals.currentBalance < 0 &&
    economyGlobals.restartMessage === false
  ) {
    economyGlobals.currentBalance = 0;
    message(scene, "Defeat", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.defeats += 1;
  }
  if (
    economyGlobals.currentBalance > economyGlobals.maxBalance &&
    economyGlobals.restartMessage === false
  ) {
    economyGlobals.currentBalance = economyGlobals.maxBalance;
    message(scene, "Victory", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.victories += 1;
  }

  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;

  const level = enemyGlobals.currentWave.toString();
  const currency = Math.round(economyGlobals.currentBalance).toString();

  currentBalance.innerText = `Wave: ${level}/${waves.length}
  Energy: ${currency}
  Defeats: ${economyGlobals.defeats}
  Victores: ${economyGlobals.victories}`;

  const currencyMeter = scene.getMeshByName("currencyMeter");
  //@ts-ignore
  const scaleRate =
    1 / (economyGlobals.maxBalance / economyGlobals.currentBalance);

  //@ts-ignore
  currencyMeter.scaling = new Vector3(
    scaleRate,
    scaleRate,
    scaleRate
  ) as Vector3;
}

export { displayEconomy, updateEconomy, rampUp };
