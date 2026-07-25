import type { FC, ReactNode } from "react";

import { Card } from "../../components/Card";
import { Stack } from "../../components/Stack";
import { View } from "../../components/View";
import type { NexusTestProps } from "../../components/shared/types";
import { AuthHeader } from "./AuthHeader";

export interface AuthCardProps extends NexusTestProps {
  /** Card title (heading). */
  title: ReactNode;
  /** Optional description under the title. */
  description?: ReactNode;
  /** Form fields / controls slot. */
  children?: ReactNode;
  /** Footer slot (e.g. AuthFooter). */
  footer?: ReactNode;
  /** Optional status area above the form (e.g. InlineAlert). */
  status?: ReactNode;
  /**
   * Heading level for the card title.
   * Use `2` when AuthShell already provides a page heading.
   */
  headingLevel?: 1 | 2;
}

/**
 * Auth pattern — form container built on Card (Surface + Stack + Divider).
 * Does not reimplement Card chrome.
 */
export const AuthCard: FC<AuthCardProps> = ({
  title,
  description,
  children,
  footer,
  status,
  headingLevel = 1,
  testID,
}) => {
  const hasStatus = status != null && status !== false;
  const hasFooter = footer != null && footer !== false;
  const hasBody = children != null && children !== false;

  return (
    <Card
      testID={testID}
      elevation="sm"
      padding="xl"
      header={
        <AuthHeader
          title={title}
          description={description}
          headingLevel={headingLevel}
          testID={testID ? `${testID}-header` : undefined}
        />
      }
      footer={
        hasFooter ? (
          <View testID={testID ? `${testID}-footer-slot` : undefined}>
            {footer}
          </View>
        ) : undefined
      }
    >
      {hasStatus || hasBody ? (
        <Stack direction="vertical" gap="lg">
          {hasStatus ? (
            <View testID={testID ? `${testID}-status` : undefined}>
              {status}
            </View>
          ) : null}
          {hasBody ? (
            <Stack
              direction="vertical"
              gap="md"
              testID={testID ? `${testID}-form` : undefined}
            >
              {children}
            </Stack>
          ) : null}
        </Stack>
      ) : null}
    </Card>
  );
};
