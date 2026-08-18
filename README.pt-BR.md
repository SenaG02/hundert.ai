<div align="center">

# Claude Design Premium

[English](README.md) · **Português**

**Seu design system. No contexto. Em toda tela.**

Claude Design Web é rápido. Este harness garante que rápido não vire esquecimento.

<p>
  <img alt="Licença: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg">
  <img alt="Runtime: Claude Design Web" src="https://img.shields.io/badge/runtime-Claude%20Design%20Web-8a63d2">
  <img alt="Dependências: 0 npm" src="https://img.shields.io/badge/deps-0%20npm-2ecc71">
  <img alt="Skills: 13" src="https://img.shields.io/badge/skills-13-3498db">
  <img alt="Modos: Builder + Consumer" src="https://img.shields.io/badge/modes-builder%20%2B%20consumer-555">
</p>

[Início rápido](#início-rápido) · [O que muda](#o-que-muda) · [Skills](#skills) · [Docs](#docs)

</div>

---

> **Projeto da comunidade.** Não afiliado nem endossado pela Anthropic.  
> Claude Design Web é produto da Anthropic. Este pacote é harness + pacote de skills.

## O buraco

Você já pagou por um design system: tokens, componentes, voz, restrições. O Claude Design não sabe disso se você não reexplicar a cada sessão.

Aí a mesma tela sai com espaçamento diferente. Botões que não existem na sua lib. Copy que parece template de landing. Mockups que o time de engenharia não consegue mapear pra componente real.

Não é problema de modelo. É problema de **contexto**.

## O que muda

| Sem harness | Com Claude Design Premium |
|-------------|---------------------------|
| Re-brief do DS a cada sessão | `BOUND_DS.json` + `DESIGN.md` ficam carregados |
| Modelo inventa componente | Guardian checa tokens + seu manifest |
| Páginas bonitas descartáveis | Espécime vivo em `design-system.dc.html` |
| Handoff "tá bonito" | Auditorias de a11y, mobile, copy, Tailwind |
| Prompt vago → UI vaga | `brief-framing` vira brief executável |

**13 skills. Zero deps npm. Quatro passos pra ancorar.**

Você continua desenhando no Claude Design Web. O harness só impede o sistema de ter amnésia.

## Para quem é

- **Founders e leads de produto** com DS (ou construindo um) que querem o Claude respeitando isso
- **Autores de design system** que mantêm tokens + componentes neste repo → modo **Builder**
- **Times de produto** que consomem bundle publicado → modo **Consumer** (`_ds/<bundle>/`)

**Consumer:** app ou landing que já tem `_ds/<bundle>/`.  
**Builder:** projeto de DS com `_ds_manifest.json` + `_ds_bundle.js` na raiz.

O modo é detectado no `GO`. Sem terminal.

## Início rápido

### 1. Baixar

[Baixe o ZIP](https://github.com/oalanicolas/claude-design-premium/archive/refs/heads/main.zip) (Code → Download ZIP).

### 2. Enviar no seu projeto Claude Design

Abra o [Claude Design Web](https://claude.ai/design), abra seu projeto e faça upload do ZIP.

### 3. Mover o harness pra raiz do projeto

Na mesma conversa, peça ao Claude:

```text
Copie todos os arquivos da pasta claude-design-premium para a raiz do projeto.
Mantenha o design system existente (_ds/ ou manifest + tokens na raiz).
```

O ZIP descompacta como `claude-design-premium-main/` (ou parecido). Tudo dessa pasta vai pra raiz: `CLAUDE.md`, `skills/`, `scripts/`, etc.

### 4. Nova guia → GO

Abra uma **nova guia** no mesmo projeto e envie:

```text
GO
```

O `harness-auto-setup` roda: detecta builder ou consumer, grava `BOUND_DS.json`, gera scaffold de `design-system.dc.html`, cria `.cdp/showcase-brief.json` e pergunta qual superfície desenhar primeiro.

Sem npm, git nem terminal. Os `scripts/*.mjs` rodam **dentro do canvas** quando o Claude lê e aplica (pareado com skills via `CLAUDE.md`).

### Depois do GO (opcional)

**Configure o `DESIGN.md`** se ainda houver placeholders (`CDP:UNCONFIGURED`).

**Monte o espécime completo** (bootstrap só gera scaffold):

```text
Monte a vitrine completa do design system a partir do brief.
```

**Construa uma tela:**

```text
Crie um dashboard para [seu produto] usando nosso design system.
```

Skills roteiam via `CLAUDE.md`: guardian em UI, auditorias antes do handoff, `framework-handoff` quando for pra código.

## Como funciona

```
Baixa ZIP → upload no projeto Claude Design
        ↓
Promove arquivos do harness pra raiz
        ↓
Nova guia → GO → harness-auto-setup + bootstrap-harness.mjs
        ↓
BOUND_DS.json + showcase-brief + páginas em scaffold
        ↓
Você dona o DESIGN.md (voz, superfícies, regras)
        ↓
assemble-design-system-showcase → design-system.dc.html completo
        ↓
Cada tela nova: guardian + auditorias certeiras
```

| Artefato | Função |
|----------|--------|
| `DESIGN.md` | Voz, superfícies, restrições. O brief que o modelo não pode pular |
| `BOUND_DS.json` | Binding legível por máquina: modo, paths, manifest, contagem de tokens |
| `.cdp/showcase-brief.json` | Seções + inventário pro espécime vivo |
| `design-system.dc.html` | Scaffold primeiro; vitrine completa depois, no Claude Design |
| `CLAUDE.md` | Roteia intenção → skills. Você não decora 13 arquivos |

### Builder vs consumer

| | **Builder** | **Consumer** |
|---|-------------|--------------|
| `DESIGN.md` | Raiz do projeto | `_ds/<bundle>/DESIGN.md` |
| Componentes | Seu repo | `components/` do bundle |
| Você | Mantenedor do DS | Time de app com kit publicado |

Detecção automática. Override: `node scripts/bootstrap-harness.mjs --mode builder|consumer`.

## O que vem no ZIP

- 13 skills: setup, vitrine, guardian, seis trilhas de auditoria, handoff
- Pipeline de bootstrap: scripts Node, sem `npm install`
- Páginas iniciais: `intro.dc.html`, `design-system.dc.html` em scaffold
- [PLAYBOOK.md](PLAYBOOK.md): receitas de sessão pra trabalho real

**De propósito não vem:** página demo genérica pronta. O espécime é montado a partir do *seu* `DESIGN.md`. Reflete seu sistema, não o nosso.

## Skills

| Skill | Quando roda |
|-------|-------------|
| `harness-auto-setup` | Primeira abertura: detecta, bootstrap, verifica |
| `assemble-design-system-showcase` | Após bootstrap: completa a página do DS |
| `design-system-guardian` | Tarefas de UI: fidelidade a tokens + componentes |
| `fivu-identity-showcase` | Superfícies de marca / identidade |
| `brief-framing` | Pedido vago → brief executável |
| `ui-audit` | Estrutura, hierarquia, layout |
| `visual-originality-audit` | Pega drift de template padrão |
| `polish-phase` | Última passagem antes de dar por encerrado |
| `text-integrity-audit` | Copy vs suas regras de voz |
| `mobile-first-audit` | Comportamento responsivo |
| `accessibility-audit` | Revisão orientada a WCAG |
| `tailwind-audit` | Alinhamento utility/token |
| `framework-handoff` | Notas de export pra React, Vue, etc. |

Roteamento no `CLAUDE.md`. Cole um prompt; a skill certa aparece.

## Docs

| Doc | |
|-----|--|
| [PLAYBOOK.md](PLAYBOOK.md) | Dashboard, landing, settings: fluxos de sessão |
| [LIMITATIONS.md](LIMITATIONS.md) | O que garante e o que não garante |
| [docs/script-pipeline.md](docs/script-pipeline.md) | Scripts de bootstrap |
| [docs/canvas-runtime.md](docs/canvas-runtime.md) | Runtime `.dc.html` |
| [docs/validation-method.md](docs/validation-method.md) | Validar seu setup |

## Checagem local (opcional)

```bash
node scripts/bootstrap-harness.mjs
node scripts/context-signals.mjs
node scripts/test-builder-bootstrap.mjs
```

## Licença

Veja a licença do repositório. Termos do Claude Design Web aplicam-se ao produto da Anthropic separadamente.

---

<div align="center">

**Você construiu o sistema. Pare de reensinar ele a cada sessão.**

[Início rápido](#início-rápido) · [PLAYBOOK](PLAYBOOK.md) · [LIMITATIONS](LIMITATIONS.md)

</div>