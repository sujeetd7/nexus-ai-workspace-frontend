import type { FC, ReactNode } from "react";

import { Stack } from "../../components/Stack";
import { View } from "../../components/View";
import type { NexusTestProps, SpacingToken } from "../../components/shared/types";

/** Readable content width for auth forms (token-backed layout constant). */
const AUTH_CONTENT_MAX_WIDTH = 420;

export interface AuthShellProps extends NexusTestProps {
  /**
   * Semantic page heading content. Prefer a single h1 via AuthHeader or Text.
   * When omitted, nested AuthCard should use `headingLevel={1}`.
   */
  heading?: ReactNode;
  /** Optional product / brand slot above the main content. */
  brand?: ReactNode;
  /** Primary content (typically AuthCard). */
  children: ReactNode;
  /** Optional supporting content below the main card (help text, legal). */
  supporting?: ReactNode;
  /** Outer vertical padding token. */
  padding?: SpacingToken;
}

/**
 * Auth pattern — responsive centered layout shell.
 * Not a route, provider, or navigation shell.
 */
export const AuthShell: FC<AuthShellProps> = ({
  heading,
  brand,
  children,
  supporting,
  padding = "xl",
  testID,
}) => {
  const hasHeading = heading != null && heading !== false;
  const hasBrand = brand != null && brand !== false;
  const hasSupporting = supporting != null && supporting !== false;

  return (
    <View
      testID={testID}
      background="background"
      width="100%"
      flexGrow={1}
      padding={padding}
      style={{
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        testID={testID ? `${testID}-content` : undefined}
        width="100%"
        style={{
          maxWidth: AUTH_CONTENT_MAX_WIDTH,
          width: "100%",
        }}
      >
        <Stack
          direction="vertical"
          gap="lg"
          align="stretch"
          media={{
            md: { gap: "xl" },
          }}
        >
          {hasBrand ? (
            <View testID={testID ? `${testID}-brand` : undefined}>{brand}</View>
          ) : null}
          {hasHeading ? (
            <View testID={testID ? `${testID}-heading` : undefined}>
              {heading}
            </View>
          ) : null}
          <View testID={testID ? `${testID}-main` : undefined}>{children}</View>
          {hasSupporting ? (
            <View testID={testID ? `${testID}-supporting` : undefined}>
              {supporting}
            </View>
          ) : null}
        </Stack>
      </View>
    </View>
  );
};
