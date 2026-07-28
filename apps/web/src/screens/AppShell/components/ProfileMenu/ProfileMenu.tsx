import type { FC } from "react";
import { Link } from "react-router-dom";
import { Avatar, ListRow, Stack, Text } from "@nexus/shared-ui";
import { useSelector } from "react-redux";

import { WEB_ROUTE_PATHS } from "../../../../router/paths";
import { selectUser } from "../../../../store/slices/auth/selectors";
import {
  resolveProfileDisplayName,
  resolveProfileEmail,
  resolveProfileInitials,
} from "../../utils/profileDisplay";

export interface ProfileMenuProps {
  readonly compact?: boolean;
  readonly testID?: string;
}

/**
 * Profile summary — auth session only; graceful fallbacks when profile unavailable.
 */
export const ProfileMenu: FC<ProfileMenuProps> = ({
  compact = false,
  testID = "app-shell-profile-menu",
}) => {
  const user = useSelector(selectUser);
  const displayName = resolveProfileDisplayName(user);
  const email = resolveProfileEmail(user);
  const initials = resolveProfileInitials(user);

  if (compact) {
    return (
      <Link
        to={WEB_ROUTE_PATHS.profile}
        style={{ textDecoration: "none", color: "inherit" }}
        data-testid={testID}
      >
        <Avatar
          initials={initials}
          size="sm"
          accessibilityLabel={`${displayName}${email ? `, ${email}` : ""}`}
          testID={`${testID}-avatar`}
        />
      </Link>
    );
  }

  return (
    <Link
      to={WEB_ROUTE_PATHS.profile}
      style={{ textDecoration: "none", color: "inherit" }}
      data-testid={testID}
    >
      <ListRow
        leading={
          <Avatar
            initials={initials}
            size="sm"
            accessibilityLabel={displayName}
            testID={`${testID}-avatar`}
          />
        }
        title={displayName}
        subtitle={email ?? "Profile unavailable"}
        accessibilityLabel={`Profile: ${displayName}`}
      />
    </Link>
  );
};

export function ProfileMenuFooter({
  testID = "app-shell-profile-footer",
}: {
  testID?: string;
}) {
  const user = useSelector(selectUser);
  const displayName = resolveProfileDisplayName(user);
  const email = resolveProfileEmail(user);

  return (
    <Stack gap="xs" testID={testID}>
      <Text variant="sectionLabel" color="textSecondary">
        Profile
      </Text>
      <Stack direction="horizontal" gap="sm" align="center">
        <Avatar
          initials={resolveProfileInitials(user)}
          size="sm"
          accessibilityLabel={displayName}
        />
        <Stack gap="xs">
          <Text weight="medium">{displayName}</Text>
          {email ? (
            <Text variant="caption" color="textSecondary">
              {email}
            </Text>
          ) : (
            <Text variant="caption" color="textSecondary">
              Email unavailable
            </Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
