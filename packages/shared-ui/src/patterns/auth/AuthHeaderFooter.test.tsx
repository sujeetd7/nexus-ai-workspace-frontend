import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { AuthFooter } from "./AuthFooter";
import { AuthHeader } from "./AuthHeader";

afterEach(() => {
  cleanup();
});

describe("AuthHeader", () => {
  it("renders title and description", () => {
    renderWithSharedUI(
      <AuthHeader
        testID="header"
        title="Create account"
        description="Start collaborating"
      />,
    );
    expect(screen.getByTestId("header-title").textContent).toContain(
      "Create account",
    );
    expect(screen.getByTestId("header-description").textContent).toContain(
      "Start collaborating",
    );
  });
});

describe("AuthFooter", () => {
  it("renders primary and secondary links without router coupling", () => {
    renderWithSharedUI(
      <AuthFooter
        testID="footer"
        prompt="Already have an account?"
        link={{
          label: "Sign in",
          href: "/sign-in",
          testID: "footer-sign-in",
        }}
        secondaryLinks={[
          {
            label: "Forgot password?",
            href: "/forgot-password",
            testID: "footer-forgot",
          },
        ]}
      />,
    );

    const primary = screen.getByTestId("footer-sign-in");
    expect(primary.textContent).toContain("Sign in");
    expect(primary.getAttribute("href")).toBe("/sign-in");

    const secondary = screen.getByTestId("footer-forgot");
    expect(secondary.textContent).toContain("Forgot password?");
    expect(secondary.getAttribute("href")).toBe("/forgot-password");
  });
});
