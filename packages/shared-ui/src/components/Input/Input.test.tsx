import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Input } from "./Input";

afterEach(() => {
  cleanup();
});

describe("Input", () => {
  it("calls onChangeText", () => {
    const onChangeText = vi.fn();
    renderWithSharedUI(
      <Input
        testID="email"
        accessibilityLabel="Email"
        onChangeText={onChangeText}
      />,
    );
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "a@b.com" },
    });
    expect(onChangeText).toHaveBeenCalled();
  });

  it("sets non-editable when disabled", () => {
    renderWithSharedUI(
      <Input testID="field" accessibilityLabel="Name" disabled />,
    );
    const node = screen.getByTestId("field");
    expect(
      node.getAttribute("disabled") !== null ||
        node.getAttribute("readonly") !== null ||
        (node as HTMLInputElement).readOnly === true,
    ).toBe(true);
  });

  it("marks invalid state for assistive tech", () => {
    renderWithSharedUI(
      <Input testID="bad" accessibilityLabel="Name" invalid required />,
    );
    expect(screen.getByTestId("bad").getAttribute("aria-invalid")).toBe("true");
  });

  it("supports secure text entry without throwing", () => {
    renderWithSharedUI(
      <Input testID="secret" accessibilityLabel="Password" secureTextEntry />,
    );
    expect(screen.getByTestId("secret")).toBeTruthy();
  });

  it("forwards autoComplete and maxLength", () => {
    renderWithSharedUI(
      <Input
        testID="user"
        accessibilityLabel="Username"
        autoComplete="username"
        maxLength={32}
      />,
    );
    const node = screen.getByTestId("user") as HTMLInputElement;
    expect(
      node.getAttribute("autocomplete") ?? node.getAttribute("autoComplete"),
    ).toMatch(/username/i);
    expect(node.getAttribute("maxLength") ?? String(node.maxLength)).toMatch(
      /32/,
    );
  });

  it("renders leading and trailing adornments", () => {
    renderWithSharedUI(
      <Input
        testID="with-slots"
        accessibilityLabel="Amount"
        leading={<Text testID="lead">$</Text>}
        trailing={<Text testID="trail">USD</Text>}
      />,
    );
    expect(screen.getByTestId("lead")).toBeTruthy();
    expect(screen.getByTestId("trail")).toBeTruthy();
    expect(screen.getByTestId("with-slots")).toBeTruthy();
  });
});
