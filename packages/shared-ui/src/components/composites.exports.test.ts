import { describe, expect, it } from "vitest";

import {
  AuthCard,
  AuthFooter,
  AuthHeader,
  AuthShell,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  EmptyState,
  ErrorText,
  FormField,
  HelperText,
  Icon,
  IconButton,
  InlineAlert,
  Input,
  Label,
  Link,
  ListRow,
  Loader,
  PasswordField,
  SearchField,
  Section,
  SettingsRow,
  Skeleton,
  Stack,
  Surface,
  Switch,
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

  it("exports Batch 5.DS.3 foundation composites", () => {
    expect(Avatar).toEqual(expect.any(Function));
    expect(Skeleton).toEqual(expect.any(Function));
    expect(Switch).toEqual(expect.any(Function));
    expect(IconButton).toEqual(expect.any(Function));
  });

  it("exports Batch 5.DS.4 shared composites", () => {
    expect(SearchField).toEqual(expect.any(Function));
    expect(ListRow).toEqual(expect.any(Function));
    expect(SettingsRow).toEqual(expect.any(Function));
    expect(EmptyState).toEqual(expect.any(Function));
  });

  it("exports Batch 5.2C auth-critical components", () => {
    expect(Link).toEqual(expect.any(Function));
    expect(Checkbox).toEqual(expect.any(Function));
    expect(Icon).toEqual(expect.any(Function));
    expect(PasswordField).toEqual(expect.any(Function));
  });

  it("exports Batch 5.2D InlineAlert and auth patterns", () => {
    expect(InlineAlert).toEqual(expect.any(Function));
    expect(AuthShell).toEqual(expect.any(Function));
    expect(AuthCard).toEqual(expect.any(Function));
    expect(AuthHeader).toEqual(expect.any(Function));
    expect(AuthFooter).toEqual(expect.any(Function));
  });

  it("does not export Tooltip (deferred — see COMPONENTS.md)", async () => {
    const mod = await import("../index");
    expect("Tooltip" in mod).toBe(false);
  });

  it("does not export Modal or Toast (deferred / incomplete)", async () => {
    const mod = await import("../index");
    expect("Modal" in mod).toBe(false);
    expect("Toast" in mod).toBe(false);
  });
});
