/**
 * Manages pooling of fragment instances to reduce mesh allocation overhead
 * Pre-allocates fragment meshes and reuses them via acquire/release
 */

import { Mesh, MeshBuilder, Scene } from "../utility/babylonOptimized";

interface PooledFragment {
  mesh: Mesh;
  inUse: boolean;
}

export class FragmentPoolManager {
  private pool: PooledFragment[] = [];
  private poolSize = 64;
  private scene: Scene;
  private createdCount = 0;
  private reuseCount = 0;

  constructor(scene: Scene) {
    this.scene = scene;
    this.initializePool();
  }

  /**
   * Initialize fragment pool with pre-allocated meshes
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const fragment = MeshBuilder.CreateBox(`fragment_pool_${i}`, {
        size: 0.1
      }, this.scene) as Mesh;
      fragment.setEnabled(false);
      this.pool.push({
        mesh: fragment,
        inUse: false
      });
      this.createdCount++;
    }
  }

  /**
   * Acquire a fragment mesh from the pool
   */
  acquireFragment(): Mesh | null {
    // Find available fragment
    let pooled = this.pool.find(p => !p.inUse);

    if (!pooled) {
      // Expand pool if needed
      if (this.pool.length < this.poolSize * 2) {
        const fragment = MeshBuilder.CreateBox(`fragment_dynamic_${this.pool.length}`, {
          size: 0.1
        }, this.scene) as Mesh;
        fragment.setEnabled(false);
        pooled = {
          mesh: fragment,
          inUse: false
        };
        this.pool.push(pooled);
        this.createdCount++;
      } else {
        // Pool is full
        return null;
      }
    }

    pooled.inUse = true;
    pooled.mesh.setEnabled(true);
    this.reuseCount++;
    return pooled.mesh;
  }

  /**
   * Release a fragment mesh back to the pool
   */
  releaseFragment(mesh: Mesh): void {
    const pooled = this.pool.find(p => p.mesh === mesh);
    if (pooled) {
      pooled.inUse = false;
      mesh.setEnabled(false);
      // Reset position and rotation for next use
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.scaling.set(1, 1, 1);
      if (mesh.material) {
        mesh.material = null;
      }
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    total: number;
    inUse: number;
    available: number;
    createdCount: number;
    reuseCount: number;
    reusePct: number;
  } {
    const inUse = this.pool.filter(p => p.inUse).length;
    const totalAllocations = this.createdCount + this.reuseCount;
    const reusePct = totalAllocations > 0 ? Math.round((this.reuseCount / totalAllocations) * 100) : 0;

    return {
      total: this.pool.length,
      inUse,
      available: this.pool.length - inUse,
      createdCount: this.createdCount,
      reuseCount: this.reuseCount,
      reusePct
    };
  }

  /**
   * Dispose all pooled fragments
   */
  dispose(): void {
    this.pool.forEach(p => {
      try {
        p.mesh.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.pool = [];
  }
}

// Global fragment pool instance
let globalFragmentPool: FragmentPoolManager | null = null;

export function getGlobalFragmentPoolManager(scene: Scene): FragmentPoolManager {
  if (!globalFragmentPool) {
    globalFragmentPool = new FragmentPoolManager(scene);
  }
  return globalFragmentPool;
}

export function disposeGlobalFragmentPool(): void {
  if (globalFragmentPool) {
    globalFragmentPool.dispose();
    globalFragmentPool = null;
  }
}
