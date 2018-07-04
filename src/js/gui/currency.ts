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
    font-weight: 500;
    font-family: fantasy;
    font-size: 2rem;
        `
  );

  canvasParent.insertBefore(currentBalance, canvas);

  const currencyTower = MeshBuilder.CreateBox(
    "currencyTower",
    {
      width: economyGlobals.bankSize,
      depth: economyGlobals.bankSize,
      height: 20,
      updatable: false
    },
    scene
  ) as Mesh;

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
  Tags.AddTagsTo(currencyTower, "tower");

  const hitPointsMeter = MeshBuilder.CreateBox(
    "currencyMeter",
    //@ts-ignore
    {
      width: economyGlobals.bankSize,
      depth: economyGlobals.bankSize,
      height: 20,
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
  if (economyGlobals.currentBalance < 0 && economyGlobals.restartMessage === false) {
    economyGlobals.currentBalance = 0;
    message(scene, "Defeat", "&#8635;");
    economyGlobals.restartMessage = true;
  }
  if (economyGlobals.currentBalance > economyGlobals.maxBalance && economyGlobals.restartMessage === false) {
    economyGlobals.currentBalance = economyGlobals.maxBalance;
    message(scene, "Victory", "&#8635;");
    economyGlobals.restartMessage = true;
  }

  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;
  currentBalance.innerText = Math.round(economyGlobals.currentBalance).toString();

  const currencyMeter = scene.getMeshByName("currencyMeter");
  //@ts-ignore
  const scaleRate =
    1 / (economyGlobals.maxBalance / economyGlobals.currentBalance);

  //@ts-ignore
  currencyMeter.scaling = new Vector3(scaleRate, 1, scaleRate) as Vector3;
}

export { displayEconomy, updateEconomy, rampUp };
