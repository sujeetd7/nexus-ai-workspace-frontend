# Sprint 5.F.2 — User Management Reconciliation

## Scope

Cross-platform reconciliation of current-user capabilities against backend `user-service`:

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me` (firstName, lastName, avatar URL, preferences)
- `POST /api/v1/users` (create on 404 only)

Directory admin routes (`GET/PATCH/DELETE /users/{id}`, `GET /users`) remain deferred.

## Backend source of truth

- Avatar is an optional string field (URL / opaque string) — **no upload API**
- Preferences are an opaque JSON object on the user profile
- Identity for `/users/me` comes from the access token subject

## Implemented

### Mobile (gaps closed)

- Profile details (avatar via shared `Avatar`, name, email, status)
- Edit Profile screen + shell route `ProfileEdit`
- Preferences screen + shell route `ProfilePreferences`
- Loading / empty / error / retry
- Unauthorized / forbidden / session-expired via `classifySystemFailure` + `profileFailureCopy`
- Settings nav targets preferences (parity with web)
- Auto-create profile only on HTTP 404

### Web (confirmed gaps only)

- Profile uses `Avatar` composite for avatar URL display
- Load/update failures classify Unauthorized / Forbidden / Session expired / Retry
- Edit form mounts after profile load (avoids empty initial values)
- Preferences JSON validation via `userPreferencesSchema` + parse error alert
- EmptyState when profile unavailable after load

## Reused infrastructure

- `createUserClient` / RTK Query `userApi`
- Auth + workspace bootstrap
- `SessionManager` / `sessionExpiredAcknowledged`
- `SystemFailureView` classification helpers
- `MobileAppShell` / web AppShell / ProtectedRoute / RootNavigator
- Shared-ui: Avatar, Button, FormField, InlineAlert, Loader, EmptyState, Stack, Text

## Out of scope

- Shared-ui changes
- Backend / OpenAPI / gateway changes
- Workspace Management
- Admin user directory CRUD UI
- Avatar binary upload
- New stores or duplicate profile implementations

## Tests

- `apps/web/src/features/profile/screens/ProfileScreens.test.tsx`
- `apps/mobile/__tests__/ProfileScreens.test.tsx`
- Navigation + `profileFailureCopy` coverage updates

## QI

- `quality/user-capability-map.json`
- `quality/test-map.json` (`FE-USER-MANAGEMENT`)
