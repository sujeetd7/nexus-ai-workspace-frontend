---
name: nexus-design-to-code
description: >-
  Implements UI from approved Figma frames using Tamagui and @nexus/shared-ui.
  Use for Figma design-to-code batches. Do not configure Figma OAuth or MCP secrets.
---

# nexus-design-to-code

## Purpose

Translate approved Figma designs into Nexus UI using the existing design system.

## Workflow

1. Confirm the frame/node is an approved Nexus design target.
2. Treat any generated React/Tailwind output as reference only.
3. Map design to `@nexus/shared-ui` primitives/composites and tokens.
4. Reuse existing components before adding new ones.
5. Prefer shared-ui public API; keep app screens feature-owned.
6. Validate visually against the frame and run `nexus-validation`.

## Constraints

- Figma MCP is IDE-local tooling. Do not commit OAuth credentials or personal MCP tokens.
- Do not add MUI, Tailwind, or another token system.
- Do not invent speculative tokens without a real consumer.
- Patterns promote to shared-ui only with ≥2 real consumers (Hybrid Enterprise Atomic).
- Repository structure may prepare for Figma MCP; authentication remains unconfigured here.

## Expected output

- Components/screens updated or added
- Mapping notes: Figma nodes → shared-ui building blocks
- Deviations from design (with rationale)
- Validation results
