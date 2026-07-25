import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Text } from "../../components/Text";
import { renderWithSharedUI } from "../../testing/render";
import { AuthShell } from "./AuthShell";

afterEach(() => {
  cleanup();
});

describe("AuthShell", () => {
  it("renders brand, heading, main, and supporting slots", () => {
    renderWithSharedUI(
      <AuthShell
        testID="shell"
        brand={<Text>Nexus</Text>}
        heading={<Text accessibilityRole="heading">Welcome</Text>}
        supporting={<Text>Need help?</Text>}
      >
        <Text>Main card</Text>
      </AuthShell>,
    );

    expect(screen.getByTestId("shell-brand").textContent).toContain("Nexus");
    expect(screen.getByTestId("shell-heading").textContent).toContain(
      "Welcome",
    );
    expect(screen.getByTestId("shell-main").textContent).toContain("Main card");
    expect(screen.getByTestId("shell-supporting").textContent).toContain(
      "Need help?",
    );
    expect(screen.getByTestId("shell-content")).toBeTruthy();
  });
});
