/**
 * Manages pooling of game objects (projectiles, enemies, fragments)
 * Reduces garbage collection pressure from frequent object creation/destruction
 */

export interface PoolableObject {
  isActive: boolean;
  reset(): void;
  activate(): void;
  deactivate(): void;
}

export class GameObjectPool {
  private available: PoolableObject[] = [];
  private inUse: Set<PoolableObject> = new Set();
  private poolSize: number;
  private objectFactory: () => PoolableObject;
  private createdCount = 0;
  private reuseCount = 0;

  constructor(
    factory: () => PoolableObject,
    initialSize: number = 16,
    maxSize: number = 64
  ) {
    this.objectFactory = factory;
    this.poolSize = initialSize;
    this.initializePool();
  }

  /**
   * Initialize the object pool with pre-allocated objects
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolSize; i++) {
      const obj = this.objectFactory();
      obj.isActive = false;
      this.available.push(obj);
      this.createdCount++;
    }
  }

  /**
   * Get an object from the pool
   */
  acquire(): PoolableObject | null {
    let obj: PoolableObject | undefined;

    if (this.available.length > 0) {
      obj = this.available.pop();
      this.reuseCount++;
    } else if (this.getTotalSize() < this.poolSize * 2) {
      // Expand pool if needed
      obj = this.objectFactory();
      this.createdCount++;
    }

    if (obj) {
      obj.isActive = true;
      obj.activate();
      this.inUse.add(obj);
      return obj;
    }

    return null;
  }

  /**
   * Return an object to the pool
   */
  release(obj: PoolableObject): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      obj.isActive = false;
      obj.deactivate();
      obj.reset();
      this.available.push(obj);
    }
  }

  /**
   * Get the total size of the pool
   */
  private getTotalSize(): number {
    return this.available.length + this.inUse.size;
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    poolSize: number;
    available: number;
    inUse: number;
    createdCount: number;
    reuseCount: number;
    reusePct: number;
  } {
    const total = this.getTotalSize();
    const reusePct = this.createdCount > 0 ? Math.round((this.reuseCount / (this.createdCount + this.reuseCount)) * 100) : 0;
    return {
      poolSize: this.poolSize,
      available: this.available.length,
      inUse: this.inUse.size,
      createdCount: this.createdCount,
      reuseCount: this.reuseCount,
      reusePct
    };
  }

  /**
   * Clear all objects in the pool
   */
  clear(): void {
    this.available = [];
    this.inUse.clear();
  }

  /**
   * Get all active objects
   */
  getActive(): PoolableObject[] {
    return Array.from(this.inUse);
  }
}

// Registry of pools for different object types
const pools = new Map<string, GameObjectPool>();

export function createPool(name: string, factory: () => PoolableObject, initialSize?: number): GameObjectPool {
  const pool = new GameObjectPool(factory, initialSize);
  pools.set(name, pool);
  return pool;
}

export function getPool(name: string): GameObjectPool | undefined {
  return pools.get(name);
}

export function getAllPools(): { name: string; stats: any }[] {
  const result: { name: string; stats: any }[] = [];
  pools.forEach((pool, name) => {
    result.push({
      name,
      stats: pool.getStats()
    });
  });
  return result;
}

export function clearAllPools(): void {
  pools.forEach(pool => pool.clear());
  pools.clear();
}
