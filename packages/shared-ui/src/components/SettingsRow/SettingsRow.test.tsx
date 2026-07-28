import { cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithSharedUI } from "../../testing/render";
import { Badge } from "../Badge";
import { SettingsRow } from "./SettingsRow";

afterEach(() => {
  cleanup();
});

describe("SettingsRow", () => {
  it("renders a switch trailing control", () => {
    const onSwitchCheckedChange = vi.fn();
    renderWithSharedUI(
      <SettingsRow
        testID="pref"
        title="Notifications"
        switchChecked={false}
        onSwitchCheckedChange={onSwitchCheckedChange}
        switchAccessibilityLabel="Notifications"
      />,
    );
    fireEvent.click(screen.getByTestId("pref-switch"));
    expect(onSwitchCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders badge, value, and chevron variants", () => {
    renderWithSharedUI(
      <>
        <SettingsRow
          testID="badge"
          title="Plan"
          badge={<Badge variant="primary">Pro</Badge>}
        />
        <SettingsRow testID="value" title="Language" value="English" />
        <SettingsRow testID="chevron" title="Privacy" showChevron />
      </>,
    );
    expect(screen.getByTestId("badge-badge").textContent).toContain("Pro");
    expect(screen.getByTestId("value-value").textContent).toContain("English");
    expect(screen.getByTestId("chevron-chevron")).toBeTruthy();
  });

  it("forwards press handling through ListRow", () => {
    const onPress = vi.fn();
    renderWithSharedUI(
      <SettingsRow
        testID="nav"
        title="Workspace settings"
        showChevron
        onPress={onPress}
      />,
    );
    fireEvent.click(screen.getByTestId("nav"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disables switch when row is disabled", () => {
    const onSwitchCheckedChange = vi.fn();
    renderWithSharedUI(
      <SettingsRow
        testID="locked"
        title="Locked"
        disabled
        switchChecked
        onSwitchCheckedChange={onSwitchCheckedChange}
        switchAccessibilityLabel="Locked"
      />,
    );
    fireEvent.click(screen.getByTestId("locked-switch"));
    expect(onSwitchCheckedChange).not.toHaveBeenCalled();
  });
});
