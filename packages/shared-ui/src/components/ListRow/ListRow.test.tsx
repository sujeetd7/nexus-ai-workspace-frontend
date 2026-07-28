import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { renderWithSharedUI } from "../../testing/render";
import { Avatar } from "../Avatar";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { Switch } from "../Switch";
import { Text } from "../Text";
import { ListRow } from "./ListRow";

afterEach(() => {
  cleanup();
});

describe("ListRow", () => {
  it("renders title, subtitle, and description", () => {
    renderWithSharedUI(
      <ListRow
        testID="row"
        title="Acme Workspace"
        subtitle="Owner"
        description="12 members"
      />,
    );
    expect(screen.getByTestId("row-title").textContent).toContain("Acme");
    expect(screen.getByTestId("row-subtitle").textContent).toContain("Owner");
    expect(screen.getByTestId("row-description").textContent).toContain("12");
  });

  it("supports avatar and icon leading slots", () => {
    renderWithSharedUI(
      <>
        <ListRow
          testID="avatar-row"
          title="User"
          leading={<Avatar initials="ab" alt="Ada" />}
        />
        <ListRow
          testID="icon-row"
          title="Docs"
          leading={
            <Icon decorative size="sm">
              <Text>D</Text>
            </Icon>
          }
        />
      </>,
    );
    expect(screen.getByTestId("avatar-row-leading")).toBeTruthy();
    expect(screen.getByTestId("icon-row-leading")).toBeTruthy();
  });

  it("supports badge, chevron, and switch trailing slots", () => {
    renderWithSharedUI(
      <>
        <ListRow
          testID="badge-row"
          title="Item"
          trailing={<Badge>New</Badge>}
        />
        <ListRow
          testID="chevron-row"
          title="Item"
          trailing={<Text>›</Text>}
        />
        <ListRow
          testID="switch-row"
          title="Item"
          trailing={
            <Switch
              checked={false}
              onCheckedChange={() => {}}
              accessibilityLabel="Toggle"
            />
          }
        />
      </>,
    );
    expect(screen.getByTestId("badge-row-trailing").textContent).toContain(
      "New",
    );
    expect(screen.getByTestId("chevron-row-trailing").textContent).toContain(
      "›",
    );
    expect(screen.getByTestId("switch-row-trailing")).toBeTruthy();
  });

  it("invokes onPress when interactive and blocks when disabled", () => {
    const onPress = vi.fn();
    const { rerender } = renderWithSharedUI(
      <ListRow testID="press" title="Open" onPress={onPress} />,
    );
    fireEvent.click(screen.getByTestId("press"));
    expect(onPress).toHaveBeenCalledTimes(1);

    onPress.mockClear();
    rerender(
      <ListRow testID="press" title="Open" disabled onPress={onPress} />,
    );
    fireEvent.click(screen.getByTestId("press"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("exposes selected accessibility state", () => {
    renderWithSharedUI(
      <ListRow testID="sel" title="Selected" selected onPress={() => {}} />,
    );
    expect(screen.getByTestId("sel").getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("meets minimum touch target height", () => {
    renderWithSharedUI(<ListRow testID="size" title="Sized" />);
    const node = screen.getByTestId("size") as HTMLElement;
    const minHeight =
      Number.parseInt(node.style.minHeight, 10) ||
      Number.parseInt(getComputedStyle(node).minHeight, 10);
    expect(minHeight).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_SIZE);
  });
});
