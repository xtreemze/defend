import { StandardMaterial, Scene, Color3 } from "../utility/babylonOptimized";

/**
 * Material cache to reuse materials instead of creating duplicates
 * Reduces memory usage and improves scene performance
 */
export class MaterialCache {
  private materials = new Map<string, StandardMaterial>();
  private scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /**
   * Get or create a material with the given properties
   */
  getMaterial(
    name: string,
    color: Color3,
    specularColor?: Color3,
    emissiveColor?: Color3
  ): StandardMaterial {
    // Create cache key from properties
    const key = `${name}_${color.r}_${color.g}_${color.b}`;

    // Return cached material if it exists
    if (this.materials.has(key)) {
      return this.materials.get(key)!;
    }

    // Create new material if not cached
    const material = new StandardMaterial(name, this.scene);
    material.specularColor = specularColor || new Color3(0.2, 0.2, 0.2);
    material.emissiveColor = emissiveColor || new Color3(0, 0, 0);
    // Set ambient and diffuse colors for material appearance
    material.ambientColor = color;
    material.emissiveColor = color.scale(0.5);

    // Cache and return
    this.materials.set(key, material);
    return material;
  }

  /**
   * Get all cached materials for cleanup
   */
  getMaterials(): StandardMaterial[] {
    return Array.from(this.materials.values());
  }

  /**
   * Clear all cached materials
   */
  clear(): void {
    this.materials.forEach(material => {
      try {
        material.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    });
    this.materials.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { cachedCount: number; totalMemory: string } {
    return {
      cachedCount: this.materials.size,
      totalMemory: `${Math.round((this.materials.size * 50) / 1024)} KB (estimated)`
    };
  }
}

// Global material cache instance
let globalMaterialCache: MaterialCache | null = null;

export function getGlobalMaterialCache(scene: Scene): MaterialCache {
  if (!globalMaterialCache) {
    globalMaterialCache = new MaterialCache(scene);
  }
  return globalMaterialCache;
}

export function disposeGlobalMaterialCache(): void {
  if (globalMaterialCache) {
    globalMaterialCache.clear();
    globalMaterialCache = null;
  }
}
