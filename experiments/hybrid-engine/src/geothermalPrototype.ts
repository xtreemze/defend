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
  Vector3,
} from "@babylonjs/core/pure";

type SourcePhase = "active" | "retreating" | "erupting";
type TowerTier = 1 | 2 | 3;

const PLANET_CENTER = new Vector3(0, -68, 0);
const CRUST_RADIUS = 72;
const MANTLE_RADIUS = 64;
const CORE_RADIUS = 31;
const MAX_CONDUIT_LENGTH = 40;
const DEPLETED_THRESHOLD = 0.075;
const DEPLETION_RETREAT_SECONDS = 6;
const RETREAT_SECONDS = 3.2;
const DEEP_REPLENISH_PER_SECOND = 0.0055;
const PRESSURE_BUILD_PER_SECOND = 0.018;
const PRESSURE_ERUPTION_THRESHOLD = 0.96;
const ERUPTION_SECONDS = 5.5;
const MAX_FRAME_DELTA_SECONDS = 0.05;

interface GeothermalSource {
  id: number;
  position: Vector3;
  energy: number;
  pressure: number;
  drawRate: number;
  depletedSeconds: number;
  retreatSeconds: number;
  eruptionSeconds: number;
  phase: SourcePhase;
  vent: Mesh;
  bulge: Mesh;
}

interface TowerProxy {
  id: number;
  tier: TowerTier;
  position: Vector3;
  mesh: Mesh;
  sourceId: number | null;
  conduit: Mesh | null;
  firing: boolean;
  supported: boolean;
  melted: boolean;
  shotPulse: number;
}

interface RaiderProxy {
  id: number;
  mesh: Mesh;
  velocity: Vector3;
  releasedEnergy: boolean;
}

interface EruptionParticle {
  mesh: Mesh;
  velocity: Vector3;
  age: number;
}

