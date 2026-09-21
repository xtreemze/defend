import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".mts", ".cjs", ".cts"]);

const RULE = Object.freeze({
  unseededRandom: "determinism/no-unseeded-random",
  wallClock: "determinism/no-wall-clock",
  ambientTimer: "lifecycle/no-ambient-timer",
  workerOwnership: "architecture/worker-ownership",
  audioOwnership: "architecture/audio-context-ownership",
  sharedMemory: "architecture/no-baseline-shared-memory",
  hiddenOracle: "ai/no-fortress-strength-oracle",
  rendererInSimulation: "architecture/no-renderer-in-simulation",
  domInSimulation: "architecture/no-dom-in-simulation",
  competingDependency: "architecture/no-competing-runtime-dependency",
  invalidException: "policy/invalid-exception",
});

const DOM_GLOBALS = new Set([
  "document",
  "window",
  "location",
  "navigator",
  "sessionStorage",
  "localStorage",
  "HTMLElement",
  "HTMLCanvasElement",
  "requestAnimationFrame",
  "cancelAnimationFrame",
  "performance",
]);

const FORBIDDEN_DEPENDENCIES = new Map([
  ["babylonjs", "Use the maintained scoped @babylonjs/* packages in the presentation boundary."],
  ["cannon", "The historical Cannon graph is parity evidence, not a modern dependency."],
  ["cannon-es", "Do not introduce a second modern physics authority without an explicit architecture decision."],
  ["three", "Babylon is the browser rendering authority; do not add a competing renderer."],
  ["@react-three/fiber", "Babylon is the browser rendering authority; do not add a competing renderer."],
  ["react", "Lit/Web Components owns the modern DOM UI boundary; do not add a competing application framework here."],
  ["react-dom", "Lit/Web Components owns the modern DOM UI boundary; do not add a competing application framework here."],
  ["vue", "Lit/Web Components owns the modern DOM UI boundary; do not add a competing application framework here."],
  ["svelte", "Lit/Web Components owns the modern DOM UI boundary; do not add a competing application framework here."],
  ["@angular/core", "Lit/Web Components owns the modern DOM UI boundary; do not add a competing application framework here."],
  ["phaser", "Babylon is the browser rendering authority; do not add a second game renderer."],
  ["playcanvas", "Babylon is the browser rendering authority; do not add a second game renderer."],
  ["pixi.js", "Babylon is the browser rendering authority; do not add a second game renderer."],
  ["webpack", "The maintained modern browser path uses Vite; Webpack is confined to the historical reference."],
  ["webpack-cli", "The maintained modern browser path uses Vite; Webpack is confined to the historical reference."],
  ["webpack-dev-server", "The maintained modern browser path uses Vite; Webpack is confined to the historical reference."],
  ["tslint", "TSLint belongs to the historical reference toolchain and must not return to the modern workspace."],
  ["typescript-eslint-parser", "The legacy parser must not return to the modern workspace."],
]);

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function isSimulationBoundary(relativePath) {
  const normalized = `/${toPosix(relativePath)}`;
  return (
    /\/(?:core|domain|protocol|simulation|workers)(?:\/|$)/u.test(normalized) ||
    /\.(?:domain|model|protocol|simulation|state)\.[cm]?[jt]sx?$/u.test(normalized)
  );
}

function isWorkerBoundary(relativePath) {
  return /(^|\/)src\/workers\//u.test(toPosix(relativePath));
}

function isAudioBoundary(relativePath) {
  return /(^|\/)src\/audio\//u.test(toPosix(relativePath));
}

function sourceLine(sourceFile, lineIndex) {
  const start = sourceFile.getPositionOfLineAndCharacter(lineIndex, 0);
  const end =
    lineIndex + 1 < sourceFile.getLineAndCharacterOfPosition(sourceFile.end).line + 1
      ? sourceFile.getPositionOfLineAndCharacter(lineIndex + 1, 0)
      : sourceFile.end;
  return sourceFile.text.slice(start, end);
}

function exceptionReason(sourceFile, node, ruleId) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const marker = `defend-lint-allow ${ruleId} -- `;
  for (const candidate of [line, line - 1]) {
    if (candidate < 0) continue;
    const text = sourceLine(sourceFile, candidate);
    const markerIndex = text.indexOf(marker);
    if (markerIndex === -1) continue;
    return text.slice(markerIndex + marker.length).trim();
  }
  return null;
}

function makeViolation(sourceFile, node, ruleId, message) {
  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  return {
    file: sourceFile.fileName,
    line: position.line + 1,
    column: position.character + 1,
    ruleId,
    message,
  };
}

function memberCall(node, owner, property) {
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === owner &&
    node.expression.name.text === property
  );
}

function directCall(node, name) {
  return ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name;
}

function constructorName(node) {
  if (!ts.isNewExpression(node) || !ts.isIdentifier(node.expression)) return null;
  return node.expression.text;
}

