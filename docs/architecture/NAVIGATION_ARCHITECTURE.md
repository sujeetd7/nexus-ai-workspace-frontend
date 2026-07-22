# Navigation Architecture

Sprint 3 Batch 3.3 — application-owned navigation foundations for Web and React Native.

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
     └── Router / Navigation          ← Batch 3.3
           └── Application Shell      ← Batch 3.3
```

Bootstrap and providers above remain Batch 3.2 ownership. See `PROVIDER_COMPOSITION.md` and `APPLICATION_BOOTSTRAP.md`.

## Web

- React Router `^7.18.1` via application-owned `createBrowserRouter` + `RouterProvider`
- Explicit static route objects (`createAppRouteObjects`)
- Nested layout route → `ApplicationShell` → `Outlet`
- Infrastructure routes only: home (`/`), catch-all not-found (`*`)
- Lazy home page + route-level `Suspense` (`RouteLoading`)
- Route `errorElement` (`RouteErrorFallback`) distinct from catch-all `NotFound` and root `ErrorBoundary`
- `RouteConfig.auth` / `roles` preserved as inactive scaffolding

## Mobile

- `@react-navigation/native` + `@react-navigation/native-stack`
- Exactly one `NavigationContainer` under Redux
- Typed `RootStackParamList` — no `any`
- Infrastructure screens: `Home`, `NotFound`
- Linking config is application-owned with **empty prefixes** until an approved scheme/domain exists

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

Generic `NavigationDecision` only. Applications may apply injected decisions (`applyNavigationDecision` on web). No token inspection, role evaluation, or login redirect in this batch.

## Deep-link readiness

| Platform | Status                                                                               |
| -------- | ------------------------------------------------------------------------------------ |
| Web      | History API via data router; direct URL + refresh + catch-all covered by route table |
| Mobile   | `navigationLinking` structure present; prefixes intentionally empty                  |

## Explicit non-goals

Authentication flows, RBAC, dashboards, workspace/documents/AI/MCP/agent routes, feature reducers/Sagas/APIs, navigation persistence, route analytics.
