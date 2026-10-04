export type RendererPreference = "auto" | "webgpu" | "webgl";

export function parseRendererPreference(search: string): RendererPreference {
  const value = new URLSearchParams(search).get("renderer")?.toLowerCase();
  if (value === "webgpu" || value === "webgl") {
    return value;
  }
  return "auto";
}

/**
 * Showcase capture reads the canvas with toDataURL(), which returns a blank
 * image unless the WebGL drawing buffer is preserved. `?capture` opts in and
 * forces WebGL; normal play keeps the cheaper default.
 */
export function wantsDrawingBufferCapture(search: string): boolean {
  return new URLSearchParams(search).has("capture");
}
