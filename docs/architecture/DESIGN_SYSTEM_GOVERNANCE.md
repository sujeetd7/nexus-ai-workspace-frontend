# Design System Governance

Canonical **process** governance for Nexus Design System engineering (Batch 2.7).

Foundation architecture remains in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).  
Organization levels: [`HYBRID_ENTERPRISE_ATOMIC.md`](./HYBRID_ENTERPRISE_ATOMIC.md).

---

## Ownership

| Concern                                           | Owner                                                   |
| ------------------------------------------------- | ------------------------------------------------------- |
| Tokens, themes, Tamagui mapping, SharedUIProvider | `@nexus/shared-ui`                                      |
| Responsive + accessibility foundations            | `@nexus/shared-ui`                                      |
| Web Storybook                                     | `apps/web` tooling; stories exercise `@nexus/shared-ui` |
| Primitives / Composites (shared)                  | Design System / frontend platform                       |
| Patterns (shared)                                 | Design System after promotion                           |
| Screens / product UI                              | Feature / app owners                                    |
| ADR / dependency approval                         | Frontend platform + CTO when required                   |

Applications must not fork tokens, recreate providers, or deep-import `shared-ui` internals.

---

## Component lifecycle

```text
Proposal
  → Implementation
  → Documentation
  → Testing
  → Accessibility Review
  → Theme Verification
  → Responsive Verification
  → Storybook
  → Manager Review
  → Ready
```

### Exit criteria by stage

| Stage                       | Exit criteria                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Proposal**                | Level (1–4) assigned; problem statement; consumers named; no speculative tokens without consumer               |
| **Implementation**          | Lives in correct package; uses Nexus tokens; no business logic in shared-ui L1–L3; public API via package root |
| **Documentation**           | `COMPONENTS.md` (or pattern/screen doc) updated; props/slots/a11y/theme/responsive notes                       |
| **Testing**                 | Behavior tests (not snapshot-only); export test if newly public; platform splits covered when applicable       |
| **Accessibility Review**    | Roles, names, keyboard/focus, contrast, reduced motion, touch targets per `ACCESSIBILITY.md`                   |
| **Theme Verification**      | Light + dark (and preference APIs); semantic colors only                                                       |
| **Responsive Verification** | Breakpoint/media usage only via approved helpers; no parallel breakpoint SoT                                   |
| **Storybook**               | CSF under correct hierarchy title; required stories; docs + a11y panel smoke                                   |
| **Manager Review**          | Checklist signed; breaking changes / deprecations noted                                                        |
| **Ready**                   | Merged; inventory lists component as Ready at its level                                                        |

Screens skip shared Storybook **Screens** category until explicitly enabled; app QA still required.

---

## Maturity checklist (all shared levels)

Reuse — do not fork — the checklist in `DESIGN_SYSTEM.md`. Additional for Composites/Patterns:

- [ ] Composition from approved lower levels only
- [ ] Slots documented (if any)
- [ ] No form-library / data-fetch coupling in shared-ui
- [ ] Storybook Controls + Docs present

---

## Contribution process

1. **Propose** — issue/ADR note with level, consumers, and API sketch.
2. **Implement** — follow file organization in `GENERATOR_GOVERNANCE.md` (even when hand-written).
3. **Document + test + Storybook** — same PR when practical.
4. **Review** — platform reviewer verifies architecture confirmation (no boundary drift) + checklists.
5. **Export** — add to package root barrel only when Ready.

### Review requirements

Reviewers must confirm:

- Hybrid level is correct
- No deep imports introduced
- No new providers / token SoT forks
- A11y + theme + tests + Storybook coverage
- Debt register updated only for concrete limitations

---

## Naming and file organization

| Item            | Convention                                                                            |
| --------------- | ------------------------------------------------------------------------------------- |
| Component name  | PascalCase matching export (`FormField`)                                              |
| Folder          | `packages/shared-ui/src/components/<Name>/`                                           |
| Platform splits | `*.web.tsx` / `*.native.tsx` + `Name.tsx` re-export when needed (Button/Chip pattern) |
| Tests           | `Name.test.tsx` colocated                                                             |
| Stories         | `apps/web/src/stories/{primitives\|composites\|patterns\|screens}/Name.stories.tsx`   |
| Story title     | `Primitives/Name`, `Composites/Name`, …                                               |

Cross-ref: `docs/standards/NAMING.md`, `FOLDER_RULES.md` when populated; prefer this table for shared-ui components.

---

## Checklists (release / PR)

### Component checklist

- [ ] Level classified (1–4)
- [ ] Implementation in correct owner package
- [ ] Public export (if shared Ready)
- [ ] Docs updated
- [ ] Tests added
- [ ] Storybook story (web shared components)
- [ ] A11y / theme / responsive verification done

### Accessibility checklist

See `ACCESSIBILITY.md` maturity section. Minimum: name, role, keyboard/focus (interactive), contrast, reduced motion (if motion), RN 44×44 (interactive).

### Storybook checklist

See `STORYBOOK.md` review checklist.

### Testing checklist

- [ ] Behavior assertions (RTL / RN testing as applicable)
- [ ] Disabled / loading / error when those states exist
- [ ] Theme preference smoke where visual tokens matter
- [ ] No reliance on snapshots alone

### Release checklist (shared-ui)

- [ ] `pnpm verify` green
- [ ] Public API diff reviewed (`PUBLIC_API_GOVERNANCE.md`)
- [ ] IMPLEMENTATION_STATUS / COMPONENTS updated if shipping a level milestone
- [ ] Technical debt: close only fully resolved items; no roadmap debt

---

## Related

- `PUBLIC_API_GOVERNANCE.md`
- `GENERATOR_GOVERNANCE.md`
- `STORYBOOK.md`
- `HYBRID_ENTERPRISE_ATOMIC.md`
