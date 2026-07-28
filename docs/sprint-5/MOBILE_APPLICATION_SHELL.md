# Sprint 5 — Mobile Application Shell (Batch 5.DS.9)

Production-ready authenticated mobile application shell composed from existing `@nexus/shared-ui` composites and current bootstrap infrastructure.

## Scope

Implemented:

- Feature-first screen module at `apps/mobile/src/screens/AppShell/`
- Header (hamburger, title, workspace summary, notification placeholder, profile avatar)
- Drawer (logo, workspace switcher, search placeholder, primary nav, recent/pinned EmptyState, settings, profile, version)
- ContentArea: default/loading/empty/error/protected presentation states
- Safe-area handling via `react-native-safe-area-context`
- Keyboard avoidance and dismiss patterns (aligned with auth layout)
- `createShellScreen` wrapper for authenticated stack screens
- Targeted unit tests and quality intelligence traceability

Out of scope (deferred):

- Documents, Prompt Library, AI Chat, Agents, Admin
- Notification center backend
- Search backend / filtering
- Feature pages beyond existing routes
- React Native Storybook (TD-057 — web Storybook remains design verification source)
- Mock recent/pinned business data

## Ownership

| Concern                  | Owner                                                                      |
| ------------------------ | -------------------------------------------------------------------------- |
| App shell screen         | `apps/mobile/src/screens/AppShell/`                                        |
| Shell export             | `apps/mobile/src/shell/ApplicationShell.tsx` (re-exports `MobileAppShell`) |
| Auth gate                | `RootNavigator` + `MobileAuthBootstrap`                                    |
| Workspace context        | `MobileWorkspaceBootstrap` + workspace Redux slice                         |
| UI primitives/composites | `@nexus/shared-ui`                                                         |

## Composition

```
MobileAppShell
├── Header
│   ├── Menu toggle (hamburger)
│   ├── Page title (route-aware)
│   ├── WorkspaceSwitcher (compact)
│   ├── Notifications placeholder
│   └── ProfileSection (compact avatar)
├── Drawer (overlay)
│   ├── Logo
│   ├── WorkspaceSwitcher
│   ├── SearchField (disabled placeholder)
│   ├── Navigation (existing routes)
│   ├── Recent → EmptyState
│   ├── Pinned → EmptyState
│   ├── Settings link
│   ├── Profile summary
│   └── Version
└── ContentArea (main)
    └── Screen children / presentation states
```

## Reuse

- **Navigation:** React Navigation stack unchanged; authenticated screens wrapped via `createShellScreen`
- **Bootstrap:** `MobileAuthBootstrap`, `MobileWorkspaceBootstrap` unchanged
- **Workspace selection:** `useWorkspaceSwitch`, `selectSelectedWorkspaceId`, `useListWorkspacesQuery`
- **Auth session:** `selectUser` for profile display
- **Shared UI:** Avatar, SearchField, ListRow, Badge, Divider, IconButton, Stack, Text, Surface, EmptyState, Loader

## Drawer behavior

- Drawer is overlay-only on mobile (slides over content with backdrop)
- Opens via header hamburger; closes via backdrop press or navigation selection
- `useDrawer` announces open/close via `AccessibilityInfo`
- No navigation framework replacement — uses existing `@react-navigation/native`

## Safe area and keyboard

- `SafeAreaView` handles top/left/right insets; bottom inset on footer edge
- Content scroll uses `KeyboardAvoidingView`, `keyboardShouldPersistTaps="handled"`, dismiss-on-tap (same patterns as `AuthScreenLayout`)
- No hardcoded notch padding

## Accessibility

- Labeled application, header, drawer, and main content regions
- IconButton / ListRow meet ≥44pt touch targets via shared-ui tokens
- Drawer open/close accessibility announcements
- SearchField documents placeholder-only behavior via label + hint

## Storybook

RN Storybook remains deferred (TD-057). Web Storybook `Patterns/AppShell` and screenshot design contract (Batch 5.DS.0) remain the cross-platform design verification source for spacing, hierarchy, and drawer rhythm.

## Validation (user-owned)

```powershell
pnpm --filter mobile typecheck
pnpm --filter mobile test
git diff --check
```
