import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core/pure";

type RaiderTier = 1 | 2 | 3;
type RaiderState = "moving" | "blocked" | "reached";
type EnergyState = "streaming" | "pooling" | "collected";

interface Obstacle {
  id: string;
  mesh: Mesh;
  x: number;
  z: number;
  halfX: number;
  halfZ: number;
  health: number;
  maxHealth: number;
  breakable: boolean;
}

interface RaiderBody {
  tier: RaiderTier;
  mesh: Mesh;
  radius: number;
  velocity: Vector3;
  desired: Vector3;
  state: RaiderState;
  decisionTimer: number;
  collisions: number;
  distanceTravelled: number;
}

interface EnergyPacket {
  mesh: Mesh;
  value: number;
  state: EnergyState;
  blockedSeconds: number;
  distanceTravelled: number;
}

const SILO = new Vector3(48, 0, 0);
const START_X = -56;
const MAX_DT = 0.05;
const DRAIN_RADIUS = 1.1;
const SILO_RADIUS = 7;
const WALL_X = 18;
const NARROW_DRAIN_Z = -30;
const BROAD_GATE_Z = 12;
const TERRAIN_VALLEY_Z = -24;

function material(
  name: string,
  scene: Scene,
  diffuse: Color3,
  emissive: Color3,
  alpha = 1,
): StandardMaterial {
  const result = new StandardMaterial(name, scene);
  result.diffuseColor = diffuse;
  result.emissiveColor = emissive;
  result.specularColor = new Color3(0.08, 0.08, 0.1);
  result.alpha = alpha;
  return result;
}

function terrainHeight(z: number): number {
  const normalized = (z - TERRAIN_VALLEY_Z) / 14;
  return -1.4 * Math.exp(-(normalized * normalized));
}

function terrainPreference(z: number): number {
  return terrainHeight(z) * 2.5;
}

function createObstacle(
  scene: Scene,
  id: string,
  x: number,
  z: number,
  width: number,
  depth: number,
  height: number,
  obstacleMaterial: StandardMaterial,
  health: number,
  breakable: boolean,
): Obstacle {
  const mesh = MeshBuilder.CreateBox(
    id,
    { width, depth, height },
    scene,
  );
  mesh.position.set(x, height / 2 + terrainHeight(z), z);
  mesh.material = obstacleMaterial;
  return {
    id,
    mesh,
    x,
    z,
    halfX: width / 2,
    halfZ: depth / 2,
    health,
    maxHealth: health,
    breakable,
  };
}

function pointBlocked(
  x: number,
  z: number,
  radius: number,
  obstacles: Obstacle[],
): Obstacle | undefined {
  return obstacles.find(
    (obstacle) =>
      obstacle.health > 0 &&
      Math.abs(x - obstacle.x) <= obstacle.halfX + radius &&
      Math.abs(z - obstacle.z) <= obstacle.halfZ + radius,
  );
}

function normalize2(x: number, z: number): Vector3 {
  const length = Math.hypot(x, z);
  if (length < 0.0001) return Vector3.Zero();
  return new Vector3(x / length, 0, z / length);
}

function rotate2(direction: Vector3, radians: number): Vector3 {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return new Vector3(
    direction.x * cosine - direction.z * sine,
    0,
    direction.x * sine + direction.z * cosine,
  );
}

function candidateDirections(direct: Vector3): Vector3[] {
  return [
    direct,
    rotate2(direct, Math.PI / 6),
    rotate2(direct, -Math.PI / 6),
    rotate2(direct, Math.PI / 3),
    rotate2(direct, -Math.PI / 3),
    rotate2(direct, Math.PI / 2),
    rotate2(direct, -Math.PI / 2),
  ];
}

function scoreCandidate(
  position: Vector3,
  direction: Vector3,
  step: number,
  target: Vector3,
): number {
  const x = position.x + direction.x * step;
  const z = position.z + direction.z * step;
  return Math.hypot(target.x - x, target.z - z) + terrainPreference(z);
}

