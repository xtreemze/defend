export interface DeviceCapabilities {
  quality: "mobile" | "medium" | "high";
  isMobile: boolean;
  isLowEnd: boolean;
  maxParticles: number;
  glowKernelSize: number;
  glowTextureRatio: number;
  impostorLimit: number;
  enemyFragments: number;
  targetFPS: number;
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );

  // Check memory if available
  const perfMemory = (performance as any).memory;
  const jsHeapLimit = perfMemory && perfMemory.jsHeapSizeLimit;
  const isLowEndMemory = jsHeapLimit && jsHeapLimit < 512 * 1024 * 1024;

  // Check screen resolution for lower-end detection
  const screenPixels = window.innerWidth * window.innerHeight;
  const isHighRes = screenPixels > 2000 * 1000; // 2MP+

  // Determine device classification
  let quality: "mobile" | "medium" | "high" = "high";
  let isLowEnd = false;

  if (isLowEndMemory || (isMobile && !isHighRes)) {
    quality = "mobile";
    isLowEnd = true;
  } else if (isMobile) {
    quality = "medium";
    isLowEnd = false;
  } else if (!isHighRes) {
    quality = "medium";
    isLowEnd = false;
  }

  // Assign capability levels based on device quality
  const capabilities = {
    mobile: {
      maxParticles: 40,
      glowKernelSize: 4,
      glowTextureRatio: 0.2,
      impostorLimit: 40,
      enemyFragments: 0,
      targetFPS: 45
    },
    medium: {
      maxParticles: 80,
      glowKernelSize: 8,
      glowTextureRatio: 0.3,
      impostorLimit: 60,
      enemyFragments: 1,
      targetFPS: 45
    },
    high: {
      maxParticles: 200,
      glowKernelSize: 24,
      glowTextureRatio: 0.4,
      impostorLimit: 80,
      enemyFragments: 1,
      targetFPS: 60
    }
  };

  const cap = capabilities[quality];

  return {
    quality,
    isMobile,
    isLowEnd,
    maxParticles: cap.maxParticles,
    glowKernelSize: cap.glowKernelSize,
    glowTextureRatio: cap.glowTextureRatio,
    impostorLimit: cap.impostorLimit,
    enemyFragments: cap.enemyFragments,
    targetFPS: cap.targetFPS
  };
}

// Log device info for debugging
export function logDeviceInfo(cap: DeviceCapabilities): void {
  if ((window as any).console && (window as any).console.log) {
    console.log(
      `Device: ${cap.quality.toUpperCase()} (${cap.isMobile ? "mobile" : "desktop"}) - ${
        cap.isLowEnd ? "low-end" : "capable"
      }`
    );
    console.log(`Settings: ${cap.maxParticles} particles, Glow kernel: ${cap.glowKernelSize}`);
    console.log(`Target FPS: ${cap.targetFPS}, Impostors: ${cap.impostorLimit}`);
  }
}
