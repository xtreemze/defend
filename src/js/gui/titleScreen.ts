import {
  projectileGlobals,
  mapGlobals,
  enemyGlobals,
  economyGlobals
} from "../main/globalVariables";
import * as FX from "../../vendor/wafxr/wafxr";
import { enemyWaves } from "../enemy/enemyWaves";
import { newTower } from "../tower/pick";
import { Scene, PhysicsEngine } from "babylonjs";
import { displayEconomy } from "./currency";
import { upgradeTower } from "../tower/upgradeTower";

function titleScreen(
  scene: Scene,
  canvas: HTMLCanvasElement,
  physicsEngine: PhysicsEngine
) {
  const title = document.createElement("h1") as HTMLElement;
  title.innerText = `Defend`;
  title.setAttribute(
    "style",
    `
    position: absolute;
    color: ${projectileGlobals.livingColor.toHexString()};
    top: 30vh;
    width: 100vw;
    text-align: center;
    margin-top: -1.5rem;
    font-weight: 500;
    font-family: fantasy;
    font-size: 4rem;
    user-select: none;
    text-shadow: black 0px 0px 18px;
    `
  );

  const startButton = document.createElement("button") as HTMLButtonElement;
  startButton.innerHTML = `&#9654;`;
  startButton.id = "startButton";
  startButton.setAttribute(
    "style",
    `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    bottom: 20vh;
    left: 50vw;
    width: 6rem;
    height: 6rem;
    margin-bottom: 1.5rem;
    margin-left: -3rem;
    border-radius: 6rem;
    font-weight: 600;
    outline: none;
    font-size: 3rem;
    user-select: none;
    `
  );

  const helpButton = document.createElement("button") as HTMLButtonElement;
  helpButton.innerHTML = `?`;
  helpButton.id = "helpButton";
  helpButton.setAttribute(
    "style",
    `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    bottom: 8vh;
    left: 50vw;
    width: 3rem;
    height: 3rem;
    margin-bottom: 1.5rem;
    margin-left: -1.5rem;
    border-radius: 3rem;
    font-weight: 600;
    outline: none;
    font-size: 1.5rem;
    user-select: none;
    `
  );

  const help = document.createElement("div") as HTMLDivElement;
  help.innerHTML = `<p>To accomplish victory: survive all the enemy waves.</p><p>Tap the grid to strategically deploy or upgrade towers.</p><p>Absorb energy by shooting the enemy to replenish your energy bank.</p><p>You will be defeated if your energy bank is depleted!</p> <button id="okHelp" style="
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    width: 100%;
    height: 6rem;
    border-radius: 6rem;
    font-weight: 600;
    outline: none;
    font-size: 3vh;
    text-align: center;
    user-select: none;
    ">Defend!</button>`;
  help.id = "help";
  help.setAttribute(
    "style",
    `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    padding: 10%;
    width: 60%;
    border-radius: 1rem;
    font-weight: 100;
    outline: none;
    border: 1px solid ${projectileGlobals.livingColor.toHexString()};
    font-size: 3vh;
    user-select: none;
    margin: 10%;
    text-align: center;
      `
  );

  const canvasParent = canvas.parentNode as Node;

  canvasParent.insertBefore(title, canvas);
  canvasParent.insertBefore(startButton, canvas);
  canvasParent.insertBefore(helpButton, canvas);

  // When no button is pressed, game starts without sound
  const noSoundTimer = setTimeout(() => {
    mapGlobals.soundOn = false;
    startGame();
  }, 9000);

  // Start button behavior
  startButton.addEventListener("click", () => {
    // Enable sound
    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;
    clearTimeout(noSoundTimer);
    // Start game
    startGame();
  });

  // Help button behavior
  helpButton.addEventListener("click", () => {
    // Enable sound
    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;
    clearTimeout(noSoundTimer);
    const titleParent = title.parentNode as Node;
    titleParent.removeChild(title);

    const startButtonParent = startButton.parentNode as Node;
    startButtonParent.removeChild(startButton);

    canvasParent.insertBefore(help, canvas);
    const helpButtonParent = helpButton.parentNode as Node;
    helpButtonParent.removeChild(helpButton);

    const okHelp = document.getElementById("okHelp") as HTMLButtonElement;

    okHelp.addEventListener("click", function() {
      const help = document.getElementById("help") as HTMLDivElement;
      const helpParent = help.parentNode as Node;
      helpParent.removeChild(help);
      startGame();
    });
  });

  function startGame() {
    displayEconomy(scene);

    // start Enemy Generation and Waves
    enemyGlobals.decayRate = enemyGlobals.initialDecayRate;
    economyGlobals.restartMessage = false;
    enemyGlobals.currentWave = 0;
    enemyWaves(scene);

    // remove GUI
    const titleParent = title.parentNode as Node;
    if (titleParent !== null) {
      titleParent.removeChild(title);
    }
    const startButtonParent = startButton.parentNode as Node;

    if (startButtonParent !== null) {
      startButtonParent.removeChild(startButton);
    }

    const helpButtonParent = helpButton.parentNode as Node;

    if (helpButtonParent !== null) {
      helpButtonParent.removeChild(helpButton);
    }

    // enable interactive Tower generation and upgrade
    newTower(scene, physicsEngine);
    upgradeTower(scene, physicsEngine);
  }
}

export { titleScreen };
