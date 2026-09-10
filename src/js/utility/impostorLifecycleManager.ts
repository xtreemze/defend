import { PhysicsImpostor, Mesh } from "../utility/babylonOptimized";

/**
 * Manages impostor lifecycle to reduce GC pressure
 * Batches disposals and tracks impostor creation/destruction
 */
export class ImpostorLifecycleManager {
  private pendingDisposals: PhysicsImpostor[] = [];
  private disposalBatchSize = 10;
  private disposalInterval = 500; // ms
  private lastDisposalTime = 0;
  private createdCount = 0;
  private disposedCount = 0;

  /**
   * Register a newly created impostor
   */
  trackCreated(impostor: PhysicsImpostor): void {
    this.createdCount++;
  }

  /**
   * Queue an impostor for disposal
   * Batches disposals to reduce GC spikes
   */
  queueDisposal(impostor: PhysicsImpostor): void {
    this.pendingDisposals.push(impostor);

    // Process batch if we've accumulated enough or enough time has passed
    const now = Date.now();
    if (
      this.pendingDisposals.length >= this.disposalBatchSize ||
      now - this.lastDisposalTime > this.disposalInterval
    ) {
      this.processBatch();
      this.lastDisposalTime = now;
    }
  }

  /**
   * Immediately process pending disposals
   */
  processBatch(): void {
    while (this.pendingDisposals.length > 0) {
      const impostor = this.pendingDisposals.pop();
      if (impostor) {
        try {
          impostor.dispose();
          this.disposedCount++;
        } catch (e) {
          // Ignore disposal errors
        }
      }
    }
  }

  /**
   * Flush all pending disposals
   */
  flush(): void {
    this.processBatch();
  }

  /**
   * Get lifecycle statistics
   */
  getStats(): {
    created: number;
    disposed: number;
    pending: number;
    activeImpostors: number;
  } {
    return {
      created: this.createdCount,
      disposed: this.disposedCount,
      pending: this.pendingDisposals.length,
      activeImpostors: this.createdCount - this.disposedCount
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.createdCount = 0;
    this.disposedCount = 0;
  }
}

// Global lifecycle manager instance
let globalLifecycleManager: ImpostorLifecycleManager | null = null;

export function getGlobalImpostorLifecycleManager(): ImpostorLifecycleManager {
  if (!globalLifecycleManager) {
    globalLifecycleManager = new ImpostorLifecycleManager();
  }
  return globalLifecycleManager;
}

export function flushImpostorDisposals(): void {
  if (globalLifecycleManager) {
    globalLifecycleManager.flush();
  }
}
