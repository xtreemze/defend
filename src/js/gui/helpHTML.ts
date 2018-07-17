import { mapGlobals, projectileGlobals } from "../main/globalVariables";

const helpHTML = `<p>To accomplish victory: survive all the enemy waves.</p><p>Tap the grid to strategically deploy or upgrade towers.</p><p>Absorb energy by shooting the enemy to replenish your energy bank.</p><p>You will be defeated if your energy bank is depleted!</p> <button id="okHelp" style="
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    width: 100%;
    height: 6rem;
    border-radius: 6rem;
    font-weight: 600;
    outline: none;
    font-size: 3vh;
    font-family: sans-serif;
    text-align: center;
    user-select: none;
    ">Defend!</button>`;

const helpStyle = `
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
      `;

const helpButtonStyle = `
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
    line-height: 0;
    `;

const helpButtonHTML = `?`;

export { helpHTML, helpStyle, helpButtonStyle, helpButtonHTML };
