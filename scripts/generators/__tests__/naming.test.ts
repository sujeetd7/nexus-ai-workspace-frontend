import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ensureHookName,
  toCamelCase,
  toPascalCase,
} from "../utils/naming";
import { resolveOutputPath, validateName } from "../utils/paths";

describe("naming", () => {
  it("converts to PascalCase", () => {
    assert.equal(toPascalCase("sample-card"), "SampleCard");
    assert.equal(toPascalCase("SampleCard"), "SampleCard");
  });

  it("converts to camelCase", () => {
    assert.equal(toCamelCase("sample"), "sample");
    assert.equal(toCamelCase("SampleCard"), "sampleCard");
  });

  it("ensures hook use prefix", () => {
    assert.equal(ensureHookName("sample"), "useSample");
    assert.equal(ensureHookName("useSample"), "useSample");
  });
});

describe("paths", () => {
  it("validates names", () => {
    assert.equal(validateName(" SampleCard "), "SampleCard");
    assert.throws(() => validateName(" "), /required/i);
  });

  it("rejects path traversal", () => {
    assert.throws(() => resolveOutputPath("../outside"), /\.\.|invalid/i);
  });

  it("rejects absolute paths", () => {
    assert.throws(() => resolveOutputPath("/tmp/out"), /absolute/i);
  });
});
