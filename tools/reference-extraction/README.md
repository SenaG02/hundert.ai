# Reference extraction

Turns a live reference page into **evidence with usage frequency** - the raw material a
defensible `DESIGN.md` is built from. Frequency is the whole point: it is what separates a
structural token (a color used 200 times across every section) from noise (a color used once
in one badge). Without counts, an extraction is just a screenshot described in words.

Two ways to run the same capture logic:

| | Use when | How |
|---|---|---|
| `console-dump.js` | Anywhere. No install, no network access needed on this side | Paste into DevTools Console on the page |
| `extract-reference.mjs` | You have a machine that can reach the site and run Node | `node tools/reference-extraction/extract-reference.mjs --url ...` |

The `.mjs` runner literally evaluates `console-dump.js` inside the page, so both produce the
same JSON shape. The runner adds screenshots and the raw HTML.

## What gets captured

- **Color** - text, background, border, border width, background images (gradients), each with counts
- **Typography** - family, size, weight, line-height, letter-spacing, text-transform, counted only
  on elements that actually render text, so wrapper `div`s do not inflate the body-copy count
- **Space** - padding and gap distributions (this is how you find the grid base: 4 or 8)
- **Shape** - radius and shadow levels
- **Motion** - every transition (property, duration, **easing curve**, delay), every running
  animation, the literal `@keyframes` bodies, and whether `prefers-reduced-motion` is handled
- **Fonts** - `@font-face` rules, and (runner only) the actual woff2/ttf files the page downloads
- **CSS custom properties** - if the site ships design tokens, this is them, verbatim
- **Breakpoints** - every media query condition
- **Specimens** - the full computed recipe of h1/h2/h3, body, eyebrow, buttons, links, fields,
  labels, cards, sections, nav, footer
- **Rhythm** - top/bottom padding and height of every section, in order down the page

Only visible elements are counted. Hidden desktop/mobile duplicates would double-count and
skew every frequency in the dump.

## Protocol

1. **Capture more than one page.** One page tells you about that page. Home + a landing +
   pricing + an app/docs screen tells you about the *system*. A value that survives four pages
   is structural; a value that appears on one is a decoration.
2. **Capture two viewports.** Desktop ~1440 and mobile ~390. The mobile dump is where the real
   type scale shows itself, because that is where the system is forced to make choices.
3. **Scroll the whole page first, then back to the top.** Reveal animations only register in the
   computed styles after they have played.
4. **Take full-page screenshots.** The CSS answers *what*. Only the screenshots answer *where the
   accent is allowed to appear, and where it never appears* - usually the most important rule in
   the system, and one no dump can give you.
5. **Drop everything in `research/<slug>/`**: `dump-<page>-<viewport>.json` plus the PNGs.

## Evidence marking - non-negotiable

Every token derived from this material carries a mark, and the mark is never decorative:

- `[E]` **extracted** - the literal value is in a dump
- `[D]` **derived** - computed from `[E]` values, and the arithmetic is stated
- `[I]` **inferred** - a gap someone filled, and the reason is stated

If `[I]` exceeds 20% of the tokens, the honest move is to stop and name what still needs to be
captured, not to ship a confident-looking system built on guesses.

## Cross-origin stylesheets

`meta.blockedStylesheets > 0` means some CSS came from another origin and the browser refused to
let the script read its rules. Keyframes and custom properties from those sheets are missing from
the dump. When that happens, go to the Network tab, open the `.css` file directly, and read the
keyframes out of it by hand.
