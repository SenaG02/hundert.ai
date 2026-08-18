# framework-handoff.skill.md

## Name

Framework Handoff

## Purpose

Turn an approved Claude Design Web direction into a reusable component and pattern inventory that can
move cleanly to Astro, Vite, or Next without locking the design phase to a framework too early.

## When to use

- After the visual direction has been approved.
- When the user asks to componentize, modularize, export, or prepare for Astro, Vite, or Next.
- Before handing a design to implementation.
- When repeated navigation, shell, card, hero, dashboard, or section patterns appear in a design.

## Procedure

1. Confirm the visual direction is approved; if not, recommend `ui-audit` or `polish-phase` first.
2. Read `BOUND_DS.json` -> `components` and `DESIGN.md` §5-6. Extract a component inventory from the
   bound namespace and any named patterns documented in the project.
3. Map each component to its source tokens: color, spacing, typography, radius, elevation, and motion.
4. Separate framework-neutral anatomy from framework-specific implementation notes.
5. Recommend the target only when the product surface makes it clear:
   Astro for marketing/content, Vite for interactive apps, Next for SSR/team constraints.
   Read the per-target adapter docs before writing the handoff plan:
   - `docs/adapters/astro.md`
   - `docs/adapters/vite.md`
   - `docs/adapters/next.md`
   Use the **Framework adapters** table below to map each piece.
6. Preserve accessibility and mobile blockers as handoff notes; do not hide them as "implementation
   details".

## Framework adapters

Map the bound DS inventory (from `BOUND_DS.json` -> `components` / `namespace`) to the target. Map by
**role**, not by a fixed component name: read the role from `DESIGN.md` §5-6 and the bound namespace,
then place it per the target's column. Tokens always come from `BOUND_DS.json` -> `globalCssPaths`
(re-exported by root `styles.css`), never reinvented.

| Role in the design | Astro (marketing/content) | Vite (app/dashboard) | Next (SSR/SEO) |
|---|---|---|---|
| App shell / logged-in frame | n/a or layout wrapper | top-level route shell | app-router layout for the route group |
| Marketing nav / header | Astro layout header (island only if interactive) | shared React primitive | server component when static |
| Hero / static section | Astro section component | reusable pattern | server component when static |
| Dashboard frame | n/a | dashboard page pattern | client component if interactive |
| Buttons, cards, section headers | Astro components, or React islands if interactive | shared React primitives | server by default; `"use client"` only when interactive |
| Bound DS token CSS (`globalCssPaths`) | import globally from the Astro layout | import once in `src/main.{jsx,tsx}` or `src/index.css` | import from the root layout |

**Choosing the target:**

- **Astro**: output is mostly marketing, editorial, documentation, or content pages. Keep
  interactive islands small and deliberate.
- **Vite**: output is an app prototype, dashboard, internal tool, or logged-in experience with rich
  client-side interaction. Fastest path for interactive iteration.
- **Next**: the project needs SSR, SEO-heavy React routes, existing Next conventions, or a
  team-standard deployment path. Do not introduce SSR-specific complexity unless it serves the
  product.

**Per-target handoff prompt** (paste into Claude Design Web after the inventory is approved):

```text
Convert this approved Claude Design direction into a {Astro|Vite|Next} plan.
Map each piece by role using the framework-handoff adapter table.
Preserve the bound DS component names (BOUND_DS.json -> namespace) and token names
(BOUND_DS.json -> globalCssPaths). Keep static and interactive pieces separated per the target.
Do not replace approved tokens with framework defaults. Report which skills were applied.
```

## Output contract

Produce a handoff inventory with:

- Components and patterns to extract.
- Props/content slots each component needs.
- Token dependencies.
- Target-framework recommendation with rationale.
- Remaining mobile/accessibility blockers.
- A short next prompt the user can paste into Claude Design Web.

Do not generate a full app unless explicitly asked.

## Reference patterns (handoff only)

Extract reusable roles from approved DC screens and map bound DS names from `BOUND_DS.json` ->
`namespace` / `components` to framework primitives per the adapter docs. Canvas work stays static;
framework code is a repo handoff step.

## Failure modes

- **Framework lock-in too early:** Choosing Next/Astro/Vite before the design is approved. -> Keep the
  first pass framework-neutral.
- **One-off page sections:** Treating repeated elements as custom layout each time. -> Extract named
  components and patterns.
- **Token drift during handoff:** Replacing approved tokens with framework defaults. -> Map every
  extracted piece back to the bound DS token CSS (`BOUND_DS.json` -> `globalCssPaths`).
- **Ignoring blockers:** Pushing mobile or accessibility issues downstream silently. -> List blockers
  explicitly.

## Example invocation

```text
Run framework-handoff on this approved dashboard. Extract reusable pieces using the bound DS
component and pattern names from BOUND_DS.json and DESIGN.md §6, recommend Astro/Vite/Next only if
appropriate, and list token dependencies and remaining blockers.
```
