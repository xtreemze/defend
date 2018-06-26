import { projectileGlobals, mapGlobals } from "./globalVariables";
import * as FX from "./../../vendor/wafxr/wafxr";
import enemies from "./Enemy";
import towers from "./Tower";
import { Scene } from "babylonjs";

function titleScreen(scene: Scene, canvas: HTMLCanvasElement) {
  const title = document.createElement("h1");
  const body = document.createElement("body");
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
      `
  );

  const startButton = document.createElement("button");
  startButton.innerText = `Start!`;
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
      height: 3rem;
      margin-top: -1.5rem;
      margin-left: -3rem;
      border-radius: 8rem;
      font-weight: 600;
      outline: none;
      `
  );
  canvas.parentNode.insertBefore(title, canvas);
  canvas.parentNode.insertBefore(startButton, canvas);
  towers(scene);
    const noSoundTimer = setTimeout(() => {
      enemies(scene);
      title.parentNode.removeChild(title);
      startButton.parentNode.removeChild(startButton);
    }, 4000);

  startButton.addEventListener("click", () => {
    clearTimeout(noSoundTimer);
    enemies(scene);

    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;

    title.parentNode.removeChild(title);
    startButton.parentNode.removeChild(startButton);
  });
}

export { titleScreen };
