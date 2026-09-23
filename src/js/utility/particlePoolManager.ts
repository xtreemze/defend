/**
 * Manages particle system pooling to reduce GC pressure
 * Reuses particle systems instead of creating/destroying them
 */

import { ParticleSystem, GPUParticleSystem, Scene, Color4, Vector3 } from "../utility/babylonOptimized";
import { createTexture } from "../enemy/flare";

interface PooledParticleSystem {
  system: ParticleSystem | GPUParticleSystem;
  inUse: boolean;
  createdAt: number;
}

export class ParticlePoolManager {
  private pool: PooledParticleSystem[] = [];
  private poolSize = 8;
  private scene: Scene;
  private createdCount = 0;
  private reuseCount = 0;
  private disposalQueue: (ParticleSystem | GPUParticleSystem)[] = [];
  private lastDisposalTime = 0;
  private disposalInterval = 300; // ms

  constructor(scene: Scene, poolSize: number = 8) {
    this.scene = scene;
    this.poolSize = poolSize;
    this.initializePool();
  }

  /**
   * Initialize the particle system pool
   */
  private initializePool(): void {
    const useGPU = GPUParticleSystem.IsSupported;

    for (let i = 0; i < this.poolSize; i++) {
      const particleSystem = useGPU
        ? new GPUParticleSystem(`pooled_particle_${i}`, { capacity: 16 }, this.scene)
        : new ParticleSystem(`pooled_particle_${i}`, 12, this.scene);

      // Configure base particle system properties
      particleSystem.renderingGroupId = 0;
      particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
      particleSystem.particleTexture = createTexture(this.scene);

      this.pool.push({
        system: particleSystem,
        inUse: false,
        createdAt: 0
      });
    }
  }

  /**
   * Get or allocate a particle system from the pool
   */
  getParticleSystem(level: number): ParticleSystem | GPUParticleSystem | null {
    // Try to find an available pooled system
    let available = this.pool.find(p => !p.inUse);

    if (!available) {
      // Expand pool if needed
      if (this.pool.length < this.poolSize * 2) {
        const newSystem = GPUParticleSystem.IsSupported
          ? new GPUParticleSystem(`pooled_particle_${this.pool.length}`, { capacity: 16 }, this.scene)
          : new ParticleSystem(`pooled_particle_${this.pool.length}`, 12, this.scene);

        newSystem.renderingGroupId = 0;
        newSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
        newSystem.particleTexture = createTexture(this.scene);

        available = {
          system: newSystem,
          inUse: false,
          createdAt: Date.now()
        };
        this.pool.push(available);
      } else {
        // Pool is full, cannot allocate
        return null;
      }
    }

    available.inUse = true;
    available.createdAt = Date.now();
    this.reuseCount++;

    // Configure particle system based on level
    const ps = available.system;
    ps.emitRate = 200;
    ps.updateSpeed = 0.008;
    ps.minEmitPower = 4;
    ps.maxEmitPower = 7 * level;
    ps.minLifeTime = 0.2;
    ps.maxLifeTime = 0.25;
    ps.minSize = 0.5;
    ps.maxSize = level;
    ps.gravity = new Vector3(0, -700, 0);
    ps.color1 = new Color4(1, 0.5, 0, 1);
    ps.color2 = new Color4(0.75, 0.4, 0.1, 1);
    ps.colorDead = new Color4(0.1, 0.08, 0.3, 1);

    // Set direction based on level
    if ("direction1" in ps) {
      ps.direction1 = new Vector3(-2.5 * level, 3 * level * level, 2.5 * level);
    }
    if ("direction2" in ps) {
      ps.direction2 = new Vector3(2.5 * level, 2 * level * level, -2.5 * level);
    }

    ps.minEmitBox = new Vector3(-2, -6, -2);
    ps.maxEmitBox = new Vector3(2, 6, 2);

    return ps;
  }

  /**
   * Return a particle system to the pool for reuse
   */
  releaseParticleSystem(particleSystem: ParticleSystem | GPUParticleSystem): void {
    const pooled = this.pool.find(p => p.system === particleSystem);
    if (pooled) {
      particleSystem.stop();
      // Queue for deferred reset to batch GC work
      this.disposalQueue.push(particleSystem);

      const now = Date.now();
      if (now - this.lastDisposalTime > this.disposalInterval || this.disposalQueue.length >= 4) {
        this.processBatch();
        this.lastDisposalTime = now;
      }
    }
  }

  /**
   * Process deferred particle system resets
   */
  private processBatch(): void {
    while (this.disposalQueue.length > 0) {
      const ps = this.disposalQueue.shift();
      if (ps) {
        try {
          ps.reset();
          const pooled = this.pool.find(p => p.system === ps);
          if (pooled) {
            pooled.inUse = false;
          }
        } catch (e) {
          // Ignore reset errors
        }
      }
    }
  }

  /**
   * Flush all pending resets
   */
  flush(): void {
    this.processBatch();
  }

  /**
   * Get pool statistics
   */
  getStats(): { poolSize: number; inUse: number; reuseCount: number; createdCount: number } {
    const inUse = this.pool.filter(p => p.inUse).length;
    return {
      poolSize: this.pool.length,
      inUse,
      reuseCount: this.reuseCount,
      createdCount: this.createdCount
    };
  }

  /**
   * Dispose all particle systems in the pool
   */
  dispose(): void {
    this.processBatch();
    this.pool.forEach(p => {
      try {
        p.system.dispose(false);
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.pool = [];
  }
}

// Global particle pool instance
let globalParticlePool: ParticlePoolManager | null = null;

export function getGlobalParticlePoolManager(scene: Scene): ParticlePoolManager {
  if (!globalParticlePool) {
    globalParticlePool = new ParticlePoolManager(scene);
  }
  return globalParticlePool;
}

export function disposeGlobalParticlePool(): void {
  if (globalParticlePool) {
    globalParticlePool.dispose();
    globalParticlePool = null;
  }
}
