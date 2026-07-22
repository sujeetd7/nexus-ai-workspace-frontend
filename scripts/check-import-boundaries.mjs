#!/usr/bin/env node
/**
 * Import-boundary scanner for Sprint 0 remediation.
 * Complements ESLint no-restricted-imports with path-based checks that
 * relative cross-feature imports can evade.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "android",
  "ios",
  "tmp",
]);

const IMPORT_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[^"'`]*?\sfrom\s+)?["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)/g;

/** @type {string[]} */
const violations = [];

function shouldSkipDir(name) {
  return IGNORE_DIR_NAMES.has(name) || name.startsWith(".");
}

function walk(dir, files = []) {
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

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function addViolation(filePath, specifier, message) {
  violations.push(`${rel(filePath)}: "${specifier}" — ${message}`);
}

/** Approved package.json `exports` subpaths (not filesystem deep imports). */
const APPROVED_NEXUS_SUBPATHS = new Set([
  "@nexus/shared-ui/tamagui-config",
  "@nexus/shared-ui/testing",
]);

function isDeepNexusImport(specifier) {
  if (APPROVED_NEXUS_SUBPATHS.has(specifier)) {
    return false;
  }
  return /^@nexus\/[^/]+\/.+/.test(specifier);
}

function resolveRelative(fromFile, specifier) {
  if (!specifier.startsWith(".")) {
    return null;
  }

  return path.normalize(path.join(path.dirname(fromFile), specifier));
}

function featureNameFromPath(filePath) {
  const normalized = rel(filePath);
  const match = normalized.match(/(?:^|\/)features\/([^/]+)/);
  return match?.[1] ?? null;
}

function checkFile(filePath) {
  const normalized = rel(filePath);
  const source = fs.readFileSync(filePath, "utf8");
  const inPackage = normalized.startsWith("packages/");
  const inSharedNetwork = normalized.startsWith("packages/shared-network/");
  const inWebApi = normalized.startsWith("apps/web/src/api/");
  const inWeb = normalized.startsWith("apps/web/");
  const currentFeature = featureNameFromPath(filePath);

  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1] ?? match[2];
    if (!specifier) {
      continue;
    }

    if (isDeepNexusImport(specifier)) {
      addViolation(
        filePath,
        specifier,
        "Deep @nexus imports are forbidden; use the package public API.",
      );
    }

    if (specifier === "axios" || specifier.startsWith("axios/")) {
      if (!inSharedNetwork && !inWebApi) {
        addViolation(
          filePath,
          specifier,
          "Axios is only allowed in @nexus/shared-network and apps/web/src/api.",
        );
      }
    }

    if (inPackage && /(^|\/)apps(\/|$)/.test(specifier)) {
      addViolation(filePath, specifier, "Packages must not import from apps.");
    }

    if (
      inPackage &&
      !inSharedNetwork &&
      (specifier === "@nexus/shared-network" ||
        specifier.startsWith("@nexus/shared-network/"))
    ) {
      const packageName = normalized.split("/")[1];
      if (
        packageName &&
        packageName !== "shared-network" &&
        packageName.startsWith("shared-")
      ) {
        addViolation(
          filePath,
          specifier,
          "Non-network shared packages must not depend on @nexus/shared-network.",
        );
      }
    }

    if (inWeb && (specifier === "mobile" || specifier.startsWith("apps/mobile"))) {
      addViolation(filePath, specifier, "Web must not import from mobile.");
    }

    if (specifier.includes("/features/") || specifier.startsWith("features/")) {
      addViolation(
        filePath,
        specifier,
        "Do not import features by path; use shared app layers.",
      );
    }

    if (currentFeature) {
      const resolved = resolveRelative(filePath, specifier);
      if (resolved) {
        const targetFeature = featureNameFromPath(resolved);
        if (targetFeature && targetFeature !== currentFeature) {
          addViolation(
            filePath,
            specifier,
            `Cross-feature import from "${currentFeature}" into "${targetFeature}" is forbidden.`,
          );
        }
      }
    }
  }
}

const targets = [
  path.join(ROOT, "packages"),
  path.join(ROOT, "apps", "web", "src"),
  path.join(ROOT, "scripts"),
].filter((dir) => fs.existsSync(dir));

for (const target of targets) {
  for (const file of walk(target)) {
    checkFile(file);
  }
}

if (violations.length > 0) {
  console.error("Import boundary violations:\n");
  for (const violation of violations) {
    console.error(` - ${violation}`);
  }
  console.error(`\n${violations.length} violation(s). See docs/architecture/dependency-rules.md`);
  process.exit(1);
}

console.log("Import boundaries check passed.");
