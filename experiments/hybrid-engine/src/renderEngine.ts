import { Engine } from "@babylonjs/core/pure";
import type { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import {
  parseRendererPreference,
  wantsDrawingBufferCapture,
  type RendererPreference,
} from "./rendererPreference";

export type RendererBackend = "webgpu" | "webgl";
export type RendererFallbackReason =
  | "webgpu-unavailable"
  | "webgpu-initialization-failed";

export interface RendererSelection {
  engine: Engine | WebGPUEngine;
  requested: RendererPreference;
  backend: RendererBackend;
  fallbackReason?: RendererFallbackReason;
}

const ENGINE_OPTIONS = {
  adaptToDeviceRatio: true,
  antialias: true,
} as const;

function exposeRendererSelection(selection: RendererSelection): void {
  document.documentElement.dataset.renderer = selection.backend;
  document.documentElement.dataset.rendererRequested = selection.requested;
  if (selection.fallbackReason) {
    document.documentElement.dataset.rendererFallback =
      selection.fallbackReason;
  } else {
    delete document.documentElement.dataset.rendererFallback;
  }
}

async function tryCreateWebGpuEngine(
  canvas: HTMLCanvasElement,
): Promise<
  | { engine: WebGPUEngine }
  | { fallbackReason: RendererFallbackReason }
> {
  const { WebGPUEngine } = await import(
    "@babylonjs/core/Engines/webgpuEngine"
  );

  if (!(await WebGPUEngine.IsSupportedAsync)) {
    return { fallbackReason: "webgpu-unavailable" };
  }

  const engine = new WebGPUEngine(canvas, ENGINE_OPTIONS);
  try {
    await engine.initAsync();
    return { engine };
  } catch (error) {
    engine.dispose();
    console.warn(
      "WebGPU initialization failed; falling back to WebGL.",
      error,
    );
    return { fallbackReason: "webgpu-initialization-failed" };
  }
}

export async function createRenderEngine(
  canvas: HTMLCanvasElement,
  search = window.location.search,
): Promise<RendererSelection> {
  const capture = wantsDrawingBufferCapture(search);
  const requested = capture ? "webgl" : parseRendererPreference(search);
  let fallbackReason: RendererFallbackReason | undefined;

  if (requested !== "webgl") {
    const webgpu = await tryCreateWebGpuEngine(canvas);
    if ("engine" in webgpu) {
      const selection: RendererSelection = {
        engine: webgpu.engine,
        requested,
        backend: "webgpu",
      };
      exposeRendererSelection(selection);
      return selection;
    }
    fallbackReason = webgpu.fallbackReason;
  }

  const selection: RendererSelection = {
    engine: new Engine(
      canvas,
      true,
      capture ? { ...ENGINE_OPTIONS, preserveDrawingBuffer: true } : ENGINE_OPTIONS,
    ),
    requested,
    backend: "webgl",
    ...(fallbackReason ? { fallbackReason } : {}),
  };
  exposeRendererSelection(selection);
  return selection;
}

export function rendererDiagnosticLabel(
  selection: RendererSelection,
): string {
  if (!selection.fallbackReason) {
    return selection.requested === "auto"
      ? `${selection.backend} (auto)`
      : `${selection.backend} (requested)`;
  }
  return `${selection.backend} (fallback: ${selection.fallbackReason})`;
}
