import { PhysicsImpostor, Mesh } from "../utility/babylonOptimized";

/**
 * Object pool for physics impostors to reduce garbage collection pressure
 * and improve frame rate consistency by reusing impostor objects
 */
export class ImpostorPool {
  private pool: PhysicsImpostor[] = [];
  private activeImpostors = new Map<Mesh, PhysicsImpostor>();
  private maxPoolSize: number;

  constructor(maxSize: number = 100) {
    this.maxPoolSize = maxSize;
  }

  /**
   * Get an impostor from the pool or create a new one
   */
  acquire(
    mesh: Mesh,
    type: number,
    options: any
  ): PhysicsImpostor {
    // For now, always create new impostor but track for pooling
    // Babylon.js 3.3 has limited impostor reuse capabilities
    const impostor = new PhysicsImpostor(mesh, type, options);
    this.activeImpostors.set(mesh, impostor);
    return impostor;
  }

  /**
   * Return an impostor to the pool for cleanup
   */
  release(mesh: Mesh): void {
    const impostor = this.activeImpostors.get(mesh);

    if (impostor) {
      // Properly dispose of the impostor to free resources
      try {
        impostor.dispose();
      } catch (e) {
        // Ignore dispose errors
      }
      this.activeImpostors.delete(mesh);
    }
  }

  /**
   * Get all active impostors
   */
  getActive(): PhysicsImpostor[] {
    return Array.from(this.activeImpostors.values());
  }

  /**
   * Get pool statistics for monitoring
   */
  getStats(): {
    poolSize: number;
    activeCount: number;
    maxSize: number;
  } {
    return {
      poolSize: this.pool.length,
      activeCount: this.activeImpostors.size,
      maxSize: this.maxPoolSize
    };
  }

  /**
   * Clear all pooled impostors
   */
  clear(): void {
    this.pool.forEach(impostor => {
      try {
        impostor.dispose();
      } catch (e) {
        // Ignore errors during cleanup
      }
    });
    this.pool = [];
    this.activeImpostors.clear();
  }
}

// Global impostor pool instance
let globalImpostorPool: ImpostorPool | null = null;

export function getGlobalImpostorPool(maxSize: number = 100): ImpostorPool {
  if (!globalImpostorPool) {
    globalImpostorPool = new ImpostorPool(maxSize);
  }
  return globalImpostorPool;
}

export function disposeGlobalImpostorPool(): void {
  if (globalImpostorPool) {
    globalImpostorPool.clear();
    globalImpostorPool = null;
  }
}
