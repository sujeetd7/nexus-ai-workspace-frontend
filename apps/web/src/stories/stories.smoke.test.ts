import { describe, expect, it } from "vitest";

import * as stories from "./primitives/Button.stories";
import * as cardStories from "./composites/Card.stories";
import * as formStories from "./composites/FormField.stories";
import * as inlineAlertStories from "./composites/InlineAlert.stories";
import * as loginStories from "./patterns/auth/Login.stories";
import * as verifyEmailStories from "./patterns/auth/VerifyEmail.stories";
import * as appShellStories from "./patterns/AppShell/AppShell.stories";
import * as authShellStories from "./patterns/AuthShell.stories";

describe("Storybook CSF smoke", () => {
  it("exports meta titles for core primitives and composites", () => {
    expect(stories.default.title).toBe("Primitives/Button");
    expect(cardStories.default.title).toBe("Composites/Card");
    expect(formStories.default.title).toBe("Composites/FormField");
    expect(inlineAlertStories.default.title).toBe("Composites/InlineAlert");
  });

  it("exports meta titles for auth and shell patterns", () => {
    expect(authShellStories.default.title).toBe("Patterns/AuthShell");
    expect(appShellStories.default.title).toBe("Patterns/AppShell");
    expect(loginStories.default.title).toBe("Patterns/Auth/Login");
    expect(verifyEmailStories.default.title).toBe("Patterns/Auth/VerifyEmail");
  });

  it("defines Default stories", () => {
    expect(stories.Default).toBeTruthy();
    expect(cardStories.Default).toBeTruthy();
    expect(formStories.Default).toBeTruthy();
    expect(inlineAlertStories.Default).toBeTruthy();
    expect(authShellStories.Default).toBeTruthy();
    expect(appShellStories.Default).toBeTruthy();
    expect(loginStories.Default).toBeTruthy();
    expect(verifyEmailStories.Loading).toBeTruthy();
  });
});
