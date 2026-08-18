# Dossier - reference: V4 Company LP "go-modular-b"

**Status: BLOCKED - awaiting evidence. No tokens may be written from this file yet.**

| | |
|---|---|
| Reference URL | `https://lps.v4company.com/assessoria/go-modular-b` |
| Captured | nothing yet |
| Target system | Hundert AI |
| Method | [`tools/reference-extraction/`](../../tools/reference-extraction/README.md) |

## Why this is empty

The session that was asked to extract this system runs behind an allowlist egress proxy. Both
Chromium and the fetch tool were denied at the network layer:

```
lps.v4company.com:443 | connect_rejected | gateway answered 403 to CONNECT
v4company.com:443     | connect_rejected | gateway answered 403 to CONNECT
```

The page was never loaded, never rendered, never measured. Writing a palette or a type scale from
here would be 100% `[I]` - invention wearing the costume of extraction. So: nothing was written.

## Intake checklist

Capture per [`tools/reference-extraction/README.md`](../../tools/reference-extraction/README.md).

- [ ] `dump-lp-desktop.json` - the LP at ~1440px
- [ ] `dump-lp-mobile.json` - the LP at ~390px
- [ ] `dump-home-desktop.json` - v4company.com home (second page = structural signal)
- [ ] `dump-<third>-desktop.json` - a third surface, ideally denser (cases, blog, app)
- [ ] `shot-lp-full.png` - full-page desktop screenshot
- [ ] `shot-lp-mobile.png` - full-page mobile screenshot
- [ ] `shot-lp-hero.png` - the fold, at rest
- [ ] Optional: a short screen recording of the hero + one scroll, if motion carries the page

## Brief - Hundert AI

Phase 3 (deviate) cannot run without this. The three adjectives in particular are what the
changed tokens get justified against; without them any deviation is arbitrary.

- **What it is** (1-2 sentences):
- **Who it is for**:
- **Target feeling, three adjectives**:
- **First surface after the system**: landing / dashboard / deck / docs
- **Non-negotiable constraint** (existing logo, dark-first, accessibility floor, ...):
- **How far to deviate from the reference**: grammar-only (default) / closer / much further

## Deliverables, once the evidence lands

1. `DESIGN.md` - YAML front matter with every token marked `[E]`/`[D]`/`[I]`, plus the prose that
   defends each decision. Sections: Overview · Colors · Typography · Spacing & Layout ·
   Radius & Elevation · Motion · Component rules · Do's & Don'ts · Anti-patterns
2. `tokens.css` - the same values as custom properties, the only place a literal color exists
3. `design-system.dc.html` - palette, type scale, spacing ruler, buttons, fields, cards.
   Zero values outside `var(--*)`
4. Report - reduction (N raw values to M tokens), confidence split, gaps, what changed vs. the
   reference, contrast ratios for every text/background pair
