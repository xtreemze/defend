import {
  projectileGlobals,
  mapGlobals,
  enemyGlobals,
  economyGlobals
} from "../main/globalVariables";
import * as FX from "../../vendor/wafxr/wafxr";
import { enemyWaves } from "../enemy/enemyWaves";
import { newTower } from "../interaction/pick";
import { Scene } from "babylonjs";
import { displayEconomy } from "./currency";
import { upgradeTower } from "../interaction/upgradeTower";

function titleScreen(
  scene: Scene,
  canvas: HTMLCanvasElement,
  physicsEngine: any
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
      `
  );

  const startButton = document.createElement("button") as HTMLButtonElement;
  startButton.innerHTML = `&#x1f50a;`;
  startButton.id = "startButton";
  startButton.setAttribute(
    "style",
    `
      position: absolute;
      background-color: ${mapGlobals.sceneAmbient.toHexString()};
      color: ${projectileGlobals.livingColor.toHexString()};
      border-color: ${projectileGlobals.livingColor.toHexString()};
      top: 70vh;
      left: 50vw;
      width: 6rem;
      height: 6rem;
      margin-top: -1.5rem;
      margin-left: -3rem;
      border-radius: 6rem;
      font-weight: 600;
      outline: none;
      font-size: 3rem;
      user-select: none;
      `
  );
  const canvasParent = canvas.parentNode as Node;

  canvasParent.insertBefore(title, canvas);
  canvasParent.insertBefore(startButton, canvas);

  // When no button is pressed, game starts without sound
  const noSoundTimer = setTimeout(() => {
    mapGlobals.soundOn = false;
    startGame();
  }, 3000);

  // Start button behavior
  startButton.addEventListener("click", () => {
    // Enable sound
    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;
    clearTimeout(noSoundTimer);

    startGame();
  });

  function startGame() {
    displayEconomy(scene);
    // start Enemy Generation and Waves
    enemyGlobals.decayRate = enemyGlobals.initialDecayRate;
    economyGlobals.restartMessage = false;
    enemyGlobals.currentWave = 0;
    setTimeout(() => {
      enemyWaves(scene);
    }, 5);
    // remove GUI
    const titleParent = title.parentNode as Node;
    titleParent.removeChild(title);
    const startButtonParent = startButton.parentNode as Node;
    startButtonParent.removeChild(startButton);
    // enable interactive Tower generation and upgrade
    newTower(scene, physicsEngine);
    upgradeTower(scene, physicsEngine);
  }
}

export { titleScreen };
