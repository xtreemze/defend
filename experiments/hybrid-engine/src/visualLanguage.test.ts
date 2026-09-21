import { describe, expect, it } from "vitest";
import {
  applyVisualRole,
  surfaceTreatmentFor,
  type VisualRole,
} from "./visualLanguage";

describe("historical visual language", () => {
  it.each<VisualRole>([
    "terrain",
    "structure",
    "raider",
    "damage-structural",
  ])("keeps %s geometry skeletal", (role) => {
    expect(surfaceTreatmentFor(role)).toBe("skeletal");
  });

  it.each<VisualRole>([
    "damage-impact",
    "projectile",
    "energy",
    "lava",
  ])("allows %s to use filled surfaces", (role) => {
    expect(surfaceTreatmentFor(role)).toBe("filled");
  });

  it("applies the role to Babylon-compatible materials without coupling the policy to Babylon", () => {
    const material = { wireframe: false };
    expect(applyVisualRole(material, "raider")).toBe(material);
    expect(material.wireframe).toBe(true);
    applyVisualRole(material, "projectile");
    expect(material.wireframe).toBe(false);
  });
});
