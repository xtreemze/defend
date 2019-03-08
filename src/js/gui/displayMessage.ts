import {
	economyGlobals,
	enemyGlobals,
	towerGlobals
} from "../main/globalVariables";
import { Scene } from "babylonjs";
import { rampUp } from "./currency";
import { newEnemyWave } from "../enemy/enemyWaves";
import {
	helpHTML,
	helpStyle,
	helpButtonStyle,
	helpButtonHTML
} from "./helpHTML";
import { startStyle, startButtonStyle } from "./startHTML";
import { shareButton, removeShareButton } from "../utility/share";

function displayMessage(scene: Scene, message: string, icon: string) {
	enemyGlobals.limit = 0;
	const canvas = document.getElementById("renderCanvas");
	const title = document.createElement("h1") as HTMLElement;
	title.innerText = message;
	title.setAttribute("style", startStyle);
	const startButton = document.createElement("button") as HTMLButtonElement;
	startButton.innerHTML = icon;
	startButton.id = "startButton";
	startButton.setAttribute("style", startButtonStyle);

	const helpButton = document.createElement("button") as HTMLButtonElement;
	helpButton.innerHTML = helpButtonHTML;
	helpButton.id = "helpButton";
	helpButton.setAttribute("style", helpButtonStyle);

	const help = document.createElement("div") as HTMLDivElement;
	help.innerHTML = helpHTML;
	help.id = "help";
	help.setAttribute("style", helpStyle);

	if (canvas !== null) {
		const canvasParent = canvas.parentNode as Node;
		canvasParent.insertBefore(title, canvas);
		canvasParent.insertBefore(startButton, canvas);
		shareButton();
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
			setTimeout(() => {

				newEnemyWave(scene);
			}, 800);

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

			removeShareButton();
		});

		// Help button behavior
		helpButton.addEventListener("click", () => {
			// remove title
			const titleParent = title.parentNode as Node;
			titleParent.removeChild(title);
			// remove start button
			const startButtonParent = startButton.parentNode as Node;
			startButtonParent.removeChild(startButton);
			// remove help button
			canvasParent.insertBefore(help, canvas);
			const helpButtonParent = helpButton.parentNode as Node;
			helpButtonParent.removeChild(helpButton);
			//remove share button
			removeShareButton();
			const okHelp = document.getElementById("okHelp") as HTMLButtonElement;

			okHelp.addEventListener("click", function () {
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
				setTimeout(() => {

					newEnemyWave(scene);
				}, 800);

				// Button and GUI
				rampUp(scene);
			});
		});
	}
}

export { displayMessage };