function bestOpenDirection(
  position: Vector3,
  radius: number,
  target: Vector3,
  obstacles: Obstacle[],
  probe = 4,
): Vector3 | undefined {
  const direct = normalize2(target.x - position.x, target.z - position.z);
  const candidates = candidateDirections(direct)
    .filter((candidate) => {
      const x = position.x + candidate.x * probe;
      const z = position.z + candidate.z * probe;
      return pointBlocked(x, z, radius, obstacles) === undefined;
    })
    .sort(
      (a, b) =>
        scoreCandidate(position, a, probe, target) -
        scoreCandidate(position, b, probe, target),
    );
  return candidates[0];
}

function createArena(scene: Scene) {
  const groundMaterial = material(
    "routing-ground",
    scene,
    new Color3(0.026, 0.018, 0.038),
    new Color3(0.008, 0.005, 0.012),
  );
  const ground = MeshBuilder.CreateGround(
    "routing-ground",
    { width: 130, height: 110, subdivisions: 1 },
    scene,
  );
  ground.material = groundMaterial;
  ground.position.y = -1.45;

  const valleyMaterial = material(
    "valley-guide",
    scene,
    new Color3(0.02, 0.08, 0.085),
    new Color3(0.01, 0.08, 0.09),
    0.5,
  );
  const valley = MeshBuilder.CreateBox(
    "valley-guide",
    { width: 125, depth: 10, height: 0.15 },
    scene,
  );
  valley.position.set(0, terrainHeight(TERRAIN_VALLEY_Z) - 0.15, TERRAIN_VALLEY_Z);
  valley.material = valleyMaterial;

  const siloMaterial = material(
    "routing-silo",
    scene,
    new Color3(0.09, 0.31, 0.17),
    new Color3(0.015, 0.07, 0.03),
  );
  const siloCoreMaterial = material(
    "routing-silo-core",
    scene,
    new Color3(0.04, 0.52, 0.54),
    new Color3(0.02, 0.34, 0.36),
    0.9,
  );
  const silo = MeshBuilder.CreateBox(
    "routing-silo",
    { width: 16, depth: 16, height: 4 },
    scene,
  );
  silo.position.set(SILO.x, 2 + terrainHeight(SILO.z), SILO.z);
  silo.material = siloMaterial;
  const core = MeshBuilder.CreateBox(
    "routing-silo-core",
    { width: 10, depth: 10, height: 1.4 },
    scene,
  );
  core.position.set(SILO.x, 4.6 + terrainHeight(SILO.z), SILO.z);
  core.material = siloCoreMaterial;

  return { ground };
}

function createFortress(scene: Scene) {
  const wallMaterial = material(
    "routing-wall",
    scene,
    new Color3(0.08, 0.3, 0.16),
    new Color3(0.012, 0.06, 0.025),
  );
  const gateMaterial = material(
    "routing-gate",
    scene,
    new Color3(0.16, 0.38, 0.2),
    new Color3(0.025, 0.085, 0.035),
  );

  const obstacles: Obstacle[] = [
    createObstacle(scene, "wall-south", WALL_X, -43, 6, 18, 8, wallMaterial, 9999, false),
    createObstacle(scene, "wall-mid", WALL_X, -12, 6, 28, 8, wallMaterial, 9999, false),
    createObstacle(scene, "wall-north", WALL_X, 37, 6, 30, 8, wallMaterial, 9999, false),
    createObstacle(scene, "broad-gate", WALL_X, BROAD_GATE_Z, 6, 20, 8, gateMaterial, 900, true),
  ];

  const sideWalls = [
    createObstacle(scene, "north-return", 38, 52, 46, 5, 7, wallMaterial, 9999, false),
    createObstacle(scene, "south-return", 38, -52, 46, 5, 7, wallMaterial, 9999, false),
    createObstacle(scene, "east-return", 61, 0, 5, 104, 7, wallMaterial, 9999, false),
  ];
  obstacles.push(...sideWalls);

  return obstacles;
}

function createRaiderMaterial(scene: Scene, tier: RaiderTier): StandardMaterial {
  const diffuse = [
    new Color3(0.22, 0.05, 0.34),
    new Color3(0.27, 0.055, 0.4),
    new Color3(0.32, 0.06, 0.45),
  ][tier - 1];
  return material(
    `routing-raider-${tier}`,
    scene,
    diffuse,
    new Color3(diffuse.r * 0.22, diffuse.g * 0.22, diffuse.b * 0.22),
  );
}

