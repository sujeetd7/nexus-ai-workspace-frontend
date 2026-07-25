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

  it("maps test and a11y props to DOM attributes", () => {
    renderWithSharedUI(
      <Input
        testID="mapped"
        id="mapped-id"
        accessibilityLabel="Mapped field"
        accessibilityHint="Should not become title"
        disabled
      />,
    );
    const node = screen.getByTestId("mapped");
    expect(node.getAttribute("data-testid")).toBe("mapped");
    expect(node.getAttribute("id")).toBe("mapped-id");
    expect(node.getAttribute("aria-label")).toBe("Mapped field");
    expect(node.getAttribute("aria-disabled")).toBe("true");
    expect(node.getAttribute("testID")).toBeNull();
    expect(node.getAttribute("accessibilityLabel")).toBeNull();
    expect(node.getAttribute("accessibilityHint")).toBeNull();
    expect(node.getAttribute("accessibilityState")).toBeNull();
    expect(node.getAttribute("title")).toBeNull();
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
