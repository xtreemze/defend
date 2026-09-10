/**
 * Orchestrates lazy loading of game features to improve initial load time
 * Defers non-critical modules and preloads them in background
 */

import { Scene, PhysicsEngine } from "../utility/babylonOptimized";
import { getGlobalLazyLoader, LazyModule } from "./lazyLoader";

export interface LazyGameModules {
  towers: boolean;
  projectiles: boolean;
  renderPipeline: boolean;
}

class LazyLoadingOrchestrator {
  private loaded: LazyGameModules = {
    towers: false,
    projectiles: false,
    renderPipeline: false
  };

  /**
   * Load all critical modules needed to start gameplay
   */
  async loadGameplayModules(scene: Scene, canvas: HTMLCanvasElement): Promise<void> {
    const loader = getGlobalLazyLoader();

    // Load towers and projectiles in parallel
    await Promise.all([
      this.loadTowers(scene),
      this.loadProjectiles(),
      this.loadRenderPipeline(scene)
    ]);
  }

  /**
   * Load tower creation instances
   */
  private async loadTowers(scene: Scene): Promise<void> {
    if (this.loaded.towers) return;

    const loader = getGlobalLazyLoader();

    // Load tower instances
    const towerModule = await loader.load("towers", () => import("../tower/createTowerInstance"));
    const { createTowerBaseInstance, createTurretInstanceL2, createTurretInstanceL3 } = towerModule;

    // Load indicator instances
    const indicatorModule = await loader.load("indicators", () => import("../tower/indicatorInstance"));
    const { createIndicatorInstance } = indicatorModule;

    createIndicatorInstance();
    createTowerBaseInstance();
    createTurretInstanceL2(scene);
    createTurretInstanceL3(scene);

    this.loaded.towers = true;
  }

  /**
   * Load projectile instances
   */
  private async loadProjectiles(): Promise<void> {
    if (this.loaded.projectiles) return;

    const loader = getGlobalLazyLoader();
    const projectileLoader: LazyModule = () => import("../projectile/createProjectileInstance");

    const projectileModule = await loader.load("projectiles", projectileLoader);
    const { createProjectileInstances } = projectileModule;

    createProjectileInstances();

    this.loaded.projectiles = true;
  }

  /**
   * Load rendering pipeline
   */
  private async loadRenderPipeline(scene: Scene): Promise<void> {
    if (this.loaded.renderPipeline) return;

    const loader = getGlobalLazyLoader();
    const pipelineLoader: LazyModule = () => import("../main/renderPipeline");

    const pipelineModule = await loader.load("renderPipeline", pipelineLoader);
    const { renderPipeline } = pipelineModule;

    renderPipeline(scene);

    this.loaded.renderPipeline = true;
  }

  /**
   * Preload modules in the background without blocking
   * Useful for preloading features while title screen is showing
   */
  async preloadGameplayModules(scene: Scene): Promise<void> {
    const loader = getGlobalLazyLoader();

    // Preload without awaiting - silently queue in background
    loader.preload("towers", () => import("../tower/createTowerInstance"));
    loader.preload("indicators", () => import("../tower/indicatorInstance"));
    loader.preload("projectiles", () => import("../projectile/createProjectileInstance"));
    loader.preload("renderPipeline", () => import("../main/renderPipeline"));
  }

  /**
   * Check if all gameplay modules are loaded
   */
  isReady(): boolean {
    return this.loaded.towers && this.loaded.projectiles && this.loaded.renderPipeline;
  }

  /**
   * Get loading statistics
   */
  getStats(): { loaded: LazyGameModules; cacheStats: { cached: number; total: number } } {
    const loader = getGlobalLazyLoader();
    return {
      loaded: this.loaded,
      cacheStats: loader.getStats()
    };
  }
}

// Global orchestrator instance
let globalOrchestrator: LazyLoadingOrchestrator | null = null;

export function getGlobalLazyLoadingOrchestrator(): LazyLoadingOrchestrator {
  if (!globalOrchestrator) {
    globalOrchestrator = new LazyLoadingOrchestrator();
  }
  return globalOrchestrator;
}
