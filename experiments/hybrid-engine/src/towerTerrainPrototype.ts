import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
  VertexBuffer,
  VertexData,
} from "@babylonjs/core/pure";
import {
  accumulateDepression,
  radialDeformationDepth,
  structuralStabilization,
  terrainImpactProfile,
  type TerrainDeformationCalibration,
} from "../../../src/js/gameplay/terrainDeformation";

type TowerPhase = "foundation" | "base" | "drilling" | "assembly" | "calibrating" | "ready" | "dry" | "renovating";

interface MagmaSource {
  id: string;
  position: Vector3;
  mesh: Mesh;
}

interface TowerModel {
  level: 1 | 2 | 3;
  root: TransformNode;
  base: Mesh;
  pillar?: Mesh;
  turret?: Mesh;
  drill?: Mesh;
  conduit?: Mesh;
  phase: TowerPhase;
  elapsed: number;
  powered: boolean;
  searchAttempted: boolean;
  angularVelocity: number;
  restYaw: number;
  aimError: number;
  readyToFire: boolean;
  connectedSourceId?: string;
}

interface ProjectileModel {
  mesh: Mesh;
  velocity: Vector3;
  effectiveMass: number;
  bodyRadius: number;
}

const TERRAIN_SIZE = 110;
const TERRAIN_SUBDIVISIONS = 44;
const DRILL_REACH = 24;
const SILO_POSITION = new Vector3(0, 0, 0);
const MAX_DT = 0.05;

const terrainCalibration: TerrainDeformationCalibration = {
  maxDepth: 4.2,
  minFootprintRadius: 1.2,
  maxFootprintRadius: 12,
  energyForMaxDepth: 240_000,
  energyForMaxRadius: 90_000,
  baseRecoveryHalfLifeMs: 90_000,
  minimumRecoveryHalfLifeMs: 24_000,
  diffusionPerSecond: 0.05,
  maxSupportSpeed: 1.8,
};

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function normalizeAngle(angle: number): number {
  let value = angle;
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
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
  material.specularColor = new Color3(0.12, 0.12, 0.13);
  material.alpha = alpha;
  return material;
}

