import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core/pure";
import initRuntime, { DefendRuntime } from "../pkg/defend_hybrid_runtime.js";
import {
  INITIAL_FIXED_STEP_STATE,
  advanceFixedStep,
  type FixedStepPolicy,
} from "./fixedStep";

const BODY_COUNT = 128;
const ARENA_RADIUS = 72;
const MAX_CATCH_UP_STEPS = 8;
const MAX_FRAME_DELTA_SECONDS = 0.25;

async function main(): Promise<void> {
  await initRuntime();

  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  if (!canvas || !metrics) {
    throw new Error("Hybrid lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, {
    adaptToDeviceRatio: true,
    antialias: true,
  });
  const scene = new Scene(engine);
  scene.clearColor.set(0.031, 0.019, 0.051, 1);

  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 3.2,
    118,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 48;
  camera.upperRadiusLimit = 180;

  const light = new HemisphericLight("ambient", new Vector3(0.2, 1, 0.1), scene);
  light.intensity = 0.8;

  const coreMaterial = new StandardMaterial("coreMaterial", scene);
  coreMaterial.diffuseColor = new Color3(0.66, 0.31, 0.13);
  coreMaterial.emissiveColor = new Color3(0.18, 0.055, 0.02);
  MeshBuilder.CreateCylinder(
    "energy-core",
    { diameter: 14, height: 4, tessellation: 6 },
    scene,
  ).material = coreMaterial;

  const bodyMaterial = new StandardMaterial("bodyMaterial", scene);
  bodyMaterial.diffuseColor = new Color3(0.28, 0.08, 0.42);
  bodyMaterial.emissiveColor = new Color3(0.06, 0.01, 0.09);

  const bodyTemplate = MeshBuilder.CreateSphere(
    "enemy-template",
    { diameter: 2.8, segments: 8 },
    scene,
  );
  bodyTemplate.material = bodyMaterial;
  bodyTemplate.isVisible = false;

  const runtime = new DefendRuntime();
  const bodyInstances = new Map<number, ReturnType<typeof bodyTemplate.createInstance>>();

  for (let index = 0; index < BODY_COUNT; index += 1) {
    const angle = (index / BODY_COUNT) * Math.PI * 2;
    const radius = ARENA_RADIUS * (0.72 + (index % 11) / 40);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const tangentX = -Math.sin(angle);
    const tangentZ = Math.cos(angle);
    const inwardX = -Math.cos(angle);
    const inwardZ = -Math.sin(angle);
    const speed = 2.2 + (index % 7) * 0.35;

    const bodyId = runtime.spawn_body(
      x,
      1.5 + (index % 3) * 0.4,
      z,
      tangentX * speed + inwardX * 0.45,
      0,
      tangentZ * speed + inwardZ * 0.45,
    );

    const instance = bodyTemplate.createInstance(`enemy-${bodyId}`);
    instance.isVisible = true;
    bodyInstances.set(bodyId, instance);
  }

  const snapshotIds = Array.from(runtime.body_ids());
  if (snapshotIds.length !== BODY_COUNT || snapshotIds.some((id) => !bodyInstances.has(id))) {
    throw new Error("Hybrid runtime body identity contract is inconsistent");
  }

  let inspectable: { dispose(): void } | undefined;
  if (new URLSearchParams(location.search).has("inspect")) {
    const { StartInspectable } = await import("@babylonjs/inspector");
    inspectable = StartInspectable(scene);
  }

  const fixedStepPolicy: FixedStepPolicy = {
    fixedDeltaSeconds: runtime.fixed_delta_seconds(),
    maxCatchUpSteps: MAX_CATCH_UP_STEPS,
    maxFrameDeltaSeconds: MAX_FRAME_DELTA_SECONDS,
  };
  let fixedStepState = INITIAL_FIXED_STEP_STATE;
  let frame = 0;
  let snapshotBytes = 0;
  let stepsThisFrame = 0;
  let renderAlpha = 0;

  engine.runRenderLoop(() => {
    const advance = advanceFixedStep(
      fixedStepState,
      engine.getDeltaTime() / 1000,
      fixedStepPolicy,
    );
    fixedStepState = advance.state;
    stepsThisFrame = advance.steps;
    renderAlpha = advance.alpha;

    if (stepsThisFrame > 0) {
      runtime.step_fixed(stepsThisFrame);
    }

    const positions = runtime.positions();
    if (positions.length !== snapshotIds.length * 3) {
      throw new Error("Hybrid runtime position snapshot changed without a lifecycle event");
    }

    snapshotBytes = positions.length * Float32Array.BYTES_PER_ELEMENT;
    for (let index = 0; index < snapshotIds.length; index += 1) {
      const body = bodyInstances.get(snapshotIds[index]);
      if (!body) {
        throw new Error(`Missing Babylon instance for body ${snapshotIds[index]}`);
      }
      const offset = index * 3;
      body.position.set(positions[offset], positions[offset + 1], positions[offset + 2]);
    }

    scene.render();
    frame += 1;
    if (frame % 15 === 0) {
      metrics.textContent = [
        "Babylon 9.23 renderer + Bevy 0.19 ECS/WASM",
        `bodies: ${BODY_COUNT}`,
        `fps: ${engine.getFps().toFixed(1)}`,
        `simulation: ${(1 / fixedStepPolicy.fixedDeltaSeconds).toFixed(0)} Hz fixed tick`,
        `tick: ${runtime.tick()} (${stepsThisFrame} step(s) this frame)`,
        `render alpha: ${renderAlpha.toFixed(2)}`,
        `snapshot: ${snapshotBytes} B/frame + ${snapshotIds.length * Uint32Array.BYTES_PER_ELEMENT} B identity table`,
        `dropped catch-up time: ${(fixedStepState.droppedSeconds * 1000).toFixed(1)} ms`,
        `WebGPU available: ${"gpu" in navigator}`,
        `crossOriginIsolated: ${String(crossOriginIsolated)}`,
        "?inspect=1 enables Babylon Inspector CLI bridge",
      ].join("\n");
    }
  });

  const resize = () => engine.resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.removeEventListener("resize", resize);
      inspectable?.dispose();
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
      runtime.free();
    },
    { once: true },
  );
}

void main();
