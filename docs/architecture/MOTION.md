# Motion Architecture

Motion foundation for `@nexus/shared-ui` (Batch 2.6).

**Runtime stance:** Duration tokens + reduced-motion-aware CSS transition helpers only.  
**No** Framer Motion, Reanimated, Tamagui animation drivers, or extra providers.

See also: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), [`ACCESSIBILITY.md`](./ACCESSIBILITY.md).

---

## Source of truth

| Concern                | Location                                                                 |
| ---------------------- | ------------------------------------------------------------------------ |
| Duration tokens        | `theme/animations.ts` (`fast` / `normal` / `slow`) — also `theme.motion` |
| Tamagui mapping        | `tamagui/mapTokens.ts` → `tokens.duration`                               |
| Reduced motion         | `accessibility/reducedMotion.ts`                                         |
| CSS transition helpers | `motion/transitions.ts`                                                  |

```ts
import {
  motionDurations,
  MOTION_EASING,
  resolveTransitionDuration,
  createCssTransition,
  createMotionStyle,
  prefersReducedMotion,
} from "@nexus/shared-ui";
```

---

## Duration scale (approved)

| Token    | Value   | Use                                  |
| -------- | ------- | ------------------------------------ |
| `fast`   | `150ms` | Hover / focus chrome, micro-feedback |
| `normal` | `250ms` | Default UI transitions               |
| `slow`   | `400ms` | Larger layout / emphasis (rare)      |

Do not invent additional duration tokens without a real consumer.

---

## Easing scale (approved CSS constants)

Documented in code as `MOTION_EASING` (not theme hex/palette tokens):

| Key        | Value                          | Use                                      |
| ---------- | ------------------------------ | ---------------------------------------- |
| `standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default opacity / color / transform      |
| `linear`   | `linear`                       | Progress-like motion only when justified |

---

## Principles

1. **Motion communicates state** — never the only channel (pair with text, busy, labels).
2. **Prefer static styles** — allocate transitions only when they improve comprehension.
3. **Short by default** — `fast` or `normal`; avoid decorative long loops.
4. **Respect reduced motion** — helpers return `0ms` / `none` when `prefersReducedMotion()`.
5. **Web CSS first** — cross-platform drivers are out of scope until an approved consumer batch.
6. **Nexus owns the API** — do not expose Tamagui animation primitives.

---

## Reduced-motion policy

| Preference                                                   | Behavior                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Off                                                          | Use duration tokens + approved easing                            |
| On (`prefers-reduced-motion: reduce` / RN AccessibilityInfo) | Disable non-essential transitions; keep essential state feedback |

`Loader` already swaps to static labeled text under reduced motion (Batch 2.3/2.4).

Helpers:

- `prefersReducedMotion()` — sync
- `subscribeReducedMotion(listener)` — cleanup always returned
- `resolveTransitionDuration` / `createCssTransition` — gate automatically

---

## Permitted transitions

- Opacity fades for enter/exit of non-modal chrome
- Color / background-color on hover/focus (web)
- Transform for small press feedback (scale ≤ ~2%) when not reduced-motion
- Loader platform spinner when motion allowed

## Prohibited patterns

- Infinite decorative animation
- Large parallax / scroll-jacking
- Motion-only status (no text/role alternative)
- Auto-playing looping marketing motion in shared-ui
- Introducing Framer Motion / Reanimated / Tamagui `createAnimations` without ADR

---

## Hover / focus / press guidance

| Interaction   | Guidance                                                                           |
| ------------- | ---------------------------------------------------------------------------------- |
| Hover         | Prefer opacity token (`opacity.hover`) or color change; optional `fast` transition |
| Focus-visible | Instant or `fast` outline using `focusRing` — never hide focus                     |
| Press         | Prefer opacity (`opacity.pressed`) or brief scale; honor reduced motion            |
| Loading       | Use `Loader` / `aria-busy`; do not rely on spinner alone for meaning               |

---

## Minimal primitives

Batch 2.6 ships **helpers**, not animated components:

- `resolveTransitionDuration`
- `createCssTransition`
- `createMotionStyle`

Components may adopt these when adding justified web transitions. No shared `AnimatedView` until a consumer requires it.
