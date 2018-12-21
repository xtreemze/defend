import { Scene, Light } from "babylonjs";
function rampLight(
	scene: Scene,
	light: Light,
	initialIntensity: number,
	normalIntensity: number
) {
	light.intensity = initialIntensity;
	scene.registerAfterRender(function lightInterval() {
		if (initialIntensity > normalIntensity) {
			light.intensity -= 0.05;
			if (light.intensity <= normalIntensity) {
				scene.unregisterAfterRender(lightInterval);
			}
		} else if (initialIntensity < normalIntensity) {
			light.intensity += 0.05;
			if (light.intensity >= normalIntensity) {
				scene.unregisterAfterRender(lightInterval);
			}
		}
	});
}

export { rampLight };
