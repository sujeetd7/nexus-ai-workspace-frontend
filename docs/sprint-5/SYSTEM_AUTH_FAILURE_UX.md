# Sprint 5 — Batch 5.DS.7 System Authentication and Failure-State UX

Cross-platform system states for session expiry, authorization failures, and retryable transport errors.

## Error flow (unchanged ownership)

`Backend/Gateway → shared-network normalizeFrontendApiError / BaseQueryError → app mapApiError → classifySystemFailure → SystemFailureView / InlineAlert`

Do not add a second mapper architecture. Auth form classification remains in `authErrorPresentation` (5.DS.5 / 5.DS.6).

## State matrix

| State                         | Classification source                                                                          | Web owner                                                  | Mobile owner                                | Session effect                                         | Retry                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------ | ---------------------------- |
| Session Expired               | SessionManager `session-expired` → Redux `sessionExpired`; or API 401 in authenticated context | `ProtectedRoute` + `SystemFailureView`                     | `RootNavigator` SessionExpiredScreen        | Clear tokens via SessionManager; Redux unauthenticated | Sign in                      |
| Unauthorized                  | No session on protected route                                                                  | `ProtectedRoute` → login redirect (`reason: unauthorized`) | Auth stack (`Login`)                        | None (already anonymous)                               | Sign in via login            |
| Forbidden                     | HTTP 403 / `showForbidden`                                                                     | Workspace bootstrap gate + WorkspaceListScreen             | Same                                        | Preserve session; optional voluntary Sign out          | No auto-retry                |
| Retryable API                 | 408/429/5xx (non-503 family)                                                                   | Bootstrap gate + list screens                              | Same                                        | None                                                   | Refetch once with busy       |
| Network / Service Unavailable | `causeType` network/timeout, `NETWORK_ERROR`, 502/503/504                                      | Same                                                       | Same                                        | None                                                   | Refetch with busy            |
| Auth Bootstrap Failure        | Session restore → `sessionRestoreFailed`                                                       | AuthBootstrap + saga                                       | MobileAuthBootstrap                         | Unauthenticated                                        | Deferred network distinction |
| Workspace Bootstrap Failure   | Existing bootstrap error gate                                                                  | `ProtectedRoute` WorkspaceBootstrapFailure                 | RootNavigator WorkspaceBootstrapErrorScreen | 401 → reauth; 403 preserve                             | Profile/list refetch         |

## Residual heuristics

Message-based inference in `classifySystemFailure` only when status/code/causeType are absent (workspace bootstrap string errors written by app providers).

Auth cold-start bootstrap: `createSessionManager.bootstrap` maps refresh failure to `unauthenticated` without exposing cause — network vs expired **deferred** at SessionManager boundary (out of allowed package scope for this batch).

## Shared UI reused

`EmptyState`, `InlineAlert`, `Button`, `Loader`, `Stack`, `Text` — no new shared-ui components.

## Tests

- `apps/web/src/system/classifySystemFailure.test.ts`
- `apps/web/src/router/guards/AuthRouteGuard.test.tsx`
- `apps/web/src/features/workspaces/screens/WorkspaceListScreen.test.tsx`
- `apps/mobile/__tests__/classifySystemFailure.test.ts`
- `apps/mobile/__tests__/RootNavigator.systemFailure.test.tsx`
- `apps/mobile/__tests__/WorkspaceListScreen.test.tsx`
