import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListRow, Stack, Text } from "@nexus/shared-ui";

import {
  PRIMARY_NAV_ITEMS,
  type ShellNavItem,
} from "../../constants";

export interface NavigationProps {
  readonly onNavigate?: () => void;
  readonly testID?: string;
}

function isNavItemActive(path: string, currentPath: string): boolean {
  if (path === currentPath) {
    return true;
  }
  return currentPath.startsWith(`${path}/`);
}

function NavItemRow({
  item,
  currentPath,
  onNavigate,
}: {
  item: ShellNavItem;
  currentPath: string;
  onNavigate?: () => void;
}) {
  const selected = isNavItemActive(item.path, currentPath);

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      aria-current={selected ? "page" : undefined}
    >
      <ListRow
        title={item.label}
        selected={selected}
        accessibilityLabel={item.label}
        testID={`app-shell-nav-${item.id}`}
      />
    </Link>
  );
}

/**
 * Primary shell navigation — existing routes only; no duplicate routing table.
 */
export const Navigation: FC<NavigationProps> = ({
  onNavigate,
  testID = "app-shell-navigation",
}) => {
  const { pathname } = useLocation();

  return (
    <nav aria-label="Primary navigation" data-testid={testID}>
      <Stack gap="xs">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavItemRow
            key={item.id}
            item={item}
            currentPath={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </Stack>
    </nav>
  );
}

export function NavigationSectionLabel({
  children,
}: {
  children: string;
}) {
  return (
    <Text variant="sectionLabel" color="textSecondary" accessibilityRole="text">
      {children}
    </Text>
  );
}
