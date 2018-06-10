import fx from "wafxr";

fx.play({
  frequency: 440,
  sweep: 1.25
});

fx.play({
  volume: -10,
  sustain: 0.1539,
  release: 0.366,
  source: "pink noise",
  bitcrush: 6,
  bandpass: 2689,
  bandpassQ: 1.58,
  bandpassSweep: -615.8,
  compressorThreshold: -30.88
}); // where the magic is

fx.getDefaults(); // object with all supported settings
fx.setVolume(0.5); // master volume, 0..1
fx._tone; // Tone.js reference if you need it
