import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Text } from "../../components/Text";
import { renderWithSharedUI } from "../../testing/render";
import { AuthCard } from "./AuthCard";

afterEach(() => {
  cleanup();
});

describe("AuthCard", () => {
  it("renders title, status, form, and footer slots", () => {
    renderWithSharedUI(
      <AuthCard
        testID="auth-card"
        title="Sign in"
        description="Use your work email"
        status={<Text>Status</Text>}
        footer={<Text>Footer</Text>}
      >
        <Text>Form fields</Text>
      </AuthCard>,
    );

    expect(screen.getByTestId("auth-card-header-title").textContent).toContain(
      "Sign in",
    );
    expect(
      screen.getByTestId("auth-card-header-description").textContent,
    ).toContain("Use your work email");
    expect(screen.getByTestId("auth-card-status").textContent).toContain(
      "Status",
    );
    expect(screen.getByTestId("auth-card-form").textContent).toContain(
      "Form fields",
    );
    expect(screen.getByTestId("auth-card-footer-slot").textContent).toContain(
      "Footer",
    );
  });
});
