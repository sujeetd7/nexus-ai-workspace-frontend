import { describe, expect, it } from "vitest";

import {
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  ErrorText,
  FormField,
  HelperText,
  Input,
  Label,
  Loader,
  Section,
  Stack,
  Surface,
  Text,
  View,
  XStack,
  YStack,
} from "../index";

describe("Level 1 + Level 2 public exports", () => {
  it("exports Batch 2.4 primitives and Batch 2.5 composites from the package root", () => {
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

    expect(FormField).toEqual(expect.any(Function));
    expect(HelperText).toEqual(expect.any(Function));
    expect(ErrorText).toEqual(expect.any(Function));
    expect(Badge).toEqual(expect.any(Function));
    expect(Chip).toEqual(expect.any(Function));
    expect(Card).toEqual(expect.any(Function));
    expect(Surface).toEqual(expect.any(Function));
    expect(Section).toEqual(expect.any(Function));
  });

  it("does not export Tooltip (deferred — see COMPONENTS.md)", async () => {
    const mod = await import("../index");
    expect("Tooltip" in mod).toBe(false);
  });
});