export function lintSourceText(relativePath, source) {
  const sourceFile = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);
  const violations = [];
  const invalidExceptionKeys = new Set();
  const simulationBoundary = isSimulationBoundary(relativePath);
  const workerBoundary = isWorkerBoundary(relativePath);
  const audioBoundary = isAudioBoundary(relativePath);

  const report = (node, ruleId, message) => {
    const reason = exceptionReason(sourceFile, node, ruleId);
    if (reason !== null) {
      if (reason.length >= 16) return;
      const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      const key = `${position.line}:${ruleId}`;
      if (!invalidExceptionKeys.has(key)) {
        invalidExceptionKeys.add(key);
        violations.push(
          makeViolation(
            sourceFile,
            node,
            RULE.invalidException,
            `Exception for ${ruleId} needs a concrete reason of at least 16 characters.`,
          ),
        );
      }
      return;
    }
    violations.push(makeViolation(sourceFile, node, ruleId, message));
  };

  const visit = (node) => {
    if (memberCall(node, "Math", "random")) {
      report(
        node,
        RULE.unseededRandom,
        "Inject a seeded/random source owned by the simulation instead of calling Math.random().",
      );
    }

    if (memberCall(node, "Date", "now")) {
      report(
        node,
        RULE.wallClock,
        "Authoritative behavior must derive time from fixed ticks; Date.now() makes replay and certification nondeterministic.",
      );
    }

    if (directCall(node, "setTimeout") || directCall(node, "setInterval")) {
      report(
        node,
        RULE.ambientTimer,
        "Do not create ambient timers in the modern game path; use owned render/audio lifecycle or authoritative simulation ticks.",
      );
    }

    const constructed = constructorName(node);
    if (constructed === "Worker" && !workerBoundary) {
      report(
        node,
        RULE.workerOwnership,
        "Create Workers only behind src/workers/ so advisory lanes have explicit ownership and teardown.",
      );
    }
    if ((constructed === "AudioContext" || constructed === "webkitAudioContext") && !audioBoundary) {
      report(
        node,
        RULE.audioOwnership,
        "Create audio rendering contexts only behind src/audio/ so lifecycle and real-time ownership stay explicit.",
      );
    }
    if (constructed === "SharedArrayBuffer") {
      report(
        node,
        RULE.sharedMemory,
        "SharedArrayBuffer may be an evidence-backed optimization, but it cannot become a baseline requirement.",
      );
    }

    if (ts.isIdentifier(node) && node.text === "SharedArrayBuffer") {
      report(
        node,
        RULE.sharedMemory,
        "SharedArrayBuffer may be an evidence-backed optimization, but it cannot become a baseline requirement.",
      );
    }

    if (ts.isIdentifier(node) && node.text === "fortressStrength") {
      report(
        node,
        RULE.hiddenOracle,
        "Attackers must adapt from observable evidence, not a hidden global fortressStrength oracle.",
      );
    }

    if (simulationBoundary && ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      if (node.moduleSpecifier.text.startsWith("@babylonjs/")) {
        report(
          node,
          RULE.rendererInSimulation,
          "Simulation/domain/protocol/worker code must not import Babylon; Babylon presents authoritative snapshots downstream.",
        );
      }
    }

    if (simulationBoundary && ts.isIdentifier(node) && DOM_GLOBALS.has(node.text)) {
      report(
        node,
        RULE.domInSimulation,
        `Simulation/domain/protocol/worker code must not depend on browser global ${node.text}.`,
      );
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return deduplicateViolations(violations);
}

export function lintDependencyManifest(manifest) {
  const violations = [];
  for (const section of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    const dependencies = manifest[section] ?? {};
    for (const dependency of Object.keys(dependencies)) {
      const reason = FORBIDDEN_DEPENDENCIES.get(dependency);
      if (!reason) continue;
      violations.push({
        file: "package.json",
        line: 1,
        column: 1,
        ruleId: RULE.competingDependency,
        message: `${dependency}: ${reason}`,
      });
    }
  }
  return violations;
}

function deduplicateViolations(violations) {
  const seen = new Set();
  return violations.filter((violation) => {
    const key = `${violation.file}:${violation.line}:${violation.column}:${violation.ruleId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await sourceFiles(absolute)));
      continue;
    }
    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
}

export async function runPolicyCheck(root = PACKAGE_ROOT) {
  const manifest = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const violations = lintDependencyManifest(manifest);
  const src = path.join(root, "src");

  for (const absolute of await sourceFiles(src)) {
    const relative = toPosix(path.relative(root, absolute));
    const source = await readFile(absolute, "utf8");
    violations.push(...lintSourceText(relative, source));
  }

  return deduplicateViolations(violations).sort(
    (left, right) =>
      left.file.localeCompare(right.file) ||
      left.line - right.line ||
      left.column - right.column ||
      left.ruleId.localeCompare(right.ruleId),
  );
}

async function main() {
  const violations = await runPolicyCheck();
  if (violations.length === 0) {
    process.stdout.write("Defend principle lint passed.\n");
    return;
  }

  for (const violation of violations) {
    process.stderr.write(
      `${violation.file}:${violation.line}:${violation.column} [${violation.ruleId}] ${violation.message}\n`,
    );
  }
  process.stderr.write(`\n${violations.length} Defend principle lint violation(s).\n`);
  process.exitCode = 1;
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  await main();
}
