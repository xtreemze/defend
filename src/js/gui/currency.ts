import { updateEconomy } from "./updateEconomy";

import {
  economyGlobals,
  enemyGlobals,
  materialGlobals
} from "../main/globalVariables";
import {
  MeshBuilder,
  Scene,
  Mesh,
  PhysicsImpostor,
  Material,
  Tags
} from "babylonjs";

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
      height: economyGlobals.bankSize / 12,
      updatable: false
    },
    scene
  ) as Mesh;

  economyGlobals.currencyMesh = currencyTower;

  Tags.AddTagsTo(currencyTower, "tower");

  const hitPointsMeter = MeshBuilder.CreateBox(
    "currencyMeter", //@ts-ignore
    {
      width: economyGlobals.bankSize,
      depth: economyGlobals.bankSize,
      height: economyGlobals.bankSize / 12,
      updatable: false
    },
    scene
  ) as Mesh;

  economyGlobals.currencyMeter = hitPointsMeter;

  hitPointsMeter.isPickable = false;

  currencyTower.position.y += economyGlobals.bankSize / 24;
  hitPointsMeter.parent = currencyTower;

  currencyTower.isPickable = false;
  currencyTower.freezeWorldMatrix();
  currencyTower.convertToUnIndexedMesh();

  currencyTower.physicsImpostor = new PhysicsImpostor(
    currencyTower,
    PhysicsImpostor.BoxImpostor,
    {
      mass: 0,
      restitution: 0.8,
      friction: 1
    },
    scene
  ) as PhysicsImpostor;

  currencyTower.material = materialGlobals.hitMaterial;
  hitPointsMeter.material = materialGlobals.enemyMaterial;

  rampUp(scene, currencyTower);
}

function rampUp(scene: Scene, currencyTower?: Mesh) {
  economyGlobals.currentBalance = 0;

  const interval1 = setInterval(() => {
    economyGlobals.currentBalance += 100;
    updateEconomy(scene, currencyTower);
    if (
      economyGlobals.currentBalance >= economyGlobals.initialBalance ||
      economyGlobals.currentBalance < 0
    ) {
      clearInterval(interval1);
    }
  }, 1000 / 30);
}
export { displayEconomy, updateEconomy, rampUp };
