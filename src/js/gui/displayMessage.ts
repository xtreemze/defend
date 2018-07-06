import {
  projectileGlobals,
  mapGlobals,
  economyGlobals,
  enemyGlobals
} from "../main/globalVariables";
import { Scene } from "babylonjs";
import { rampUp } from "./currency";

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
  if (canvas !== null) {
    const canvasParent = canvas.parentNode as Node;
    canvasParent.insertBefore(title, canvas);
    canvasParent.insertBefore(startButton, canvas);
    startButton.addEventListener("click", () => {
      const titleParent = title.parentNode as Node;
      titleParent.removeChild(title);
      const startButtonParent = startButton.parentNode as Node;
      startButtonParent.removeChild(startButton);
      enemyGlobals.currentWave = 0;
      rampUp(scene);
      enemyGlobals.limit = mapGlobals.size;
      economyGlobals.restartMessage = false;
    });
  }
}

export { displayMessage };
