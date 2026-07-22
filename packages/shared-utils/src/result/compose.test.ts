import { describe, expect, it } from "vitest";

import { ERROR_CODES } from "@nexus/shared-types";

import {
  allResults,
  andThen,
  andThenAsync,
  err,
  fromPromise,
  fromThrowable,
  mapResultAsync,
  matchResult,
  ok,
} from "./index";

describe("result composition helpers", () => {
  it("mapResultAsync maps ok and short-circuits err", async () => {
    await expect(
      mapResultAsync(ok(2), async (n) => n * 2),
    ).resolves.toEqual(ok(4));

    await expect(
      mapResultAsync(err("e"), async (n: number) => n * 2),
    ).resolves.toEqual(err("e"));
  });

  it("andThen chains results and short-circuits", () => {
    expect(andThen(ok(2), (n) => ok(n + 1))).toEqual(ok(3));
    expect(andThen(ok(2), () => err("fail"))).toEqual(err("fail"));
    expect(andThen(err("early"), (n: number) => ok(n))).toEqual(err("early"));
  });

  it("andThenAsync supports async success and failure", async () => {
    await expect(
      andThenAsync(ok("a"), async (value) => ok(value.toUpperCase())),
    ).resolves.toEqual(ok("A"));

    await expect(
      andThenAsync(err("no"), async (value: string) => ok(value)),
    ).resolves.toEqual(err("no"));
  });

  it("matchResult covers ok and err branches", () => {
    expect(
      matchResult(ok(1), {
        ok: (value) => `ok:${value}`,
        err: (error) => `err:${error}`,
      }),
    ).toBe("ok:1");

    expect(
      matchResult(err("x"), {
        ok: (value: number) => `ok:${value}`,
        err: (error) => `err:${error}`,
      }),
    ).toBe("err:x");
  });

  it("fromThrowable and fromPromise normalize thrown values", async () => {
    expect(fromThrowable(() => 1)).toEqual(ok(1));

    const thrown = fromThrowable(() => {
      throw new Error("boom");
    });

    expect(thrown.ok).toBe(false);
    if (!thrown.ok) {
      expect(thrown.error.code).toBe(ERROR_CODES.UNKNOWN);
      expect(thrown.error.message).toBe("boom");
    }

    await expect(fromPromise(Promise.resolve(5))).resolves.toEqual(ok(5));

    const rejected = await fromPromise(Promise.reject("nope"));
    expect(rejected.ok).toBe(false);
    if (!rejected.ok) {
      expect(rejected.error.message).toBe("nope");
    }
  });

  it("allResults aggregates in order and returns first error", () => {
    expect(allResults([ok(1), ok(2), ok(3)])).toEqual(ok([1, 2, 3]));
    expect(allResults([ok(1), err("first"), err("second")])).toEqual(
      err("first"),
    );
  });
});
