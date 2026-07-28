import { describe, expect, it } from "vitest";

import type { ButtonShape } from "./Button/Button.types";
import type { ChipTone } from "./Chip/Chip.types";
import type { SurfaceBorderTone } from "./Surface/Surface";
import type { SemanticBackground } from "./shared/types";
import type { TextVariant } from "./Text/Text";

describe("Batch 5.DS.2 public API additives", () => {
  it("documents additive shape/tone/background/variant unions", () => {
    const shapes: ButtonShape[] = ["default", "pill"];
    const tones: ChipTone[] = ["default", "muted"];
    const borders: SurfaceBorderTone[] = ["none", "default", "subtle"];
    const backgrounds: SemanticBackground[] = [
      "background",
      "surface",
      "surfaceMuted",
      "transparent",
    ];
    const variants: TextVariant[] = [
      "display",
      "h1",
      "h2",
      "h3",
      "body",
      "caption",
      "sectionLabel",
      "label",
    ];

    expect(shapes).toContain("pill");
    expect(tones).toContain("muted");
    expect(borders).toContain("subtle");
    expect(backgrounds).toContain("surfaceMuted");
    expect(variants).toContain("sectionLabel");
  });

  it("does not introduce ChatGPT / OpenAI product strings in additive type names", () => {
    const names = [
      "ButtonShape",
      "ChipTone",
      "SurfaceBorderTone",
      "surfaceMuted",
      "sectionLabel",
    ]
      .join(" ")
      .toLowerCase();
    expect(names.includes("chatgpt")).toBe(false);
    expect(names.includes("openai")).toBe(false);
  });
});
