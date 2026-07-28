import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { SearchField } from "./SearchField";

afterEach(() => {
  cleanup();
});

describe("SearchField", () => {
  it("renders controlled value and placeholder", () => {
    renderWithSharedUI(
      <SearchField
        testID="search"
        value="nexus"
        onChangeText={() => {}}
        placeholder="Search workspaces"
        accessibilityLabel="Search workspaces"
      />,
    );
    const input = screen.getByTestId("search") as HTMLInputElement;
    expect(input.value).toBe("nexus");
    expect(input.getAttribute("aria-label") ?? input.getAttribute("placeholder")).toBeTruthy();
  });

  it("forwards onChangeText for controlled updates", () => {
    const onChangeText = vi.fn();
    renderWithSharedUI(
      <SearchField
        testID="search"
        value=""
        onChangeText={onChangeText}
        accessibilityLabel="Search"
      />,
    );
    fireEvent.change(screen.getByTestId("search"), {
      target: { value: "a" },
    });
    expect(onChangeText).toHaveBeenCalled();
  });

  it("shows clear control and clears via onChangeText by default", () => {
    const onChangeText = vi.fn();
    renderWithSharedUI(
      <SearchField
        testID="search"
        value="query"
        onChangeText={onChangeText}
        accessibilityLabel="Search"
      />,
    );
    fireEvent.click(screen.getByTestId("search-clear"));
    expect(onChangeText).toHaveBeenCalledWith("");
  });

  it("honors onClear when provided", () => {
    const onClear = vi.fn();
    renderWithSharedUI(
      <SearchField
        testID="search"
        value="query"
        onChangeText={() => {}}
        onClear={onClear}
        accessibilityLabel="Search"
      />,
    );
    fireEvent.click(screen.getByTestId("search-clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("shows loading indicator and hides clear", () => {
    renderWithSharedUI(
      <SearchField
        testID="search"
        value="query"
        loading
        onChangeText={() => {}}
        accessibilityLabel="Search"
      />,
    );
    expect(screen.getByTestId("search-loading")).toBeTruthy();
    expect(screen.queryByTestId("search-clear")).toBeNull();
  });

  it("respects disabled state", () => {
    renderWithSharedUI(
      <SearchField
        testID="search"
        value="query"
        disabled
        onChangeText={() => {}}
        accessibilityLabel="Search"
      />,
    );
    const input = screen.getByTestId("search") as HTMLInputElement;
    expect(input.disabled || input.getAttribute("aria-disabled")).toBeTruthy();
    expect(screen.queryByTestId("search-clear")).toBeNull();
  });

  it("supports custom leading icon and omitting leading", () => {
    const { rerender } = renderWithSharedUI(
      <SearchField
        testID="search"
        value=""
        leadingIcon={<Text testID="custom-lead">S</Text>}
        onChangeText={() => {}}
        accessibilityLabel="Search"
      />,
    );
    expect(screen.getByTestId("custom-lead")).toBeTruthy();

    rerender(
      <SearchField
        testID="search"
        value=""
        leadingIcon={null}
        onChangeText={() => {}}
        accessibilityLabel="Search"
      />,
    );
    expect(screen.queryByTestId("custom-lead")).toBeNull();
  });
});
