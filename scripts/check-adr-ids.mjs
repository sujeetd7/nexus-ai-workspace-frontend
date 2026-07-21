#!/usr/bin/env node
/**
 * Validates canonical ADR IDs under docs/adr.
 * - Filenames must match ADR-####-slug.md
 * - IDs must be unique
 * - README index must list each ADR exactly once
 * - docs/architecture/adr must not contain ADR body files
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ADR_DIR = path.join(ROOT, "docs", "adr");
const LEGACY_DIR = path.join(ROOT, "docs", "architecture", "adr");
const README = path.join(ADR_DIR, "README.md");
const FILE_RE = /^ADR-(\d{4})-[a-z0-9-]+\.md$/i;
const INDEX_RE = /\|\s*ADR-(\d{4})\s*\|/g;

/** @type {string[]} */
const errors = [];

function fail(message) {
  errors.push(message);
}

if (!fs.existsSync(ADR_DIR)) {
  fail(`Missing canonical ADR directory: ${path.relative(ROOT, ADR_DIR)}`);
} else {
  const files = fs
    .readdirSync(ADR_DIR)
    .filter((name) => name.startsWith("ADR-") && name.endsWith(".md"));

  /** @type {Map<string, string[]>} */
  const ids = new Map();

  for (const name of files) {
    const match = FILE_RE.exec(name);
    if (!match) {
      fail(`Invalid ADR filename: docs/adr/${name}`);
      continue;
    }

    const id = match[1];
    const list = ids.get(id) ?? [];
    list.push(name);
    ids.set(id, list);

    const fullPath = path.join(ADR_DIR, name);
    const contents = fs.readFileSync(fullPath, "utf8").trim();
    if (!contents) {
      fail(`ADR body is empty: docs/adr/${name}`);
    }

    if (!contents.includes(`ADR-${id}`)) {
      fail(`ADR file does not declare its ID in content: docs/adr/${name}`);
    }
  }

  for (const [id, names] of ids) {
    if (names.length > 1) {
      fail(`Duplicate ADR-${id}: ${names.join(", ")}`);
    }
  }

  if (!fs.existsSync(README)) {
    fail("Missing docs/adr/README.md index");
  } else {
    const readme = fs.readFileSync(README, "utf8");
    const indexed = new Set();

    for (const match of readme.matchAll(INDEX_RE)) {
      const id = match[1];
      if (indexed.has(id)) {
        fail(`README indexes ADR-${id} more than once`);
      }
      indexed.add(id);
    }

    for (const id of ids.keys()) {
      if (!indexed.has(id)) {
        fail(`README is missing ADR-${id}`);
      }
    }

    for (const id of indexed) {
      if (!ids.has(id)) {
        fail(`README references missing ADR-${id}`);
      }
    }
  }
}

if (fs.existsSync(LEGACY_DIR)) {
  const legacyAdrs = fs
    .readdirSync(LEGACY_DIR)
    .filter((name) => /^ADR-\d{4}-/i.test(name));

  if (legacyAdrs.length > 0) {
    fail(
      `Legacy ADR bodies found under docs/architecture/adr (move to docs/adr): ${legacyAdrs.join(", ")}`,
    );
  }
}

if (errors.length > 0) {
  console.error("ADR validation failed:\n");
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

console.log("ADR ID validation passed.");
