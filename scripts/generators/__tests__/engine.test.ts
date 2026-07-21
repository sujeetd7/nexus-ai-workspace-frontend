import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

import { runGenerator } from "../utils/engine";

const createdDirs: string[] = [];

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-gen-"));
  createdDirs.push(dir);
  return dir;
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
    const dir = tempDir();
    const result = runGenerator("component", {
      name: "SampleCard",
      path: dir,
    });

    assert.equal(result.files.length, 2);
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
    const dir = tempDir();
    runGenerator("hook", { name: "useSample", path: dir });

    assert.equal(
      fs.existsSync(path.join(dir, "useSample", "useSample.ts")),
      true,
    );
  });

  it("creates a slice folder", () => {
    const dir = tempDir();
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
    const dir = tempDir();
    runGenerator("hook", { name: "useSample", path: dir });

    assert.throws(
      () => runGenerator("hook", { name: "useSample", path: dir }),
      /already exists/,
    );
  });

  it("supports dry-run without writing files", () => {
    const dir = tempDir();
    runGenerator("slice", {
      name: "sample",
      path: dir,
      dryRun: true,
    });

    assert.equal(fs.existsSync(path.join(dir, "sample")), false);
  });

  it("rejects unimplemented generators", () => {
    assert.throws(
      () => runGenerator("api", { name: "users", path: tempDir() }),
      /not implemented/,
    );
  });
});
