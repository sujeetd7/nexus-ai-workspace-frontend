# Application Shell

Sprint 3 Batch 3.3 — application-owned shells for Web and React Native.

## Ownership

| Concern                 | Owner                   |
| ----------------------- | ----------------------- |
| Web shell chrome        | `apps/web/src/shell`    |
| Mobile shell chrome     | `apps/mobile/src/shell` |
| Primitives / composites | `@nexus/shared-ui`      |

Shells are **not** shared packages and must not move into `@nexus/shared-ui`.

## Web shell (`ApplicationShell`)

Allowed regions implemented:

- Root container
- Skip-to-content link (`#main-content`)
- Header with brand text + navigation placeholder
- Main content region with route `Outlet`
- Route-level `Suspense` fallback (`RouteLoading`)

Not implemented (intentionally): dashboard chrome, workspace sidebar, profile, notifications, search, command palette, AI/MCP/agent controls, auth controls, product menus.

`MainLayout` delegates to `ApplicationShell` for compatibility with existing layout folders. `AuthLayout` / `BlankLayout` remain pass-through stubs and are unwired.

## Mobile shell (`ApplicationShell`)

Allowed regions implemented:

- Safe-area-aware root layout
- Header / title region
- Screen content boundary
- Shared-ui primitives only (no duplicated components)

Not implemented: tab bar, drawer, account menu, workspace selector, feature chrome.

## Accessibility

- Web: semantic `header` / `nav` / `main`, skip link with visible focus, labeled regions
- Mobile: labeled header/content regions, shared Button touch targets, no motion-only navigation feedback
- Loading announcements via shared `Loader` / `RouteLoading` (`accessibilityRole="progress"`)

## Responsive behavior

- Web: flexible column shell with padding; works at narrow / tablet / desktop widths without a product sidebar
- Mobile: safe-area insets; phone orientations inherit RN defaults — tablet optimization not claimed

## State

Shells render without backend connectivity. No shell Redux slice, no navigation persistence, no feature state.
