import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PointLight,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core/pure";

type MothershipPhase = "stable" | "low-reserve" | "critical" | "falling" | "hulk";
type CameraMode = "raider" | "defender";

const START_RESERVE = 1;
const LOW_RESERVE = 0.38;
const CRITICAL_RESERVE = 0.2;
const FALL_RESERVE = 0.1;
const HOVER_DRAIN_PER_SECOND = 0.0065;
const FALL_DRAIN_PER_SECOND = 0.002;
const FAST_DRAIN_MULTIPLIER = 8;
const START_ALTITUDE = 56;
const HULK_CENTER_Y = 18;
const GRAVITY = 9.81;
const MAX_FRAME_DELTA_SECONDS = 0.05;

interface MothershipState {
  reserve: number;
  phase: MothershipPhase;
  verticalVelocity: number;
  angularVelocity: Vector3;
  elapsedSeconds: number;
  impactCount: number;
  paused: boolean;
  fastDrain: boolean;
  cameraMode: CameraMode;
}

function phaseForReserve(reserve: number): MothershipPhase {
  if (reserve <= FALL_RESERVE) return "falling";
  if (reserve <= CRITICAL_RESERVE) return "critical";
  if (reserve <= LOW_RESERVE) return "low-reserve";
  return "stable";
}

function createMaterial(
  name: string,
  scene: Scene,
  diffuse: Color3,
  emissive: Color3,
  alpha = 1,
): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = diffuse;
  material.emissiveColor = emissive;
  material.specularColor = new Color3(0.08, 0.08, 0.1);
  material.alpha = alpha;
  return material;
}

function createMothership(scene: Scene) {
  const root = new TransformNode("mothership-root", scene);
  root.position.set(0, START_ALTITUDE, 0);

  const shellMaterial = createMaterial(
    "mothership-shell",
    scene,
    new Color3(0.22, 0.055, 0.34),
    new Color3(0.07, 0.012, 0.1),
    0.92,
  );
  shellMaterial.wireframe = true;

  const structureMaterial = createMaterial(
    "mothership-structure",
    scene,
    new Color3(0.16, 0.035, 0.24),
    new Color3(0.035, 0.006, 0.055),
    0.96,
  );

  const activeStructureMaterial = createMaterial(
    "mothership-active-structure",
    scene,
    new Color3(0.08, 0.24, 0.27),
    new Color3(0.025, 0.18, 0.2),
    0.9,
  );

  const coreMaterial = createMaterial(
    "mothership-energy-core",
    scene,
    new Color3(0.04, 0.58, 0.58),
    new Color3(0.02, 0.52, 0.54),
    0.92,
  );
  coreMaterial.specularColor = new Color3(0.2, 0.95, 0.92);

  const shell = MeshBuilder.CreateSphere(
    "mothership-shell-cage",
    { diameter: 38, segments: 8 },
    scene,
  );
  shell.parent = root;
  shell.material = shellMaterial;
  shell.isPickable = false;

  const core = MeshBuilder.CreateSphere(
    "mothership-core",
    { diameter: 15, segments: 12 },
    scene,
  );
  core.parent = root;
  core.material = coreMaterial;
  core.isPickable = false;

  const equator = MeshBuilder.CreateTorus(
    "mothership-equator",
    { diameter: 35, thickness: 1.25, tessellation: 16 },
    scene,
  );
  equator.parent = root;
  equator.material = structureMaterial;

  const meridianX = MeshBuilder.CreateTorus(
    "mothership-meridian-x",
    { diameter: 35, thickness: 1.05, tessellation: 16 },
    scene,
  );
  meridianX.parent = root;
  meridianX.rotation.x = Math.PI / 2;
  meridianX.material = structureMaterial;

  const meridianZ = MeshBuilder.CreateTorus(
    "mothership-meridian-z",
    { diameter: 35, thickness: 1.05, tessellation: 16 },
    scene,
  );
  meridianZ.parent = root;
  meridianZ.rotation.z = Math.PI / 2;
  meridianZ.material = structureMaterial;

  const launchRing = MeshBuilder.CreateTorus(
    "mothership-launch-ring",
    { diameter: 21, thickness: 0.75, tessellation: 14 },
    scene,
  );
  launchRing.parent = root;
  launchRing.position.y = -6.2;
  launchRing.material = activeStructureMaterial;

  const strutX = MeshBuilder.CreateBox(
    "mothership-strut-x",
    { width: 30, height: 0.85, depth: 0.85 },
    scene,
  );
  strutX.parent = root;
  strutX.material = structureMaterial;

  const strutY = MeshBuilder.CreateBox(
    "mothership-strut-y",
    { width: 0.85, height: 30, depth: 0.85 },
    scene,
  );
  strutY.parent = root;
  strutY.material = structureMaterial;

  const strutZ = MeshBuilder.CreateBox(
    "mothership-strut-z",
    { width: 0.85, height: 0.85, depth: 30 },
    scene,
  );
  strutZ.parent = root;
  strutZ.material = structureMaterial;

  const nodePositions = [
    new Vector3(17, 0, 0),
    new Vector3(-17, 0, 0),
    new Vector3(0, 17, 0),
    new Vector3(0, -17, 0),
    new Vector3(0, 0, 17),
    new Vector3(0, 0, -17),
    new Vector3(11.5, 11.5, 0),
    new Vector3(-11.5, 11.5, 0),
    new Vector3(0, 11.5, 11.5),
    new Vector3(0, 11.5, -11.5),
  ];

  const fieldNodes = nodePositions.map((position, index) => {
    const node = MeshBuilder.CreateSphere(
      `mothership-field-node-${index}`,
      { diameter: index < 6 ? 3.2 : 2.5, segments: 5 },
      scene,
    );
    node.parent = root;
    node.position.copyFrom(position);
    node.material = index % 3 === 0 ? activeStructureMaterial : structureMaterial;
    return node;
  });

  return {
    root,
    core,
    coreMaterial,
    shellMaterial,
    structureMaterial,
    activeStructureMaterial,
    launchRing,
    fieldNodes,
  };
}

