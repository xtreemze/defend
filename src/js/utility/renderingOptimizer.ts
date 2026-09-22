/**
 * Rendering optimization manager
 * Dynamically adjusts rendering quality based on performance metrics
 */

import { GlowLayer, Scene } from "../utility/babylonOptimized";
import { renderGlobals } from "../main/globalVariables";

export class RenderingOptimizer {
  private glowLayer: GlowLayer | null = null;
  private scene: Scene;
  private frameCount = 0;
  private fpsHistory: number[] = [];
  private currentIntensity: number;
  private currentKernelSize: number;
  private performanceDropDetected = false;
  private lastFPS = 120;

  constructor(scene: Scene, glowLayer: GlowLayer | null, initialIntensity: number, initialKernelSize: number) {
    this.scene = scene;
    this.glowLayer = glowLayer;
    this.currentIntensity = initialIntensity;
    this.currentKernelSize = initialKernelSize;
  }

  /**
   * Update rendering optimizer with current FPS
   * Detects performance issues and adjusts quality
   */
  updatePerformance(currentFPS: number): void {
    this.lastFPS = currentFPS;
    this.fpsHistory.push(currentFPS);

    // Keep only last 60 frames in history
    if (this.fpsHistory.length > 60) {
      this.fpsHistory.shift();
    }

    // Check for performance drops every 60 frames
    if (this.frameCount % 60 === 0 && this.fpsHistory.length >= 30) {
      this.analyzePerformance();
    }

    this.frameCount++;
  }

  /**
   * Analyze performance and adjust rendering quality
   */
  private analyzePerformance(): void {
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    const minFPS = Math.min(...this.fpsHistory);

    // Detect performance drop: FPS below target or high variance
    const hasPerformanceDrop = minFPS < 80 || (120 - minFPS) > 30;

    if (hasPerformanceDrop && !this.performanceDropDetected) {
      this.performanceDropDetected = true;
      this.reduceQuality();
    } else if (!hasPerformanceDrop && this.performanceDropDetected) {
      this.performanceDropDetected = false;
      this.increaseQuality();
    }
  }

  /**
   * Reduce rendering quality to improve performance
   */
  private reduceQuality(): void {
    if (!this.glowLayer) return;

    // Step 1: Reduce glow intensity
    if (this.currentIntensity > 0.5) {
      this.currentIntensity = Math.max(0.5, this.currentIntensity - 0.3);
      this.glowLayer.intensity = this.currentIntensity;
      console.log(`[RenderingOptimizer] Reduced glow intensity to ${this.currentIntensity.toFixed(2)}`);
      return;
    }

    // Step 2: Reduce glow kernel size
    if (this.currentKernelSize > 4) {
      this.currentKernelSize = Math.max(4, this.currentKernelSize - 4);
      console.log(`[RenderingOptimizer] Reduced glow kernel size (would need recreation)`);
      return;
    }

    // Step 3: Disable glow if still struggling
    if (this.glowLayer && this.glowLayer.isEnabled) {
      this.glowLayer.isEnabled = false;
      console.log(`[RenderingOptimizer] Disabled glow layer for performance`);
    }
  }

  /**
   * Increase rendering quality when performance allows
   */
  private increaseQuality(): void {
    if (!this.glowLayer) return;

    // Step 1: Re-enable glow if disabled
    if (this.glowLayer && !this.glowLayer.isEnabled) {
      this.glowLayer.isEnabled = true;
      this.currentIntensity = 0.5;
      console.log(`[RenderingOptimizer] Re-enabled glow layer`);
      return;
    }

    // Step 2: Increase glow intensity
    if (this.currentIntensity < renderGlobals.glowIntensity) {
      this.currentIntensity = Math.min(renderGlobals.glowIntensity, this.currentIntensity + 0.2);
      this.glowLayer.intensity = this.currentIntensity;
      console.log(`[RenderingOptimizer] Increased glow intensity to ${this.currentIntensity.toFixed(2)}`);
    }
  }

  /**
   * Get rendering statistics
   */
  getStats(): {
    lastFPS: number;
    averageFPS: number;
    minFPS: number;
    glowIntensity: number;
    glowKernelSize: number;
    glowEnabled: boolean;
    performanceDropDetected: boolean;
  } {
    const avgFPS = this.fpsHistory.length > 0
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
      : 0;
    const minFPS = this.fpsHistory.length > 0 ? Math.min(...this.fpsHistory) : 0;

    const glowEnabled = this.glowLayer && this.glowLayer.isEnabled ? true : false;

    return {
      lastFPS: this.lastFPS,
      averageFPS: avgFPS,
      minFPS,
      glowIntensity: this.currentIntensity,
      glowKernelSize: this.currentKernelSize,
      glowEnabled,
      performanceDropDetected: this.performanceDropDetected
    };
  }

  /**
   * Dispose rendering optimizer
   */
  dispose(): void {
    this.fpsHistory = [];
    this.glowLayer = null;
  }
}

// Global rendering optimizer instance
let globalRenderingOptimizer: RenderingOptimizer | null = null;

export function getGlobalRenderingOptimizer(): RenderingOptimizer | null {
  return globalRenderingOptimizer;
}

export function initializeGlobalRenderingOptimizer(
  scene: Scene,
  glowLayer: GlowLayer | null,
  initialIntensity: number,
  initialKernelSize: number
): RenderingOptimizer {
  if (!globalRenderingOptimizer) {
    globalRenderingOptimizer = new RenderingOptimizer(scene, glowLayer, initialIntensity, initialKernelSize);
  }
  return globalRenderingOptimizer;
}

export function disposeGlobalRenderingOptimizer(): void {
  if (globalRenderingOptimizer) {
    globalRenderingOptimizer.dispose();
    globalRenderingOptimizer = null;
  }
}