function spawnRaiders(scene: Scene): RaiderBody[] {
  const radii: Record<RaiderTier, number> = { 1: 3, 2: 4.5, 3: 7 };
  const starts: Record<RaiderTier, number> = { 1: -30, 2: 8, 3: 27 };
  return ([1, 2, 3] as RaiderTier[]).map((tier) => {
    const radius = radii[tier];
    const mesh = MeshBuilder.CreateIcoSphere(
      `routing-raider-${tier}`,
      { radius, subdivisions: tier },
      scene,
    );
    const z = starts[tier];
    mesh.position.set(START_X, radius + terrainHeight(z), z);
    mesh.material = createRaiderMaterial(scene, tier);
    return {
      tier,
      mesh,
      radius,
      velocity: Vector3.Zero(),
      desired: normalize2(SILO.x - START_X, SILO.z - z),
      state: "moving" as RaiderState,
      decisionTimer: 0,
      collisions: 0,
      distanceTravelled: 0,
    };
  });
}

function raiderDecision(body: RaiderBody, obstacles: Obstacle[]): Vector3 {
  const direct = normalize2(SILO.x - body.mesh.position.x, SILO.z - body.mesh.position.z);

  if (body.tier === 1) {
    return bestOpenDirection(body.mesh.position, body.radius + 0.25, SILO, obstacles, 4.4) ?? direct;
  }

  if (body.tier === 2) {
    const blocker = pointBlocked(
      body.mesh.position.x + direct.x * 5,
      body.mesh.position.z + direct.z * 5,
      body.radius,
      obstacles,
    );
    if (blocker?.breakable) return direct;
    return bestOpenDirection(body.mesh.position, body.radius + 0.35, SILO, obstacles, 5.2) ?? direct;
  }

  const downhillBias = normalize2(0, (TERRAIN_VALLEY_Z - body.mesh.position.z) * 0.28);
  return normalize2(direct.x + downhillBias.x * 0.3, direct.z + downhillBias.z * 0.3);
}

function applyObstacleImpact(body: RaiderBody, obstacle: Obstacle): void {
  body.collisions += 1;
  if (obstacle.breakable) {
    const speed = Math.hypot(body.velocity.x, body.velocity.z);
    const tierImpulse = body.tier === 1 ? 6 : body.tier === 2 ? 26 : 68;
    obstacle.health = Math.max(0, obstacle.health - tierImpulse * Math.max(0.5, speed));
    const remaining = obstacle.health / obstacle.maxHealth;
    obstacle.mesh.scaling.y = Math.max(0.15, remaining);
    obstacle.mesh.position.y =
      terrainHeight(obstacle.z) + 4 * obstacle.mesh.scaling.y;
    if (obstacle.health <= 0) {
      obstacle.mesh.setEnabled(false);
    }
  }

  const retention = body.tier === 1 ? 0.15 : body.tier === 2 ? 0.42 : 0.66;
  body.velocity.scaleInPlace(retention);
  if (body.tier === 1) body.decisionTimer = 0;
  body.state = "blocked";
}

function updateRaider(body: RaiderBody, obstacles: Obstacle[], deltaSeconds: number): void {
  if (body.state === "reached") return;

  const cadence = body.tier === 1 ? 0.16 : body.tier === 2 ? 0.42 : 0.9;
  body.decisionTimer -= deltaSeconds;
  if (body.decisionTimer <= 0) {
    body.desired = raiderDecision(body, obstacles);
    body.decisionTimer = cadence;
  }

  const acceleration = body.tier === 1 ? 13 : body.tier === 2 ? 8.5 : 4.4;
  const maxSpeed = body.tier === 1 ? 15 : body.tier === 2 ? 12 : 9.5;
  body.velocity.x += body.desired.x * acceleration * deltaSeconds;
  body.velocity.z += body.desired.z * acceleration * deltaSeconds;

  const damping = Math.max(0, 1 - (body.tier === 1 ? 1.8 : body.tier === 2 ? 0.9 : 0.35) * deltaSeconds);
  body.velocity.scaleInPlace(damping);
  const speed = Math.hypot(body.velocity.x, body.velocity.z);
  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    body.velocity.x *= scale;
    body.velocity.z *= scale;
  }

  const nextX = body.mesh.position.x + body.velocity.x * deltaSeconds;
  const nextZ = body.mesh.position.z + body.velocity.z * deltaSeconds;
  const obstacle = pointBlocked(nextX, nextZ, body.radius, obstacles);
  if (obstacle) {
    applyObstacleImpact(body, obstacle);
  } else {
    const dx = nextX - body.mesh.position.x;
    const dz = nextZ - body.mesh.position.z;
    body.distanceTravelled += Math.hypot(dx, dz);
    body.mesh.position.x = nextX;
    body.mesh.position.z = nextZ;
    body.mesh.position.y = body.radius + terrainHeight(nextZ);
    body.state = "moving";
  }

  const siloDistance = Math.hypot(
    SILO.x - body.mesh.position.x,
    SILO.z - body.mesh.position.z,
  );
  if (siloDistance <= SILO_RADIUS + body.radius * 0.45) {
    body.state = "reached";
    body.velocity.set(0, 0, 0);
  }
}

