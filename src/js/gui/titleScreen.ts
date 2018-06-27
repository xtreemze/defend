import { projectileGlobals, mapGlobals } from "../main/globalVariables";
import * as FX from "../../vendor/wafxr/wafxr";
import enemies from "../enemy/Enemy";
import towers from "../tower/Tower";
import { Scene } from "babylonjs";

function titleScreen(scene: Scene, canvas: HTMLCanvasElement) {
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
      `
  );
  const canvasParent = canvas.parentNode as Node;

  canvasParent.insertBefore(title, canvas);
  canvasParent.insertBefore(startButton, canvas);
  const noSoundTimer = setTimeout(() => {
    towers(scene);
    enemies(scene);
    const titleParent = title.parentNode as Node;
    titleParent.removeChild(title);
    const startButtonParent = startButton.parentNode as Node;
    startButtonParent.removeChild(startButton);
  }, 4000);

  startButton.addEventListener("click", () => {
    clearTimeout(noSoundTimer);
    towers(scene);
    enemies(scene);

    mapGlobals.soundOn = true;
    FX._tone.context.resume();
    FX._tone.Master.mute = false;

    const titleParent = title.parentNode as Node;
    titleParent.removeChild(title);
    const startButtonParent = startButton.parentNode as Node;
    startButtonParent.removeChild(startButton);
  });
}

export { titleScreen };
