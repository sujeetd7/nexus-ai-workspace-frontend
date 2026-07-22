# Responsive Design Architecture

Canonical responsive rules for `@nexus/shared-ui` (Batch 2.3).

See also: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), [`DESIGN_SYSTEM_GOVERNANCE.md`](./DESIGN_SYSTEM_GOVERNANCE.md), [`ACCESSIBILITY.md`](./ACCESSIBILITY.md), [`../sprint-2/BATCH_MAP.md`](../sprint-2/BATCH_MAP.md).

## Ownership

| Concern                         | Owner                                                     |
| ------------------------------- | --------------------------------------------------------- |
| Breakpoint scale (SoT)          | `@nexus/shared-ui` → `src/responsive/breakpoints.ts`      |
| Device-class helpers            | `@nexus/shared-ui` → `src/responsive/responsive.ts`       |
| Tamagui media mapping           | `@nexus/shared-ui` → `src/tamagui/mapTokens.ts` (`media`) |
| Application layout / safe areas | `apps/web`, `apps/mobile`                                 |

Applications must not define a competing shared breakpoint scale.

## Breakpoint scale

Stable names and values (do not change without a documented defect):

| Name | Value (px / logical width) |
| ---- | -------------------------- |
| `xs` | `0`                        |
| `sm` | `640`                      |
| `md` | `768`                      |
| `lg` | `1024`                     |
| `xl` | `1280`                     |

Public types: `BreakpointName`, `MediaName`, `BREAKPOINT_ORDER`, `breakpoints`.

## Tamagui media

`media` in `mapTokens.ts` **derives** from `breakpoints` — never duplicate literals:

| Media | Query                      |
| ----- | -------------------------- |
| `xs`  | `maxWidth: breakpoints.sm` |
| `sm`  | `minWidth: breakpoints.sm` |
| `md`  | `minWidth: breakpoints.md` |
| `lg`  | `minWidth: breakpoints.lg` |
| `xl`  | `minWidth: breakpoints.xl` |

Prefer Tamagui responsive props / `$sm` style media for Tamagui-backed components. Do not build a parallel responsive framework.

## Platform behavior

Web and React Native **share names and intent** but not the same mechanism.

### Web

- Browser **viewport width** drives CSS media queries and Tamagui media
- Keyboard and pointer input coexist with layout adaptation
- Zoom and text scaling may change usable layout without changing the CSS breakpoint
- Prefer semantic layout adaptation across breakpoint ranges over hard device sniffing

### React Native

- **Window dimensions** (and orientation changes) drive device-class helpers
- Font scaling is independent of width breakpoints
- Touch interaction and hit targets are accessibility concerns (see `ACCESSIBILITY.md`)
- **Safe-area insets remain application-owned** (`SafeAreaProvider` / insets) — shared-ui does not own safe areas

Do not treat `matchMedia` and `Dimensions` as interchangeable implementations behind one fake abstraction.

## Shared runtime API (Batch 2.3)

Intentionally small:

| API                                   | Purpose                                   |
| ------------------------------------- | ----------------------------------------- |
| `breakpoints`                         | Canonical scale                           |
| `BREAKPOINT_ORDER`                    | Ordered names                             |
| `resolveBreakpoint`                   | Largest matching name for a numeric width |
| `getDeviceClass`                      | `mobile` / `tablet` / `desktop`           |
| `isMobile` / `isTablet` / `isDesktop` | Width band helpers                        |

### Intentionally not created

- No `useWindowDimensions` / `useMedia` wrapper (prefer Tamagui media for Tamagui views; apps already own dimension subscriptions when needed)
- No layout components (`Stack`, `Grid`, containers)
- No exposure of Tamagui media config internals beyond documented mapping rules

## Usage rules

1. Import breakpoints and helpers from `@nexus/shared-ui` only.
2. For Tamagui components, prefer Tamagui responsive capabilities.
3. When classifying a raw width (tests, native layout math), use `resolveBreakpoint` / device-class helpers.
4. Do not add speculative breakpoints.
5. Do not change values without recording a defect and updating sync tests.

## Testing invariants

Package tests assert:

- Breakpoint values are strictly ascending
- Tamagui `media` stays synchronized with `breakpoints`
- Device-class helpers respect `md` / `lg` boundaries

## Deferred to component batches

- Component-level responsive variants
- Container queries / content-based adaptation
- Storybook viewport tooling
