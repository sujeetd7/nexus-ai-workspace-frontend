import { describe, expect, it } from "vitest";

import {
  Button,
  Divider,
  Input,
  Label,
  Loader,
  Stack,
  Text,
  View,
  XStack,
  YStack,
} from "../index";

describe("Level 1 public exports", () => {
  it("exports all Batch 2.4 primitives from the package root", () => {
    expect(View).toEqual(expect.any(Function));
    expect(Text).toEqual(expect.any(Function));
    expect(Stack).toEqual(expect.any(Function));
    expect(XStack).toEqual(expect.any(Function));
    expect(YStack).toEqual(expect.any(Function));
    expect(Button).toEqual(expect.any(Function));
    expect(Input).toEqual(expect.any(Function));
    expect(Label).toEqual(expect.any(Function));
    expect(Divider).toEqual(expect.any(Function));
    expect(Loader).toEqual(expect.any(Function));
  });
});

// Batch 2.5 composite export coverage lives in composites.exports.test.ts
