import {
	DefaultRenderingPipeline,
	DepthOfFieldEffectBlurLevel,
	GlowLayer,
	Vector3,
	Scene,
	MeshBuilder,
	GroundMesh,
	Mesh
} from "../utility/babylonOptimized";
import {
	renderGlobals,
	mapGlobals,
	materialGlobals,
	economyGlobals
} from "./globalVariables";
import { detectDeviceCapabilities, logDeviceInfo } from "../utility/deviceDetection";

function renderPipeline(scene: Scene) {
	const groundMaterial = materialGlobals.groundMaterial;

	// Detect device capabilities and auto-configure quality
	const deviceCap = detectDeviceCapabilities();
	logDeviceInfo(deviceCap);

	// Auto-disable expensive effects on low-end devices
	const shouldEnablePipeline = renderGlobals.pipelineOn && !deviceCap.isLowEnd;
	const shouldEnableGlow = renderGlobals.glow;

	if (shouldEnablePipeline) {
		const pipeline = new DefaultRenderingPipeline(
			"default", // The name of the pipeline
			false,
			scene, // The scene instance,
			[scene.cameras[0]] // The list of cameras to be attached to
		);

		// Depth of Field - disabled by default for performance
		pipeline.depthOfFieldEnabled = false;
		pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
		pipeline.depthOfField.focusDistance = 20 * 1000;
		pipeline.depthOfField.focalLength = 400;
		pipeline.depthOfField.fStop = 4.0;

		// Antialiasing - disabled by default for performance
		pipeline.samples = 1;
		pipeline.fxaaEnabled = false;

		// Sharpen - disabled by default
		pipeline.sharpenEnabled = false;
		pipeline.sharpen.edgeAmount = 0.3;
		pipeline.sharpen.colorAmount = 1;

		// Bloom - disabled by default
		pipeline.bloomEnabled = false;
		pipeline.bloomThreshold = 0.8;
		pipeline.bloomWeight = 0.9;
		pipeline.bloomKernel = 64;
		pipeline.bloomScale = 0.9;
	}

	// Glow - optimized for device capability
	if (shouldEnableGlow) {
		const glowLayer = new GlowLayer("glow", scene, {
			// Dynamic kernel size based on device
			blurKernelSize: deviceCap.glowKernelSize,
			// Dynamic texture ratio based on device
			mainTextureRatio: deviceCap.glowTextureRatio
		});

		glowLayer.intensity = renderGlobals.glowIntensity;
		glowLayer.addExcludedMesh(mapGlobals.groundMesh);
		glowLayer.addExcludedMesh(mapGlobals.atmosphereMesh);
		glowLayer.addExcludedMesh(economyGlobals.currencyMesh);
	}
	if (mapGlobals.demoSphere) {
		const demoSphere = MeshBuilder.CreateSphere(
			"demoSphere",
			{
				segments: 6,
				diameter: 20,
				updatable: false
			},
			scene
		);
		demoSphere.position = new Vector3(0, 40, 0);
		demoSphere.material = groundMaterial;
	}
}

export { renderPipeline };
