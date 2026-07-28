import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Text } from "../Text";
import { Avatar } from "./Avatar";
import { avatarSizeMap } from "./avatarTokens";

afterEach(() => {
  cleanup();
});

describe("Avatar", () => {
  it("renders initials", () => {
    renderWithSharedUI(
      <Avatar testID="av" initials="nx" alt="Nexus user" />,
    );
    expect(screen.getByTestId("av").textContent).toContain("NX");
  });

  it("renders icon fallback", () => {
    renderWithSharedUI(
      <Avatar
        testID="icon"
        icon={<Text>?</Text>}
        accessibilityLabel="Placeholder"
      />,
    );
    expect(screen.getByTestId("icon").textContent).toContain("?");
  });

  it("hides decorative avatars from assistive tech", () => {
    renderWithSharedUI(<Avatar testID="deco" initials="ab" decorative />);
    const node = screen.getByTestId("deco");
    expect(node.getAttribute("aria-hidden")).toBe("true");
  });

  it("exposes labeled image role when alt is provided", () => {
    renderWithSharedUI(
      <Avatar testID="labeled" initials="ab" alt="Ada Byron" />,
    );
    const node = screen.getByTestId("labeled");
    expect(node.getAttribute("aria-label")).toBe("Ada Byron");
    expect(node.getAttribute("role")).toBe("img");
  });

  it("maps size tokens to spacing-derived dimensions", () => {
    expect(avatarSizeMap.md).toBe(40);
    expect(avatarSizeMap.sm).toBe(32);
  });
});
