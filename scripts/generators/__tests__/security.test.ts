import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, it } from "node:test";

import {
  findWorkspaceRoot,
  isAbsolutePathInput,
  resolveOutputPath,
  validateName,
} from "../utils/paths";

const created: string[] = [];
const sandboxRoot = path.join("tmp", "generator-security");

function relativeTempDir(): string {
  fs.mkdirSync(sandboxRoot, { recursive: true });
  const absolute = fs.mkdtempSync(path.join(sandboxRoot, "run-"));
  created.push(absolute);
  return path.relative(process.cwd(), absolute);
}

afterEach(() => {
  while (created.length > 0) {
    const entry = created.pop();
    if (entry && fs.existsSync(entry)) {
      fs.rmSync(entry, { recursive: true, force: true });
    }
  }
});

describe("generator path security", () => {
  it("detects absolute path forms cross-platform", () => {
    assert.equal(isAbsolutePathInput("/etc/passwd"), true);
    assert.equal(isAbsolutePathInput("C:\\Windows"), true);
    assert.equal(isAbsolutePathInput("C:/Windows"), true);
    assert.equal(isAbsolutePathInput("D:temp"), true);
    assert.equal(isAbsolutePathInput("\\\\server\\share"), true);
    assert.equal(isAbsolutePathInput("//server/share"), true);
    assert.equal(isAbsolutePathInput("apps/web/src"), false);
    assert.equal(isAbsolutePathInput(".\\apps\\web"), false);
  });

  it("rejects drive-rooted, UNC, and POSIX absolute paths", () => {
    assert.throws(() => resolveOutputPath("C:\\Windows"), /absolute/i);
    assert.throws(() => resolveOutputPath("C:/Windows"), /absolute/i);
    assert.throws(() => resolveOutputPath("/etc/passwd"), /absolute/i);
    assert.throws(() => resolveOutputPath("\\\\server\\share\\x"), /absolute/i);
    assert.throws(() => resolveOutputPath("//server/share/x"), /absolute/i);
  });

  it("rejects traversal including encoded and mixed separators", () => {
    assert.throws(() => resolveOutputPath("../outside"), /\.\.|invalid/i);
    assert.throws(() => resolveOutputPath("..\\outside"), /\.\.|invalid/i);
    assert.throws(
      () => resolveOutputPath("apps\\..\\..\\outside"),
      /\.\.|invalid|escapes/i,
    );
    assert.throws(
      () => resolveOutputPath("%2e%2e/outside"),
      /encoded|invalid|\.\./i,
    );
    assert.throws(
      () => resolveOutputPath("foo/%2e%2e%2fbar"),
      /encoded|invalid|\.\./i,
    );
  });

  it("rejects Windows reserved names and trailing junk", () => {
    assert.throws(() => resolveOutputPath("foo/CON"), /reserved/i);
    assert.throws(() => resolveOutputPath("foo/nul.txt"), /reserved/i);
    assert.throws(() => validateName("PRN"), /reserved/i);
    assert.throws(() => resolveOutputPath("foo/bar."), /space or dot/i);
    assert.throws(() => validateName("bad<name>"), /invalid/i);
  });

  it("resolves relative paths inside the workspace", () => {
    const dir = relativeTempDir();
    const resolved = resolveOutputPath(dir);
    const root = findWorkspaceRoot();

    assert.equal(path.isAbsolute(resolved), true);
    assert.equal(
      path.relative(root, resolved).startsWith(".."),
      false,
    );
  });

  it("rejects symlink destinations that escape the workspace", () => {
    const dir = relativeTempDir();
    const absoluteDir = path.resolve(dir);
    const outside = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-gen-out-"));
    created.push(outside);

    const linkPath = path.join(absoluteDir, "escape-link");

    try {
      fs.symlinkSync(outside, linkPath, "dir");
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code?: string }).code)
          : "";

      // Windows may require elevated privileges for symlinks.
      if (code === "EPERM" || code === "EACCES") {
        return;
      }

      throw error;
    }

    const relativeLink = path.join(dir, "escape-link");

    assert.throws(
      () => resolveOutputPath(relativeLink),
      /escapes|symlink/i,
    );
  });
});
