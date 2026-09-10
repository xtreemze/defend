/**
 * Real-time performance monitoring utility
 * Tracks FPS, frame time, memory usage, and other metrics
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTime = 16.67;
  private minFps = 60;
  private maxFrameTime = 0;
  private isMonitoring = false;

  /**
   * Start monitoring performance
   */
  start(): void {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.minFps = 60;
    this.maxFrameTime = 0;
  }

  /**
   * Update metrics (call once per frame)
   */
  update(): void {
    if (!this.isMonitoring) return;

    this.frameCount++;
    const now = performance.now();
    const deltaTime = now - this.lastTime;

    // Update frame time
    this.frameTime = deltaTime;
    this.maxFrameTime = Math.max(this.maxFrameTime, deltaTime);

    // Update FPS every second
    if (this.frameCount >= 60) {
      this.fps = Math.round(1000 / (deltaTime / 60));
      this.minFps = Math.min(this.minFps, this.fps);
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  /**
   * Stop monitoring and get final stats
   */
  stop(): PerformanceStats {
    this.isMonitoring = false;
    return this.getStats();
  }

  /**
   * Get current performance statistics
   */
  getStats(): PerformanceStats {
    const perfMemory = (performance as any).memory;
    const memoryStats = perfMemory
      ? {
          usedJSHeap: Math.round(perfMemory.usedJSHeapSize / 1024 / 1024),
          totalJSHeap: Math.round(perfMemory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(perfMemory.jsHeapSizeLimit / 1024 / 1024)
        }
      : null;

    return {
      fps: this.fps,
      frameTime: Math.round(this.frameTime * 100) / 100,
      minFps: this.minFps,
      maxFrameTime: Math.round(this.maxFrameTime * 100) / 100,
      memory: memoryStats
    };
  }

  /**
   * Log performance stats to console
   */
  logStats(): void {
    const stats = this.getStats();
    console.log(
      `Performance - FPS: ${stats.fps} (min: ${stats.minFps}), Frame time: ${stats.frameTime}ms (max: ${stats.maxFrameTime}ms)`
    );
    if (stats.memory) {
      console.log(
        `Memory - Used: ${stats.memory.usedJSHeap}MB / ${stats.memory.totalJSHeap}MB (limit: ${stats.memory.limit}MB)`
      );
    }
  }
}

export interface PerformanceStats {
  fps: number;
  frameTime: number;
  minFps: number;
  maxFrameTime: number;
  memory: {
    usedJSHeap: number;
    totalJSHeap: number;
    limit: number;
  } | null;
}

// Global monitor instance
let globalMonitor: PerformanceMonitor | null = null;

export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new PerformanceMonitor();
  }
  return globalMonitor;
}