function createArena(scene: Scene) {
  const groundMaterial = createMaterial(
    "arena-ground",
    scene,
    new Color3(0.025, 0.018, 0.035),
    new Color3(0.008, 0.005, 0.012),
  );

  const ground = MeshBuilder.CreateGround(
    "arena-ground",
    { width: 180, height: 180, subdivisions: 1 },
    scene,
  );
  ground.material = groundMaterial;
  ground.position.y = 0;

  const towerMaterial = createMaterial(
    "defender-structure",
    scene,
    new Color3(0.09, 0.31, 0.17),
    new Color3(0.015, 0.07, 0.03),
  );
  const siloEnergyMaterial = createMaterial(
    "defender-silo-energy",
    scene,
    new Color3(0.05, 0.5, 0.52),
    new Color3(0.02, 0.3, 0.32),
    0.82,
  );

  const silo = MeshBuilder.CreateBox(
    "defender-silo",
    { width: 24, height: 3.5, depth: 24 },
    scene,
  );
  silo.position.y = 1.75;
  silo.material = towerMaterial;

  const siloCore = MeshBuilder.CreateBox(
    "defender-silo-core",
    { width: 17, height: 1.2, depth: 17 },
    scene,
  );
  siloCore.position.y = 4.1;
  siloCore.material = siloEnergyMaterial;

  const barrierPositions = [
    new Vector3(-22, 2, -18),
    new Vector3(22, 2, -18),
    new Vector3(-22, 2, 18),
    new Vector3(22, 2, 18),
  ];
  barrierPositions.forEach((position, index) => {
    const barrier = MeshBuilder.CreateBox(
      `defender-barrier-${index}`,
      { width: 10, height: 4, depth: 10 },
      scene,
    );
    barrier.position.copyFrom(position);
    barrier.material = towerMaterial;
  });

  const raiderShellMaterial = createMaterial(
    "raider-reference-shell",
    scene,
    new Color3(0.28, 0.06, 0.4),
    new Color3(0.06, 0.01, 0.09),
  );
  raiderShellMaterial.wireframe = true;
  const raiderCoreMaterial = createMaterial(
    "raider-reference-core",
    scene,
    new Color3(0.04, 0.5, 0.52),
    new Color3(0.015, 0.24, 0.27),
    0.8,
  );

  [6, 9, 14].forEach((diameter, index) => {
    const x = -34 + index * 17;
    const shell = MeshBuilder.CreateSphere(
      `raider-reference-shell-${index + 1}`,
      { diameter, segments: 5 + index },
      scene,
    );
    shell.position.set(x, diameter / 2, 48);
    shell.material = raiderShellMaterial;

    const core = MeshBuilder.CreateSphere(
      `raider-reference-core-${index + 1}`,
      { diameter: diameter * 0.42, segments: 6 },
      scene,
    );
    core.position.copyFrom(shell.position);
    core.material = raiderCoreMaterial;
  });
}

