# Legacy Claude Design Exports

Older Claude Design export patterns (e.g. Redpine, Amazon-style downloads) differ from the native
component track. They are valid evidence but need explicit migration rules.

## Observed shape

Common root files:

- `README.md` or `readme.md`
- `SKILL.md`
- `_ds_bundle.js`
- `_ds_manifest.json`
- `_adherence.oxlintrc.json`
- One or more root CSS token files, commonly `colors_and_type.css`

Common folders:

- `preview/` for many small `@dsCard` HTML specimens
- `ui_kits/<name>/` for larger interactive prototypes
- `assets/`, `uploads/`, sometimes `fonts/`
- Optional `slides/`, `variations/`, `spec/`, or `screenshots/`

Common omissions:

- No root `styles.css`
- No `templates/<slug>/index.html`
- No exported native component files in `components/*.jsx` + `components/*.d.ts`
- No `components` entries in `_ds_manifest.json`

## What the native compiler still produces

Even without native components, the compiler writes:

- `namespace`
- `cards`
- `globalCssPaths`
- `tokens`
- `themes`
- `brandFonts`
- `_adherence.oxlintrc.json`

In these exports, `@dsCard` is the main design-system surface. Cards often live in `preview/` and may
omit public-page affordances (`<title>`, viewport meta, `lang`). Treat them as specimens, not pages.

## Migration into CDP harness

### Consumer mode (recommended for legacy exports)

1. Place the export under `_ds/<bundle>/`.
2. Run `GO` or `node scripts/bootstrap-harness.mjs`.
3. Keep `colors_and_type.css` or files in `_ds_manifest.json.globalCssPaths` as the token source.
4. Keep `preview/*.html` as `@dsCard` specimens; do not force component sidecars.
5. Add `templates/<slug>/index.html` only when native picker templates are needed.
6. Add real components later as `.jsx` + `.d.ts`; do not mistake UI kit prototypes for native DS components.
7. Treat `_ds_bundle.js`, `_ds_manifest.json`, and `_adherence.oxlintrc.json` as generated evidence, not hand-authored files.

### Builder mode

Use only when the legacy export is normalized to a clean DS project root with manifest + bundle at `./`.

## Brownfield token rule

Active token source order:

1. `_ds_manifest.json.globalCssPaths`, if present.
2. Root token CSS names already used by the export (e.g. `colors_and_type.css`).
3. CSS linked by existing `preview/*.html` cards.
4. Only then consider adding a root `styles.css` facade (bootstrap generates this as `@import` chain).

## Detector calibration

`detect-canvas-antipatterns.mjs` exempts native `@dsCard` specimens from public-page title, viewport,
and language checks. It still flags missing image alt text, broken sources, outline removal without
focus replacement, and risky typography/layout patterns.

## See also

- [`PLAYBOOK.md`](../PLAYBOOK.md)
- [`LIMITATIONS.md`](../LIMITATIONS.md)