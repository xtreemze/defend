import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PointLight,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core/pure";

type CameraMode = "raider" | "defender";
type NavigationPhase = "stable" | "warning" | "critical" | "captured";

const START_POSITION = new Vector3(48, 46, 30);
const START_RESERVE = 1;
const HOVER_DRAIN_PER_SECOND = 0.0025;
const MOVEMENT_DRAIN_PER_ACCEL = 0.00028;
const MAX_ACCELERATION = 7.2;
const MAX_SPEED = 22;
const LINEAR_DAMPING = 0.42;
const ARRIVAL_RADIUS = 4;
const SURFACE_HALF_EXTENT = 86;
const SILO_WARNING_RADIUS = 31;
const SILO_CRITICAL_RADIUS = 17;
const SAFE_TARGET_RADIUS = 35;
const TARGET_LAUNCH_OFFSET = 24;
const ATTRACTION_STRENGTH = 19;
const CAPTURE_PULL_STRENGTH = 34;
const MAX_FRAME_DELTA_SECONDS = 0.05;

interface NavigationState {
  reserve: number;
  velocity: Vector3;
  desiredPosition: Vector3;
  raidSector: Vector3;
  cameraAnchor: Vector3;
  cameraMode: CameraMode;
  phase: NavigationPhase;
  projectedTargetCount: number;
  totalMovementEnergy: number;
  elapsedSeconds: number;
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

function horizontalDistance(position: Vector3): number {
  return Math.sqrt(position.x * position.x + position.z * position.z);
}

function horizontalDirection(position: Vector3, fallback: Vector3): Vector3 {
  const direction = new Vector3(position.x, 0, position.z);
  if (direction.lengthSquared() < 0.0001) {
    direction.copyFrom(fallback);
    direction.y = 0;
  }
  if (direction.lengthSquared() < 0.0001) {
    direction.set(1, 0, 0);
  }
  return direction.normalize();
}

function clampSurfacePoint(point: Vector3): Vector3 {
  return new Vector3(
    Math.max(-SURFACE_HALF_EXTENT, Math.min(SURFACE_HALF_EXTENT, point.x)),
    0.16,
    Math.max(-SURFACE_HALF_EXTENT, Math.min(SURFACE_HALF_EXTENT, point.z)),
  );
}

function desiredShipPositionForSector(
  sector: Vector3,
  currentPosition: Vector3,
): { desired: Vector3; projected: boolean } {
  const outward = horizontalDirection(sector, currentPosition);
  const desired = new Vector3(
    sector.x + outward.x * TARGET_LAUNCH_OFFSET,
    START_POSITION.y,
    sector.z + outward.z * TARGET_LAUNCH_OFFSET,
  );

  const distance = horizontalDistance(desired);
  if (distance >= SAFE_TARGET_RADIUS) {
    return { desired, projected: false };
  }

  desired.x = outward.x * SAFE_TARGET_RADIUS;
  desired.z = outward.z * SAFE_TARGET_RADIUS;
  return { desired, projected: true };
}

function phaseForPosition(position: Vector3): NavigationPhase {
  const distance = horizontalDistance(position);
  if (distance <= SILO_CRITICAL_RADIUS) return "critical";
  if (distance <= SILO_WARNING_RADIUS) return "warning";
  return "stable";
}

function createArena(scene: Scene) {
  const groundMaterial = createMaterial(
    "navigation-ground",
    scene,
    new Color3(0.028, 0.019, 0.038),
    new Color3(0.008, 0.005, 0.014),
  );
  const ground = MeshBuilder.CreateGround(
    "navigation-ground",
    { width: 180, height: 180, subdivisions: 1 },
    scene,
  );
  ground.material = groundMaterial;

  const towerMaterial = createMaterial(
    "navigation-defender",
    scene,
    new Color3(0.08, 0.31, 0.17),
    new Color3(0.012, 0.06, 0.025),
  );
  const tealMaterial = createMaterial(
    "navigation-silo-core",
    scene,
    new Color3(0.05, 0.54, 0.55),
    new Color3(0.025, 0.36, 0.37),
    0.9,
  );
  const warningMaterial = createMaterial(
    "navigation-warning",
    scene,
    new Color3(0.48, 0.26, 0.08),
    new Color3(0.16, 0.065, 0.01),
    0.45,
  );
  const criticalMaterial = createMaterial(
    "navigation-critical",
    scene,
    new Color3(0.55, 0.08, 0.2),
    new Color3(0.24, 0.015, 0.05),
    0.5,
  );

  const silo = MeshBuilder.CreateBox(
    "navigation-silo",
    { width: 24, height: 4, depth: 24 },
    scene,
  );
  silo.position.y = 2;
  silo.material = towerMaterial;

  const siloCore = MeshBuilder.CreateBox(
    "navigation-silo-core",
    { width: 17, height: 1.1, depth: 17 },
    scene,
  );
  siloCore.position.y = 4.6;
  siloCore.material = tealMaterial;

  const warningRing = MeshBuilder.CreateTorus(
    "silo-warning-ring",
    { diameter: SILO_WARNING_RADIUS * 2, thickness: 0.45, tessellation: 48 },
    scene,
  );
  warningRing.rotation.x = Math.PI / 2;
  warningRing.position.y = 0.28;
  warningRing.material = warningMaterial;
  warningRing.isPickable = false;

  const criticalRing = MeshBuilder.CreateTorus(
    "silo-critical-ring",
    { diameter: SILO_CRITICAL_RADIUS * 2, thickness: 0.7, tessellation: 40 },
    scene,
  );
  criticalRing.rotation.x = Math.PI / 2;
  criticalRing.position.y = 0.32;
  criticalRing.material = criticalMaterial;
  criticalRing.isPickable = false;

  const barrierPositions = [
    new Vector3(-30, 2, -24),
    new Vector3(28, 2, -25),
    new Vector3(-28, 2, 26),
    new Vector3(31, 2, 25),
    new Vector3(-52, 2, 8),
    new Vector3(52, 2, -5),
  ];
  barrierPositions.forEach((position, index) => {
    const barrier = MeshBuilder.CreateBox(
      `navigation-barrier-${index}`,
      { width: 10, height: 4, depth: 10 },
      scene,
    );
    barrier.position.copyFrom(position);
    barrier.material = towerMaterial;
  });

  return { ground, siloCore, warningRing, criticalRing };
}

function createMothership(scene: Scene) {
  const root = new TransformNode("navigation-mothership-root", scene);
  root.position.copyFrom(START_POSITION);

  const shellMaterial = createMaterial(
    "navigation-mothership-shell",
    scene,
    new Color3(0.23, 0.055, 0.35),
    new Color3(0.075, 0.012, 0.105),
    0.92,
  );
  shellMaterial.wireframe = true;
  const structureMaterial = createMaterial(
    "navigation-mothership-structure",
    scene,
    new Color3(0.15, 0.035, 0.24),
    new Color3(0.035, 0.006, 0.055),
    0.96,
  );
  const coreMaterial = createMaterial(
    "navigation-mothership-core",
    scene,
    new Color3(0.04, 0.58, 0.58),
    new Color3(0.02, 0.52, 0.54),
    0.93,
  );

  const shell = MeshBuilder.CreateSphere(
    "navigation-mothership-shell",
    { diameter: 32, segments: 8 },
    scene,
  );
  shell.parent = root;
  shell.material = shellMaterial;
  shell.isPickable = false;

  const core = MeshBuilder.CreateSphere(
    "navigation-mothership-core",
    { diameter: 12, segments: 10 },
    scene,
  );
  core.parent = root;
  core.material = coreMaterial;
  core.isPickable = false;

  for (const axis of ["equator", "x", "z"] as const) {
    const ring = MeshBuilder.CreateTorus(
      `navigation-ring-${axis}`,
      { diameter: 29, thickness: 0.9, tessellation: 18 },
      scene,
    );
    ring.parent = root;
    if (axis === "x") ring.rotation.x = Math.PI / 2;
    if (axis === "z") ring.rotation.z = Math.PI / 2;
    ring.material = structureMaterial;
    ring.isPickable = false;
  }

  const strutX = MeshBuilder.CreateBox(
    "navigation-strut-x",
    { width: 25, height: 0.75, depth: 0.75 },
    scene,
  );
  strutX.parent = root;
  strutX.material = structureMaterial;
  const strutZ = MeshBuilder.CreateBox(
    "navigation-strut-z",
    { width: 0.75, height: 0.75, depth: 25 },
    scene,
  );
  strutZ.parent = root;
  strutZ.material = structureMaterial;

  return { root, core, coreMaterial, shellMaterial };
}

function createMarker(
  name: string,
  scene: Scene,
  material: StandardMaterial,
  diameter: number,
): Mesh {
  const marker = MeshBuilder.CreateTorus(
    name,
    { diameter, thickness: 0.55, tessellation: 28 },
    scene,
  );
  marker.rotation.x = Math.PI / 2;
  marker.position.y = 0.3;
  marker.material = material;
  marker.isPickable = false;
  return marker;
}

function resetState(state: NavigationState, root: TransformNode): void {
  state.reserve = START_RESERVE;
  state.velocity.set(0, 0, 0);
  state.raidSector.set(52, 0.16, 42);
  const initialTarget = desiredShipPositionForSector(state.raidSector, START_POSITION);
  state.desiredPosition.copyFrom(initialTarget.desired);
  state.cameraAnchor.copyFrom(START_POSITION);
  state.phase = "stable";
  state.projectedTargetCount = 0;
  state.totalMovementEnergy = 0;
  state.elapsedSeconds = 0;
  root.position.copyFrom(START_POSITION);
  root.rotation.set(0, 0, 0);
}

function setTargetSector(
  state: NavigationState,
  root: TransformNode,
  marker: Mesh,
  desiredMarker: Mesh,
  point: Vector3,
): void {
  state.raidSector.copyFrom(clampSurfacePoint(point));
  marker.position.x = state.raidSector.x;
  marker.position.z = state.raidSector.z;

  const target = desiredShipPositionForSector(state.raidSector, root.position);
  state.desiredPosition.copyFrom(target.desired);
  if (target.projected) state.projectedTargetCount += 1;
  desiredMarker.position.set(
    state.desiredPosition.x,
    0.34,
    state.desiredPosition.z,
  );
}

function siloAttraction(position: Vector3, phase: NavigationPhase): Vector3 {
  const distance = horizontalDistance(position);
  if (distance >= SILO_WARNING_RADIUS || distance < 0.001) return Vector3.Zero();

  const inward = new Vector3(-position.x, 0, -position.z).normalize();
  const normalized = 1 - distance / SILO_WARNING_RADIUS;
  const strength =
    phase === "critical"
      ? CAPTURE_PULL_STRENGTH * (0.45 + normalized * normalized)
      : ATTRACTION_STRENGTH * normalized * normalized;
  return inward.scale(strength);
}

function movementAcceleration(
  position: Vector3,
  velocity: Vector3,
  desired: Vector3,
): Vector3 {
  const error = desired.subtract(position);
  error.y = 0;
  const distance = error.length();
  if (distance < ARRIVAL_RADIUS) {
    return velocity.scale(-1.2);
  }

  const desiredDirection = error.normalize();
  const desiredSpeed = Math.min(MAX_SPEED, Math.max(4, distance * 0.38));
  const desiredVelocity = desiredDirection.scale(desiredSpeed);
  const correction = desiredVelocity.subtract(new Vector3(velocity.x, 0, velocity.z));
  if (correction.length() > MAX_ACCELERATION) correction.normalize().scaleInPlace(MAX_ACCELERATION);
  return correction;
}

function updateCamera(
  camera: ArcRotateCamera,
  state: NavigationState,
  root: TransformNode,
  deltaSeconds: number,
): void {
  if (state.cameraMode === "raider") {
    const followTarget = root.position.add(new Vector3(0, -5, 0));
    const smoothing = 1 - Math.exp(-deltaSeconds * 4.2);
    state.cameraAnchor.copyFrom(Vector3.Lerp(state.cameraAnchor, followTarget, smoothing));
    camera.setTarget(state.cameraAnchor);
    camera.radius += (64 - camera.radius) * Math.min(1, deltaSeconds * 2.2);
    camera.beta += (0.93 - camera.beta) * Math.min(1, deltaSeconds * 1.4);
  } else {
    camera.setTarget(new Vector3(0, 24, 0));
  }
}

async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const resetButton = document.querySelector<HTMLButtonElement>("#reset");
  const nearButton = document.querySelector<HTMLButtonElement>("#near");
  const farButton = document.querySelector<HTMLButtonElement>("#far");
  const cameraButton = document.querySelector<HTMLButtonElement>("#camera");
  if (!canvas || !metrics || !resetButton || !nearButton || !farButton || !cameraButton) {
    throw new Error("Navigation lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, { adaptToDeviceRatio: true, antialias: true });
  const scene = new Scene(engine);
  scene.clearColor.set(0.02, 0.012, 0.034, 1);

  const camera = new ArcRotateCamera(
    "navigation-camera",
    -Math.PI / 2.1,
    0.93,
    64,
    START_POSITION,
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 42;
  camera.upperRadiusLimit = 170;
  camera.lowerBetaLimit = 0.35;
  camera.upperBetaLimit = 2.2;

  const ambient = new HemisphericLight("navigation-ambient", new Vector3(0.15, 1, 0.2), scene);
  ambient.intensity = 0.74;

  const arena = createArena(scene);
  const mothership = createMothership(scene);
  const coreLight = new PointLight("navigation-core-light", START_POSITION, scene);
  coreLight.diffuse = new Color3(0.1, 0.92, 0.88);
  coreLight.intensity = 0.7;
  coreLight.range = 62;

  const raidMarkerMaterial = createMaterial(
    "raid-sector-marker",
    scene,
    new Color3(0.06, 0.56, 0.58),
    new Color3(0.02, 0.28, 0.3),
    0.86,
  );
  const desiredMarkerMaterial = createMaterial(
    "ship-target-marker",
    scene,
    new Color3(0.68, 0.35, 0.09),
    new Color3(0.18, 0.07, 0.01),
    0.7,
  );
  const raidMarker = createMarker("raid-sector-marker", scene, raidMarkerMaterial, 7);
  const desiredMarker = createMarker("ship-target-marker", scene, desiredMarkerMaterial, 5);

  const state: NavigationState = {
    reserve: START_RESERVE,
    velocity: Vector3.Zero(),
    desiredPosition: START_POSITION.clone(),
    raidSector: new Vector3(52, 0.16, 42),
    cameraAnchor: START_POSITION.clone(),
    cameraMode: "raider",
    phase: "stable",
    projectedTargetCount: 0,
    totalMovementEnergy: 0,
    elapsedSeconds: 0,
  };
  resetState(state, mothership.root);
  setTargetSector(state, mothership.root, raidMarker, desiredMarker, state.raidSector);

  let inspectable: { dispose(): void } | undefined;
  if (new URLSearchParams(location.search).has("inspect")) {
    const { StartInspectable } = await import("@babylonjs/inspector");
    inspectable = StartInspectable(scene);
  }

  const updateCameraButton = () => {
    cameraButton.textContent = state.cameraMode === "raider" ? "Defender view [C]" : "Raider view [C]";
  };

  const doReset = () => {
    resetState(state, mothership.root);
    setTargetSector(state, mothership.root, raidMarker, desiredMarker, state.raidSector);
    camera.alpha = -Math.PI / 2.1;
    camera.beta = 0.93;
    camera.radius = 64;
    updateCameraButton();
  };

  const setNearTarget = () => {
    setTargetSector(state, mothership.root, raidMarker, desiredMarker, new Vector3(4, 0, 3));
  };
  const setFarTarget = () => {
    setTargetSector(state, mothership.root, raidMarker, desiredMarker, new Vector3(-66, 0, 46));
  };
  const toggleCamera = () => {
    state.cameraMode = state.cameraMode === "raider" ? "defender" : "raider";
    if (state.cameraMode === "defender") {
      camera.alpha = -Math.PI / 3.4;
      camera.beta = 1.34;
      camera.radius = 138;
    } else {
      camera.alpha = -Math.PI / 2.1;
      camera.beta = 0.93;
      camera.radius = 64;
    }
    updateCameraButton();
  };

  resetButton.addEventListener("click", doReset);
  nearButton.addEventListener("click", setNearTarget);
  farButton.addEventListener("click", setFarTarget);
  cameraButton.addEventListener("click", toggleCamera);

  scene.onPointerDown = (_event, pickInfo) => {
    if (pickInfo.hit && pickInfo.pickedPoint && pickInfo.pickedMesh === arena.ground) {
      setTargetSector(state, mothership.root, raidMarker, desiredMarker, pickInfo.pickedPoint);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === "r") doReset();
    if (event.key === "1") setNearTarget();
    if (event.key === "2") setFarTarget();
    if (event.key.toLowerCase() === "c") toggleCamera();
  };
  window.addEventListener("keydown", onKeyDown);

  let frame = 0;
  engine.runRenderLoop(() => {
    const deltaSeconds = Math.min(MAX_FRAME_DELTA_SECONDS, engine.getDeltaTime() / 1000);
    state.elapsedSeconds += deltaSeconds;

    if (state.phase !== "captured") {
      state.phase = phaseForPosition(mothership.root.position);
    }

    const steering = movementAcceleration(
      mothership.root.position,
      state.velocity,
      state.desiredPosition,
    );
    const attraction = siloAttraction(mothership.root.position, state.phase);
    const acceleration = steering.add(attraction);

    if (state.phase === "critical") {
      const inwardSpeed = -Vector3.Dot(
        new Vector3(state.velocity.x, 0, state.velocity.z),
        horizontalDirection(mothership.root.position, new Vector3(1, 0, 0)),
      );
      if (horizontalDistance(mothership.root.position) < SILO_CRITICAL_RADIUS * 0.55 && inwardSpeed > 3) {
        state.phase = "captured";
      }
    }

    if (state.phase === "captured") {
      const inward = new Vector3(-mothership.root.position.x, -10, -mothership.root.position.z);
      if (inward.lengthSquared() > 0.001) {
        inward.normalize().scaleInPlace(CAPTURE_PULL_STRENGTH * 1.35);
        acceleration.copyFrom(inward);
      }
    }

    state.velocity.addInPlace(acceleration.scale(deltaSeconds));
    const damping = Math.exp(-LINEAR_DAMPING * deltaSeconds);
    state.velocity.x *= damping;
    state.velocity.z *= damping;
    state.velocity.y = state.phase === "captured" ? state.velocity.y - 8 * deltaSeconds : 0;

    const horizontalSpeed = Math.sqrt(
      state.velocity.x * state.velocity.x + state.velocity.z * state.velocity.z,
    );
    if (horizontalSpeed > MAX_SPEED * 1.35) {
      const scale = (MAX_SPEED * 1.35) / horizontalSpeed;
      state.velocity.x *= scale;
      state.velocity.z *= scale;
    }

    mothership.root.position.addInPlace(state.velocity.scale(deltaSeconds));
    if (state.phase !== "captured") mothership.root.position.y = START_POSITION.y;
    else mothership.root.position.y = Math.max(15, mothership.root.position.y);

    const movementDrain = acceleration.length() * MOVEMENT_DRAIN_PER_ACCEL * deltaSeconds;
    state.totalMovementEnergy += movementDrain;
    state.reserve = Math.max(0, state.reserve - HOVER_DRAIN_PER_SECOND * deltaSeconds - movementDrain);

    const reserveScale = Math.max(0.3, Math.sqrt(state.reserve));
    mothership.core.scaling.set(reserveScale, reserveScale, reserveScale);
    mothership.coreMaterial.emissiveColor.set(
      0.02 * reserveScale,
      0.52 * reserveScale,
      0.54 * reserveScale,
    );
    coreLight.position.copyFrom(mothership.root.position);
    coreLight.intensity = 0.2 + state.reserve * 0.62;

    const speed = state.velocity.length();
    const targetHeading = speed > 0.3 ? Math.atan2(state.velocity.x, state.velocity.z) : mothership.root.rotation.y;
    mothership.root.rotation.y += (targetHeading - mothership.root.rotation.y) * Math.min(1, deltaSeconds * 1.8);
    const stress = state.phase === "warning" ? 0.025 : state.phase === "critical" ? 0.06 : state.phase === "captured" ? 0.12 : 0.008;
    mothership.root.rotation.z = Math.sin(state.elapsedSeconds * 1.8) * stress + state.velocity.x * -0.003;
    mothership.root.rotation.x = Math.cos(state.elapsedSeconds * 1.4) * stress + state.velocity.z * 0.002;

    const distanceToSilo = horizontalDistance(mothership.root.position);
    arena.warningRing.scaling.setAll(1 + Math.sin(state.elapsedSeconds * 2.2) * 0.01);
    arena.criticalRing.scaling.setAll(1 + Math.sin(state.elapsedSeconds * 3.3) * 0.025);
    arena.siloCore.scaling.y = 1 + Math.max(0, 1 - distanceToSilo / SILO_WARNING_RADIUS) * 0.45;

    updateCamera(camera, state, mothership.root, deltaSeconds);
    scene.render();

    frame += 1;
    if (frame % 8 === 0) {
      const desiredDistance = Vector3.Distance(
        new Vector3(mothership.root.position.x, 0, mothership.root.position.z),
        new Vector3(state.desiredPosition.x, 0, state.desiredPosition.z),
      );
      metrics.textContent = [
        "Mothership navigation / silo-attraction PoC",
        `phase: ${state.phase}`,
        `reserve: ${(state.reserve * 100).toFixed(1)}%`,
        `position: ${mothership.root.position.x.toFixed(1)}, ${mothership.root.position.z.toFixed(1)}`,
        `speed: ${speed.toFixed(2)} u/s`,
        `distance to silo: ${distanceToSilo.toFixed(1)}`,
        `desired distance: ${desiredDistance.toFixed(1)}`,
        `raid sector: ${state.raidSector.x.toFixed(1)}, ${state.raidSector.z.toFixed(1)}`,
        `movement energy spent: ${(state.totalMovementEnergy * 100).toFixed(2)}%`,
        `unsafe targets projected: ${state.projectedTargetCount}`,
        `camera: ${state.cameraMode}`,
        `fps: ${engine.getFps().toFixed(1)}`,
        `meshes: ${scene.meshes.length}`,
        "warning / critical silo radii are lab values",
        "?inspect=1 enables Babylon Inspector",
      ].join("\n");
    }
  });

  const resize = () => engine.resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      inspectable?.dispose();
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    },
    { once: true },
  );

  (window as unknown as { __defendMothershipNavigation?: unknown }).__defendMothershipNavigation = {
    state,
    setSector: (x: number, z: number) =>
      setTargetSector(state, mothership.root, raidMarker, desiredMarker, new Vector3(x, 0, z)),
  };
}

void main();
