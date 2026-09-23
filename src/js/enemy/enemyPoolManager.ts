/**
 * Manages pooling of enemy instances to reduce mesh allocation overhead
 * Pre-allocates enemy meshes per level and reuses them via acquire/release
 */

import { Mesh, MeshBuilder, Scene, InstancedMesh } from "../utility/babylonOptimized";

interface PooledEnemy {
  mesh: Mesh | InstancedMesh;
  inUse: boolean;
  level: number;
}

export class EnemyPoolManager {
  private pools: Map<number, PooledEnemy[]> = new Map();
  private baseMeshes: Map<number, Mesh> = new Map();
  private poolSizePerLevel = 16;
  private scene: Scene;
  private createdCount = 0;
  private reuseCount = 0;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Initialize base meshes and pools for a level
   */
  initializeLevel(level: number): void {
    if (this.pools.has(level)) {
      return; // Already initialized
    }

    const diameter = (level * level + 5) as number;

    // Create base mesh template
    const baseMesh = MeshBuilder.CreateIcoSphere(
      `enemyBaseMeshL${level}`,
      {
        subdivisions: level,
        radius: diameter / 2,
        updatable: false
      },
      this.scene
    ) as Mesh;
    baseMesh.setEnabled(false);
    this.baseMeshes.set(level, baseMesh);

    // Create instance pool for this level
    const pool: PooledEnemy[] = [];
    for (let i = 0; i < this.poolSizePerLevel; i++) {
      const instance = baseMesh.createInstance(`enemy_l${level}_pool_${i}`) as InstancedMesh;
      instance.setEnabled(false);
      pool.push({
        mesh: instance,
        inUse: false,
        level
      });
      this.createdCount++;
    }
    this.pools.set(level, pool);
  }

  /**
   * Acquire an enemy mesh from the pool
   */
  acquireEnemy(level: number): Mesh | InstancedMesh | null {
    // Initialize pool if needed
    if (!this.pools.has(level)) {
      this.initializeLevel(level);
    }

    const pool = this.pools.get(level);
    if (!pool) return null;

    // Find available instance
    let pooled = pool.find(p => !p.inUse);

    if (!pooled) {
      // Expand pool if needed
      const baseMesh = this.baseMeshes.get(level);
      if (baseMesh && pool.length < this.poolSizePerLevel * 2) {
        const instance = baseMesh.createInstance(`enemy_l${level}_dynamic_${pool.length}`) as InstancedMesh;
        instance.setEnabled(false);
        pooled = {
          mesh: instance,
          inUse: false,
          level
        };
        pool.push(pooled);
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
   * Release an enemy mesh back to the pool
   */
  releaseEnemy(mesh: Mesh | InstancedMesh, level: number): void {
    const pool = this.pools.get(level);
    if (!pool) return;

    const pooled = pool.find(p => p.mesh === mesh);
    if (pooled) {
      pooled.inUse = false;
      mesh.setEnabled(false);
      // Reset position and rotation for next use
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      if (mesh.physicsImpostor) {
        mesh.physicsImpostor.setLinearVelocity(undefined as any);
        mesh.physicsImpostor.setAngularVelocity(undefined as any);
      }
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    pools: { [key: number]: { total: number; inUse: number; available: number } };
    createdCount: number;
    reuseCount: number;
    reusePct: number;
  } {
    const stats: any = { pools: {} };

    this.pools.forEach((pool, level) => {
      const inUse = pool.filter(p => p.inUse).length;
      stats.pools[level] = {
        total: pool.length,
        inUse,
        available: pool.length - inUse
      };
    });

    const totalAllocations = this.createdCount + this.reuseCount;
    const reusePct = totalAllocations > 0 ? Math.round((this.reuseCount / totalAllocations) * 100) : 0;

    return {
      ...stats,
      createdCount: this.createdCount,
      reuseCount: this.reuseCount,
      reusePct
    };
  }

  /**
   * Dispose all pooled enemies
   */
  dispose(): void {
    this.baseMeshes.forEach(mesh => {
      try {
        mesh.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.pools.forEach(pool => {
      pool.forEach(p => {
        try {
          p.mesh.dispose();
        } catch (e) {
          // Ignore disposal errors
        }
      });
    });
    this.pools.clear();
    this.baseMeshes.clear();
  }
}

// Global enemy pool instance
let globalEnemyPool: EnemyPoolManager | null = null;

export function getGlobalEnemyPoolManager(scene: Scene): EnemyPoolManager {
  if (!globalEnemyPool) {
    globalEnemyPool = new EnemyPoolManager(scene);
  }
  return globalEnemyPool;
}

export function disposeGlobalEnemyPool(): void {
  if (globalEnemyPool) {
    globalEnemyPool.dispose();
    globalEnemyPool = null;
  }
}