async function main(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#renderCanvas");
  const metrics = document.querySelector<HTMLElement>("#metrics");
  const resetButton = document.querySelector<HTMLButtonElement>("#reset");
  const maintainButton = document.querySelector<HTMLButtonElement>("#maintain");
  const migrateButton = document.querySelector<HTMLButtonElement>("#migrate");
  const miss2Button = document.querySelector<HTMLButtonElement>("#miss2");
  const miss3Button = document.querySelector<HTMLButtonElement>("#miss3");
  const dropButton = document.querySelector<HTMLButtonElement>("#drop");
  const bulgeButton = document.querySelector<HTMLButtonElement>("#bulge");
  if (!canvas || !metrics || !resetButton || !maintainButton || !migrateButton || !miss2Button || !miss3Button || !dropButton || !bulgeButton) {
    throw new Error("Tower terrain lab DOM is incomplete");
  }

  const engine = new Engine(canvas, true, { antialias: true, adaptToDeviceRatio: true });
  const scene = new Scene(engine);
  scene.clearColor.set(0.018, 0.012, 0.027, 1);

  const camera = new ArcRotateCamera(
    "tower-terrain-camera",
    -Math.PI / 2.35,
    1.06,
    104,
    new Vector3(0, 5, 0),
    scene,
  );
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 52;
  camera.upperRadiusLimit = 150;
  camera.lowerBetaLimit = 0.45;
  camera.upperBetaLimit = 1.42;

  const light = new HemisphericLight("ambient", new Vector3(0.2, 1, -0.15), scene);
  light.intensity = 0.9;

  const groundMaterial = createMaterial(
    "terrain",
    scene,
    new Color3(0.055, 0.045, 0.07),
    new Color3(0.008, 0.006, 0.012),
    0.91,
  );
  const towerMaterial = createMaterial(
    "tower",
    scene,
    new Color3(0.08, 0.36, 0.2),
    new Color3(0.012, 0.07, 0.03),
  );
  const towerActiveMaterial = createMaterial(
    "tower-active",
    scene,
    new Color3(0.1, 0.48, 0.31),
    new Color3(0.02, 0.12, 0.06),
  );
  const tealMaterial = createMaterial(
    "magma",
    scene,
    new Color3(0.04, 0.68, 0.67),
    new Color3(0.02, 0.5, 0.52),
    0.9,
  );
  tealMaterial.specularColor = new Color3(0.2, 0.9, 0.88);
  const dryMaterial = createMaterial(
    "dry",
    scene,
    new Color3(0.2, 0.12, 0.2),
    new Color3(0.03, 0.01, 0.03),
  );
  const targetMaterial = createMaterial(
    "target",
    scene,
    new Color3(0.32, 0.08, 0.42),
    new Color3(0.09, 0.01, 0.13),
  );
  targetMaterial.wireframe = true;
  const projectileMaterial = createMaterial(
    "projectile",
    scene,
    new Color3(0.92, 0.42, 0.11),
    new Color3(0.62, 0.18, 0.03),
  );

  const ground = MeshBuilder.CreateGround(
    "deformable-terrain",
    { width: TERRAIN_SIZE, height: TERRAIN_SIZE, subdivisions: TERRAIN_SUBDIVISIONS, updatable: true },
    scene,
  );
  ground.material = groundMaterial;

  const positions = Array.from(ground.getVerticesData(VertexBuffer.PositionKind) ?? []);
  const indices = Array.from(ground.getIndices() ?? []);
  const baselineHeights = new Array<number>(positions.length / 3);
  const depressionDepths = new Array<number>(positions.length / 3).fill(0);
  const upliftHeights = new Array<number>(positions.length / 3).fill(0);

  for (let index = 0; index < positions.length; index += 3) {
    const x = positions[index];
    const z = positions[index + 2];
    const y = 0.65 * Math.sin(x * 0.075) + 0.38 * Math.cos(z * 0.095) + 0.22 * Math.sin((x + z) * 0.13);
    positions[index + 1] = y;
    baselineHeights[index / 3] = y;
  }

  const updateTerrainMesh = () => {
    const normals = new Array<number>(positions.length).fill(0);
    for (let vertex = 0; vertex < baselineHeights.length; vertex += 1) {
      positions[vertex * 3 + 1] = baselineHeights[vertex] + upliftHeights[vertex] - depressionDepths[vertex];
    }
    VertexData.ComputeNormals(positions, indices, normals);
    ground.updateVerticesData(VertexBuffer.PositionKind, positions, true);
    ground.updateVerticesData(VertexBuffer.NormalKind, normals, true);
    ground.refreshBoundingInfo();
  };
  updateTerrainMesh();

  const sampleHeight = (x: number, z: number): number => {
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    for (let vertex = 0; vertex < baselineHeights.length; vertex += 1) {
      const dx = positions[vertex * 3] - x;
      const dz = positions[vertex * 3 + 2] - z;
      const distance = dx * dx + dz * dz;
      if (distance < best) {
        best = distance;
        nearest = vertex;
      }
    }
    return baselineHeights[nearest] + upliftHeights[nearest] - depressionDepths[nearest];
  };

  const stabilizationAt = (x: number, z: number, towerPositions: Vector3[]): number => {
    let value = 0;
    for (const towerPosition of towerPositions) {
      value = Math.max(
        value,
        structuralStabilization(
          Math.hypot(x - towerPosition.x, z - towerPosition.z),
          9,
          0.78,
        ),
      );
    }
    return value;
  };

  const stabilizeFoundation = (center: Vector3, radius = 7.5): void => {
    const affected: number[] = [];
    let average = 0;
    for (let vertex = 0; vertex < baselineHeights.length; vertex += 1) {
      const x = positions[vertex * 3];
      const z = positions[vertex * 3 + 2];
      const distance = Math.hypot(x - center.x, z - center.z);
      if (distance <= radius) {
        affected.push(vertex);
        average += baselineHeights[vertex] + upliftHeights[vertex] - depressionDepths[vertex];
      }
    }
    if (affected.length === 0) return;
    average /= affected.length;
    for (const vertex of affected) {
      const x = positions[vertex * 3];
      const z = positions[vertex * 3 + 2];
      const distance = Math.hypot(x - center.x, z - center.z);
      const influence = smoothstep(1 - distance / radius) * 0.48;
      const current = baselineHeights[vertex] + upliftHeights[vertex] - depressionDepths[vertex];
      baselineHeights[vertex] += (average - current) * influence;
    }
    updateTerrainMesh();
  };

  const towerPositions = [
    new Vector3(-28, 0, -8),
    new Vector3(3, 0, -29),
    new Vector3(30, 0, -8),
  ];

  const applyImpact = (
    x: number,
    z: number,
    effectiveMass: number,
    normalSpeed: number,
    bodyRadius: number,
  ): void => {
    const profile = terrainImpactProfile(
      {
        effectiveMass,
        normalSpeed,
        bodyRadius,
        compliance: 0.9,
        stabilization: stabilizationAt(x, z, towerPositions),
      },
      terrainCalibration,
    );
    for (let vertex = 0; vertex < depressionDepths.length; vertex += 1) {
      const dx = positions[vertex * 3] - x;
      const dz = positions[vertex * 3 + 2] - z;
      const added = radialDeformationDepth(Math.hypot(dx, dz), profile);
      depressionDepths[vertex] = accumulateDepression(
        depressionDepths[vertex],
        added,
        terrainCalibration.maxDepth,
      );
    }
    updateTerrainMesh();
  };

  const applyBulge = (x: number, z: number, radius: number, height: number): void => {
    for (let vertex = 0; vertex < upliftHeights.length; vertex += 1) {
      const dx = positions[vertex * 3] - x;
      const dz = positions[vertex * 3 + 2] - z;
      const distance = Math.hypot(dx, dz);
      if (distance >= radius) continue;
      const t = 1 - distance / radius;
      upliftHeights[vertex] += height * t * t;
    }
    updateTerrainMesh();
  };

  const silo = MeshBuilder.CreateBox("silo", { width: 20, depth: 20, height: 3 }, scene);
  silo.position.set(0, sampleHeight(0, 0) + 1.5, 0);
  silo.material = towerMaterial;
  const siloCore = MeshBuilder.CreateBox("silo-core", { width: 13, depth: 13, height: 1 }, scene);
  siloCore.position.set(0, silo.position.y + 2, 0);
  siloCore.material = tealMaterial;

  const sourceData = [
    { id: "west", position: new Vector3(-25, -6, -20) },
    { id: "south", position: new Vector3(6, -7, -37) },
    { id: "east", position: new Vector3(55, -7, -28) },
  ];
  const sources: MagmaSource[] = sourceData.map(({ id, position }) => {
    const mesh = MeshBuilder.CreateSphere(`magma-${id}`, { diameter: 5.5, segments: 7 }, scene);
    mesh.position.copyFrom(position);
    mesh.material = tealMaterial;
    return { id, position: mesh.position, mesh };
  });

  const target = MeshBuilder.CreateSphere("moving-raider-target", { diameter: 7, segments: 6 }, scene);
  target.material = targetMaterial;

  const towers: TowerModel[] = [];
  const projectiles: ProjectileModel[] = [];

  const disposeTower = (tower: TowerModel): void => {
    tower.conduit?.dispose();
    tower.root.dispose(false, true);
  };

  const createTower = (level: 1 | 2 | 3, x: number, z: number): TowerModel => {
    const root = new TransformNode(`tower-${level}-root`, scene);
    const groundY = sampleHeight(x, z);
    root.position.set(x, groundY, z);

    const base = MeshBuilder.CreateBox(`tower-${level}-base`, { width: 10, depth: 10, height: 3 }, scene);
    base.parent = root;
    base.position.y = 1.5;
    base.material = towerMaterial;
    base.scaling.set(0.05, 0.05, 0.05);

    let pillar: Mesh | undefined;
    let turret: Mesh | undefined;
    let drill: Mesh | undefined;
    if (level > 1) {
      pillar = MeshBuilder.CreateBox(
        `tower-${level}-pillar`,
        { width: level === 2 ? 1.5 : 2.2, depth: level === 2 ? 1.5 : 2.2, height: level === 2 ? 6 : 9 },
        scene,
      );
      pillar.parent = root;
      pillar.position.y = level === 2 ? 3 : 4.5;
      pillar.material = towerMaterial;
      pillar.scaling.y = 0.01;

      turret = MeshBuilder.CreateBox(
        `tower-${level}-turret`,
        { width: level === 2 ? 6 : 9, depth: level === 2 ? 7 : 11, height: 3 },
        scene,
      );
      turret.parent = root;
      turret.position.y = level === 2 ? 9 : 13.5;
      turret.material = dryMaterial;
      turret.scaling.set(0.04, 0.04, 0.04);

      drill = MeshBuilder.CreateCylinder(`tower-${level}-drill`, { height: 12, diameter: 0.45, tessellation: 7 }, scene);
      drill.parent = root;
      drill.position.y = -6;
      drill.material = dryMaterial;
      drill.scaling.y = 0.01;
    }

    const outward = new Vector3(x - SILO_POSITION.x, 0, z - SILO_POSITION.z);
    const restYaw = Math.atan2(outward.x, outward.z);
    if (turret) turret.rotation.y = restYaw;

    const model: TowerModel = {
      level,
      root,
      base,
      pillar,
      turret,
      drill,
      phase: "foundation",
      elapsed: 0,
      powered: level === 1,
      searchAttempted: level === 1,
      angularVelocity: 0,
      restYaw,
      aimError: 0,
      readyToFire: false,
    };
    towers.push(model);
    return model;
  };

  const connectTower = (tower: TowerModel, source: MagmaSource): void => {
    tower.conduit?.dispose();
    const start = tower.root.position.add(new Vector3(0, -0.2, 0));
    const end = source.position.clone();
    const midpoint = Vector3.Lerp(start, end, 0.5);
    midpoint.y -= 4.5;
    tower.conduit = MeshBuilder.CreateTube(
      `tower-${tower.level}-conduit`,
      { path: [start, midpoint, end], radius: tower.level === 3 ? 0.42 : 0.3, tessellation: 7 },
      scene,
    );
    tower.conduit.material = tealMaterial;
    tower.powered = true;
    tower.connectedSourceId = source.id;
    if (tower.turret) tower.turret.material = towerActiveMaterial;
    if (tower.drill) tower.drill.material = tealMaterial;
  };

  const searchForMagma = (tower: TowerModel): void => {
    tower.searchAttempted = true;
    if (tower.level === 1) return;
    let nearest: MagmaSource | undefined;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (const source of sources) {
      const distance = Vector3.Distance(tower.root.position, source.position);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = source;
      }
    }
    if (nearest && nearestDistance <= DRILL_REACH) {
      connectTower(tower, nearest);
    } else {
      tower.powered = false;
      tower.connectedSourceId = undefined;
      tower.conduit?.dispose();
      tower.conduit = undefined;
      if (tower.turret) tower.turret.material = dryMaterial;
      if (tower.drill) tower.drill.material = dryMaterial;
    }
  };

  const buildAll = (): void => {
    for (const tower of towers.splice(0)) disposeTower(tower);
    towerPositions.forEach((position) => stabilizeFoundation(position));
    createTower(1, towerPositions[0].x, towerPositions[0].z);
    createTower(2, towerPositions[1].x, towerPositions[1].z);
    createTower(3, towerPositions[2].x, towerPositions[2].z);
  };
  buildAll();

  const deploymentCompleteAt = (level: number): number => (level === 1 ? 1.8 : level === 2 ? 4.1 : 5.4);

  const updateTowerDeployment = (tower: TowerModel, dt: number): void => {
    tower.elapsed += dt;
    const baseStart = 0.25;
    const baseEnd = tower.level === 1 ? 1.55 : 1.5;
    const baseT = smoothstep((tower.elapsed - baseStart) / (baseEnd - baseStart));
    tower.base.scaling.set(0.05 + baseT * 0.95, 0.05 + baseT * 0.95, 0.05 + baseT * 0.95);

    if (tower.level === 1) {
      tower.phase = tower.elapsed < baseEnd ? "base" : "ready";
      return;
    }

    const drillStart = 1.0;
    const drillEnd = tower.level === 2 ? 2.35 : 2.8;
    const drillT = smoothstep((tower.elapsed - drillStart) / (drillEnd - drillStart));
    if (tower.drill) tower.drill.scaling.y = Math.max(0.01, drillT);

    const pillarStart = tower.level === 2 ? 1.65 : 2.0;
    const pillarEnd = tower.level === 2 ? 2.9 : 3.65;
    const pillarT = smoothstep((tower.elapsed - pillarStart) / (pillarEnd - pillarStart));
    if (tower.pillar) tower.pillar.scaling.y = Math.max(0.01, pillarT);

    const turretStart = tower.level === 2 ? 2.45 : 3.15;
    const turretEnd = tower.level === 2 ? 3.55 : 4.65;
    const turretT = smoothstep((tower.elapsed - turretStart) / (turretEnd - turretStart));
    if (tower.turret) tower.turret.scaling.set(Math.max(0.04, turretT), Math.max(0.04, turretT), Math.max(0.04, turretT));

    if (tower.elapsed < drillStart) tower.phase = "base";
    else if (tower.elapsed < pillarStart) tower.phase = "drilling";
    else if (tower.elapsed < turretEnd) tower.phase = "assembly";
    else if (tower.elapsed < deploymentCompleteAt(tower.level)) tower.phase = "calibrating";
    else if (tower.powered) tower.phase = "ready";
    else tower.phase = "dry";

    if (!tower.searchAttempted && tower.elapsed >= drillEnd) searchForMagma(tower);
  };

  const updateTurret = (tower: TowerModel, dt: number): void => {
    if (!tower.turret || tower.elapsed < (tower.level === 2 ? 3.55 : 4.65)) return;
    const dx = target.position.x - tower.root.position.x;
    const dz = target.position.z - tower.root.position.z;
    const desiredYaw = Math.atan2(dx, dz);
    const error = normalizeAngle(desiredYaw - tower.turret.rotation.y);
    const maxSpeed = tower.level === 2 ? 2.45 : 1.15;
    const acceleration = tower.level === 2 ? 6.8 : 2.2;
    const brakingDistance = (tower.angularVelocity * tower.angularVelocity) / (2 * Math.max(0.001, acceleration));
    const desiredSign = Math.sign(error);
    const shouldBrake = Math.abs(error) <= brakingDistance + 0.025;
    const desiredVelocity = shouldBrake ? 0 : desiredSign * maxSpeed;
    const velocityDelta = desiredVelocity - tower.angularVelocity;
    const maxVelocityChange = acceleration * dt;
    tower.angularVelocity += Math.max(-maxVelocityChange, Math.min(maxVelocityChange, velocityDelta));
    tower.turret.rotation.y = normalizeAngle(tower.turret.rotation.y + tower.angularVelocity * dt);
    tower.aimError = Math.abs(normalizeAngle(desiredYaw - tower.turret.rotation.y));
    tower.readyToFire = tower.powered && tower.phase === "ready" && tower.aimError < (tower.level === 2 ? 0.09 : 0.055);
  };

  const spawnMiss = (tower: TowerModel): void => {
    if (!tower.turret) return;
    const projectile = MeshBuilder.CreateSphere(
      `miss-${tower.level}-${projectiles.length}`,
      { diameter: tower.level === 2 ? 1.0 : 1.55, segments: 5 },
      scene,
    );
    projectile.position.copyFrom(tower.root.position.add(tower.turret.position));
    projectile.material = projectileMaterial;
    const yaw = tower.turret.rotation.y + (tower.level === 2 ? 0.24 : -0.18);
    const speed = tower.level === 2 ? 34 : 42;
    const velocity = new Vector3(Math.sin(yaw) * speed, -6.5, Math.cos(yaw) * speed);
    projectiles.push({
      mesh: projectile,
      velocity,
      effectiveMass: tower.level === 2 ? 120 : 270,
      bodyRadius: tower.level === 2 ? 0.8 : 1.35,
    });
  };

  const updateProjectiles = (dt: number): void => {
    for (let index = projectiles.length - 1; index >= 0; index -= 1) {
      const projectile = projectiles[index];
      projectile.velocity.y -= 12 * dt;
      projectile.mesh.position.addInPlace(projectile.velocity.scale(dt));
      const groundY = sampleHeight(projectile.mesh.position.x, projectile.mesh.position.z);
      if (projectile.mesh.position.y <= groundY + projectile.bodyRadius * 0.2) {
        applyImpact(
          projectile.mesh.position.x,
          projectile.mesh.position.z,
          projectile.effectiveMass,
          Math.abs(projectile.velocity.y),
          projectile.bodyRadius,
        );
        projectile.mesh.dispose();
        projectiles.splice(index, 1);
      } else if (Math.abs(projectile.mesh.position.x) > 75 || Math.abs(projectile.mesh.position.z) > 75) {
        projectile.mesh.dispose();
        projectiles.splice(index, 1);
      }
    }
  };

  let targetTime = 0;
  const updateTarget = (dt: number): void => {
    targetTime += dt;
    const radius = 35 + Math.sin(targetTime * 0.44) * 8;
    const angle = targetTime * 0.72;
    target.position.set(
      Math.cos(angle) * radius,
      sampleHeight(Math.cos(angle) * radius, Math.sin(angle) * radius) + 5,
      Math.sin(angle) * radius,
    );
  };

  const renovateDryT3 = (): void => {
    const tower = towers.find((candidate) => candidate.level === 3);
    if (!tower) return;
    tower.phase = "renovating";
    tower.searchAttempted = false;
    tower.powered = false;
    tower.elapsed = 4.1;
    if (tower.drill) {
      tower.drill.scaling.y = 0.25;
      tower.drill.material = dryMaterial;
    }
  };

  const migrateMagma = (): void => {
    const east = sources.find((source) => source.id === "east");
    if (!east) return;
    east.mesh.position.set(38, -7, -15);
  };

  resetButton.addEventListener("click", buildAll);
  maintainButton.addEventListener("click", renovateDryT3);
  migrateButton.addEventListener("click", migrateMagma);
  miss2Button.addEventListener("click", () => {
    const tower = towers.find((candidate) => candidate.level === 2);
    if (tower) spawnMiss(tower);
  });
  miss3Button.addEventListener("click", () => {
    const tower = towers.find((candidate) => candidate.level === 3);
    if (tower) spawnMiss(tower);
  });
  dropButton.addEventListener("click", () => applyImpact(-11, 24, 48_600, 8.5, 7));
  bulgeButton.addEventListener("click", () => applyBulge(18, 20, 14, 2.2));

  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r") buildAll();
    if (event.key.toLowerCase() === "m") renovateDryT3();
    if (event.key.toLowerCase() === "g") migrateMagma();
    if (event.key === "2") {
      const tower = towers.find((candidate) => candidate.level === 2);
      if (tower) spawnMiss(tower);
    }
    if (event.key === "3") {
      const tower = towers.find((candidate) => candidate.level === 3);
      if (tower) spawnMiss(tower);
    }
    if (event.key.toLowerCase() === "d") applyImpact(-11, 24, 48_600, 8.5, 7);
    if (event.key.toLowerCase() === "v") applyBulge(18, 20, 14, 2.2);
  });

  engine.runRenderLoop(() => {
    const dt = Math.min(MAX_DT, engine.getDeltaTime() / 1000);
    updateTarget(dt);
    for (const tower of towers) {
      if (tower.phase === "renovating") {
        tower.elapsed += dt;
        if (tower.elapsed >= 5.0 && !tower.searchAttempted) {
          searchForMagma(tower);
          tower.phase = tower.powered ? "ready" : "dry";
        }
      } else {
        updateTowerDeployment(tower, dt);
      }
      updateTurret(tower, dt);
    }
    updateProjectiles(dt);

    const towerLines = towers.map((tower) => {
      const power = tower.level === 1 ? "passive" : tower.powered ? `source:${tower.connectedSourceId}` : "DRY";
      const slew = tower.turret ? ` err:${(tower.aimError * 180 / Math.PI).toFixed(1)}° ω:${tower.angularVelocity.toFixed(2)}` : "";
      return `T${tower.level} ${tower.phase.padEnd(11)} ${power.padEnd(13)}${slew}${tower.readyToFire ? " READY" : ""}`;
    });
    metrics.textContent = [
      "TOWER / TERRAIN PHYSICS LAB",
      ...towerLines,
      `projectiles: ${projectiles.length}`,
      `east magma: (${sources[2].mesh.position.x.toFixed(0)}, ${sources[2].mesh.position.z.toFixed(0)})`,
      `FPS: ${engine.getFps().toFixed(0)} | meshes: ${scene.meshes.length}`,
    ].join("\n");

    scene.render();
  });

  window.addEventListener("resize", () => engine.resize());
}

void main();
