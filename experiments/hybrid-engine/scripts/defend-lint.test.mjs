import assert from "node:assert/strict";
import test from "node:test";
import { lintDependencyManifest, lintSourceText } from "./defend-lint.mjs";

const ids = (violations) => violations.map((violation) => violation.ruleId);

test("accepts injected deterministic sources", () => {
  const violations = lintSourceText(
    "src/simulation/energy.state.ts",
    `
      export function step(tick, random) {
        return { tick: tick + 1, sample: random.next() };
      }
    `,
  );
  assert.deepEqual(violations, []);
});

test("rejects unseeded randomness, wall-clock time, and ambient timers", () => {
  const violations = lintSourceText(
    "src/presentation/example.ts",
    `
      const sample = Math.random();
      const now = Date.now();
      setTimeout(() => sample + now, 10);
      setInterval(() => sample, 100);
    `,
  );
  assert.deepEqual(ids(violations), [
    "determinism/no-unseeded-random",
    "determinism/no-wall-clock",
    "lifecycle/no-ambient-timer",
    "lifecycle/no-ambient-timer",
  ]);
});

test("keeps Babylon and DOM out of semantic simulation boundaries", () => {
  const violations = lintSourceText(
    "src/simulation/world.state.ts",
    `
      import { Vector3 } from "@babylonjs/core";
      export const width = window.innerWidth;
      export const canvas = document.querySelector("canvas");
      export const vector = new Vector3(0, 0, 0);
    `,
  );
  assert.deepEqual(ids(violations), [
    "architecture/no-renderer-in-simulation",
    "architecture/no-dom-in-simulation",
    "architecture/no-dom-in-simulation",
  ]);
});

test("allows Babylon and DOM in presentation code", () => {
  const violations = lintSourceText(
    "src/presentation/scene.ts",
    `
      import { Vector3 } from "@babylonjs/core";
      export const width = window.innerWidth;
      export const vector = new Vector3(0, 0, 0);
    `,
  );
  assert.deepEqual(violations, []);
});

test("enforces worker, audio, shared-memory, and attacker-knowledge ownership", () => {
  const ordinary = lintSourceText(
    "src/presentation/runtime.ts",
    `
      const worker = new Worker("./combat.js");
      const audio = new AudioContext();
      const shared = new SharedArrayBuffer(64);
      const fortressStrength = 0.9;
      void worker; void audio; void shared; void fortressStrength;
    `,
  );
  assert.deepEqual(ids(ordinary), [
    "architecture/worker-ownership",
    "architecture/audio-context-ownership",
    "architecture/no-baseline-shared-memory",
    "architecture/no-baseline-shared-memory",
    "ai/no-fortress-strength-oracle",
    "ai/no-fortress-strength-oracle",
  ]);

  assert.deepEqual(
    lintSourceText("src/workers/createCombatWorker.ts", `export const worker = new Worker("./combat.js");`),
    [],
  );
  assert.deepEqual(
    lintSourceText("src/audio/createContext.ts", `export const audio = new AudioContext();`),
    [],
  );
});

test("rejects legacy and competing runtime dependencies", () => {
  const violations = lintDependencyManifest({
    dependencies: {
      "@babylonjs/core": "9.25.0",
      three: "1.0.0",
      webpack: "5.0.0",
      react: "19.0.0",
    },
  });
  assert.equal(violations.length, 3);
  assert.ok(violations.every((violation) => violation.ruleId === "architecture/no-competing-runtime-dependency"));
});

test("requires concrete justification for local exceptions", () => {
  const accepted = lintSourceText(
    "src/presentation/exception.ts",
    `
      // defend-lint-allow determinism/no-wall-clock -- Presentation-only instrumentation timestamp, never simulation state.
      const stamp = Date.now();
    `,
  );
  assert.deepEqual(accepted, []);

  const rejected = lintSourceText(
    "src/presentation/exception.ts",
    `
      // defend-lint-allow determinism/no-wall-clock -- temporary
      const stamp = Date.now();
    `,
  );
  assert.deepEqual(ids(rejected), ["policy/invalid-exception"]);
});
