export type RendererPreference = "auto" | "webgpu" | "webgl";

export function parseRendererPreference(search: string): RendererPreference {
  const value = new URLSearchParams(search).get("renderer")?.toLowerCase();
  if (value === "webgpu" || value === "webgl") {
    return value;
  }
  return "auto";
}
