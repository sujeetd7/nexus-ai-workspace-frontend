# Sprint 5.F.3 — Workspace Management Reconciliation

## Scope

Cross-platform reconciliation of Workspace Management against backend `workspace-service` OpenAPI:

- `GET/POST /api/v1/workspaces`
- `GET/PATCH/DELETE /api/v1/workspaces/{id}`
- Members: list / add / get / update role / remove
- Invitations: list / create / accept / reject / delete

## Backend source of truth

- Membership-scoped list (`ownerId` OR `WorkspaceMember`)
- Invitation accept identity from JWT subject (body `userId` ignored)
- Reject invitation = decline (`POST /workspaces/invitations/reject`)
- Leave workspace = `DELETE /workspaces/{id}/members/{memberId}` for self (no dedicated leave route)
- Workspace entity has no avatar field
- Workspace settings entity routes exist in service code but are **not** in OpenAPI stable routes — deferred

## Implemented

### Mobile (gaps closed)

- Workspace Detail + settings (PATCH name/description)
- Workspace Members (role update / remove / leave self)
- Invitations + Invite Member
- Accept / Decline invitation
- List → Manage navigation; Accept invitation entry
- Routes / linking / shell titles for management screens
- Loading / empty / retry / unauthorized / forbidden / session-expired via `classifySystemFailure` + `workspaceFailureCopy`

### Web (confirmed gaps only)

- Failure classification on Detail / Members / Invitations
- Settings form mounts after workspace load
- Leave workspace (self removeMember) on Detail + Members
- Decline invitation on Accept Invitation screen
- EmptyState for empty members / invitations / not found

## Reused infrastructure

- `createWorkspaceClient` / RTK Query `workspaceApi`
- WorkspaceBootstrap / MobileWorkspaceBootstrap / WorkspaceSwitcher
- `SessionManager` / `sessionExpiredAcknowledged` / `clearSelectedWorkspace`
- App shells / ProtectedRoute / RootNavigator
- Shared-ui: Button, FormField, InlineAlert, Loader, EmptyState, Stack, Text

## Out of scope

- Shared-ui changes
- Backend / OpenAPI / gateway changes
- Workspace avatar (no backend field)
- Workspace settings entity API (not OpenAPI-stable)
- Mobile create workspace (not in confirmed gap list)
- New stores or duplicate RTK endpoints

## Tests

- `apps/web/src/features/workspaces/screens/WorkspaceManagementScreens.test.tsx`
- `apps/mobile/__tests__/WorkspaceManagementScreens.test.tsx`
- Navigation contract updates

## QI

- `quality/workspace-capability-map.json`
- `quality/test-map.json` (`FE-WORKSPACE-MANAGEMENT`)
