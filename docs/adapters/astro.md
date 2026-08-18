# Astro Adapter

Use Astro when the approved Claude Design output is mostly marketing, editorial, documentation, or
content pages.

## Prerequisites

- Harness bound (`BOUND_DS.json` with `configured: true`)
- Visual direction approved in canvas
- Token CSS from `BOUND_DS.json` -> `globalCssPaths` (re-exported by root `styles.css`)

## Mapping

Map by **role**, not fixed component names. Read roles from `DESIGN.md` §5-6 and
`BOUND_DS.json` -> `components` / `namespace`.

| Role | Astro target |
|---|---|
| Marketing nav / header | Astro layout header, or React island if interactive |
| Hero / static section | Astro section component |
| Buttons, cards, section headers | Astro components, or React islands when interactive |
| App shell / logged-in frame | Layout wrapper or skip for pure marketing sites |
| Bound DS token CSS | Import globally from the Astro layout |

**Token import** (builder host at repo root):

```css
/* src/styles/ds.css  -  paths from BOUND_DS.json -> globalCssPaths */
@import "../tokens/fonts.css";
@import "../tokens/colors.css";
/* ...remaining globalCssPaths... */
```

**Token import** (consumer host with `_ds/<bundle>/`):

```css
@import "../../_ds/<bundle>/tokens/fonts.css";
@import "../../_ds/<bundle>/tokens/colors.css";
```

Map roles from approved DC screens using `BOUND_DS.json` -> `namespace` / `components`; do not invent
parallel component names during handoff.

## Prompt

```text
Convert this approved Claude Design direction into an Astro component plan.
Keep static sections as Astro components and reserve React islands only for interactive pieces.
Preserve bound DS component names (BOUND_DS.json -> namespace) and token names
(BOUND_DS.json -> globalCssPaths). Do not replace approved tokens with framework defaults.
Report which skills were applied.
```

## See also

- [`framework-handoff.skill.md`](../../skills/framework-handoff.skill.md)
- [`PLAYBOOK.md`](../../PLAYBOOK.md) § Framework handoff
