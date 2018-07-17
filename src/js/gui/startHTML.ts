import { mapGlobals, projectileGlobals } from "../main/globalVariables";

const startHTML = `<p>To accomplish victory: survive all the enemy waves.</p><p>Tap the grid to strategically deploy or upgrade towers.</p><p>Absorb energy by shooting the enemy to replenish your energy bank.</p><p>You will be defeated if your energy bank is depleted!</p> <button id="okHelp" style="
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

const startStyle = `
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
      `;

const startButtonStyle = `
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
      line-height: 0;
      `;

const startButtonHTML = `&#9654;`;

export { startHTML, startStyle, startButtonStyle, startButtonHTML };
