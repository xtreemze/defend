/**
 * Material factory using the material cache for efficient reuse
 * Centralizes material creation and management
 */

import { Color3, StandardMaterial, Scene, Material } from "../utility/babylonOptimized";
import { getGlobalMaterialCache } from "./materialCache";

export class MaterialFactory {
  private scene: Scene;
  private cache: any;

  constructor(scene: Scene) {
    this.scene = scene;
    this.cache = getGlobalMaterialCache(scene);
  }

  /**
   * Create or retrieve a color-based material
   */
  getColorMaterial(
    name: string,
    color: Color3,
    options?: {
      specularColor?: Color3;
      emissiveColor?: Color3;
      wireframe?: boolean;
      alpha?: number;
    }
  ): StandardMaterial {
    const specularColor = options && options.specularColor ? options.specularColor : undefined;
    const emissiveColor = options && options.emissiveColor ? options.emissiveColor : undefined;

    const cached = this.cache.getMaterial(
      name,
      color,
      specularColor,
      emissiveColor
    );

    // Apply additional options if provided
    if (options && options.wireframe !== undefined) {
      cached.wireframe = options.wireframe;
    }
    if (options && options.alpha !== undefined) {
      cached.alpha = options.alpha;
    }

    return cached;
  }

  /**
   * Create or retrieve a standard tower material
   */
  getTowerMaterial(color: Color3): StandardMaterial {
    return this.cache.getMaterial("tower", color);
  }

  /**
   * Create or retrieve a standard enemy material
   */
  getEnemyMaterial(color: Color3): StandardMaterial {
    return this.cache.getMaterial("enemy", color);
  }

  /**
   * Create or retrieve a projectile material
   */
  getProjectileMaterial(color: Color3): StandardMaterial {
    return this.cache.getMaterial("projectile", color);
  }

  /**
   * Clone a cached material for unique instances
   */
  cloneMaterial(material: StandardMaterial, newName: string): StandardMaterial {
    const clone = material.clone(newName) as StandardMaterial;
    return clone;
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    return this.cache.getStats();
  }
}

// Global factory instance
let globalFactory: MaterialFactory | null = null;

export function getGlobalMaterialFactory(scene: Scene): MaterialFactory {
  if (!globalFactory) {
    globalFactory = new MaterialFactory(scene);
  }
  return globalFactory;
}

export function resetGlobalMaterialFactory(): void {
  globalFactory = null;
}
