# Sprint 5 — Web Application Shell (Batch 5.DS.8)

Production-ready authenticated web application shell composed from existing `@nexus/shared-ui` composites and current bootstrap infrastructure.

## Scope

Implemented:

- Feature-first screen module at `apps/web/src/screens/AppShell/`
- Sidebar (logo, workspace, search placeholder, primary nav, recent/pinned empty states, settings, profile, version)
- Top bar (page title, breadcrumbs, workspace summary, notification placeholder, profile)
- Content area presentation states (default, loading, empty, error)
- Responsive behavior (desktop sidebar, tablet collapse, mobile drawer)
- Storybook `Patterns/AppShell` compositions
- Targeted unit tests and quality intelligence traceability

Out of scope (deferred):

- Documents, Prompt Library, AI Chat, Agents, Admin
- Notification center backend
- Search backend / filtering
- Feature pages beyond existing routes
- Theme toggle product control (Storybook toolbar only)
- Mock recent/pinned business data

## Ownership

| Concern                  | Owner                                                           |
| ------------------------ | --------------------------------------------------------------- |
| App shell screen         | `apps/web/src/screens/AppShell/`                                |
| Router integration       | `apps/web/src/shell/ApplicationShell.tsx` (re-exports AppShell) |
| Auth gate                | `ProtectedRoute`                                                |
| Workspace context        | `WorkspaceBootstrap` + workspace Redux slice                    |
| UI primitives/composites | `@nexus/shared-ui`                                              |

## Composition

```
AppShell
├── Sidebar (aside)
│   ├── Logo
│   ├── WorkspaceSwitcher
│   ├── SearchField (disabled placeholder)
│   ├── Navigation (existing routes)
│   ├── Recent → EmptyState
│   ├── Pinned → EmptyState
│   ├── Settings link
│   ├── Profile summary
│   └── Version
├── TopBar (header)
│   ├── Menu toggle (tablet/mobile)
│   ├── Page title + Breadcrumbs
│   ├── WorkspaceSwitcher (compact)
│   ├── Notifications placeholder
│   └── ProfileMenu (compact)
└── ContentArea (main)
    └── Route Outlet / presentation states
```

## Reuse

- **Router:** unchanged route table; shell wraps root `Outlet`
- **ProtectedRoute / GuestRoute:** unchanged guards
- **AuthBootstrap / WorkspaceBootstrap:** unchanged providers
- **Workspace selection:** `useWorkspaceSwitch`, `selectSelectedWorkspaceId`, `useListWorkspacesQuery`
- **Auth session:** `selectUser` for profile display
- **Shared UI:** Avatar, SearchField, ListRow, Badge, Divider, IconButton, Stack, Text, Surface, EmptyState, Loader

## Responsive behavior

Uses `@nexus/shared-ui` breakpoint scale only (`md` 768px, `lg` 1024px):

| Viewport         | Sidebar                              | Top bar     |
| ---------------- | ------------------------------------ | ----------- |
| Desktop (`≥ lg`) | Persistent; optional collapse toggle | Full        |
| Tablet (`md–lg`) | Collapsible                          | Menu toggle |
| Mobile (`< md`)  | Drawer overlay + backdrop            | Menu toggle |

## Accessibility

- Landmarks: `aside`, `header`, `main`, `nav`
- Skip-to-content link with visible `:focus` affordance
- ListRow / IconButton keyboard focus rings (shared-ui)
- SearchField `accessibilityLabel` + hint documents placeholder-only behavior
- Minimum 44px targets via ListRow / IconButton tokens

## Visual source

Screenshot Design Contract (Batch 5.DS.0) informs spacing, hierarchy, sidebar density, and responsive rhythm only. Nexus brand, semantic tokens, and typography remain authoritative.

## Validation (user-owned)

```powershell
pnpm --filter web typecheck
pnpm --filter web test
pnpm --filter web build-storybook
git diff --check
```