interface CollectedDroplet {
  mesh: Mesh;
  age: number;
  value: number;
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

function surfaceY(x: number, z: number, offset = 0): number {
  const radialSquared = x * x + z * z;
  const radiusSquared = CRUST_RADIUS * CRUST_RADIUS;
  if (radialSquared >= radiusSquared) return PLANET_CENTER.y + offset;
  return PLANET_CENTER.y + Math.sqrt(radiusSquared - radialSquared) + offset;
}

function surfacePoint(x: number, z: number, offset = 0): Vector3 {
  return new Vector3(x, surfaceY(x, z, offset), z);
}

function horizontalDistance(a: Vector3, b: Vector3): number {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

function towerDrawRate(tier: TowerTier): number {
  if (tier === 1) return 0;
  if (tier === 2) return 0.012;
  return 0.028;
}

function createPlanet(scene: Scene) {
  const crustMaterial = createMaterial(
    "geothermal-crust",
    scene,
    new Color3(0.16, 0.12, 0.2),
    new Color3(0.018, 0.01, 0.028),
    0.2,
  );
  crustMaterial.backFaceCulling = false;
  crustMaterial.wireframe = true;

  const mantleMaterial = createMaterial(
    "geothermal-mantle",
    scene,
    new Color3(0.035, 0.46, 0.47),
    new Color3(0.02, 0.28, 0.3),
    0.12,
  );
  mantleMaterial.backFaceCulling = false;

  const coreMaterial = createMaterial(
    "geothermal-core",
    scene,
    new Color3(0.12, 0.055, 0.18),
    new Color3(0.035, 0.01, 0.055),
    0.22,
  );
  coreMaterial.backFaceCulling = false;

  const crust = MeshBuilder.CreateSphere(
    "planet-crust",
    { diameter: CRUST_RADIUS * 2, segments: 32 },
    scene,
  );
  crust.position.copyFrom(PLANET_CENTER);
  crust.material = crustMaterial;
  crust.isPickable = false;

  const mantle = MeshBuilder.CreateSphere(
    "planet-mantle",
    { diameter: MANTLE_RADIUS * 2, segments: 28 },
    scene,
  );
  mantle.position.copyFrom(PLANET_CENTER);
  mantle.material = mantleMaterial;
  mantle.isPickable = false;

  const core = MeshBuilder.CreateSphere(
    "planet-core",
    { diameter: CORE_RADIUS * 2, segments: 20 },
    scene,
  );
  core.position.copyFrom(PLANET_CENTER);
  core.material = coreMaterial;
  core.isPickable = false;

  return { crust, mantle, core, crustMaterial, mantleMaterial, coreMaterial };
}

function createSurfaceReferences(scene: Scene) {
  const defenderMaterial = createMaterial(
    "geothermal-defender",
    scene,
    new Color3(0.08, 0.31, 0.17),
    new Color3(0.012, 0.065, 0.025),
  );
  const siloEnergyMaterial = createMaterial(
    "geothermal-silo-energy",
    scene,
    new Color3(0.045, 0.52, 0.53),
    new Color3(0.02, 0.32, 0.34),
    0.9,
  );
  const raiderMaterial = createMaterial(
    "geothermal-raider",
    scene,
    new Color3(0.27, 0.06, 0.39),
    new Color3(0.055, 0.008, 0.085),
    0.95,
  );
  raiderMaterial.wireframe = true;

  const silo = MeshBuilder.CreateBox(
    "geothermal-silo",
    { width: 20, height: 3.5, depth: 20 },
    scene,
  );
  silo.position.copyFrom(surfacePoint(0, 0, 1.75));
  silo.material = defenderMaterial;

  const siloCore = MeshBuilder.CreateBox(
    "geothermal-silo-core",
    { width: 14, height: 1, depth: 14 },
    scene,
  );
  siloCore.position.copyFrom(surfacePoint(0, 0, 4));
  siloCore.material = siloEnergyMaterial;

  return { defenderMaterial, siloEnergyMaterial, raiderMaterial, silo };
}

function createSource(
  scene: Scene,
  id: number,
  x: number,
  z: number,
  tealMaterial: StandardMaterial,
  crustMaterial: StandardMaterial,
): GeothermalSource {
  const position = surfacePoint(x, z, -0.8);
  const vent = MeshBuilder.CreateSphere(
    `geothermal-vent-${id}`,
    { diameter: 5.2, segments: 7 },
    scene,
  );
  vent.position.copyFrom(position);
  vent.material = tealMaterial;
  vent.scaling.y = 0.35;
  vent.isPickable = false;

  const bulge = MeshBuilder.CreateSphere(
    `geothermal-bulge-${id}`,
    { diameter: 11, segments: 8 },
    scene,
  );
  bulge.position.copyFrom(surfacePoint(x, z, -4));
  bulge.material = crustMaterial;
  bulge.scaling.set(1, 0.08, 1);
  bulge.isPickable = false;

  return {
    id,
    position,
    energy: 0.72 + id * 0.09,
    pressure: 0.25 + id * 0.1,
    drawRate: 0,
    depletedSeconds: 0,
    retreatSeconds: 0,
    eruptionSeconds: 0,
    phase: "active",
    vent,
    bulge,
  };
}

function createSubsurfaceStream(
  scene: Scene,
  name: string,
  from: Vector3,
  to: Vector3,
  material: StandardMaterial,
): Mesh {
  const midpoint = Vector3.Lerp(from, to, 0.5);
  midpoint.y -= 5;
  const path = [
    from.add(new Vector3(0, -2.5, 0)),
    Vector3.Lerp(from, midpoint, 0.5).add(new Vector3(0, -1.5, 0)),
    midpoint,
    Vector3.Lerp(midpoint, to, 0.5).add(new Vector3(0, -1, 0)),
    to.add(new Vector3(0, -2.5, 0)),
  ];
  const tube = MeshBuilder.CreateTube(
    name,
    { path, radius: 0.7, tessellation: 7, cap: Mesh.CAP_ALL },
    scene,
  );
  tube.material = material;
  tube.isPickable = false;
  return tube;
}

function createTower(
  scene: Scene,
  id: number,
  tier: TowerTier,
  x: number,
  z: number,
  material: StandardMaterial,
): TowerProxy {
  const height = tier === 1 ? 4 : tier === 2 ? 8 : 11;
  const mesh = MeshBuilder.CreateBox(
    `geothermal-tower-${id}`,
    { width: tier === 1 ? 8 : 6, height, depth: tier === 1 ? 8 : 6 },
    scene,
  );
  const position = surfacePoint(x, z, height / 2 + 0.5);
  mesh.position.copyFrom(position);
  mesh.material = material;

  return {
    id,
    tier,
    position,
    mesh,
    sourceId: null,
    conduit: null,
    firing: tier > 1,
    supported: tier === 1,
    melted: false,
    shotPulse: 0,
  };
}

function conduitPath(source: GeothermalSource, tower: TowerProxy): Vector3[] {
  const start = source.position.add(new Vector3(0, 1.2, 0));
  const end = tower.mesh.position.add(new Vector3(0, -tower.mesh.getBoundingInfo().boundingBox.extendSizeWorld.y + 0.7, 0));
  const lateral = end.subtract(start);
  const side = new Vector3(-lateral.z, 0, lateral.x);
  if (side.lengthSquared() > 0.001) side.normalize().scaleInPlace(Math.min(5, lateral.length() * 0.12));
  const p1 = Vector3.Lerp(start, end, 0.32).add(side).add(new Vector3(0, 1.4, 0));
  const p2 = Vector3.Lerp(start, end, 0.68).subtract(side.scale(0.45)).add(new Vector3(0, 1.1, 0));
  return [start, p1, p2, end];
}

function connectTowers(
  scene: Scene,
  towers: TowerProxy[],
  sources: GeothermalSource[],
  conduitMaterial: StandardMaterial,
): void {
  towers.forEach(tower => {
    tower.conduit?.dispose();
    tower.conduit = null;
    tower.sourceId = null;
    tower.supported = tower.tier === 1;

    if (tower.tier === 1) return;

    let best: GeothermalSource | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const source of sources) {
      if (source.phase === "retreating") continue;
      const distance = horizontalDistance(tower.mesh.position, source.position);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = source;
      }
    }

    if (!best || bestDistance > MAX_CONDUIT_LENGTH) return;

    tower.sourceId = best.id;
    tower.supported = true;
    tower.conduit = MeshBuilder.CreateTube(
      `tower-conduit-${tower.id}`,
      { path: conduitPath(best, tower), radius: 0.42, tessellation: 6, cap: Mesh.CAP_ALL },
      scene,
    );
    tower.conduit.material = conduitMaterial;
    tower.conduit.isPickable = false;
  });
}

