import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

import { runGenerator } from "../utils/engine";

const createdDirs: string[] = [];
const sandboxRoot = path.join("tmp", "generator-tests");

function relativeTempDir(): string {
  fs.mkdirSync(sandboxRoot, { recursive: true });
  const absolute = fs.mkdtempSync(path.join(sandboxRoot, "run-"));
  createdDirs.push(absolute);
  return path.relative(process.cwd(), absolute);
}

afterEach(() => {
  while (createdDirs.length > 0) {
    const dir = createdDirs.pop();
    if (dir && fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("runGenerator", () => {
  it("creates a component and updates index", () => {
    const dir = relativeTempDir();
    const result = runGenerator("component", {
      name: "SampleCard",
      path: dir,
    });

    assert.equal(result.files.length, 2);
    assert.deepEqual(result.files, [...result.files].sort((a, b) => a.localeCompare(b, "en")));
    assert.equal(
      fs.existsSync(path.join(dir, "SampleCard", "SampleCard.tsx")),
      true,
    );
    assert.match(
      fs.readFileSync(path.join(dir, "index.ts"), "utf8"),
      /export \* from "\.\/SampleCard"/,
    );
  });

  it("creates a hook with use prefix", () => {
    const dir = relativeTempDir();
    runGenerator("hook", { name: "useSample", path: dir });

    assert.equal(
      fs.existsSync(path.join(dir, "useSample", "useSample.ts")),
      true,
    );
  });

  it("creates a slice folder", () => {
    const dir = relativeTempDir();
    runGenerator("slice", { name: "sample", path: dir });

    assert.equal(
      fs.existsSync(path.join(dir, "sample", "sampleSlice.ts")),
      true,
    );
    assert.match(
      fs.readFileSync(path.join(dir, "sample", "sampleSlice.ts"), "utf8"),
      /name: "sample"/,
    );
  });

  it("protects against overwrite without --force", () => {
    const dir = relativeTempDir();
    runGenerator("hook", { name: "useSample", path: dir });

    assert.throws(
      () => runGenerator("hook", { name: "useSample", path: dir }),
      /already exists/,
    );
  });

  it("supports dry-run without writing files", () => {
    const dir = relativeTempDir();
    runGenerator("slice", {
      name: "sample",
      path: dir,
      dryRun: true,
    });

    assert.equal(fs.existsSync(path.join(dir, "sample")), false);
  });

  it("rejects unimplemented generators", () => {
    assert.throws(
      () => runGenerator("api", { name: "users", path: relativeTempDir() }),
      /not implemented/,
    );
  });

  it("keeps barrel exports deterministic and de-duplicated", () => {
    const dir = relativeTempDir();

    runGenerator("component", { name: "BetaCard", path: dir });
    runGenerator("component", { name: "AlphaCard", path: dir });
    runGenerator("component", { name: "AlphaCard", path: dir, force: true });

    const barrel = fs.readFileSync(path.join(dir, "index.ts"), "utf8");
    const exports = barrel
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("export *"));

    assert.deepEqual(exports, [
      'export * from "./AlphaCard";',
      'export * from "./BetaCard";',
    ]);
  });

  it("produces stable content for identical input", () => {
    const firstDir = relativeTempDir();
    const secondDir = relativeTempDir();

    runGenerator("slice", { name: "stableSample", path: firstDir });
    runGenerator("slice", { name: "stableSample", path: secondDir });

    const first = fs.readFileSync(
      path.join(firstDir, "stableSample", "stableSampleSlice.ts"),
      "utf8",
    );
    const second = fs.readFileSync(
      path.join(secondDir, "stableSample", "stableSampleSlice.ts"),
      "utf8",
    );

    assert.equal(first, second);
    assert.equal(first.includes("\r"), false);
  });
});
