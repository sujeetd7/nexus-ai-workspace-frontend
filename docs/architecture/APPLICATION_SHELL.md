# Application Shell

Sprint 3 Batch 3.3 — application-owned shells for Web and React Native.
Sprint 5 Batch 5.DS.8 — production web AppShell screen module.
Sprint 5 Batch 5.DS.9 — production mobile AppShell screen module.

## Ownership

| Concern                 | Owner                                        |
| ----------------------- | -------------------------------------------- |
| Web shell chrome        | `apps/web/src/screens/AppShell/`             |
| Web shell export        | `apps/web/src/shell/ApplicationShell.tsx`    |
| Mobile shell chrome     | `apps/mobile/src/screens/AppShell/`          |
| Mobile shell export     | `apps/mobile/src/shell/ApplicationShell.tsx` |
| Primitives / composites | `@nexus/shared-ui`                           |

Shells are **not** shared packages and must not move into `@nexus/shared-ui`.

## Web shell (`AppShell`)

Authenticated chrome (sidebar + top bar + content) renders when:

- User is authenticated, and
- Current path is not a guest/public auth route (`/`, `/login`, register/forgot/reset/verify)

Guest and public routes render a content-only main region (auth screens keep `AuthShell` ownership).

### Regions

- Root container + skip-to-content (`#main-content`)
- **Sidebar:** logo, workspace switcher, search placeholder, primary navigation (existing routes), recent/pinned empty states, settings, profile summary, version
- **Top bar:** page title, breadcrumbs, compact workspace, notification placeholder, profile avatar
- **Main:** `ContentArea` + route `Outlet` with `Suspense` fallback (`RouteLoading`)

### Reuse (no duplication)

- React Router route table unchanged
- `ProtectedRoute` / `GuestRoute` unchanged
- `AuthBootstrap`, `WorkspaceBootstrap`, workspace Redux slice unchanged
- `@nexus/shared-ui` composites only — no duplicate primitives

`MainLayout` delegates to `ApplicationShell` → `AppShell`. `AuthLayout` / `BlankLayout` remain pass-through stubs.

### Not implemented (intentionally)

- Feature modules (Documents, Prompt Library, AI Chat, Agents, Admin)
- Notification center, command palette, search backend
- Recent/pinned data surfaces (EmptyState until APIs exist)
- Theme toggle product control
- AI/MCP/agent controls

See `docs/sprint-5/APPLICATION_SHELL.md` for batch 5.DS.8 detail.

## Mobile shell (`MobileAppShell`)

Authenticated chrome (header + drawer + content) wraps authenticated stack screens via `createShellScreen` in `RootNavigator`.

Guest auth routes and infrastructure `NotFound` remain content-only (no drawer chrome).

### Regions

- Safe-area root (`SafeAreaView` + bottom inset)
- **Header:** hamburger, page title, compact workspace, notification placeholder, profile avatar
- **Drawer (overlay):** logo, workspace switcher, search placeholder, primary navigation (existing routes), recent/pinned empty states, settings, profile summary, version
- **Main:** `ContentArea` + screen children with keyboard avoidance

### Reuse (no duplication)

- React Navigation stack unchanged
- `MobileAuthBootstrap`, `MobileWorkspaceBootstrap`, workspace Redux slice unchanged
- `@nexus/shared-ui` composites only — no duplicate primitives

`ApplicationShell` in `apps/mobile/src/shell` re-exports `MobileAppShell`.

### Not implemented (intentionally)

- Feature modules (Documents, Prompt Library, AI Chat, Agents, Admin)
- Notification center, command palette, search backend
- Recent/pinned data surfaces (EmptyState until APIs exist)
- React Native Storybook (TD-057)
- Tab bar (drawer-only navigation on mobile)

See `docs/sprint-5/MOBILE_APPLICATION_SHELL.md` for batch 5.DS.9 detail.

## Mobile shell (legacy stub — superseded)

The Sprint 3 stub at `apps/mobile/src/shell` is superseded by `MobileAppShell`. Export path preserved for compatibility.

Previously documented as stub-only:

- Safe-area-aware root layout
- Header / title region
- Screen content boundary

Now implemented in production AppShell module.

## Accessibility

- Web: semantic `aside` / `header` / `nav` / `main`, skip link with visible focus, labeled regions, shared ListRow/IconButton focus rings
- Mobile: labeled header/drawer/main regions, drawer open/close announcements, shared IconButton/ListRow touch targets (≥44pt), SearchField placeholder hints
- Loading announcements via shared `Loader` / `RouteLoading` (`accessibilityRole="progress"`)

## Responsive behavior

- Web: desktop persistent sidebar; tablet collapsible sidebar; mobile drawer overlay — breakpoints from `@nexus/shared-ui` (`md`/`lg`)
- Mobile: drawer overlay; safe-area insets via `react-native-safe-area-context`; phone orientations inherit RN defaults — tablet optimization not claimed

## State

Shell chrome reads auth and workspace bootstrap state only. No shell Redux slice, no navigation persistence, no feature state.