function relocateSource(source: GeothermalSource, relocationIndex: number): void {
  const relocationPoints = [
    new Vector3(-52, 0, 28),
    new Vector3(16, 0, 48),
    new Vector3(50, 0, -4),
    new Vector3(-8, 0, -52),
  ];
  const point = relocationPoints[(source.id + relocationIndex) % relocationPoints.length];
  source.position.copyFrom(surfacePoint(point.x, point.z, -0.8));
  source.vent.position.copyFrom(source.position);
  source.bulge.position.copyFrom(surfacePoint(point.x, point.z, -4));
  source.energy = 0.62;
  source.pressure = 0.18;
  source.drawRate = 0;
  source.depletedSeconds = 0;
  source.retreatSeconds = 0;
  source.phase = "active";
  source.vent.setEnabled(true);
}

function createEruptionParticles(
  scene: Scene,
  source: GeothermalSource,
  material: StandardMaterial,
): EruptionParticle[] {
  const particles: EruptionParticle[] = [];
  for (let index = 0; index < 24; index += 1) {
    const mesh = MeshBuilder.CreateSphere(
      `eruption-${source.id}-${index}`,
      { diameter: 0.8 + (index % 4) * 0.25, segments: 4 },
      scene,
    );
    mesh.position.copyFrom(source.position.add(new Vector3(0, 1.3, 0)));
    mesh.material = material;
    mesh.isPickable = false;

    const angle = (index / 24) * Math.PI * 2;
    const speed = 5 + (index % 6) * 1.2;
    particles.push({
      mesh,
      velocity: new Vector3(Math.cos(angle) * speed, 10 + (index % 5) * 2.2, Math.sin(angle) * speed),
      age: 0,
    });
  }
  return particles;
}

