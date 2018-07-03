import { economyGlobals, enemyGlobals } from "../main/globalVariables";
import { MeshBuilder, Scene, Mesh, PhysicsImpostor } from "babylonjs";

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
      width: 20,
      depth: 20,
      height: 20,
      updatable: false
    },
    scene
  ) as Mesh;

  const currencyImpostor = new PhysicsImpostor(
    currencyTower,
    PhysicsImpostor.BoxImpostor,
    {
      mass: 0,
      restitution: 0.2,
      friction: 1
    },
    scene
  );

  currencyTower.material = scene.getMaterialByName("hitMaterial");

  const hitPointsMeter = MeshBuilder.CreateBox(
    "currencyMeter",
    //@ts-ignore
    {
      width: 20,
      depth: 20,
      height: 20,
      updatable: false
    },
    scene
  ) as Mesh;

  hitPointsMeter.parent = currencyTower;

  currencyTower.position.y = -5;

  hitPointsMeter.material = scene.getMaterialByName("enemyMaterial");
}

function updateEconomy(scene: Scene) {
  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;
  currentBalance.innerText = economyGlobals.currentBalance.toString();

  const currencyMeter = scene.getMeshByName("currencyMeter");
  //@ts-ignore
  const scaleRate = 1 / (1000 / economyGlobals.currentBalance);

  //@ts-ignore
  currencyMeter.scaling = new BABYLON.Vector3(scaleRate, 1, scaleRate);
}

export { displayEconomy, updateEconomy };
