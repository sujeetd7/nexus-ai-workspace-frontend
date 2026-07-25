import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "android",
  "ios",
  "tmp",
  "__tests__",
]);

const IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[^"'`]*?\sfrom\s+)?["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

const RUNTIME_TARGETS = [
  path.join(ROOT, "apps", "web", "src"),
  path.join(ROOT, "apps", "mobile", "src"),
  path.join(ROOT, "packages", "shared-ui", "src"),
];

const ENGINEERING_PLATFORM_PREFIX = "@sujeetd7/ai-engineering";

function shouldSkipDir(name: string): boolean {
  return IGNORE_DIR_NAMES.has(name) || name.startsWith(".");
}

function walk(dir: string, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) {
        walk(path.join(dir, entry.name), files);
      }
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.join(dir, entry.name));
    }
  }

  return files;
}

function collectEngineeringImports(filePath: string): string[] {
  const source = fs.readFileSync(filePath, "utf8");
  const matches: string[] = [];

  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1] ?? match[2];
    if (specifier?.startsWith(ENGINEERING_PLATFORM_PREFIX)) {
      matches.push(specifier);
    }
  }

  return matches;
}

describe("runtime isolation", () => {
  it("does not import engineering platform packages from runtime surfaces", () => {
    const violations: string[] = [];

    for (const target of RUNTIME_TARGETS) {
      for (const file of walk(target)) {
        for (const specifier of collectEngineeringImports(file)) {
          violations.push(
            `${path.relative(ROOT, file).split(path.sep).join("/")}: "${specifier}"`,
          );
        }
      }
    }

    assert.deepEqual(
      violations,
      [],
      `Engineering platform imports found in runtime surfaces:\n${violations.join("\n")}`,
    );
  });
});
