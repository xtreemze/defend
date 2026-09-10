/**
 * Optimized Babylon.js exports
 * Only export what we actually use to enable tree-shaking
 * This file centralizes Babylon.js imports for easier optimization
 */

// Core engine
export { Engine } from "babylonjs";

// Scene and rendering
export { Scene } from "babylonjs";

// Math utilities
export { Vector2, Vector3, Vector4 } from "babylonjs";
export { Matrix } from "babylonjs";
export { Quaternion } from "babylonjs";
export { Color3, Color4 } from "babylonjs";

// Mesh creation
export { MeshBuilder } from "babylonjs";
export { Mesh } from "babylonjs";
export { InstancedMesh } from "babylonjs";
export { GroundMesh } from "babylonjs";

// Physics
export { PhysicsImpostor } from "babylonjs";
export { CannonJSPlugin } from "babylonjs";
export { PhysicsEngine } from "babylonjs";

// Materials
export { StandardMaterial } from "babylonjs";
export { Material } from "babylonjs";

// Lights
export { HemisphericLight } from "babylonjs";
export { DirectionalLight } from "babylonjs";

// Cameras
export { UniversalCamera } from "babylonjs";
export { ArcRotateCamera } from "babylonjs";

// Optimization
export { SceneOptimizer, SceneOptimizerOptions } from "babylonjs";

// Particles
export { GPUParticleSystem } from "babylonjs";
export { ParticleSystem } from "babylonjs";

// Post-processing
export { DefaultRenderingPipeline } from "babylonjs";
export { DepthOfFieldEffectBlurLevel } from "babylonjs";
export { GlowLayer } from "babylonjs";

// Utilities
export { Tags } from "babylonjs";
