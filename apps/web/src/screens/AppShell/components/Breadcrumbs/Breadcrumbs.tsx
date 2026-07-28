import type { FC } from "react";
import { Link } from "react-router-dom";
import { Stack, Text } from "@nexus/shared-ui";

import type { ShellBreadcrumb } from "../../hooks/useShellNavigation";

export interface BreadcrumbsProps {
  readonly items: readonly ShellBreadcrumb[];
  readonly testID?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  items,
  testID = "app-shell-breadcrumbs",
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" data-testid={testID}>
      <Stack direction="horizontal" gap="xs" align="center" wrap>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${item.label}-${index}`;

          return (
            <Stack key={key} direction="horizontal" gap="xs" align="center">
              {index > 0 ? (
                <Text variant="caption" color="textSecondary" aria-hidden>
                  /
                </Text>
              ) : null}
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Text variant="caption" color="textSecondary">
                    {item.label}
                  </Text>
                </Link>
              ) : (
                <Text
                  variant="caption"
                  color={isLast ? "text" : "textSecondary"}
                  accessibilityRole="text"
                >
                  {item.label}
                </Text>
              )}
            </Stack>
          );
        })}
      </Stack>
    </nav>
  );
};
