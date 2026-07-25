import { describe, expect, it } from "vitest";

import {
  mapNativeA11yProps,
  mapTamaguiA11yProps,
  mapTestProps,
  mapWebDomProps,
} from "./a11y";

describe("mapTestProps", () => {
  it("maps testID to data-testid on web path via mapWebDomProps", () => {
    expect(mapWebDomProps({ testID: "field" })["data-testid"]).toBe("field");
    expect(
      "testID" in mapWebDomProps({ testID: "field" }),
    ).toBe(false);
  });

  it("preserves testID on native path via mapNativeA11yProps", () => {
    expect(mapNativeA11yProps({ testID: "field" }).testID).toBe("field");
    expect(
      "data-testid" in mapNativeA11yProps({ testID: "field" }),
    ).toBe(false);
  });
});

describe("mapWebDomProps", () => {
  it("maps nativeID, label, role, and state without RN prop names", () => {
    const props = mapWebDomProps({
      testID: "box",
      nativeID: "box-id",
      accessibilityLabel: "Panel",
      accessibilityHint: "Extra detail",
      accessibilityRole: "alert",
      accessibilityState: {
        disabled: true,
        busy: true,
        checked: "mixed",
        expanded: true,
        selected: true,
      },
    });

    expect(props).toEqual({
      "data-testid": "box",
      id: "box-id",
      "aria-label": "Panel",
      role: "alert",
      "aria-disabled": true,
      "aria-busy": true,
      "aria-checked": "mixed",
      "aria-expanded": true,
      "aria-selected": true,
    });
    expect(props).not.toHaveProperty("accessibilityLabel");
    expect(props).not.toHaveProperty("accessibilityHint");
    expect(props).not.toHaveProperty("accessibilityRole");
    expect(props).not.toHaveProperty("accessibilityState");
    expect(props).not.toHaveProperty("testID");
    expect(props).not.toHaveProperty("nativeID");
    expect(props).not.toHaveProperty("title");
  });

  it("omits role when prefer native HTML semantics", () => {
    const props = mapWebDomProps(
      { accessibilityRole: "button", accessibilityLabel: "Save" },
      { omitWebRole: true },
    );
    expect(props.role).toBeUndefined();
    expect(props["aria-label"]).toBe("Save");
  });

  it("hides decorative content with aria-hidden and no label/role", () => {
    const props = mapWebDomProps(
      { testID: "deco", accessibilityLabel: "ignored" },
      { hidden: true, webRole: "presentation" },
    );
    expect(props["aria-hidden"]).toBe(true);
    expect(props["data-testid"]).toBe("deco");
    expect(props.role).toBeUndefined();
    expect(props["aria-label"]).toBeUndefined();
  });

  it("maps progress role to progressbar", () => {
    expect(
      mapWebDomProps({ accessibilityRole: "progress" }).role,
    ).toBe("progressbar");
  });

  it("maps heading role to heading (not RN header)", () => {
    expect(
      mapWebDomProps({ accessibilityRole: "heading" }).role,
    ).toBe("heading");
  });

  it("does not emit invalid ARIA role for text", () => {
    expect(
      mapWebDomProps({ accessibilityRole: "text" }).role,
    ).toBeUndefined();
  });
});

describe("mapTamaguiA11yProps", () => {
  it("omits Tamagui role for RN-only text accessibility role", () => {
    const props = mapTamaguiA11yProps({
      testID: "copy",
      accessibilityLabel: "Body",
      accessibilityRole: "text",
    });
    expect(props.role).toBeUndefined();
    expect(props.testID).toBe("copy");
    expect(props["aria-label"]).toBe("Body");
  });

  it("maps valid web roles for Tamagui hosts", () => {
    expect(
      mapTamaguiA11yProps({ accessibilityRole: "alert" }).role,
    ).toBe("alert");
    expect(
      mapTamaguiA11yProps({ accessibilityRole: "heading" }).role,
    ).toBe("heading");
    expect(
      mapTamaguiA11yProps({ accessibilityRole: "progress" }).role,
    ).toBe("progressbar");
  });
});

describe("mapNativeA11yProps", () => {
  it("preserves React Native prop names and maps roles", () => {
    const props = mapNativeA11yProps({
      testID: "box",
      nativeID: "box-id",
      accessibilityLabel: "Panel",
      accessibilityHint: "Extra detail",
      accessibilityRole: "heading",
      accessibilityState: { disabled: true },
    });

    expect(props).toEqual({
      testID: "box",
      nativeID: "box-id",
      accessibilityLabel: "Panel",
      accessibilityHint: "Extra detail",
      accessibilityRole: "header",
      accessibilityState: { disabled: true },
    });
    expect(props).not.toHaveProperty("data-testid");
    expect(props).not.toHaveProperty("aria-label");
    expect(props).not.toHaveProperty("id");
    expect(props).not.toHaveProperty("role");
  });

  it("preserves React Native text accessibility role", () => {
    const props = mapNativeA11yProps({
      accessibilityRole: "text",
      accessibilityLabel: "Caption",
    });
    expect(props.accessibilityRole).toBe("text");
    expect(props.accessibilityLabel).toBe("Caption");
    expect(props).not.toHaveProperty("role");
  });

  it("applies decorative hide flags on native", () => {
    const props = mapNativeA11yProps({ testID: "deco" }, { hidden: true });
    expect(props.accessible).toBe(false);
    expect(props.accessibilityElementsHidden).toBe(true);
    expect(props.importantForAccessibility).toBe("no");
  });
});

describe("mapTestProps platform helper", () => {
  it("returns empty object when testID is absent", () => {
    expect(mapTestProps(undefined)).toEqual({});
  });
});
