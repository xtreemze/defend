import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  RegisterInstancedMesh,
  RegisterStandardEngineExtensions,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core/pure";
import initRuntime, { DefendRuntime } from "../pkg/defend_hybrid_runtime.js";
import {
  advanceFixedStep,
  type FixedStepPolicy,
  INITIAL_FIXED_STEP_STATE,
} from "./fixedStep";
import {
  createProceduralAudioNode,
  updateProceduralVoices,
} from "./parallel/proceduralAudio";
import { ParallelSystemWorkers } from "./parallel/systemWorkers";
import {
  intervalForDistanceTier,
  resultIsFresh,
  shouldScheduleTick,
} from "./parallel/workerProtocol";

RegisterStandardEngineExtensions();
RegisterInstancedMesh();

const BODY_COUNT = 128;
const ARENA_RADIUS = 72;
const MAX_CATCH_UP_STEPS = 8;
const MAX_FRAME_DELTA_SECONDS = 0.25;
const MAX_WORKER_LAG_TICKS = 12;
const AI_INTERVAL_TICKS = intervalForDistanceTier("standard");
const COMBAT_INTERVAL_TICKS = intervalForDistanceTier("standard");
const AUDIO_INTERVAL_TICKS = intervalForDistanceTier("standard");
const MAX_AI_SPEED = 6;
const AUDIO_VOICE_BUDGET = 12;
const TURRET_IDS = new Uint32Array([1, 2, 3, 4]);
const TURRET_POSITIONS = new Float32Array([
  18, 2, 0,
  -18, 2, 0,
  0, 2, 18,
  0, 2, -18,
]);