function createEnergyMaterial(scene: Scene): StandardMaterial {
  const result = material(
    "routing-energy",
    scene,
    new Color3(0.04, 0.62, 0.62),
    new Color3(0.02, 0.48, 0.5),
    0.92,
  );
  result.specularColor = new Color3(0.2, 0.95, 0.92);
  return result;
}

function spawnEnergy(scene: Scene, packets: EnergyPacket[], energyMaterial: StandardMaterial): void {
  const offsets = [-4, -2, 0, 2, 4];
  offsets.forEach((offset, index) => {
    const mesh = MeshBuilder.CreateSphere(
      `routing-energy-${performance.now()}-${index}`,
      { diameter: 1.8, segments: 5 },
      scene,
    );
    mesh.position.set(
      START_X + 8 + index * 0.8,
      0.7 + terrainHeight(NARROW_DRAIN_Z + offset),
      NARROW_DRAIN_Z + offset,
    );
    mesh.scaling.y = 0.45;
    mesh.material = energyMaterial;
    packets.push({
      mesh,
      value: 100,
      state: "streaming",
      blockedSeconds: 0,
      distanceTravelled: 0,
    });
  });
}

function energyDirection(packet: EnergyPacket, obstacles: Obstacle[]): Vector3 | undefined {
  const direct = normalize2(SILO.x - packet.mesh.position.x, SILO.z - packet.mesh.position.z);
  const candidates = candidateDirections(direct)
    .filter((candidate) => {
      const x = packet.mesh.position.x + candidate.x * 3.2;
      const z = packet.mesh.position.z + candidate.z * 3.2;
      return pointBlocked(x, z, DRAIN_RADIUS, obstacles) === undefined;
    })
    .sort((a, b) => {
      const aScore = scoreCandidate(packet.mesh.position, a, 3.2, SILO);
      const bScore = scoreCandidate(packet.mesh.position, b, 3.2, SILO);
      return aScore - bScore;
    });
  return candidates[0];
}

function updateEnergy(packet: EnergyPacket, obstacles: Obstacle[], deltaSeconds: number): void {
  if (packet.state === "collected") return;

  const distance = Math.hypot(
    SILO.x - packet.mesh.position.x,
    SILO.z - packet.mesh.position.z,
  );
  if (distance <= SILO_RADIUS) {
    packet.state = "collected";
    packet.mesh.setEnabled(false);
    return;
  }

  const direction = energyDirection(packet, obstacles);
  if (!direction) {
    packet.blockedSeconds += deltaSeconds;
    packet.state = "pooling";
    packet.mesh.scaling.set(1.5, 0.25, 1.5);
    return;
  }

  packet.state = "streaming";
  packet.blockedSeconds = 0;
  packet.mesh.scaling.set(1.05, 0.42, 1.05);
  const speed = 8.5;
  const nextX = packet.mesh.position.x + direction.x * speed * deltaSeconds;
  const nextZ = packet.mesh.position.z + direction.z * speed * deltaSeconds;
  if (!pointBlocked(nextX, nextZ, DRAIN_RADIUS, obstacles)) {
    packet.distanceTravelled += Math.hypot(
      nextX - packet.mesh.position.x,
      nextZ - packet.mesh.position.z,
    );
    packet.mesh.position.x = nextX;
    packet.mesh.position.z = nextZ;
    packet.mesh.position.y = 0.5 + terrainHeight(nextZ);
  }
}

