# Workspace Selection — Figma / Design Mapping (5D.1-R2)

**Canonical Sprint 5 Workspace Selection source** for future feature development.

## Figma source

| Field        | Value                                                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File         | [Nexus Design System](https://www.figma.com/design/FsvUWNEF0SJAvYEawUBuqg)                                                                                                                  |
| File key     | `FsvUWNEF0SJAvYEawUBuqg`                                                                                                                                                                    |
| Page         | `Sprint 5 — Workspace Selection`                                                                                                                                                            |
| Page node id | `1:21`                                                                                                                                                                                      |
| Status       | **Canonical** — created in this batch; Nexus token collection seeded from `@nexus/shared-ui`                                                                                                |
| MCP note     | Starter-plan MCP quota exhausted mid-batch after file + tokens + page creation. Screen frames follow the token contract below; complete remaining Figma state frames when MCP quota resets. |

### Token collection (in-file)

Collection: `Nexus Tokens` / mode `Light` — mirrors `@nexus/shared-ui`:

| Token                 | Value                     |
| --------------------- | ------------------------- |
| `color/background`    | `#FFFFFF`                 |
| `color/surface`       | `#F9FAFB`                 |
| `color/text`          | `#111827`                 |
| `color/textSecondary` | `#4B5563`                 |
| `color/border`        | `#E5E7EB`                 |
| `color/primary`       | `#2563EB`                 |
| `color/onPrimary`     | `#FFFFFF`                 |
| `color/danger`        | `#DC2626`                 |
| `space/xs`–`xxl`      | 4 / 8 / 12 / 16 / 24 / 32 |
| `radius/sm`–`lg`      | 4 / 8 / 12                |
| Font                  | Inter (product SoT)       |

### Canonical frame inventory (design contract → Figma)

| Screen                        | Platform | Intended frame name                        | Node id                 |
| ----------------------------- | -------- | ------------------------------------------ | ----------------------- |
| Default (selected + continue) | Web      | `Web / Workspace Selection / Default`      | Pending MCP frame build |
| Loading skeleton              | Web      | `Web / Workspace Selection / Loading`      | Pending                 |
| Empty                         | Web      | `Web / Workspace Selection / Empty`        | Pending                 |
| Unauthorized                  | Web      | `Web / Workspace Selection / Unauthorized` | Pending                 |
| Forbidden                     | Web      | `Web / Workspace Selection / Forbidden`    | Pending                 |
| Retry / API error             | Web      | `Web / Workspace Selection / Error`        | Pending                 |
| Default                       | Mobile   | `Mobile / Workspace Selection / Default`   | Pending                 |
| Loading / Empty / Error       | Mobile   | matching Mobile variants                   | Pending                 |

Screenshot references (when frames exist):

- Figma file: `https://www.figma.com/design/FsvUWNEF0SJAvYEawUBuqg?node-id=1-21`
- Web implementation: Storybook `Patterns/Workspace/WorkspaceSelection`
- Mobile implementation: `apps/mobile` `WorkspaceListScreen`

## Pixel contract (implementation locked to tokens)

| Element                          | Spec                                                                         |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Screen padding                   | `xl` (24)                                                                    |
| Section gap                      | web `lg` (16–24), mobile `md` (12)                                           |
| Logo mark                        | 32×32, `primary` fill, `radius/md` (8), “N” `onPrimary`                      |
| Brand wordmark                   | `Text` `h3` bold “Nexus”                                                     |
| Title                            | `Text` `h2` “Select a workspace” (semantic heading)                          |
| Subtitle                         | body `textSecondary`                                                         |
| Create CTA                       | `Button` `secondary` (web only; backend create supported)                    |
| Card                             | `Card` elevation `sm` / selected `md`, padding `md`, radius `lg`             |
| Avatar                           | web 40×40 / mobile 44×44, `radius/md`, border `border` or selected `primary` |
| Selected indicator               | `Badge` `primary` `sm` “Selected”                                            |
| Row actions                      | web Switch/Current; mobile Use workspace / Current workspace (full-width)    |
| Continue                         | primary `Button` when selection exists → dashboard                           |
| Loading                          | 3 skeleton cards (surface bars via `View` + border token)                    |
| Empty                            | 72×72 circle illustration + copy + create CTA (web)                          |
| Unauthorized / Forbidden / Retry | `InlineAlert` + `Button`                                                     |

Shadows: elevation `sm` → `0 1px 2px rgba(0,0,0,.08)`; `md` → `0 4px 8px rgba(0,0,0,.10)`.

## Shared-ui mapping

| Visual element                   | `@nexus/shared-ui`                                            |
| -------------------------------- | ------------------------------------------------------------- |
| Brand / logo                     | `Stack` + `View` + `Text`                                     |
| Title / subtitle                 | `Text` (`h2`, body)                                           |
| Workspace card                   | `Card` → `Surface`                                            |
| Avatar                           | `View` + `Text`                                               |
| Selected chip                    | `Badge`                                                       |
| Primary / secondary actions      | `Button`                                                      |
| Continue                         | `Button`                                                      |
| Create workspace                 | `Button` `secondary`                                          |
| Retry / Sign in                  | `Button`                                                      |
| Error / unauthorized / forbidden | `InlineAlert` (+ app-owned `classifySystemFailure` in 5.DS.7) |
| Loading skeleton                 | `Card` + `View` placeholders                                  |
| Empty illustration               | `View` + `Text`                                               |
| Layout                           | `Stack`                                                       |
| Theme colors / spacing           | `useTheme` + spacing/radius tokens                            |

No new shared-ui primitives were invented for this batch.

Bootstrap/system failure gates for workspace selection also use `SystemFailureView` (EmptyState composition) — see `docs/sprint-5/SYSTEM_AUTH_FAILURE_UX.md`.

## Responsive notes

- **Web:** header is horizontal (titles + Create); continue right-aligned; avatar 40px.
- **Mobile:** vertical header; full-width card actions; avatar/touch ≥44pt; no create CTA (web-owned create); safe-area via existing navigator shell.

## Accessibility checklist

| Check                     | Status                                             |
| ------------------------- | -------------------------------------------------- |
| Semantic heading on title | Yes (`accessibilityRole="heading"`)                |
| Screen / list labels      | Yes                                                |
| Avatar labels             | Yes (`{name} avatar`)                              |
| Selected announced        | Yes (listitem label + Badge label)                 |
| Button accessible names   | Yes (Switch / Current / Continue / Retry / Create) |
| Focus ring                | Button focus-visible via shared-ui                 |
| Keyboard                  | Native button / link focus order                   |
| Contrast                  | Semantic tokens (primary / text / onPrimary)       |
| Touch targets ≥44pt       | Mobile avatar + Button min heights                 |

## Sources consulted

| Source                                      | Result                                                        |
| ------------------------------------------- | ------------------------------------------------------------- |
| Prior in-repo approved Workspace Figma node | Not found (5D.1-R1 gap)                                       |
| Code Connect mappings                       | None                                                          |
| Figma MCP `whoami`                          | Authenticated (`Sujeet`, Full seat, Starter plan)             |
| New canonical file                          | Created `FsvUWNEF0SJAvYEawUBuqg`                              |
| Live frame screenshots via MCP              | Blocked by Starter MCP tool-call limit after token/page setup |
