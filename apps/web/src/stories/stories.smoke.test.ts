import { describe, expect, it } from "vitest";

import * as stories from "./primitives/Button.stories";
import * as cardStories from "./composites/Card.stories";
import * as formStories from "./composites/FormField.stories";

describe("Storybook CSF smoke", () => {
  it("exports meta titles for core primitives and composites", () => {
    expect(stories.default.title).toBe("Primitives/Button");
    expect(cardStories.default.title).toBe("Composites/Card");
    expect(formStories.default.title).toBe("Composites/FormField");
  });

  it("defines Default stories", () => {
    expect(stories.Default).toBeTruthy();
    expect(cardStories.Default).toBeTruthy();
    expect(formStories.Default).toBeTruthy();
  });
});
