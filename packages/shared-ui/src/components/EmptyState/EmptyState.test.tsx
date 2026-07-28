import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Text } from "../Text";
import { View } from "../View";
import { EmptyState } from "./EmptyState";

afterEach(() => {
  cleanup();
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    renderWithSharedUI(
      <EmptyState
        testID="empty"
        title="No results"
        description="Try a different query."
      />,
    );
    expect(screen.getByTestId("empty-title").textContent).toContain(
      "No results",
    );
    expect(screen.getByTestId("empty-description").textContent).toContain(
      "different",
    );
  });

  it("supports icon and illustration slots", () => {
    renderWithSharedUI(
      <EmptyState
        testID="slots"
        title="Empty"
        icon={
          <Icon decorative>
            <Text>○</Text>
          </Icon>
        }
        illustration={
          <View testID="art" background="surfaceMuted" padding="lg">
            <Text>Art</Text>
          </View>
        }
      />,
    );
    expect(screen.getByTestId("slots-icon")).toBeTruthy();
    expect(screen.getByTestId("slots-illustration")).toBeTruthy();
    expect(screen.getByTestId("art")).toBeTruthy();
  });

  it("supports primary and secondary action slots", () => {
    renderWithSharedUI(
      <EmptyState
        testID="cta"
        title="Get started"
        primaryAction={<Button>Create</Button>}
        secondaryAction={<Button variant="ghost">Learn more</Button>}
      />,
    );
    expect(screen.getByTestId("cta-primary").textContent).toContain("Create");
    expect(screen.getByTestId("cta-secondary").textContent).toContain("Learn");
  });

  it("exposes an accessible label from title", () => {
    renderWithSharedUI(<EmptyState testID="a11y" title="Nothing here" />);
    expect(screen.getByTestId("a11y").getAttribute("aria-label")).toBe(
      "Nothing here",
    );
  });
});
