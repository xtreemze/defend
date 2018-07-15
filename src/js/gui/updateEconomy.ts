import { economyGlobals, enemyGlobals } from "../main/globalVariables";
import { Scene, Vector3, Mesh } from "babylonjs";
import { displayMessage } from "./displayMessage";
import { waves } from "../enemy/waves";
import { victory, defeated } from "../main/sound";

export function updateEconomy(scene: Scene): any {
  // Defeat Conditions
  if (
    economyGlobals.currentBalance < 0 &&
    economyGlobals.restartMessage === false
  ) {
    defeated();
    economyGlobals.currentBalance = 0;
    displayMessage(scene, "Defeat", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.defeats += 1;
    enemyGlobals.decayRate = enemyGlobals.baseHitPoints;
  }

  // Victory Conditions
  if (
    enemyGlobals.currentWave >= waves.length &&
    economyGlobals.restartMessage === false
  ) {
    victory();
    economyGlobals.currentBalance = economyGlobals.maxBalance;
    displayMessage(scene, "Victory", "&#8635;");
    economyGlobals.restartMessage = true;
    economyGlobals.victories += 1;
    enemyGlobals.decayRate = enemyGlobals.baseHitPoints;
  }

  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;

  const level = enemyGlobals.currentWave.toString();
  const currency = Math.round(economyGlobals.currentBalance / 1000).toString();
  const currencyMax = (economyGlobals.maxBalance / 1000).toString();
  currentBalance.innerText = `Wave: ${level}/${waves.length}
  Energy: ${currency}/${currencyMax}k
  Defeats: ${economyGlobals.defeats}
  Victories: ${economyGlobals.victories}`;

  const scaleRate =
    1 / (economyGlobals.maxBalance / economyGlobals.currentBalance);

  if (economyGlobals.currencyMeter !== null) {
    economyGlobals.currencyMeter.scaling = new Vector3(
      scaleRate,
      0.99,
      scaleRate
    ) as Vector3;
  }
}
