import type { NavigationDecision, RouteId } from "@nexus/shared-types";
import { isNavigationAllowed } from "@nexus/shared-types";

export interface AppliedNavigationDecision {
  readonly allow: boolean;
  readonly reason?: string;
  readonly redirectTo?: RouteId;
}

/**
 * Applies an injected navigation decision.
 * No token/role inspection — callers supply the decision explicitly.
 */
export function applyNavigationDecision(
  decision: NavigationDecision,
): AppliedNavigationDecision {
  if (isNavigationAllowed(decision)) {
    return { allow: true };
  }

  return {
    allow: false,
    reason: decision.reason,
    redirectTo: decision.redirectTo,
  };
}