function spawnCollectedDroplet(
  scene: Scene,
  origin: Vector3,
  material: StandardMaterial,
  index: number,
): CollectedDroplet {
  const mesh = MeshBuilder.CreateSphere(
    `eruption-liberated-energy-${index}`,
    { diameter: 1.15, segments: 5 },
    scene,
  );
  mesh.position.copyFrom(origin);
  mesh.material = material;
  mesh.isPickable = false;
  return { mesh, age: 0, value: 1 };
}

async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const resetButton = document.querySelector<HTMLButtonElement>("#reset");
  const fireButton = document.querySelector<HTMLButtonElement>("#fire");
  const pressureButton = document.querySelector<HTMLButtonElement>("#pressure");
  const eruptionButton = document.querySelector<HTMLButtonElement>("#eruption");
  const layersButton = document.querySelector<HTMLButtonElement>("#layers");
  if (!canvas || !metrics || !resetButton || !fireButton || !pressureButton || !eruptionButton || !layersButton) {
    throw new Error("Geothermal lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, { adaptToDeviceRatio: true, antialias: true });
  const scene = new Scene(engine);
  scene.clearColor.set(0.02, 0.012, 0.034, 1);

  const camera = new ArcRotateCamera(
    "geothermal-camera",
    -Math.PI / 2.35,
    1.08,
    154,
    new Vector3(0, -12, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 90;
  camera.upperRadiusLimit = 220;
  camera.lowerBetaLimit = 0.38;
  camera.upperBetaLimit = 2.5;

  const ambient = new HemisphericLight("geothermal-ambient", new Vector3(0.25, 1, 0.15), scene);
  ambient.intensity = 0.7;

  const planet = createPlanet(scene);
  const refs = createSurfaceReferences(scene);
  const tealMaterial = createMaterial(
    "geothermal-energy",
    scene,
    new Color3(0.03, 0.62, 0.61),
    new Color3(0.015, 0.48, 0.48),
    0.9,
  );
  tealMaterial.specularColor = new Color3(0.18, 0.94, 0.9);
  const conduitMaterial = createMaterial(
    "geothermal-conduit",
    scene,
    new Color3(0.035, 0.38, 0.4),
    new Color3(0.012, 0.21, 0.23),
    0.84,
  );
  const invalidMaterial = createMaterial(
    "unsupported-tower",
    scene,
    new Color3(0.25, 0.08, 0.1),
    new Color3(0.05, 0.01, 0.015),
  );

  const sources = [
    createSource(scene, 0, -36, -18, tealMaterial, planet.crustMaterial),
    createSource(scene, 1, 3, 34, tealMaterial, planet.crustMaterial),
    createSource(scene, 2, 39, -20, tealMaterial, planet.crustMaterial),
  ];

  const deepStreams = [
    createSubsurfaceStream(scene, "deep-stream-0", sources[0].position, sources[1].position, tealMaterial),
    createSubsurfaceStream(scene, "deep-stream-1", sources[1].position, sources[2].position, tealMaterial),
  ];
  deepStreams.forEach(stream => {
    stream.visibility = 0.55;
  });

  const towers = [
    createTower(scene, 0, 2, -24, -31, refs.defenderMaterial),
    createTower(scene, 1, 3, -9, -22, refs.defenderMaterial),
    createTower(scene, 2, 2, 27, -29, refs.defenderMaterial),
    createTower(scene, 3, 3, 51, 22, refs.defenderMaterial),
    createTower(scene, 4, 1, 17, 30, refs.defenderMaterial),
  ];

  const raiders: RaiderProxy[] = [6, 9, 14].map((diameter, index) => {
    const mesh = MeshBuilder.CreateSphere(
      `geothermal-raider-${index}`,
      { diameter, segments: 5 + index },
      scene,
    );
    mesh.position.copyFrom(surfacePoint(-46 + index * 34, 12 + index * 9, diameter / 2 + 0.4));
    mesh.material = refs.raiderMaterial;
    return { id: index, mesh, velocity: Vector3.Zero(), releasedEnergy: false };
  });

  connectTowers(scene, towers, sources, conduitMaterial);
  towers.forEach(tower => {
    if (!tower.supported && tower.tier > 1) tower.mesh.material = invalidMaterial;
  });

  const ventLight = new PointLight("geothermal-vent-light", sources[1].position, scene);
  ventLight.diffuse = new Color3(0.08, 0.92, 0.88);
  ventLight.intensity = 0.35;
  ventLight.range = 44;

  let globalFiring = true;
  let acceleratedPressure = false;
  let boostedLayers = false;
  let relocationIndex = 0;
  let collectedFromEruptions = 0;
  let eruptionParticles: EruptionParticle[] = [];
  let collectedDroplets: CollectedDroplet[] = [];
  let eruptionSourceId: number | null = null;

  let inspectable: { dispose(): void } | undefined;
  if (new URLSearchParams(location.search).has("inspect")) {
    const { StartInspectable } = await import("@babylonjs/inspector");
    inspectable = StartInspectable(scene);
  }

  const updateButtons = () => {
    fireButton.textContent = globalFiring ? "Stop tower draw [F]" : "Resume tower draw [F]";
    pressureButton.textContent = acceleratedPressure ? "Normal pressure [P]" : "Accelerate pressure [P]";
    layersButton.textContent = boostedLayers ? "Dim internal layers [L]" : "Boost internal layers [L]";
  };

  const startEruption = (source: GeothermalSource) => {
    if (eruptionSourceId !== null) return;
    source.phase = "erupting";
    source.eruptionSeconds = 0;
    source.pressure = 1;
    eruptionSourceId = source.id;
    eruptionParticles = createEruptionParticles(scene, source, tealMaterial);

    for (const tower of towers) {
      if (horizontalDistance(tower.mesh.position, source.position) < 25 && !tower.melted) {
        tower.melted = true;
        tower.firing = false;
      }
    }

    for (const raider of raiders) {
      const distance = horizontalDistance(raider.mesh.position, source.position);
      if (distance < 31) {
        const outward = raider.mesh.position.subtract(source.position);
        outward.y = 0;
        if (outward.lengthSquared() < 0.001) outward.set(1, 0, 0);
        outward.normalize();
        raider.velocity.addInPlace(outward.scale(10 + (31 - distance) * 0.35));
        raider.velocity.y += 9;
        if (!raider.releasedEnergy) {
          raider.releasedEnergy = true;
          collectedDroplets.push(
            spawnCollectedDroplet(scene, raider.mesh.position, tealMaterial, collectedDroplets.length),
          );
        }
      }
    }
  };

  const reset = () => {
    globalFiring = true;
    acceleratedPressure = false;
    boostedLayers = false;
    relocationIndex = 0;
    collectedFromEruptions = 0;
    eruptionSourceId = null;
    eruptionParticles.forEach(particle => particle.mesh.dispose());
    collectedDroplets.forEach(droplet => droplet.mesh.dispose());
    eruptionParticles = [];
    collectedDroplets = [];

    const resetPoints = [new Vector3(-36, 0, -18), new Vector3(3, 0, 34), new Vector3(39, 0, -20)];
    sources.forEach((source, index) => {
      source.position.copyFrom(surfacePoint(resetPoints[index].x, resetPoints[index].z, -0.8));
      source.vent.position.copyFrom(source.position);
      source.vent.setEnabled(true);
      source.bulge.position.copyFrom(surfacePoint(resetPoints[index].x, resetPoints[index].z, -4));
      source.bulge.scaling.set(1, 0.08, 1);
      source.energy = 0.72 + index * 0.09;
      source.pressure = 0.25 + index * 0.1;
      source.drawRate = 0;
      source.depletedSeconds = 0;
      source.retreatSeconds = 0;
      source.eruptionSeconds = 0;
      source.phase = "active";
    });

    towers.forEach(tower => {
      tower.firing = tower.tier > 1;
      tower.melted = false;
      tower.mesh.scaling.set(1, 1, 1);
      tower.mesh.rotation.set(0, 0, 0);
      tower.mesh.material = refs.defenderMaterial;
    });
    raiders.forEach((raider, index) => {
      const diameter = [6, 9, 14][index];
      raider.mesh.position.copyFrom(surfacePoint(-46 + index * 34, 12 + index * 9, diameter / 2 + 0.4));
      raider.velocity.set(0, 0, 0);
      raider.releasedEnergy = false;
    });

    planet.crustMaterial.alpha = 0.2;
    planet.mantleMaterial.alpha = 0.12;
    planet.coreMaterial.alpha = 0.22;
    connectTowers(scene, towers, sources, conduitMaterial);
    towers.forEach(tower => {
      if (!tower.supported && tower.tier > 1) tower.mesh.material = invalidMaterial;
    });
    updateButtons();
  };

  const toggleFire = () => {
    globalFiring = !globalFiring;
    updateButtons();
  };
  const togglePressure = () => {
    acceleratedPressure = !acceleratedPressure;
    updateButtons();
  };
  const toggleLayers = () => {
    boostedLayers = !boostedLayers;
    planet.crustMaterial.alpha = boostedLayers ? 0.32 : 0.2;
    planet.mantleMaterial.alpha = boostedLayers ? 0.28 : 0.12;
    planet.coreMaterial.alpha = boostedLayers ? 0.42 : 0.22;
    updateButtons();
  };
  const forceEruption = () => {
    const candidate = sources.reduce((best, source) =>
      source.pressure > best.pressure ? source : best,
    );
    startEruption(candidate);
  };

  resetButton.addEventListener("click", reset);
  fireButton.addEventListener("click", toggleFire);
  pressureButton.addEventListener("click", togglePressure);
  eruptionButton.addEventListener("click", forceEruption);
  layersButton.addEventListener("click", toggleLayers);

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === "r") reset();
    if (key === "f") toggleFire();
    if (key === "p") togglePressure();
    if (key === "e") forceEruption();
    if (key === "l") toggleLayers();
  };
  window.addEventListener("keydown", onKeyDown);

  let frame = 0;
  engine.runRenderLoop(() => {
    const deltaSeconds = Math.min(MAX_FRAME_DELTA_SECONDS, engine.getDeltaTime() / 1000);

    sources.forEach(source => {
      source.drawRate = 0;
    });

    towers.forEach(tower => {
      if (tower.melted) {
        tower.mesh.scaling.y += (0.22 - tower.mesh.scaling.y) * Math.min(1, deltaSeconds * 0.75);
        tower.mesh.rotation.z += deltaSeconds * 0.09;
        return;
      }
      if (!globalFiring || !tower.firing || !tower.supported || tower.sourceId === null) return;
      const source = sources.find(candidate => candidate.id === tower.sourceId);
      if (!source || source.phase !== "active" || source.energy <= 0) return;
      const requested = towerDrawRate(tower.tier) * deltaSeconds;
      const actual = Math.min(source.energy, requested);
      source.energy -= actual;
      source.drawRate += actual / Math.max(deltaSeconds, 0.0001);
      tower.shotPulse += deltaSeconds * (tower.tier === 3 ? 2.2 : 4.8);
      if (tower.conduit) {
        const pulse = 0.72 + Math.sin(tower.shotPulse * Math.PI * 2) * 0.2;
        tower.conduit.visibility = pulse;
        tower.conduit.scaling.y = 0.92 + source.energy * 0.12;
      }
    });

    sources.forEach(source => {
      if (source.phase === "active") {
        source.energy = Math.min(1, source.energy + DEEP_REPLENISH_PER_SECOND * deltaSeconds);
        if (source.energy < DEPLETED_THRESHOLD) source.depletedSeconds += deltaSeconds;
        else source.depletedSeconds = Math.max(0, source.depletedSeconds - deltaSeconds * 0.5);

        const quietRich = source.energy > 0.78 && source.drawRate < 0.003;
        if (quietRich) {
          const multiplier = acceleratedPressure ? 7 : 1;
          source.pressure = Math.min(
            1,
            source.pressure + PRESSURE_BUILD_PER_SECOND * multiplier * deltaSeconds,
          );
        } else if (source.drawRate > 0.008) {
          source.pressure = Math.max(0.08, source.pressure - source.drawRate * 0.3 * deltaSeconds);
        }

        if (source.depletedSeconds >= DEPLETION_RETREAT_SECONDS) {
          source.phase = "retreating";
          source.retreatSeconds = 0;
          source.vent.setEnabled(true);
          connectTowers(scene, towers, sources, conduitMaterial);
        }
        if (source.pressure >= PRESSURE_ERUPTION_THRESHOLD && eruptionSourceId === null) {
          startEruption(source);
        }
      } else if (source.phase === "retreating") {
        source.retreatSeconds += deltaSeconds;
        source.vent.scaling.x = Math.max(0.05, 1 - source.retreatSeconds / RETREAT_SECONDS);
        source.vent.scaling.z = source.vent.scaling.x;
        source.vent.position.y -= deltaSeconds * 1.6;
        if (source.retreatSeconds >= RETREAT_SECONDS) {
          relocationIndex += 1;
          source.vent.scaling.set(1, 0.35, 1);
          relocateSource(source, relocationIndex);
          connectTowers(scene, towers, sources, conduitMaterial);
          towers.forEach(tower => {
            tower.mesh.material = !tower.supported && tower.tier > 1 ? invalidMaterial : refs.defenderMaterial;
          });
        }
      } else if (source.phase === "erupting") {
        source.eruptionSeconds += deltaSeconds;
        source.energy = Math.max(0.08, source.energy - 0.055 * deltaSeconds);
        source.pressure = Math.max(0.08, source.pressure - 0.16 * deltaSeconds);
        source.bulge.position.y += deltaSeconds * (source.eruptionSeconds < 1.4 ? 1.2 : -0.18);
        source.bulge.scaling.y = Math.min(0.8, 0.15 + source.eruptionSeconds * 0.12);
        if (source.eruptionSeconds >= ERUPTION_SECONDS) {
          source.phase = "retreating";
          source.retreatSeconds = 0;
          source.depletedSeconds = DEPLETION_RETREAT_SECONDS;
          source.bulge.scaling.set(1, 0.12, 1);
          eruptionSourceId = null;
          connectTowers(scene, towers, sources, conduitMaterial);
        }
      }

      const visibleEnergy = Math.max(0.12, source.energy);
      source.vent.scaling.x = source.phase === "retreating" ? source.vent.scaling.x : 0.55 + visibleEnergy * 0.65;
      source.vent.scaling.z = source.vent.scaling.x;
      source.vent.scaling.y = source.phase === "erupting" ? 0.65 + source.pressure * 0.8 : 0.22 + source.pressure * 0.35;
      const bulgePressure = Math.max(0, source.pressure - 0.58);
      if (source.phase === "active") {
        source.bulge.scaling.y = 0.08 + bulgePressure * 0.42;
        source.bulge.position.y = surfaceY(source.position.x, source.position.z, -4 + bulgePressure * 2.2);
      }
    });

    for (let index = eruptionParticles.length - 1; index >= 0; index -= 1) {
      const particle = eruptionParticles[index];
      particle.age += deltaSeconds;
      particle.velocity.y -= 8.5 * deltaSeconds;
      particle.mesh.position.addInPlace(particle.velocity.scale(deltaSeconds));
      const floor = surfaceY(particle.mesh.position.x, particle.mesh.position.z, 0.25);
      if (particle.mesh.position.y <= floor || particle.age > 4.2) {
        particle.mesh.dispose();
        eruptionParticles.splice(index, 1);
      }
    }

    raiders.forEach(raider => {
      if (raider.velocity.lengthSquared() < 0.001) return;
      raider.velocity.y -= 7.5 * deltaSeconds;
      raider.mesh.position.addInPlace(raider.velocity.scale(deltaSeconds));
      const radius = raider.mesh.getBoundingInfo().boundingSphere.radiusWorld;
      const floor = surfaceY(raider.mesh.position.x, raider.mesh.position.z, radius + 0.2);
      if (raider.mesh.position.y < floor) {
        raider.mesh.position.y = floor;
        raider.velocity.y *= -0.3;
        raider.velocity.x *= 0.92;
        raider.velocity.z *= 0.92;
      }
    });

    const siloTarget = refs.silo.position.add(new Vector3(0, 2.5, 0));
    for (let index = collectedDroplets.length - 1; index >= 0; index -= 1) {
      const droplet = collectedDroplets[index];
      droplet.age += deltaSeconds;
      const toSilo = siloTarget.subtract(droplet.mesh.position);
      const horizontal = new Vector3(toSilo.x, 0, toSilo.z);
      if (horizontal.length() < 3) {
        collectedFromEruptions += droplet.value;
        droplet.mesh.dispose();
        collectedDroplets.splice(index, 1);
        continue;
      }
      horizontal.normalize();
      const speed = 8 + Math.min(8, toSilo.length() * 0.08);
      droplet.mesh.position.x += horizontal.x * speed * deltaSeconds;
      droplet.mesh.position.z += horizontal.z * speed * deltaSeconds;
      droplet.mesh.position.y = surfaceY(droplet.mesh.position.x, droplet.mesh.position.z, 0.55);
    }

    const highlighted = eruptionSourceId === null ? sources[1] : sources.find(source => source.id === eruptionSourceId) ?? sources[1];
    ventLight.position.copyFrom(highlighted.position.add(new Vector3(0, 3, 0)));
    ventLight.intensity = 0.18 + highlighted.pressure * 0.8;

    scene.render();
    frame += 1;
    if (frame % 10 === 0) {
      const sourceLines = sources.map(
        source =>
          `S${source.id + 1} ${source.phase.padEnd(10)} energy ${(source.energy * 100).toFixed(0).padStart(3)}% pressure ${(source.pressure * 100).toFixed(0).padStart(3)}% draw ${source.drawRate.toFixed(3)}`,
      );
      const supported = towers.filter(tower => tower.tier === 1 || tower.supported).length;
      const firing = towers.filter(tower => tower.tier > 1 && tower.supported && !tower.melted && globalFiring).length;
      metrics.textContent = [
        "Planetary geothermal / tower-power PoC",
        ...sourceLines,
        `supported towers: ${supported}/${towers.length}`,
        `active firing towers: ${firing}`,
        `max conduit length: ${MAX_CONDUIT_LENGTH}`,
        `eruption particles: ${eruptionParticles.length}`,
        `liberated raider droplets in transit: ${collectedDroplets.length}`,
        `eruption-liberated energy collected: ${collectedFromEruptions.toFixed(0)} lab units`,
        `internal layers: ${boostedLayers ? "boosted" : "subtle"}`,
        `fps: ${engine.getFps().toFixed(1)}`,
        `meshes: ${scene.meshes.length}`,
        "all rates/thresholds are lab values",
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

  (window as unknown as { __defendGeothermalPrototype?: unknown }).__defendGeothermalPrototype = {
    sources,
    towers,
    raiders,
    forceEruption,
  };
}

void main();
