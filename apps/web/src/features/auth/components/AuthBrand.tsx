import type { FC } from "react";
import { Text } from "@nexus/shared-ui";

/** Shared Nexus brand mark for auth shells — product name, not ChatGPT/OpenAI. */
export const AuthBrand: FC = () => (
  <Text variant="h2" align="center" weight="bold">
    Nexus AI Workspace
  </Text>
);
