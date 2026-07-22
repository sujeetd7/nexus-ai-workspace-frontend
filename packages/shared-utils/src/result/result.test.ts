import { describe, expect, it } from "vitest";

import {
  err,
  isErr,
  isOk,
  mapErr,
  mapResult,
  ok,
  unwrap,
  unwrapOr,
} from "./result";

describe("result helpers", () => {
  it("creates ok and err variants", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
    expect(err("boom")).toEqual({ ok: false, error: "boom" });
  });

  it("narrows with isOk and isErr", () => {
    const success = ok("yes");
    const failure = err("no");

    expect(isOk(success)).toBe(true);
    expect(isErr(success)).toBe(false);
    expect(isOk(failure)).toBe(false);
    expect(isErr(failure)).toBe(true);
  });

  it("unwraps values and throws on error", () => {
    expect(unwrap(ok(7))).toBe(7);
    expect(() => unwrap(err(new Error("fail")))).toThrow("fail");
    expect(() => unwrap(err("fail"))).toThrow("fail");
  });

  it("unwrapOr returns fallback for errors", () => {
    expect(unwrapOr(ok(1), 0)).toBe(1);
    expect(unwrapOr(err("x"), 0)).toBe(0);
  });

  it("maps values and errors", () => {
    expect(mapResult(ok(2), (n) => n * 2)).toEqual(ok(4));
    expect(mapResult(err("e"), (n: number) => n * 2)).toEqual(err("e"));
    expect(mapErr(ok(1), (e: string) => e.toUpperCase())).toEqual(ok(1));
    expect(mapErr(err("e"), (e) => e.toUpperCase())).toEqual(err("E"));
  });
});
