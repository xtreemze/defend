import {
  projectileGlobals,
  mapGlobals,
  enemyGlobals,
  economyGlobals
} from "../main/globalVariables";
import {
  helpHTML,
  helpButtonHTML,
  helpStyle,
  helpButtonStyle
} from "./helpHTML";
import * as FX from "../../vendor/wafxr/wafxr";
import { enemyWaves } from "../enemy/enemyWaves";
import { newTower } from "../tower/pick";
import { Scene, PhysicsEngine } from "babylonjs";
import { displayEconomy } from "./currency";
import { upgradeTower } from "../tower/upgradeTower";
import { startButtonStyle, startStyle, startButtonHTML } from "./startHTML";

function titleScreen(
  scene: Scene,
  canvas: HTMLCanvasElement,
  physicsEngine: PhysicsEngine
) {
  const title = document.createElement("h1") as HTMLElement;
  title.innerText = `Defend`;
  title.setAttribute("style", startStyle);

  const startButton = document.createElement("button") as HTMLButtonElement;
  startButton.innerHTML = startButtonHTML;
  startButton.id = "startButton";
  startButton.setAttribute("style", startButtonStyle);

  const helpButton = document.createElement("button") as HTMLButtonElement;
  helpButton.innerHTML = `?`;
  helpButton.id = "helpButton";
  helpButton.setAttribute("style", helpButtonStyle);

  const help = document.createElement("div") as HTMLDivElement;
  help.innerHTML = helpHTML;
  help.id = "help";
  help.setAttribute("style", helpStyle);

  const canvasParent = canvas.parentNode as Node;

  canvasParent.insertBefore(title, canvas);
  canvasParent.insertBefore(startButton, canvas);
  canvasParent.insertBefore(helpButton, canvas);

  // When no button is pressed, game starts without sound
  // const noSoundTimer = setTimeout(() => {
  //   mapGlobals.soundOn = false;
  //   startGame();
  // }, 9000);

  // Start button behavior
  startButton.addEventListener("click", () => {
    // Enable sound
    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;
    // clearTimeout(noSoundTimer);
    // Start game
    startGame();
  });

  // Help button behavior
  helpButton.addEventListener("click", () => {
    // Enable sound
    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;
    // clearTimeout(noSoundTimer);
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