function openBroadGate(obstacles: Obstacle[]): void {
  const gate = obstacles.find((obstacle) => obstacle.id === "broad-gate");
  if (!gate || gate.health <= 0) return;
  gate.health = 0;
  gate.mesh.setEnabled(false);
}

async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const resetButton = document.querySelector<HTMLButtonElement>("#reset");
  const energyButton = document.querySelector<HTMLButtonElement>("#energy");
  const gateButton = document.querySelector<HTMLButtonElement>("#gate");
  if (!canvas || !metrics || !resetButton || !energyButton || !gateButton) {
    throw new Error("Surface routing lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, { adaptToDeviceRatio: true, antialias: true });
  const scene = new Scene(engine);
  scene.clearColor.set(0.02, 0.012, 0.034, 1);
  const camera = new ArcRotateCamera(
    "routing-camera",
    -Math.PI / 2,
    0.78,
    132,
    new Vector3(5, 0, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 70;
  camera.upperRadiusLimit = 190;

  const light = new HemisphericLight("routing-light", new Vector3(0.2, 1, 0.1), scene);
  light.intensity = 0.82;

  createArena(scene);
  let obstacles = createFortress(scene);
  let raiders = spawnRaiders(scene);
  const energyMaterial = createEnergyMaterial(scene);
  let energyPackets: EnergyPacket[] = [];
  spawnEnergy(scene, energyPackets, energyMaterial);

  const reset = () => {
    obstacles.forEach((obstacle) => obstacle.mesh.dispose());
    raiders.forEach((raider) => raider.mesh.dispose());
    energyPackets.forEach((packet) => packet.mesh.dispose());
    obstacles = createFortress(scene);
    raiders = spawnRaiders(scene);
    energyPackets = [];
    spawnEnergy(scene, energyPackets, energyMaterial);
  };

  resetButton.addEventListener("click", reset);
  energyButton.addEventListener("click", () => spawnEnergy(scene, energyPackets, energyMaterial));
  gateButton.addEventListener("click", () => openBroadGate(obstacles));
  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") reset();
    if (event.key.toLowerCase() === "e") spawnEnergy(scene, energyPackets, energyMaterial);
    if (event.key.toLowerCase() === "g") openBroadGate(obstacles);
  });

  engine.runRenderLoop(() => {
    const deltaSeconds = Math.min(MAX_DT, engine.getDeltaTime() / 1000);
    raiders.forEach((raider) => updateRaider(raider, obstacles, deltaSeconds));
    energyPackets.forEach((packet) => updateEnergy(packet, obstacles, deltaSeconds));

    const gate = obstacles.find((obstacle) => obstacle.id === "broad-gate");
    const pooled = energyPackets.filter((packet) => packet.state === "pooling");
    const collected = energyPackets.filter((packet) => packet.state === "collected");
    metrics.textContent = [
      "Shared surface topology proof of concept",
      `R1 navigator: ${raiders[0].state} | collisions ${raiders[0].collisions} | path ${raiders[0].distanceTravelled.toFixed(1)}`,
      `R2 breaker:   ${raiders[1].state} | collisions ${raiders[1].collisions} | path ${raiders[1].distanceTravelled.toFixed(1)}`,
      `R3 titan:     ${raiders[2].state} | collisions ${raiders[2].collisions} | path ${raiders[2].distanceTravelled.toFixed(1)}`,
      `broad gate: ${gate && gate.health > 0 ? `${gate.health.toFixed(0)} / ${gate.maxHealth}` : "OPEN / DESTROYED"}`,
      `energy packets: ${energyPackets.length} | pooled ${pooled.length} | collected ${collected.length}`,
      `fps: ${engine.getFps().toFixed(1)} | meshes: ${scene.meshes.length}`,
      "narrow west gap: fluid + R1 only",
      "R2 may batter breakable gate; R3 favors momentum/direct pressure",
      "terrain valley biases free flow and raider movement toward lower surface",
    ].join("\n");

    scene.render();
  });

  const resize = () => engine.resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.removeEventListener("resize", resize);
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    },
    { once: true },
  );
}

void main();