function setCameraMode(camera: ArcRotateCamera, mode: CameraMode, target: Vector3): void {
  if (mode === "raider") {
    camera.alpha = -Math.PI / 2.2;
    camera.beta = 0.9;
    camera.radius = 58;
    camera.setTarget(target);
  } else {
    camera.alpha = -Math.PI / 3.5;
    camera.beta = 1.92;
    camera.radius = 126;
    camera.setTarget(new Vector3(0, 30, 0));
  }
}

function resetState(state: MothershipState, root: TransformNode): void {
  state.reserve = START_RESERVE;
  state.phase = "stable";
  state.verticalVelocity = 0;
  state.angularVelocity.set(0, 0, 0);
  state.elapsedSeconds = 0;
  state.impactCount = 0;
  state.paused = false;
  state.fastDrain = false;

  root.position.set(0, START_ALTITUDE, 0);
  root.rotation.set(0, 0, 0);
}

async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const resetButton = document.querySelector<HTMLButtonElement>("#reset");
  const pauseButton = document.querySelector<HTMLButtonElement>("#pause");
  const fastButton = document.querySelector<HTMLButtonElement>("#fast");
  const cameraButton = document.querySelector<HTMLButtonElement>("#camera");

  if (!canvas || !metrics || !resetButton || !pauseButton || !fastButton || !cameraButton) {
    throw new Error("Mothership lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, {
    adaptToDeviceRatio: true,
    antialias: true,
  });
  const scene = new Scene(engine);
  scene.clearColor.set(0.02, 0.012, 0.034, 1);

  const camera = new ArcRotateCamera(
    "mothership-camera",
    -Math.PI / 2.2,
    0.9,
    58,
    new Vector3(0, START_ALTITUDE - 8, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 36;
  camera.upperRadiusLimit = 180;
  camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = 2.35;

  const ambient = new HemisphericLight(
    "ambient",
    new Vector3(0.15, 1, 0.2),
    scene,
  );
  ambient.intensity = 0.72;

  const coreLight = new PointLight("core-light", new Vector3(0, START_ALTITUDE, 0), scene);
  coreLight.diffuse = new Color3(0.12, 0.9, 0.88);
  coreLight.intensity = 0.65;
  coreLight.range = 62;

  createArena(scene);
  const mothership = createMothership(scene);

  const state: MothershipState = {
    reserve: START_RESERVE,
    phase: "stable",
    verticalVelocity: 0,
    angularVelocity: Vector3.Zero(),
    elapsedSeconds: 0,
    impactCount: 0,
    paused: false,
    fastDrain: false,
    cameraMode: "raider",
  };

  setCameraMode(camera, state.cameraMode, mothership.root.position);

  let inspectable: { dispose(): void } | undefined;
  if (new URLSearchParams(location.search).has("inspect")) {
    const { StartInspectable } = await import("@babylonjs/inspector");
    inspectable = StartInspectable(scene);
  }

  const updateButtons = () => {
    pauseButton.textContent = state.paused ? "Resume drain [Space]" : "Pause drain [Space]";
    fastButton.textContent = state.fastDrain ? "Normal drain [F]" : "Fast drain [F]";
    cameraButton.textContent = state.cameraMode === "raider" ? "Defender view [C]" : "Raider view [C]";
  };

  const doReset = () => {
    resetState(state, mothership.root);
    setCameraMode(camera, state.cameraMode, mothership.root.position);
    updateButtons();
  };

  const togglePause = () => {
    state.paused = !state.paused;
    updateButtons();
  };

  const toggleFast = () => {
    state.fastDrain = !state.fastDrain;
    updateButtons();
  };

  const toggleCamera = () => {
    state.cameraMode = state.cameraMode === "raider" ? "defender" : "raider";
    setCameraMode(camera, state.cameraMode, mothership.root.position);
    updateButtons();
  };

  resetButton.addEventListener("click", doReset);
  pauseButton.addEventListener("click", togglePause);
  fastButton.addEventListener("click", toggleFast);
  cameraButton.addEventListener("click", toggleCamera);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (event.code === "KeyR") doReset();
    if (event.code === "Space") {
      event.preventDefault();
      togglePause();
    }
    if (event.code === "KeyF") toggleFast();
    if (event.code === "KeyC") toggleCamera();
  };
  window.addEventListener("keydown", onKeyDown);

  let frame = 0;

  engine.runRenderLoop(() => {
    const deltaSeconds = Math.min(
      MAX_FRAME_DELTA_SECONDS,
      engine.getDeltaTime() / 1000,
    );
    state.elapsedSeconds += deltaSeconds;

    if (!state.paused && state.phase !== "hulk") {
      const drainMultiplier = state.fastDrain ? FAST_DRAIN_MULTIPLIER : 1;
      const drainRate =
        state.phase === "falling" ? FALL_DRAIN_PER_SECOND : HOVER_DRAIN_PER_SECOND;
      state.reserve = Math.max(
        0,
        state.reserve - drainRate * drainMultiplier * deltaSeconds,
      );
    }

    if (state.phase !== "falling" && state.phase !== "hulk") {
      state.phase = phaseForReserve(state.reserve);
    }

    if (state.phase === "falling") {
      state.verticalVelocity -= GRAVITY * deltaSeconds;
      mothership.root.position.y += state.verticalVelocity * deltaSeconds;
      mothership.root.rotation.x += state.angularVelocity.x * deltaSeconds;
      mothership.root.rotation.y += state.angularVelocity.y * deltaSeconds;
      mothership.root.rotation.z += state.angularVelocity.z * deltaSeconds;

      if (state.angularVelocity.lengthSquared() < 0.0001) {
        state.angularVelocity.set(0.22, 0.08, -0.16);
      }

      if (mothership.root.position.y <= HULK_CENTER_Y) {
        mothership.root.position.y = HULK_CENTER_Y;
        state.impactCount += 1;
        if (state.impactCount === 1 && Math.abs(state.verticalVelocity) > 4) {
          state.verticalVelocity = Math.abs(state.verticalVelocity) * 0.12;
          state.angularVelocity.scaleInPlace(0.72);
        } else {
          state.verticalVelocity = 0;
          state.angularVelocity.set(0, 0, 0);
          state.phase = "hulk";
        }
      }
    } else if (state.phase !== "hulk") {
      const liftFraction = Math.max(
        0,
        Math.min(1, (state.reserve - FALL_RESERVE) / (START_RESERVE - FALL_RESERVE)),
      );
      const depletion = 1 - liftFraction;
      const targetAltitude = START_ALTITUDE - depletion * 12;
      const stiffness = 4.4 * (0.32 + liftFraction * 0.68);
      const damping = 1.1 + liftFraction * 3.1;
      const wobbleAmplitude = 0.08 + depletion * depletion * 1.5;
      const wobble =
        Math.sin(state.elapsedSeconds * (1.2 + depletion * 1.8)) * wobbleAmplitude;
      const acceleration =
        (targetAltitude - mothership.root.position.y) * stiffness -
        state.verticalVelocity * damping +
        wobble;

      state.verticalVelocity += acceleration * deltaSeconds;
      mothership.root.position.y += state.verticalVelocity * deltaSeconds;

      const orientationAmplitude = depletion * depletion * 0.14;
      const targetPitch = Math.sin(state.elapsedSeconds * 0.72) * orientationAmplitude;
      const targetRoll = Math.cos(state.elapsedSeconds * 0.58) * orientationAmplitude;
      const correction = Math.max(0.35, 2.6 * liftFraction) * deltaSeconds;
      mothership.root.rotation.x +=
        (targetPitch - mothership.root.rotation.x) * correction;
      mothership.root.rotation.z +=
        (targetRoll - mothership.root.rotation.z) * correction;
      mothership.root.rotation.y += deltaSeconds * (0.035 + depletion * 0.025);
    }

    if (state.phase !== "hulk" && state.reserve <= FALL_RESERVE) {
      state.phase = "falling";
      state.angularVelocity.set(0.22, 0.08, -0.16);
    }

    const visibleReserve = state.phase === "hulk" ? Math.min(state.reserve, 0.025) : state.reserve;
    const coreScale = 0.26 + Math.cbrt(Math.max(0, visibleReserve)) * 0.74;
    mothership.core.scaling.set(coreScale, coreScale, coreScale);

    mothership.coreMaterial.emissiveColor.set(
      0.015 + visibleReserve * 0.05,
      0.07 + visibleReserve * 0.48,
      0.08 + visibleReserve * 0.5,
    );
    mothership.coreMaterial.diffuseColor.set(
      0.025 + visibleReserve * 0.04,
      0.16 + visibleReserve * 0.42,
      0.17 + visibleReserve * 0.41,
    );

    const structureEnergy = state.phase === "hulk" ? 0.02 : Math.max(0.03, state.reserve);
    mothership.activeStructureMaterial.emissiveColor.set(
      0.01,
      0.04 + structureEnergy * 0.15,
      0.05 + structureEnergy * 0.16,
    );
    mothership.shellMaterial.emissiveColor.set(
      0.018 + structureEnergy * 0.045,
      0.003 + structureEnergy * 0.012,
      0.03 + structureEnergy * 0.07,
    );

    coreLight.position.copyFrom(mothership.root.position);
    coreLight.intensity = state.phase === "hulk" ? 0.05 : 0.12 + state.reserve * 0.72;

    if (state.cameraMode === "raider") {
      const target = mothership.root.position.clone();
      target.y -= 8;
      camera.setTarget(target);
    }

    scene.render();

    frame += 1;
    if (frame % 8 === 0) {
      const drainMultiplier = state.fastDrain ? FAST_DRAIN_MULTIPLIER : 1;
      metrics.textContent = [
        "Defend mothership PoC — issue #80",
        `phase: ${state.phase}`,
        `reserve: ${(state.reserve * 100).toFixed(1)}%`,
        `altitude: ${mothership.root.position.y.toFixed(2)}`,
        `vertical velocity: ${state.verticalVelocity.toFixed(2)}`,
        `hover drain: x${drainMultiplier}${state.paused ? " (paused)" : ""}`,
        `camera: ${state.cameraMode}`,
        `impacts: ${state.impactCount}`,
        `meshes: ${scene.meshes.length}`,
        `fps: ${engine.getFps().toFixed(1)}`,
        "",
        "R reset · Space pause · F fast drain · C camera",
        "?inspect=1 enables Babylon Inspector",
      ].join("\n");
    }
  });

  updateButtons();

  const resize = () => engine.resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      resetButton.removeEventListener("click", doReset);
      pauseButton.removeEventListener("click", togglePause);
      fastButton.removeEventListener("click", toggleFast);
      cameraButton.removeEventListener("click", toggleCamera);
      inspectable?.dispose();
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    },
    { once: true },
  );
}

void main();