interface ParallelDiagnostics {
  aiCompleted: number;
  aiApplied: number;
  combatCompleted: number;
  combatTargets: number;
  audioCompleted: number;
  audioVoices: number;
  staleResults: number;
  workerErrors: number;
  audioState: "disabled" | "ready" | "unavailable" | "failed";
}

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

  const light = new HemisphericLight(
    "ambient",
    new Vector3(0.2, 1, 0.1),
    scene,
  );
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
  const bodyInstances = new Map<
    number,
    ReturnType<typeof bodyTemplate.createInstance>
  >();

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
  const snapshotIdArray = Uint32Array.from(snapshotIds);
  const bodyIndex = new Map<number, number>();
  snapshotIds.forEach((id, index) => bodyIndex.set(id, index));
  if (
    snapshotIds.length !== BODY_COUNT ||
    snapshotIds.some((id) => !bodyInstances.has(id))
  ) {
    throw new Error("Hybrid runtime body identity contract is inconsistent");
  }

  let inspectable: { dispose(): void } | undefined;
  if (new URLSearchParams(location.search).has("inspect")) {
    const { StartInspectable } = await import("@babylonjs/inspector");
    inspectable = StartInspectable(scene);
  }

  const diagnostics: ParallelDiagnostics = {
    aiCompleted: 0,
    aiApplied: 0,
    combatCompleted: 0,
    combatTargets: 0,
    audioCompleted: 0,
    audioVoices: 0,
    staleResults: 0,
    workerErrors: 0,
    audioState: "disabled",
  };
  (window as typeof window & { __defendParallelDiagnostics?: ParallelDiagnostics })
    .__defendParallelDiagnostics = diagnostics;

  let parallelWorkers: ParallelSystemWorkers | undefined;
  try {
    parallelWorkers = new ParallelSystemWorkers();
  } catch {
    diagnostics.workerErrors += 1;
  }

  let audioContext: AudioContext | undefined;
  let audioNode: AudioWorkletNode | undefined;
  const enableAudio = async () => {
    if (audioNode || diagnostics.audioState === "failed") {
      return;
    }
    if (!("AudioContext" in window)) {
      diagnostics.audioState = "unavailable";
      return;
    }
    try {
      audioContext = new AudioContext();
      if (!audioContext.audioWorklet) {
        diagnostics.audioState = "unavailable";
        await audioContext.close();
        audioContext = undefined;
        return;
      }
      audioNode = await createProceduralAudioNode(audioContext);
      audioNode.connect(audioContext.destination);
      await audioContext.resume();
      diagnostics.audioState = "ready";
    } catch {
      diagnostics.audioState = "failed";
      diagnostics.workerErrors += 1;
    }
  };
  window.addEventListener("pointerdown", enableAudio, { once: true });

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
  let lastAiTick: number | null = null;
  let lastCombatTick: number | null = null;
  let lastAudioTick: number | null = null;
  let aiInFlight = false;
  let combatInFlight = false;
  let audioInFlight = false;
  let previousCameraPosition = camera.position.clone();
  let previousCameraSampleMs = performance.now();

  const recordWorkerError = () => {
    diagnostics.workerErrors += 1;
  };

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

    const tick = runtime.tick();
    const positions = runtime.positions();
    const velocities = runtime.velocities();
    if (
      positions.length !== snapshotIds.length * 3 ||
      velocities.length !== snapshotIds.length * 3
    ) {
      throw new Error("Hybrid runtime snapshot changed without a lifecycle event");
    }

    snapshotBytes =
      (positions.length + velocities.length) * Float32Array.BYTES_PER_ELEMENT;
    for (let index = 0; index < snapshotIds.length; index += 1) {
      const body = bodyInstances.get(snapshotIds[index]);
      if (!body) {
        throw new Error(`Missing Babylon instance for body ${snapshotIds[index]}`);
      }
      const offset = index * 3;
      body.position.set(
        positions[offset],
        positions[offset + 1],
        positions[offset + 2],
      );
    }

    const cameraNowMs = performance.now();
    const cameraDeltaSeconds = Math.max(
      0.001,
      (cameraNowMs - previousCameraSampleMs) / 1000,
    );
    const listenerVelocity: [number, number, number] = [
      (camera.position.x - previousCameraPosition.x) / cameraDeltaSeconds,
      (camera.position.y - previousCameraPosition.y) / cameraDeltaSeconds,
      (camera.position.z - previousCameraPosition.z) / cameraDeltaSeconds,
    ];
    previousCameraPosition.copyFrom(camera.position);
    previousCameraSampleMs = cameraNowMs;

    if (
      parallelWorkers?.laneAvailable("ai") &&
      !aiInFlight &&
      shouldScheduleTick(tick, lastAiTick, AI_INTERVAL_TICKS)
    ) {
      aiInFlight = true;
      lastAiTick = tick;
      const ids = snapshotIdArray.slice();
      const workerPositions = positions.slice();
      const workerVelocities = velocities.slice();
      void parallelWorkers
        .submit(
          "ai",
          tick,
          {
            agentIds: ids,
            positions: workerPositions,
            velocities: workerVelocities,
            objective: [0, 1.5, 0],
            preferredSpeed: 4.5,
            separationRadius: 5.5,
            separationWeight: 1.4,
          },
          [ids.buffer, workerPositions.buffer, workerVelocities.buffer],
        )
        .then((response) => {
          if (!resultIsFresh(response.sourceTick, runtime.tick(), MAX_WORKER_LAG_TICKS)) {
            diagnostics.staleResults += 1;
            return;
          }
          diagnostics.aiApplied = runtime.apply_velocity_commands(
            response.sourceTick,
            MAX_WORKER_LAG_TICKS,
            response.result.agentIds,
            response.result.desiredVelocities,
            MAX_AI_SPEED,
          );
          diagnostics.aiCompleted += 1;
        })
        .catch(recordWorkerError)
        .finally(() => {
          aiInFlight = false;
        });
    }

    if (
      parallelWorkers?.laneAvailable("combat") &&
      !combatInFlight &&
      shouldScheduleTick(tick, lastCombatTick, COMBAT_INTERVAL_TICKS)
    ) {
      combatInFlight = true;
      lastCombatTick = tick;
      const turretIds = TURRET_IDS.slice();
      const turretPositions = TURRET_POSITIONS.slice();
      const targetIds = snapshotIdArray.slice();
      const targetPositions = positions.slice();
      const targetVelocities = velocities.slice();
      void parallelWorkers
        .submit(
          "combat",
          tick,
          {
            turretIds,
            turretPositions,
            targetIds,
            targetPositions,
            targetVelocities,
            projectileSpeed: 38,
            maxRange: 80,
          },
          [
            turretIds.buffer,
            turretPositions.buffer,
            targetIds.buffer,
            targetPositions.buffer,
            targetVelocities.buffer,
          ],
        )
        .then((response) => {
          if (!resultIsFresh(response.sourceTick, runtime.tick(), MAX_WORKER_LAG_TICKS)) {
            diagnostics.staleResults += 1;
            return;
          }
          let selected = 0;
          for (const targetId of response.result.targetIds) {
            if (targetId !== 0xffffffff) {
              selected += 1;
            }
          }
          diagnostics.combatTargets = selected;
          diagnostics.combatCompleted += 1;
        })
        .catch(recordWorkerError)
        .finally(() => {
          combatInFlight = false;
        });
    }

    if (
      parallelWorkers?.laneAvailable("audio") &&
      !audioInFlight &&
      shouldScheduleTick(tick, lastAudioTick, AUDIO_INTERVAL_TICKS)
    ) {
      audioInFlight = true;
      lastAudioTick = tick;
      const ids = snapshotIdArray.slice();
      const sourcePositions = positions.slice();
      const sourceVelocities = velocities.slice();
      const sourceImportance = new Float32Array(ids.length);
      for (let index = 0; index < sourceImportance.length; index += 1) {
        const distance = Math.hypot(
          positions[index * 3],
          positions[index * 3 + 1],
          positions[index * 3 + 2],
        );
        sourceImportance[index] = Math.min(1, 0.2 + 30 / Math.max(30, distance));
      }
      void parallelWorkers
        .submit(
          "audio",
          tick,
          {
            sourceIds: ids,
            sourcePositions,
            sourceVelocities,
            sourceImportance,
            listenerPosition: [camera.position.x, camera.position.y, camera.position.z],
            listenerVelocity,
            maxRenderedVoices: AUDIO_VOICE_BUDGET,
            speedOfSound: 343,
          },
          [
            ids.buffer,
            sourcePositions.buffer,
            sourceVelocities.buffer,
            sourceImportance.buffer,
          ],
        )
        .then((response) => {
          if (!resultIsFresh(response.sourceTick, runtime.tick(), MAX_WORKER_LAG_TICKS)) {
            diagnostics.staleResults += 1;
            return;
          }
          diagnostics.audioVoices = response.result.sourceIds.length;
          diagnostics.audioCompleted += 1;
          if (!audioNode) {
            return;
          }
          const voices = Array.from(response.result.sourceIds, (id, index) => {
            const bodyOffset = (bodyIndex.get(id) ?? 0) * 3;
            const relativeX = positions[bodyOffset] - camera.position.x;
            return {
              id,
              frequencyHz: 95 + (id % 11) * 17,
              gain: Math.min(0.06, response.result.priorities[index] * 0.06),
              dopplerRatio: response.result.dopplerRatios[index],
              pan: Math.max(-1, Math.min(1, relativeX / 40)),
            };
          });
          updateProceduralVoices(audioNode, voices);
        })
        .catch(recordWorkerError)
        .finally(() => {
          audioInFlight = false;
        });
    }

    scene.render();
    frame += 1;
    if (frame % 15 === 0) {
      const fingerprint = runtime.state_fingerprint();
      metrics.textContent = [
        "Babylon 9.25 renderer + Bevy 0.19 ECS/WASM",
        `bodies: ${BODY_COUNT}`,
        `fps: ${engine.getFps().toFixed(1)}`,
        `simulation: ${(1 / fixedStepPolicy.fixedDeltaSeconds).toFixed(0)} Hz fixed tick`,
        `tick: ${tick} (${stepsThisFrame} step(s) this frame)`,
        `state: ${fingerprint}`,
        `render alpha: ${renderAlpha.toFixed(2)}`,
        `snapshot: ${snapshotBytes} B/frame + ${snapshotIds.length * Uint32Array.BYTES_PER_ELEMENT} B identity table`,
        `workers: AI ${diagnostics.aiCompleted}/${diagnostics.aiApplied} applied · combat ${diagnostics.combatCompleted}/${diagnostics.combatTargets} targets · audio ${diagnostics.audioCompleted}/${diagnostics.audioVoices} voices`,
        `worker stale/errors: ${diagnostics.staleResults}/${diagnostics.workerErrors}`,
        `procedural audio: ${diagnostics.audioState} (pointer/tap enables)`,
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
      window.removeEventListener("pointerdown", enableAudio);
      audioNode?.disconnect();
      void audioContext?.close();
      parallelWorkers?.dispose();
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
