/**
 * Audio system optimization manager
 * Implements lazy loading of audio context and audio parameter caching
 */

import * as FX from "../../vendor/wafxr/wafxr";
import { mapGlobals } from "../main/globalVariables";

interface CachedAudioParams {
  key: string;
  params: any;
}

export class AudioManager {
  private audioInitialized = false;
  private parameterCache: Map<string, any> = new Map();
  private cacheHits = 0;
  private cacheMisses = 0;

  /**
   * Lazy initialize audio context on first sound play
   */
  private initializeAudio(): void {
    if (this.audioInitialized) {
      return;
    }

    try {
      FX.setVolume(1);
      FX._tone.Master.mute = true;
      this.audioInitialized = true;
    } catch (e) {
      console.error("Failed to initialize audio:", e);
    }
  }

  /**
   * Unmute audio when sounds should play
   */
  enableAudio(): void {
    if (!this.audioInitialized) {
      this.initializeAudio();
    }
    if (FX._tone && FX._tone.Master) {
      FX._tone.Master.mute = false;
    }
  }

  /**
   * Mute audio to save CPU when not needed
   */
  disableAudio(): void {
    if (FX._tone && FX._tone.Master) {
      FX._tone.Master.mute = true;
    }
  }

  /**
   * Cache audio parameters by key to reduce object allocation
   */
  getCachedParams(key: string, paramBuilder: () => any): any {
    if (this.parameterCache.has(key)) {
      this.cacheHits++;
      return this.parameterCache.get(key);
    }

    const params = paramBuilder();
    this.parameterCache.set(key, params);
    this.cacheMisses++;
    return params;
  }

  /**
   * Play audio with caching support
   */
  play(params: any): void {
    if (!this.audioInitialized) {
      this.initializeAudio();
    }

    if (mapGlobals.soundOn && FX && FX.play) {
      try {
        FX.play(params);
      } catch (e) {
        console.warn("Audio play error:", e);
      }
    }
  }

  /**
   * Get audio statistics
   */
  getStats(): {
    cacheSize: number;
    cacheHits: number;
    cacheMisses: number;
    hitRate: number;
    audioInitialized: boolean;
  } {
    const totalRequests = this.cacheHits + this.cacheMisses;
    const hitRate = totalRequests > 0 ? Math.round((this.cacheHits / totalRequests) * 100) : 0;

    return {
      cacheSize: this.parameterCache.size,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      hitRate,
      audioInitialized: this.audioInitialized
    };
  }

  /**
   * Clear parameter cache if needed
   */
  clearCache(): void {
    this.parameterCache.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  /**
   * Dispose audio system
   */
  dispose(): void {
    this.disableAudio();
    this.clearCache();
  }
}

// Global audio manager instance
let globalAudioManager: AudioManager | null = null;

export function getGlobalAudioManager(): AudioManager {
  if (!globalAudioManager) {
    globalAudioManager = new AudioManager();
  }
  return globalAudioManager;
}

export function disposeGlobalAudioManager(): void {
  if (globalAudioManager) {
    globalAudioManager.dispose();
    globalAudioManager = null;
  }
}
