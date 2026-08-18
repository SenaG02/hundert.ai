# Next Adapter

Use Next only when the project needs SSR, SEO-heavy React routes, existing Next conventions, or a
team-standard deployment path.

## Prerequisites

- Harness bound (`BOUND_DS.json` with `configured: true`)
- Visual direction approved in canvas
- Token CSS from `BOUND_DS.json` -> `globalCssPaths`

## Mapping

| Role | Next target |
|---|---|
| Marketing nav / hero (static) | Server components |
| Interactive controls | Client components with explicit `"use client"` |
| App shell | App-router layout for the route group |
| Buttons, cards, section headers | Server by default; client only when interactive |
| Bound DS token CSS | Import from the root layout |

**Token import** (builder host) in `app/layout.tsx` companion CSS:

```css
@import "../tokens/fonts.css";
@import "../tokens/colors.css";
/* ...remaining globalCssPaths... */
```

**Token import** (consumer host):

```css
@import "../_ds/<bundle>/tokens/fonts.css";
```

Map roles from approved DC screens using `BOUND_DS.json` -> `namespace` / `components` (e.g. marketing
nav, layout shell).

## Prompt

```text
Convert this approved Claude Design direction into a Next app-router plan.
Separate static server components from interactive client components.
Preserve bound DS component names (BOUND_DS.json -> namespace) and token names
(BOUND_DS.json -> globalCssPaths).
Do not introduce SSR-specific complexity unless it serves the product.
Report which skills were applied.
```

## See also

- [`framework-handoff.skill.md`](../../skills/framework-handoff.skill.md)
- [`PLAYBOOK.md`](../../PLAYBOOK.md) § Framework handoff
