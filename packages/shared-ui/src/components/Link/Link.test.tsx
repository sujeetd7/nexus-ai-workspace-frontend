import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Link } from "./Link";

afterEach(() => {
  cleanup();
});

describe("Link (web native <a>)", () => {
  it("renders an anchor with href", () => {
    renderWithSharedUI(
      <Link testID="forgot" href="/forgot-password">
        Forgot password?
      </Link>,
    );
    const node = screen.getByTestId("forgot");
    expect(node.tagName).toBe("A");
    expect(node.getAttribute("href")).toBe("/forgot-password");
  });

  it("applies external security attributes", () => {
    renderWithSharedUI(
      <Link testID="docs" href="https://example.com" external>
        Docs
      </Link>,
    );
    const node = screen.getByTestId("docs");
    expect(node.getAttribute("target")).toBe("_blank");
    expect(node.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("disables navigation and sets aria-disabled", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Link testID="go" href="#next" disabled onPress={onPress}>
        Continue
      </Link>,
    );
    const node = screen.getByTestId("go");
    expect(node.getAttribute("aria-disabled")).toBe("true");
    expect(node.getAttribute("href")).toBeNull();
    fireEvent.click(node);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("invokes onPress when enabled without document navigation", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <Link testID="go" href="#continue" onPress={onPress}>
        Continue
      </Link>,
    );
    fireEvent.click(screen.getByTestId("go"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("exposes accessibility label and omits RN prop names", () => {
    renderWithSharedUI(
      <Link
        testID="help"
        href="#help"
        accessibilityLabel="Open help center"
        accessibilityHint="Opens the help article"
      >
        Help
      </Link>,
    );
    const node = screen.getByTestId("help");
    expect(node.getAttribute("aria-label")).toBe("Open help center");
    expect(node.getAttribute("data-testid")).toBe("help");
    expect(node.getAttribute("testID")).toBeNull();
    expect(node.getAttribute("accessibilityLabel")).toBeNull();
    expect(node.getAttribute("accessibilityHint")).toBeNull();
    expect(node.getAttribute("title")).toBeNull();
  });
});

describe("Link variants", () => {
  it("renders subtle and destructive without throwing", () => {
    renderWithSharedUI(
      <>
        <Link testID="subtle" href="/a" variant="subtle">
          Subtle
        </Link>
        <Link testID="danger" href="/b" variant="destructive">
          Delete account
        </Link>
        <Text>ok</Text>
      </>,
    );
    expect(screen.getByTestId("subtle")).toBeTruthy();
    expect(screen.getByTestId("danger")).toBeTruthy();
  });
});
