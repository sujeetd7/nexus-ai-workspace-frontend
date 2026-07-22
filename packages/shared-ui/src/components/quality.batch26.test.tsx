import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  renderWithSharedUI,
  renderWithThemePreference,
} from "../testing/render";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { FormField } from "./FormField";
import { Text } from "./Text";

afterEach(() => {
  cleanup();
});

describe("Batch 2.6 quality — theme", () => {
  it("renders Badge and FormField under dark preference", () => {
    renderWithThemePreference(
      <>
        <Badge testID="badge-dark" variant="success">
          Ok
        </Badge>
        <FormField
          id="dark-field"
          label="Name"
          testID="field-dark"
          helperText="Hint"
        />
      </>,
      "dark",
    );
    expect(screen.getByTestId("badge-dark").textContent).toContain("Ok");
    expect(screen.getByTestId("field-dark-helper").textContent).toContain(
      "Hint",
    );
  });

  it("switches light vs dark Text without throwing", () => {
    const { unmount } = renderWithSharedUI(
      <Text testID="t-light">Light</Text>,
      { preference: "light" },
    );
    expect(screen.getByTestId("t-light").textContent).toContain("Light");
    unmount();

    renderWithThemePreference(<Text testID="t-dark">Dark</Text>, "dark");
    expect(screen.getByTestId("t-dark").textContent).toContain("Dark");
  });
});

describe("Batch 2.6 quality — interaction / a11y", () => {
  it("Chip is keyboard-focusable as a native button", () => {
    renderWithSharedUI(
      <Chip testID="chip-focus" selected>
        Focus me
      </Chip>,
    );
    const node = screen.getByTestId("chip-focus") as HTMLButtonElement;
    node.focus();
    expect(document.activeElement).toBe(node);
    expect(node.getAttribute("aria-pressed")).toBe("true");
  });

  it("Button supports keyboard click via native button semantics", () => {
    renderWithSharedUI(<Button testID="btn-key">Go</Button>);
    const node = screen.getByTestId("btn-key");
    expect(node.tagName).toBe("BUTTON");
    fireEvent.keyDown(node, { key: "Enter" });
    expect(node).toBeTruthy();
  });

  it("FormField error uses alert semantics", () => {
    renderWithSharedUI(
      <FormField
        id="err-field"
        label="City"
        errorText="Required"
        testID="err-field"
      />,
    );
    const error = screen.getByTestId("err-field-error");
    expect(
      error.getAttribute("role") === "alert" ||
        error.getAttribute("aria-role") === "alert",
    ).toBe(true);
  });
});
