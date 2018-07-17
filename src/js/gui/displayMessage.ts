import {
  projectileGlobals,
  mapGlobals,
  economyGlobals,
  enemyGlobals,
  towerGlobals
} from "../main/globalVariables";
import { Scene } from "babylonjs";
import { rampUp } from "./currency";
import { enemyWaves } from "../enemy/enemyWaves";

function displayMessage(scene: Scene, message: string, icon: string) {
  enemyGlobals.limit = 0;
  const canvas = document.getElementById("renderCanvas");
  const title = document.createElement("h1") as HTMLElement;
  title.innerText = message;
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
  startButton.innerHTML = icon;
  startButton.id = "startButton";
  startButton.setAttribute(
    "style",
    `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    top: 50vh;
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

  if (canvas !== null) {
    const canvasParent = canvas.parentNode as Node;
    canvasParent.insertBefore(title, canvas);
    canvasParent.insertBefore(startButton, canvas);
    canvasParent.insertBefore(helpButton, canvas);

    // Start button behavior
    startButton.addEventListener("click", () => {
      towerGlobals.allTowers.forEach(tower => {
        tower.dispose();
      });

      // Enemy waves start
      enemyGlobals.decayRate = enemyGlobals.initialDecayRate;
      enemyGlobals.currentWave = 0;
      economyGlobals.restartMessage = false;

      enemyWaves(scene);

      // Button and GUI
      const titleParent = title.parentNode as Node;
      titleParent.removeChild(title);
      const startButtonParent = startButton.parentNode as Node;
      startButtonParent.removeChild(startButton);

      // Clear Help Button
      const help = document.getElementById("helpButton") as HTMLDivElement;
      const helpParent = help.parentNode as Node;
      helpParent.removeChild(help);
      rampUp(scene);
    });

    // Help button behavior
    helpButton.addEventListener("click", () => {
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

        towerGlobals.allTowers.forEach(tower => {
          tower.dispose();
        });

        // Enemy waves start
        enemyGlobals.decayRate = enemyGlobals.initialDecayRate;
        enemyGlobals.currentWave = 0;
        economyGlobals.restartMessage = false;

        enemyWaves(scene);

        // Button and GUI
        rampUp(scene);
      });
    });
  }
}

export { displayMessage };
