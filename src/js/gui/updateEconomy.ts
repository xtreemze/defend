import { economyGlobals, enemyGlobals } from "../main/globalVariables";
import { Scene, Vector3 } from "babylonjs";
import { displayMessage } from "./displayMessage";
import { waves } from "../enemy/waves";
import { victory, defeated } from "../main/sound";

export function updateEconomy(scene: Scene): any {
  // Defeat Conditions
  if (
    economyGlobals.currentBalance < 0 &&
    economyGlobals.restartMessage === false
  ) {
    setTimeout(() => {
      defeated();
      setTimeout(() => {
        displayMessage(scene, "Defeat", "&#8635;");
      }, 100);
    }, 900);
    economyGlobals.restartMessage = true;
    economyGlobals.currentBalance = 0;
    economyGlobals.defeats += 1;
    localStorage.setItem("defeats", `${economyGlobals.defeats}`);
    enemyGlobals.decayRate = enemyGlobals.baseHitPoints;
  }

  // Victory Conditions
  if (
    enemyGlobals.currentWave >= waves.length &&
    economyGlobals.restartMessage === false
  ) {
    setTimeout(() => {
      victory();
      setTimeout(() => {
        displayMessage(scene, "Victory", "&#8635;");
      }, 100);
    }, 900);
    economyGlobals.currentBalance = economyGlobals.maxBalance;
    economyGlobals.restartMessage = true;
    economyGlobals.victories += 1;
    localStorage.setItem("victories", `${economyGlobals.victories}`);

    enemyGlobals.decayRate = enemyGlobals.baseHitPoints;
  }

  const currentBalance = document.getElementById(
    "currentBalance"
  ) as HTMLDivElement;

  const level = enemyGlobals.currentWave.toString();
  // const currency = Math.round(economyGlobals.currentBalance / 1000).toString();
  // const currencyMax = (economyGlobals.maxBalance / 1000).toString();
  // currentBalance.innerText = `Wave: ${level}/${waves.length}
  // Energy: ${currency}/${currencyMax}k
  // Defeats: ${economyGlobals.defeats}
  // Victories: ${economyGlobals.victories}`;

  if (
    economyGlobals.guiString !==
    `Wave: ${level}/${waves.length}
  Victories: ${economyGlobals.victories}/${economyGlobals.victories +
      economyGlobals.defeats}`
  ) {
    economyGlobals.guiString = `Wave: ${level}/${waves.length}
  Victories: ${economyGlobals.victories}/${economyGlobals.victories +
      economyGlobals.defeats}`;

    currentBalance.innerText = economyGlobals.guiString;
  }

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
