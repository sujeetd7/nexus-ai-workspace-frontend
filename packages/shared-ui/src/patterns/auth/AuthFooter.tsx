import type { FC, ReactNode } from "react";

import { Link, type LinkProps } from "../../components/Link";
import { Stack } from "../../components/Stack";
import { Text } from "../../components/Text";
import type { NexusTestProps } from "../../components/shared/types";

export interface AuthFooterLink {
  /** Visible link label. */
  label: ReactNode;
  /** Destination URL — not coupled to a router. */
  href: string;
  onPress?: LinkProps["onPress"];
  accessibilityLabel?: string;
  testID?: string;
}

export interface AuthFooterProps extends NexusTestProps {
  /** Optional prompt before the primary alternate-flow link (e.g. "Don't have an account?"). */
  prompt?: ReactNode;
  /** Primary alternate-flow link (Sign up / Sign in / Forgot password / Back to sign in). */
  link: AuthFooterLink;
  /** Optional additional links stacked below (e.g. Forgot password beside Sign up). */
  secondaryLinks?: AuthFooterLink[];
}

/**
 * Auth pattern — alternate-flow navigation via shared Link.
 * Callers own href values; no routing-library coupling.
 */
export const AuthFooter: FC<AuthFooterProps> = ({
  prompt,
  link,
  secondaryLinks,
  testID,
}) => {
  const hasPrompt = prompt != null && prompt !== false;
  const extras = secondaryLinks ?? [];

  return (
    <Stack direction="vertical" gap="sm" testID={testID} align="center">
      <Stack direction="horizontal" gap="sm" align="center" wrap>
        {hasPrompt ? (
          <Text variant="body" color="textSecondary">
            {prompt}
          </Text>
        ) : null}
        <Link
          href={link.href}
          onPress={link.onPress}
          accessibilityLabel={link.accessibilityLabel}
          testID={link.testID ?? (testID ? `${testID}-link` : undefined)}
        >
          {link.label}
        </Link>
      </Stack>
      {extras.map((item, index) => (
        <Link
          key={item.testID ?? `${String(item.href)}-${index}`}
          href={item.href}
          onPress={item.onPress}
          accessibilityLabel={item.accessibilityLabel}
          testID={
            item.testID ??
            (testID ? `${testID}-secondary-${index}` : undefined)
          }
        >
          {item.label}
        </Link>
      ))}
    </Stack>
  );
};
