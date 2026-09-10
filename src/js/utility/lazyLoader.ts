/**
 * Lazy loading utility for game features
 * Enables code splitting and deferred loading of non-critical features
 */

export type LazyModule = () => Promise<any>;

interface LoadedModule {
  loaded: boolean;
  module: any;
  error: Error | null;
}

export class LazyLoader {
  private cache = new Map<string, LoadedModule>();

  /**
   * Load a module and cache the result
   */
  async load(name: string, moduleLoader: LazyModule): Promise<any> {
    // Return cached module if available
    if (this.cache.has(name)) {
      const cached = this.cache.get(name)!;
      if (cached.error) throw cached.error;
      return cached.module;
    }

    // Load and cache the module
    try {
      const module = await moduleLoader();
      this.cache.set(name, { loaded: true, module, error: null });
      return module;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.cache.set(name, { loaded: false, module: null, error: err });
      throw err;
    }
  }

  /**
   * Preload a module in the background
   */
  preload(name: string, moduleLoader: LazyModule): Promise<void> {
    return this.load(name, moduleLoader).catch(() => {
      // Silently ignore preload errors
    });
  }

  /**
   * Get cache statistics
   */
  getStats(): { cached: number; total: number } {
    return {
      cached: this.cache.size,
      total: this.cache.size
    };
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Global loader instance
let globalLoader: LazyLoader | null = null;

export function getGlobalLazyLoader(): LazyLoader {
  if (!globalLoader) {
    globalLoader = new LazyLoader();
  }
  return globalLoader;
}
