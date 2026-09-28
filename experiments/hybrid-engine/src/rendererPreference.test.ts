import { describe, expect, it } from "vitest";
import { parseRendererPreference } from "./rendererPreference";

describe("renderer preference", () => {
  it("defaults to auto when no renderer is requested", () => {
    expect(parseRendererPreference("")).toBe("auto");
    expect(parseRendererPreference("?inspect=1")).toBe("auto");
  });

  it("accepts explicit WebGPU and WebGL requests", () => {
    expect(parseRendererPreference("?renderer=webgpu")).toBe("webgpu");
    expect(parseRendererPreference("?renderer=webgl")).toBe("webgl");
    expect(parseRendererPreference("?renderer=WEBGPU")).toBe("webgpu");
  });

  it("fails unknown renderer values closed to auto selection", () => {
    expect(parseRendererPreference("?renderer=canvas")).toBe("auto");
    expect(parseRendererPreference("?renderer=")).toBe("auto");
  });
});
