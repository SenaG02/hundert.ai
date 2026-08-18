# Vite Adapter

Use Vite when the approved Claude Design output is an app prototype, dashboard, internal tool, or
logged-in experience with rich client-side interaction.

## Prerequisites

- Harness bound (`BOUND_DS.json` with `configured: true`)
- Visual direction approved in canvas
- Token CSS from `BOUND_DS.json` -> `globalCssPaths`

## Mapping

| Role | Vite target |
|---|---|
| App shell / logged-in frame | Top-level route shell |
| Dashboard frame | Dashboard page pattern |
| Buttons, cards, section headers | Shared React primitives |
| Marketing nav | Shared header primitive |
| Bound DS token CSS | Import once in `src/main.{jsx,tsx}` or `src/index.css` |

**Token import** (builder host):

```css
/* src/index.css */
@import "../tokens/fonts.css";
@import "../tokens/colors.css";
/* ...remaining globalCssPaths... */
```

**Token import** (consumer host):

```css
@import "../_ds/<bundle>/tokens/fonts.css";
@import "../_ds/<bundle>/tokens/colors.css";
```

Map roles from approved DC screens using `BOUND_DS.json` -> `namespace` / `components` (e.g. app shell,
dashboard frame, nav).

## Prompt

```text
Convert this approved Claude Design direction into a Vite React module plan.
Use an app shell for the logged-in structure and keep dashboard sections as reusable patterns.
Preserve bound DS component names (BOUND_DS.json -> namespace) and token names
(BOUND_DS.json -> globalCssPaths). Do not replace approved tokens with framework defaults.
Report which skills were applied.
```

## See also

- [`framework-handoff.skill.md`](../../skills/framework-handoff.skill.md)
- [`PLAYBOOK.md`](../../PLAYBOOK.md) § Framework handoff
