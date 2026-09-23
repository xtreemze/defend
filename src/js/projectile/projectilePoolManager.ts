/**
 * Manages pooling of projectile instances to reduce mesh allocation overhead
 * Pre-allocates instances and reuses them instead of creating new ones each fire
 */

import { InstancedMesh, Mesh } from "../utility/babylonOptimized";
import { projectileGlobals } from "../main/globalVariables";

interface PooledProjectile {
  instance: InstancedMesh;
  inUse: boolean;
  level: number;
}

export class ProjectilePoolManager {
  private poolL2: PooledProjectile[] = [];
  private poolL3: PooledProjectile[] = [];
  private poolSizePerLevel = 32;
  private createdCount = 0;
  private reuseCount = 0;

  constructor() {
    this.initializePool();
  }

  /**
   * Initialize projectile instance pools
   */
  private initializePool(): void {
    // Pre-create instances for level 2
    for (let i = 0; i < this.poolSizePerLevel; i++) {
      const instance = projectileGlobals.projectileMeshL2.createInstance(
        `projectile_l2_pool_${i}`
      ) as InstancedMesh;
      instance.setEnabled(false);
      this.poolL2.push({
        instance,
        inUse: false,
        level: 2
      });
      this.createdCount++;
    }

    // Pre-create instances for level 3
    for (let i = 0; i < this.poolSizePerLevel; i++) {
      const instance = projectileGlobals.projectileMeshL3.createInstance(
        `projectile_l3_pool_${i}`
      ) as InstancedMesh;
      instance.setEnabled(false);
      this.poolL3.push({
        instance,
        inUse: false,
        level: 3
      });
      this.createdCount++;
    }
  }

  /**
   * Acquire a projectile instance from the pool
   */
  acquireProjectile(level: 2 | 3): InstancedMesh | null {
    const pool = level === 2 ? this.poolL2 : this.poolL3;

    // Find available instance
    let pooled = pool.find(p => !p.inUse);

    if (!pooled) {
      // Expand pool if needed
      if (pool.length < this.poolSizePerLevel * 2) {
        const baseMesh = level === 2 ? projectileGlobals.projectileMeshL2 : projectileGlobals.projectileMeshL3;
        const instance = baseMesh.createInstance(
          `projectile_l${level}_dynamic_${pool.length}`
        ) as InstancedMesh;
        instance.setEnabled(false);
        pooled = {
          instance,
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
    pooled.instance.setEnabled(true);
    this.reuseCount++;
    return pooled.instance;
  }

  /**
   * Release a projectile instance back to the pool
   */
  releaseProjectile(instance: InstancedMesh, level: 2 | 3): void {
    const pool = level === 2 ? this.poolL2 : this.poolL3;
    const pooled = pool.find(p => p.instance === instance);

    if (pooled) {
      pooled.inUse = false;
      instance.setEnabled(false);
      // Reset position and rotation for next use
      instance.position.set(0, 0, 0);
      instance.rotation.set(0, 0, 0);
      if (instance.physicsImpostor) {
        instance.physicsImpostor.setLinearVelocity(undefined as any);
        instance.physicsImpostor.setAngularVelocity(undefined as any);
      }
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    poolL2: { total: number; inUse: number; available: number };
    poolL3: { total: number; inUse: number; available: number };
    createdCount: number;
    reuseCount: number;
    reusePct: number;
  } {
    const l2InUse = this.poolL2.filter(p => p.inUse).length;
    const l3InUse = this.poolL3.filter(p => p.inUse).length;
    const totalAllocations = this.createdCount + this.reuseCount;
    const reusePct = totalAllocations > 0 ? Math.round((this.reuseCount / totalAllocations) * 100) : 0;

    return {
      poolL2: {
        total: this.poolL2.length,
        inUse: l2InUse,
        available: this.poolL2.length - l2InUse
      },
      poolL3: {
        total: this.poolL3.length,
        inUse: l3InUse,
        available: this.poolL3.length - l3InUse
      },
      createdCount: this.createdCount,
      reuseCount: this.reuseCount,
      reusePct
    };
  }

  /**
   * Dispose all pooled projectiles
   */
  dispose(): void {
    this.poolL2.forEach(p => {
      try {
        p.instance.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.poolL3.forEach(p => {
      try {
        p.instance.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.poolL2 = [];
    this.poolL3 = [];
  }
}

// Global projectile pool instance
let globalProjectilePool: ProjectilePoolManager | null = null;

export function getGlobalProjectilePoolManager(): ProjectilePoolManager {
  if (!globalProjectilePool) {
    globalProjectilePool = new ProjectilePoolManager();
  }
  return globalProjectilePool;
}

export function disposeGlobalProjectilePool(): void {
  if (globalProjectilePool) {
    globalProjectilePool.dispose();
    globalProjectilePool = null;
  }
}
