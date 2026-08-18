# Changelog

## 2.3.3 — 2026-06-18

### Added

- `scripts/binding-drift.mjs` — compares cached `BOUND_DS.json` vs live DS detection
- `fixtures/builder-ds/` — committed builder fixture for CI (`test-builder-bootstrap.mjs`)

### Fixed

- `bootstrap-harness.mjs` — re-binds on binding drift (not only missing/stale cache)
- `context-signals.mjs` — `bindingOutOfSync` signal; root-only `dcCount`
- CI — builder bootstrap promoted from advisory to gate

### Changed

- Local-only reference material gitignored and removed from published tree
- Docs/skills — removed product-generation and archive path references
- `docs/validation-method.md` — gates vs advisory expectations documented honestly

## 2.3.2 — 2026-06-18

### Fixed

- `context-signals.mjs` - `needsAutoSetup` false positive from `scripts/templates/dc/` placeholders
- `detect-canvas-antipatterns.mjs` - skip local-only dirs and `scripts/`; exempt HTML fragments (e.g. `ds-helmet.snippet.html`)
- DC templates - logo `src` uses `{{BOUND_DS_LOGO_PATH}}` (no hardcoded bundle path)
- `unbind-harness.mjs` - dual-mode UNBOUND comment; reverse `voice.logoPath` on unbind
- `harness-auto-setup.skill.md` / `CLAUDE.md` - stale binding metadata triggers setup

### Changed

- Anti em-dash pass on protocol docs (`CLAUDE.md`, README, PLAYBOOK, skills)
- `docs/canvas-runtime.md` - dual-mode bootstrap as primary path
- `README.md` - links to PLAYBOOK, adapters, legacy exports

## 2.3.1 — 2026-06-18

### Added

- `scripts/test-builder-bootstrap.mjs` — CI fixture for builder-mode E2E bootstrap
- `docs/adapters/{astro,vite,next}.md` — framework handoff adapters at repo root
- `PLAYBOOK.md` — dual-mode workflow at repo root
- `docs/legacy-claude-design-exports.md` — legacy export migration guide

### Changed

- `bootstrap-harness.mjs` — re-binds when `BOUND_DS.json` schema is stale (version < 2 or missing `hostMode`)
- `LIMITATIONS.md` — dual-mode token sources; removed stale `validate-cdp.mjs` / `starter-kit/static/tokens.css` refs
- `framework-handoff.skill.md` — links to `docs/adapters/` and archive reference patterns
- CI — advisory `test-builder-bootstrap.mjs` step

## 2.3.0 — 2026-06-18

### Added

- **Dual host mode**: `builder` (DS at project root) + `consumer` (`_ds/<bundle>/`)
- `detectHostDs()` in `detect-bound-ds.mjs` — auto, `--mode builder|consumer`
- `scripts/ds-paths.mjs` — correct asset/import paths when `root` is `.`
- `BOUND_DS.json` fields: `hostMode`, `bindingSource`, `version: 2`

### Changed

- `bootstrap-harness.mjs`, `harness-auto-setup`, `CLAUDE.md`, README — document both flows
- `extract-ds-tokens.mjs` — reads token CSS via `binding.root` (fixes consumer path bug)
- `context-signals.mjs` — reports `hostMode`, `builderReady`, `consumerReady`

## 2.2.0 — 2026-06-18

### Added

- `scripts/synthesize-design-md.mjs` — síntese determinística de `DESIGN.md` (paridade com Phase 5 do canvas)
- `scripts/extract-ds-tokens.mjs` — amostragem de tokens CSS para voz e DESIGN.md
- `scripts/file-snapshot.mjs` — snapshot/rollback para scripts mutantes (R3 script-security)
- `scripts/templates/design-md.template.md` — stub restaurado pelo unbind
- `.github/workflows/ci.yml` — CI de validação do harness (node --check + context-signals gate + detectores advisory)
- `CLAUDE.md` § Placeholder Inventory + Structure Markers + protocolo de mismatch token/CSS

### Changed

- `bootstrap-harness.mjs` agora sintetiza `DESIGN.md`, suporta `--dry-run`, `--bundle`, `--allow-multi`, exit codes 0/1/2/3
- `unbind-harness.mjs` **não apaga `_ds/`**; unbind dinâmico via `BOUND_DS.json`; snapshot/rollback
- `detect-bound-ds.mjs` — fallback alfabético + `selectedBundle` quando há múltiplos bundles
- `extract-ds-voice.mjs` — hints de tema a partir de token CSS quando readme é vago
- `detect-*-antipatterns.mjs` — path traversal bloqueado; canvas scanner default = `.`
- `.gitignore` — `/_ds/` ignorado (host-project DS nunca é shipado com o harness)

### Fixed

- Drift canvas ↔ scripts: `node scripts/bootstrap-harness.mjs` produz o mesmo estado que auto-setup (incl. DESIGN.md)

## 2.1.1 — 2026-06-18

### Fixed

- Corrigido erro documental: `scripts/` **não** são "só fora do canvas" — rodam no canvas (Claude
  executa a lógica JS), pareados com skills na ordem documentada
- Novo [`docs/script-pipeline.md`](docs/script-pipeline.md) — pipeline scripts → skills
- `CLAUDE.md`: roteamento, `SCRIPTS APPLIED`, guardrails
- Skills de auditoria voltam a exigir `detect-*` **antes** do julgamento

## 2.1.0 — 2026-06-18

### Added

- `scripts/extract-ds-voice.mjs` — extrai tagline, superfícies, CTAs e tema do readme do DS
- `scripts/personalize-dc.mjs` — personaliza `*.dc.html` com voz + poda por componente
- `scripts/templates/dc/` — snapshots agnósticos para `unbind-harness.mjs`

### Changed

- Bootstrap e `harness-auto-setup` agora personalizam comunicação e estrutura dos DCs
- Placeholders de voz em Landing, AppShell, Deck, Doc, Starter
- Blocos `CDP:REQUIRES`, `CDP:SURFACES`, `CDP:NAV-LINKS`, `CDP:APP-NAV` para poda/regeneração

## 2.0.1 — 2026-06-18

### Changed

- README reduzido ao fluxo de 4 passos (ZIP → upload → copiar → GO)
- Documentação brownfield como fluxo principal; material greenfield legado fora do repositório publicado

## 2.0.0 — 2026-06-18

### Changed

- Repositório simplificado: harness brownfield agnóstico como distribuição principal.
- Auto-setup no canvas (`harness-auto-setup`) — primeira mensagem ou `GO` configura tudo.
- Fluxo humano: baixar ZIP → upload → copiar para raiz → nova guia → `GO`.
- Starter greenfield (`starter-kit/`, `templates/`, `components/`) removido da distribuição publicada.

### Added

- `BOUND_DS.json`, `bootstrap-harness.mjs`, `unbind-harness.mjs`, `detect-bound-ds.mjs`
- Templates DC: `Starter`, `AppShell`, `Landing`, `Deck`, `Doc`
- `activation-prompt.md` → `GO`