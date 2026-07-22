/**
 * Cross-platform navigation contracts.
 * Applications own routers/navigators and shells; this package owns shared shapes only.
 */

/** Stable infrastructure route identifiers shared by web and mobile. */
export const ROUTE_IDS = {
  HOME: "home",
  NOT_FOUND: "not-found",
} as const;

export type RouteId = (typeof ROUTE_IDS)[keyof typeof ROUTE_IDS];

/** Route classification — metadata only; no auth/RBAC evaluation in this package. */
export type RouteKind = "public" | "protected" | "system";

/**
 * Platform-neutral route reference for deep-link readiness and catalog checks.
 * Path/name mapping remains application-owned at the router/navigator boundary.
 */
export interface RouteReference {
  readonly id: RouteId;
  readonly kind: RouteKind;
  /** Optional human-readable title — infrastructure wording only. */
  readonly title?: string;
  /** Web path template when the route has a URL. */
  readonly webPath?: string;
  /** React Navigation screen name when the route has a native screen. */
  readonly mobileName?: string;
}

/**
 * Minimal infrastructure catalog. Product/feature routes are intentionally absent.
 */
export const INFRASTRUCTURE_ROUTES = {
  [ROUTE_IDS.HOME]: {
    id: ROUTE_IDS.HOME,
    kind: "public",
    title: "Home",
    webPath: "/",
    mobileName: "Home",
  },
  [ROUTE_IDS.NOT_FOUND]: {
    id: ROUTE_IDS.NOT_FOUND,
    kind: "system",
    title: "Not Found",
    webPath: "*",
    mobileName: "NotFound",
  },
} as const satisfies Record<RouteId, RouteReference>;

export type InfrastructureRouteId = keyof typeof INFRASTRUCTURE_ROUTES;

/**
 * Generic navigation guard outcome.
 * Decisions are injected by application code — never derived from tokens/roles here.
 */
export type NavigationDecision =
  | { readonly allowed: true }
  | {
      readonly allowed: false;
      readonly reason: string;
      readonly redirectTo?: RouteId;
    };

/** Type guard for allowed navigation decisions. */
export function isNavigationAllowed(
  decision: NavigationDecision,
): decision is { readonly allowed: true } {
  return decision.allowed === true;
}

/**
 * Returns route IDs that appear more than once in a catalog list.
 * Useful for application route-table validation tests.
 */
export function findDuplicateRouteIds(
  routes: readonly Pick<RouteReference, "id">[],
): RouteId[] {
  const seen = new Set<RouteId>();
  const duplicates = new Set<RouteId>();

  for (const route of routes) {
    if (seen.has(route.id)) {
      duplicates.add(route.id);
    } else {
      seen.add(route.id);
    }
  }

  return [...duplicates];
}
