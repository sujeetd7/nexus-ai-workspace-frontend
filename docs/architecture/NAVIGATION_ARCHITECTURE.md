# Navigation Architecture

Sprint 3 Batch 3.3 — application-owned navigation foundations for Web and React Native.
Sprint 5 — auth, profile, workspace, and shell routes added in application route tables (still app-owned; no shared router package).

## Ownership

| Concern                                                    | Owner                 |
| ---------------------------------------------------------- | --------------------- |
| Route IDs, route kind, titles, guard decision shapes       | `@nexus/shared-types` |
| React Router wiring, web route tables, web shell           | `apps/web`            |
| React Navigation wiring, mobile route tables, mobile shell | `apps/mobile`         |
| Design-system primitives used by shells                    | `@nexus/shared-ui`    |

**Not created:** `@nexus/app-platform`, shared router package, shared shell package, runtime route discovery, Module Federation, plugin navigation, IoC.

## Approved composition (Batch 3.3 layers)

```text
… Redux Provider
     └── Router / Navigation          ← Batch 3.3 (+ Sprint 5 feature routes)
           └── Application Shell      ← Batch 3.3 / 5.DS.8–5.DS.9
```

Bootstrap and providers above remain Batch 3.2 ownership. See `PROVIDER_COMPOSITION.md` and `APPLICATION_BOOTSTRAP.md`.

## Web

- React Router `^7.18.1` via application-owned `createBrowserRouter` + `RouterProvider`
- Explicit static route objects (`createAppRouteObjects`)
- Nested layout route → `ApplicationShell` → `Outlet`
- Infrastructure: home (`/`), catch-all not-found (`*`)
- Sprint 5 product routes: auth (guest), dashboard, profile, workspaces (members/invitations/accept)
- Lazy home page + route-level `Suspense` (`RouteLoading`)
- Route `errorElement` (`RouteErrorFallback`) distinct from catch-all `NotFound` and root `ErrorBoundary`
- `ProtectedRoute` / `GuestRoute` enforce session + workspace bootstrap gates

## Mobile

- `@react-navigation/native` + `@react-navigation/native-stack`
- Exactly one `NavigationContainer` under Redux
- Typed `RootStackParamList` — no `any`
- Infrastructure screens: `Home`, `NotFound` (NotFound is guest-safe; Home is authenticated-stack only)
- Sprint 5 product routes: auth stack, dashboard, profile, workspaces (no mobile create-workspace route by design)
- Linking config is application-owned with **empty prefixes** until an approved scheme/domain exists (TD-060)

## Shared contracts

```ts
ROUTE_IDS / RouteId;
RouteKind / RouteReference;
INFRASTRUCTURE_ROUTES;
NavigationDecision;
isNavigationAllowed / findDuplicateRouteIds;
```

No React, JSX, hooks, or navigator types in shared packages.

## Guard policy

Web: `ProtectedRoute` / `GuestRoute` + session-expired / workspace bootstrap gates.
Mobile: `RootNavigator` auth/session/workspace gates + guest vs authenticated stacks.
Generic `NavigationDecision` remains available for injected decisions; RBAC product evaluation is still deferred.

## Deep-link readiness

| Platform | Status                                                                               |
| -------- | ------------------------------------------------------------------------------------ |
| Web      | History API via data router; direct URL + refresh + catch-all covered by route table |
| Mobile   | `navigationLinking` path shapes present; prefixes intentionally empty (TD-060)       |

## Explicit non-goals (current freeze)

- Documents / Prompt Library / AI Chat / Agents / Admin routes
- Shared router or shell packages, Module Federation, plugin navigation
- Navigation persistence and route analytics
- Mobile deep-link host/scheme activation (TD-060)
- Full RBAC / role-gated route evaluation beyond current session gates
