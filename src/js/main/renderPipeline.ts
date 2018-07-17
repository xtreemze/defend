import {
  DefaultRenderingPipeline,
  DepthOfFieldEffectBlurLevel,
  GlowLayer,
  Vector3,
  Scene,
  MeshBuilder,
  GroundMesh,
  Mesh
} from "babylonjs";
import { renderGlobals, mapGlobals, materialGlobals } from "./globalVariables";

function renderPipeline(scene: Scene) {
  const groundMaterial = materialGlobals.groundMaterial;

  if (renderGlobals.pipelineOn) {
    const pipeline = new DefaultRenderingPipeline(
      "default", // The name of the pipeline
      false,
      scene, // The scene instance,
      [scene.cameras[0]] // The list of cameras to be attached to
    );

    // Depth of Field
    pipeline.depthOfFieldEnabled = renderGlobals.depthOfField;
    pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;
    pipeline.depthOfField.focusDistance = 20 * 1000; // distance of the current focus point from the camera in millimeters considering 1 scene unit is 1 meter
    pipeline.depthOfField.focalLength = 400; // focal length of the camera in millimeters
    pipeline.depthOfField.fStop = 4.0; // aka F number of the camera defined in stops as it would be on a physical device

    // Antialiasing
    pipeline.samples = 2;
    pipeline.fxaaEnabled = renderGlobals.antialiasing;

    // Sharpen
    pipeline.sharpenEnabled = renderGlobals.sharpenning;
    pipeline.sharpen.edgeAmount = 0.3;
    pipeline.sharpen.colorAmount = 1;

    // Bloom
    pipeline.bloomEnabled = renderGlobals.bloom;
    pipeline.bloomThreshold = 0.8;
    pipeline.bloomWeight = 0.9;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.9;
  }

  // Glow
  if (renderGlobals.glow) {
    const glowLayer = new GlowLayer("glow", scene, {
      // mainTextureFixedSize: 32,
      // blurKernelSize: 8,
      // mainTextureSamples: 2
      mainTextureRatio: 0.2
    });

    glowLayer.intensity = renderGlobals.glowIntensity;
    // glowLayer.addIncludedOnlyMesh(projectile);
    glowLayer.addExcludedMesh(mapGlobals.groundMesh);
    glowLayer.addExcludedMesh(mapGlobals.atmosphereMesh);
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
