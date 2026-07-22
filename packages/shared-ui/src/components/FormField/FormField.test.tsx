import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { FormField } from "./FormField";

afterEach(() => {
  cleanup();
});

describe("FormField", () => {
  it("composes label, input, and helper text with describedby", () => {
    renderWithSharedUI(
      <FormField
        id="email"
        label="Email"
        helperText="We never share your email"
        testID="email-field"
      />,
    );

    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("We never share your email")).toBeTruthy();
    const input = screen.getByTestId("email-field-input");
    expect(input.getAttribute("aria-describedby")).toBe("email-helper");
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("shows error state and replaces helper text", () => {
    renderWithSharedUI(
      <FormField
        id="name"
        label="Name"
        helperText="Optional"
        errorText="Name is required"
        testID="name-field"
      />,
    );

    expect(screen.queryByText("Optional")).toBeNull();
    expect(screen.getByText("Name is required")).toBeTruthy();
    const input = screen.getByTestId("name-field-input");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("name-error");
  });

  it("marks required and disabled on the composed input", () => {
    renderWithSharedUI(
      <FormField id="city" label="City" required disabled testID="city-field" />,
    );
    const input = screen.getByTestId("city-field-input");
    expect(input.getAttribute("aria-required")).toBe("true");
    expect(
      input.getAttribute("disabled") !== null ||
        input.getAttribute("readonly") !== null ||
        (input as HTMLInputElement).readOnly === true,
    ).toBe(true);
  });

  it("forwards onChangeText", () => {
    const onChangeText = vi.fn();
    renderWithSharedUI(
      <FormField
        id="note"
        label="Note"
        testID="note-field"
        onChangeText={onChangeText}
      />,
    );
    fireEvent.change(screen.getByTestId("note-field-input"), {
      target: { value: "hello" },
    });
    expect(onChangeText).toHaveBeenCalled();
  });
});
