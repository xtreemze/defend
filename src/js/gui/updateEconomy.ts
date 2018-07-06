import { economyGlobals, enemyGlobals } from "../main/globalVariables";
import { Scene, Vector3 } from "babylonjs";
import { displayMessage } from "./displayMessage";
import { waves } from "../enemy/waves";

export function updateEconomy(scene: Scene) {
  if (
    economyGlobals.currentBalance < 0 &&
    economyGlobals.restartMessage === false
  ) {
    economyGlobals.currentBalance = 0;
    displayMessage(scene, "Defeat", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.defeats += 1;
  }
  if (
    (economyGlobals.currentBalance > economyGlobals.maxBalance &&
      economyGlobals.restartMessage === false) ||
    (enemyGlobals.currentWave >= waves.length &&
      economyGlobals.restartMessage === false)
  ) {
    economyGlobals.currentBalance = economyGlobals.maxBalance;
    displayMessage(scene, "Victory", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.victories += 1;
  }
  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;
  const level = enemyGlobals.currentWave.toString();
  const currency = Math.round(economyGlobals.currentBalance).toString();
  currentBalance.innerText = `Wave: ${level}/${waves.length}
  Energy: ${currency}
  Defeats: ${economyGlobals.defeats}
  Victories: ${economyGlobals.victories}`;
  const currencyMeter = scene.getMeshByName("currencyMeter");
  //@ts-ignore
  const scaleRate =
    1 / (economyGlobals.maxBalance / economyGlobals.currentBalance);
  //@ts-ignore
  currencyMeter.scaling = new Vector3(
    scaleRate,
    scaleRate,
    scaleRate
  ) as Vector3;
}
