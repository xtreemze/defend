export type VisualRole =
  | "terrain"
  | "structure"
  | "raider"
  | "damage-structural"
  | "damage-impact"
  | "projectile"
  | "energy"
  | "lava";

export type SurfaceTreatment = "skeletal" | "filled";

const FILLED_ROLES = new Set<VisualRole>([
  "damage-impact",
  "projectile",
  "energy",
  "lava",
]);

export function surfaceTreatmentFor(role: VisualRole): SurfaceTreatment {
  return FILLED_ROLES.has(role) ? "filled" : "skeletal";
}

export function applyVisualRole<T extends { wireframe: boolean }>(
  material: T,
  role: VisualRole,
): T {
  material.wireframe = surfaceTreatmentFor(role) === "skeletal";
  return material;
}
