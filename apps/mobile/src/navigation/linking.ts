import type { LinkingOptions } from "@react-navigation/native";

import type { RootStackParamList } from "./types";
import { MOBILE_ROUTE_NAMES } from "./types";

/**
 * Deep-link readiness config.
 * Prefixes stay empty until an approved scheme/domain exists — do not invent production URLs.
 */
export const navigationLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [],
  config: {
    screens: {
      [MOBILE_ROUTE_NAMES.Home]: "",
      [MOBILE_ROUTE_NAMES.NotFound]: "*",
    },
  },
};
