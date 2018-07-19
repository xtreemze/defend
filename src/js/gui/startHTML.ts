import { mapGlobals, projectileGlobals } from "../main/globalVariables";

const startStyle = `
    position: absolute;
    color: ${projectileGlobals.livingColor.toHexString()};
      top: 26vh;
      width: 100vw;
      text-align: center;
      margin-top: -1.5rem;
      font-weight: 700;
      font-family: 'Titillium Web', sans-serif;
      font-size: 4rem;
      user-select: none;
      text-shadow: black 0px 0px 18px;
      `;

const startButtonStyle = `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    top: 48vh;
    left: 50vw;
      width: 6rem;
      height: 6rem;
      margin-top: -1.5rem;
      margin-left: -3rem;
      border-radius: 6rem;
      font-weight: 700;
      outline: none;
      font-size: 3rem;
      font-family: 'Titillium Web', sans-serif;
      user-select: none;
      line-height: 0;
      `;

const installButtonStyle = `
    position: absolute;
    background-color: ${mapGlobals.sceneAmbient.toHexString()};
    color: ${projectileGlobals.livingColor.toHexString()};
    border-color: ${projectileGlobals.livingColor.toHexString()};
    bottom: 13vh;
    left: 50vw;
    width: 3rem;
    height: 3rem;
    margin-bottom: 1.5rem;
    margin-left: -1.5rem;
    border-radius: 3rem;
    font-weight: 400;
    outline: none;
    font-size: 1.5rem;
    font-family: 'Titillium Web', sans-serif;
    user-select: none;
    line-height: 0;
    `;

const startButtonHTML = `&#9654;`;

export { startStyle, startButtonStyle, startButtonHTML, installButtonStyle };
