import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Skeleton } from "./Skeleton";

afterEach(() => {
  cleanup();
});

describe("Skeleton", () => {
  it("renders text placeholder with loading label", () => {
    renderWithSharedUI(<Skeleton testID="sk" variant="text" />);
    const node = screen.getByTestId("sk");
    expect(node.getAttribute("aria-label")).toBe("Loading");
  });

  it("supports avatar and card variants", () => {
    renderWithSharedUI(
      <>
        <Skeleton testID="avatar" variant="avatar" avatarSize="md" />
        <Skeleton testID="card" variant="card" />
      </>,
    );
    expect(screen.getByTestId("avatar")).toBeTruthy();
    expect(screen.getByTestId("card")).toBeTruthy();
  });

  it("supports title and rounded variants", () => {
    renderWithSharedUI(
      <>
        <Skeleton testID="title" variant="title" />
        <Skeleton testID="rounded" variant="rounded" />
      </>,
    );
    expect(screen.getByTestId("title")).toBeTruthy();
    expect(screen.getByTestId("rounded")).toBeTruthy();
  });
});
