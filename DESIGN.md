---
system: Hundert AI
version: 0.1.0
status: aguardando aprovacao
reference: LP V4 Company "go-modular-b"
evidence: research/v4-go-modular-b/OBSERVATIONS.md
tokens: tokens.css
marks:
  E-vis: observado nos screenshots da referencia; estrutura confiavel, valor numerico aproximado
  D: derivado por calculo a partir de [E-vis], com a conta declarada
  I: decidido para preencher lacuna, com o motivo declarado
confidence:
  tokens_marcados: 63
  E-vis: "65%"
  D: "16%"
  I: "19%"
color:
  bg-base: "#0A0A0A [E-vis]"
  bg-elevated: "#141414 [E-vis]"
  bg-inverse: "#FFFFFF [E-vis]"
  surface-form: "#E9E9E9 [E-vis]"
  fg-on-dark: "#FFFFFF [E-vis]"
  fg-on-dark-muted: "#A3A3A3 [E-vis]"
  fg-on-light-muted: "#52525B [E-vis]"
  accent-brand: "#F0323F [D]"
  accent-brand-core: "#E11D2E [E-vis]"
  action: "#16A34A [D]"
  action-strong: "#15803D [D]"
  quote-from: "#D93B28 [D]"
typography:
  font-display: "Aeonik, Inter Tight [I]"
  font-mono: "JetBrains Mono [E-vis]"
  scale: "13 14 16 18 20 24 32 44 64 [E-vis + D]"
  leading-display: "1.05 [E-vis]"
  tracking-display: "-0.02em [E-vis]"
space:
  base: "8 [D]"
  section-desktop: "160px [E-vis]"
  container: "1280px [E-vis]"
radius:
  field: "10px [E-vis]"
  card: "16px [E-vis]"
  card-lg: "24px [E-vis]"
  panel: "56px [E-vis]"
  pill: "999px [E-vis]"
motion:
  ease-out: "cubic-bezier(.16,1,.3,1) [I]"
  dur-normal: "220ms [I]"
  dur-slow: "600ms [I]"
---

# DESIGN.md - Hundert AI

> Restricao visual ativa do projeto. Toda tela, componente, deck e documento se ancora aqui.
> A fonte de verdade dos **valores** e `tokens.css`. Este arquivo e a camada interpretativa:
> o que os tokens significam e como compor. Quando os dois divergirem, o CSS vence.

## 0. Como este documento foi construido, e o que isso limita

A referencia nunca foi carregada por esta sessao. A politica de egresso do ambiente respondeu
403 ao dominio, entao nao houve `getComputedStyle`, nao houve leitura de CSS, nao houve
medicao de pixel. O que existe sao **8 screenshots de tela cheia** enviados pelo cliente, lidos
diretamente.

Isso define exatamente o que e forte e o que e fraco aqui:

**Confiavel:** a sequencia de secoes, o ritmo escuro-claro-escuro, a regra do acento, o
inventario de componentes, as proporcoes relativas, a hierarquia tipografica, a familia de
formas. Estrutura se le em imagem.

**Aproximado:** todo hex e todo px. Foram lidos a olho. Um `#0A0A0A` pode ser `#0B0B0F`.

**Ausente:** movimento. Screenshot nao tem tempo. Toda a secao de motion e `[I]` declarado.
A familia tipografica tambem nao e determinavel por imagem.

Nenhum token neste sistema carrega a marca `[E]`. `[E]` exige o dump, que continua pendente.
Como fechar essa lacuna esta em `research/v4-go-modular-b/DOSSIER.md`.

**Decisao registrada do cliente:** foi pedido explicitamente "clone o mais fiel possivel".
Este documento entrega isso na gramatica: proporcao, ritmo, densidade, arquitetura de acento e
inventario de componentes sao 1:1 com a referencia. Duas ressalvas, ambas de fato e nao de
opiniao: a identidade visual da V4 e trade dress dela, e quatro pares de cor da referencia
reprovam em contraste WCAG AA. As correcoes estao na secao 8, com a conta.

---

## 1. Filosofia de design

A Hundert AI vende operacao: assessoria de marketing, midia paga e solucoes de IA para
escalar negocio. Isso e um negocio de **prova**, nao de promessa. O sistema visual existe para
uma unica coisa: fazer um empresario ocupado ler numero, reconhecer competencia e clicar.

O registro e **performance sob disciplina**. Fundo quase preto que faz a informacao brilhar,
tipo de display enorme com entrelinha curta, corpo cinza que nao compete com titulo, e um
unico ponto de decisao por secao. Nada de gradiente decorativo, nada de ilustracao generica de
SaaS, nada de icone flutuando sem funcao.

**Superficies deste sistema:**

- **Marca** - LP de conversao, heros, campanhas. E a primeira superficie a ser desenhada
- **Produto** - dashboards e paineis de cliente, quando o braco de produto amadurecer
- **Sistema** - a vitrine de tokens, esta documentacao

**Anti-referencias explicitas:** gradiente roxo-azul de SaaS, ilustracao isometrica, mockup de
navegador flutuando em perspectiva, "card de feature" com icone redondo colorido, heroi
centralizado com dois botoes lado a lado do mesmo peso, e qualquer secao que exista so para
ocupar altura.

---

## 2. Principios estruturais

### Hierarquia e leitura

Cada secao entrega **uma** afirmacao. A leitura desce assim: enfase pequena em caixa alta,
titulo grande de duas linhas onde a segunda carrega o acento, paragrafo curto de apoio, prova
concreta, e um unico CTA. Se uma secao precisa de dois CTAs, ela e duas secoes.

O titulo de duas linhas com a segunda em cor de marca e o gesto estrutural mais repetido da
referencia, e o mais barato de acertar: ele transforma o titulo em uma frase com sujeito
neutro e predicado acentuado.

### Ritmo e espaco

Base **8** `[D]`. Todo valor de espaco e multiplo dela. Respiro vertical de secao no desktop:
`--space-40` (160px). Conteudo em `--container` (1280px), goteira de 64px no desktop e 24px no
mobile.

O ritmo da pagina e **escuro, claro, escuro**. O bloco claro nao e uma secao com fundo trocado:
e um painel unico com `--radius-panel` (56px) nos cantos onde encosta no escuro. Ele parece um
cartao gigante deitado sobre a pagina. Esse detalhe e o que separa a referencia de um site que
so alterna cor de fundo.

### Componentes

Composicao, nunca imitacao. Quando o DS estiver compilado, monte a partir do namespace ligado.
Ate la, todo componente novo nasce de `tokens.css` e entra no inventario da secao 6.

### Responsividade

Mobile primeiro na intencao. O split 50/50 do hero vira coluna unica com o formulario embaixo
do texto. Tipo de display cai de 64px para 40px. Alvo de toque minimo 44px. As faixas
horizontais (metricas, depoimentos) mantem rolagem horizontal com o primeiro card sangrando na
borda, o que sinaliza que ha mais conteudo sem precisar de seta.

### Acessibilidade

Todo par texto/fundo deste sistema tem razao calculada e declarada. Nenhum foi herdado sem
conferencia. Isso e revisao, nao certificacao: teclado, leitor de tela e dispositivo real ainda
exigem teste humano.

---

## 3. Linguagem visual

### Cor

Duas familias de superficie e **duas familias de acento com funcoes que nao se cruzam**.

| Papel | Token | Onde vive |
|---|---|---|
| Fundo da pagina | `--bg-base` | secoes escuras |
| Superficie elevada | `--bg-elevated` | card de metrica, linha de FAQ |
| Painel claro | `--bg-inverse` | bloco de autoridade e depoimentos |
| Superficie de formulario | `--surface-form` | o card do hero, unico ponto de inversao local |
| Texto | `--fg-on-dark`, `--fg-on-dark-muted`, `--fg-on-light`, `--fg-on-light-muted` | |
| **Marca** | `--accent-brand`, `--accent-brand-core` | logo, check, segunda linha de titulo, numero de metrica, aba ativa, link de rodape, brilho de fundo |
| **Acao** | `--action`, `--action-strong` | **exclusivamente CTA primario** |

**A regra mais importante do sistema:** o vermelho nunca e um botao, e o verde nunca e
decoracao. O vermelho carrega quantidade e identidade, aparece dezenas de vezes por pagina e
por isso perde poder de convocacao. O verde aparece **uma vez por secao** e por isso ainda
manda. Inverter isso destroi as duas cores de uma vez: um CTA vermelho no meio de vinte
elementos vermelhos vira invisivel.

Onde o acento **nunca** aparece: em texto corrido, em borda de campo, em fundo de secao
inteira, e dentro do card de formulario. Essa ausencia e o que da peso a presenca.

### Tipografia

Uma familia grotesca de desenho geometrico para tudo, e **uma unica quebra**: numero de metrica
em monoespacada. A quebra e semantica, nao estetica. Ela diz "isto e dado".

| Papel | Tamanho | Entrelinha | Tracking | Peso |
|---|---|---|---|---|
| Display / H1 | `--text-4xl` 64px | 1.05 | -0.02em | 400-500 |
| H2 | `--text-3xl` 44px | 1.15 | -0.02em | 500-600 |
| H3 | `--text-xl` 24px | 1.15 | 0 | 600 |
| Corpo | `--text-md` 18px | 1.55 | 0 | 400 |
| Eyebrow | `--text-xs` 13px | 1.2 | +0.12em, caixa alta | 700 |
| Metrica | `--text-3xl` mono | 1.1 | 0 | 500 |

Entrelinha de display em 1.05 e a decisao mais radical da tipografia: o titulo vira um bloco
solido de texto, quase uma forma. So funciona com tracking negativo e com titulo curto.

O nome da familia e `[I]`. `Aeonik` e a aposta pela imagem, com `Inter Tight` como alternativa
licenciavel. O painel de fontes do DevTools resolve isso em cinco segundos.

### Elevacao

A referencia quase nao usa sombra no escuro: ela separa plano por **cor**, nao por sombra.
`--bg-elevated` sobre `--bg-base` ja e a elevacao. Sombra so existe em tres lugares:
bolha de logo sobre o painel claro, card sobre painel claro, e o halo do CTA.

O halo do CTA (`--shadow-cta`) nao e uma sombra: e uma marcacao. Ele existe para que o unico
elemento clicavel da secao tenha presenca fisica.

### Raio

Cinco niveis, cada um com um trabalho: `--radius-field` 10px, `--radius-card` 16px,
`--radius-card-lg` 24px, `--radius-panel` 56px, `--radius-pill` 999px. O pill e reservado a
CTA e aba. Nada mais na pagina e totalmente arredondado, o que faz do arredondamento total um
sinal de "isto e clicavel".

### Movimento `[I]`

Nao observavel em screenshot. Sistema declarado por decisao, para ser substituido quando o
dump chegar:

- **Entrada de secao** `--dur-slow` 600ms com `--ease-out`, deslocamento de 24px para cima,
  opacidade 0 a 1. Uma vez, sem repetir na rolagem de volta
- **Hover** `--dur-normal` 220ms. CTA escurece para `--action-hover` e sobe 2px; o halo cresce
- **Aba e acordeao** `--dur-normal` na cor, altura com `--ease-standard`
- **Nunca:** parallax, contador animado, carrossel com avanco automatico, e qualquer animacao
  que se repita enquanto o usuario le

`prefers-reduced-motion` zera as tres duracoes em `tokens.css`. Nao e opcional.

### Iconografia

Check de lista em vermelho, linha fina, sempre no mesmo tamanho do corpo. Seta de CTA dentro de
circulo, a direita do rotulo. Logos de terceiros entram monocromaticos no escuro e coloridos
quando dentro de bolha branca. Icone nunca aparece sozinho como decoracao de card.

---

## 4. Faca / Nao faca

**Faca**

- Uma afirmacao e um CTA por secao
- Titulo em duas linhas, acento na segunda
- Prova com numero especifico, em monoespacada
- Alterne escuro e claro com o painel de canto grande
- Deixe a faixa horizontal sangrar na borda para sinalizar continuacao
- Use `--action-strong` sempre que o rotulo do botao for menor que 18px bold

**Nao faca**

- CTA primario vermelho, em nenhuma hipotese
- Verde em qualquer coisa que nao seja acao primaria
- Dois CTAs de mesmo peso na mesma secao
- Texto de corpo em `--accent-brand-core`: 4.16:1 reprova
- Sombra difusa para separar plano no escuro: use `--bg-elevated`
- Entrelinha 1.05 em texto de mais de tres linhas
- Estrela de avaliacao sem a nota em texto ao lado

---

## 5. Filosofia de componente

Componente aqui e **papel**, nao aparencia. O CTA primario nao e "o botao verde": e o unico
ponto de decisao da secao, e por isso e verde. Se um dia dois precisarem coexistir, o segundo
vira link com seta, nao um segundo botao.

O card de formulario do hero e o unico lugar onde a paleta inverte localmente dentro de uma
secao escura. Ele funciona porque a inversao e total, nao parcial: fundo claro, campos brancos,
texto escuro. Meia inversao vira sujeira.

---

## 6. Padroes reutilizaveis

Inventario observado, na ordem da pagina:

| Padrao | Composicao |
|---|---|
| `nav` | marca a esquerda, 4 links a direita, sem CTA |
| `hero-split` | coluna de texto + card de formulario, 50/50 |
| `eyebrow` | ponto de marca + texto caixa alta com tracking |
| `check-list` | 3 itens, check vermelho, texto branco |
| `partner-strip` | rotulo + 3 logos monocromaticos |
| `panel-inverse` | painel claro com `--radius-panel` nos cantos de encontro |
| `portrait-card` | retrato sobre marca, nome vazado na vertical, legenda inferior |
| `quote-carousel` | cards de citacao com estrelas, titulo, regua, avatar |
| `metric-strip` | faixa horizontal de cards com numero mono em vermelho |
| `tab-pills` + `showcase-card` | abas em pill, card branco com titulo bicolor e bolhas de logo |
| `constellation` | bolhas de logo ligadas por linha fina a um centro de marca |
| `faq-accordion` | linhas escuras com icone de mais |
| `footer` | marca, voltar ao topo, regua, linha legal com links |

---

## 7. Handoff

Canvas primeiro, framework depois. `tokens.css` migra sem alteracao para qualquer alvo. Para a
LP de conversao, Astro e o alvo natural; se o painel de produto vier, Vite. Ver
`skills/framework-handoff.skill.md` e `docs/adapters/`.

---

## 8. Onde o sistema diverge da referencia de proposito

Quatro divergencias, todas por reprovacao medida em contraste WCAG 2.1. Nenhuma muda a
aparencia de forma perceptivel a olho nu; todas mudam quem consegue ler a pagina.

| O que | Referencia | Aqui | Motivo |
|---|---|---|---|
| Verde do CTA | ~`#22C55E`, branco a **2.28:1** | `--action` `#16A34A` a 3.30:1 para rotulo >= 18px bold, `--action-strong` `#15803D` a 5.02:1 abaixo disso | 2.28:1 reprova ate para texto grande. O rotulo do botao principal e a coisa que mais precisa ser lida |
| Vermelho em texto | ~`#E11D2E` a **4.16:1** | `--accent-brand` `#F0323F` a 4.93:1 sobre base e 4.59:1 sobre elevated | o vermelho de identidade fica em `--accent-brand-core`, restrito a forma e marca |
| Card de citacao | coral com branco a **3.33:1** | `--quote-from` `#D93B28` a 4.56:1, `--quote-to` `#B32A1C` a 6.43:1 | citacao e texto corrido e precisa de 4.5:1 |
| Estrela de avaliacao | dourado sobre coral a **1.81:1** | mesma estrela, com a nota em texto obrigatoria ao lado | informacao nao pode existir so em cor |

Alem dessas, uma adicao: `--border-light` nos campos de formulario. A referencia usa campo sem
borda visivel, o que apaga o limite do alvo de clique e prejudica o estado de foco.

Tudo o mais e fiel: sequencia de secoes, ritmo escuro-claro-escuro, canto grande do painel,
arquitetura de dois acentos, escala tipografica, familia de raios, densidade e composicao.

---

## 9. Relatorio

**Reducao.** De 8 telas cheias com dezenas de valores distintos para **63 tokens marcados** em
`tokens.css`. O corte mais agressivo foi em cor: a pagina exibe muitos tons de vermelho, coral,
cinza e verde, e quase todos sao a mesma decisao vista sob gradiente, sobreposicao ou
antialiasing. Sobraram 4 papeis de acento e 4 superficies.

**Confianca.** 65% `[E-vis]` · 16% `[D]` · 19% `[I]`. Abaixo do teto de 20% de `[I]` do
protocolo, mas so porque movimento foi isolado em poucos tokens. Se movimento fosse detalhado
como merece, `[I]` estouraria: e a maior lacuna deste sistema.

**Buracos, em ordem de valor:**

1. **Movimento inteiro.** Duracoes, curvas, o que anima na entrada. Screenshot nao captura
2. **Nome da familia tipografica.** Um print do painel de fontes do DevTools resolve
3. **Hex exato.** Tudo foi lido a olho. O dump promove `[E-vis]` para `[E]` de uma vez
4. **Mobile.** Nao ha nenhum print em 390px, entao a escala mobile e `[D]`
5. **Estados.** Hover, foco, erro, vazio e carregando nao aparecem em screenshot estatico

**O desvio.** Ficou: gramatica inteira. Mudou: quatro pares de cor por acessibilidade, e a
borda de campo. O sistema e reconhecivelmente da mesma familia da referencia, como pedido.

**Proximo passo.** Aprovacao. Depois dela, `design-system.dc.html` com paleta, escala, regua de
espaco, botoes, campos e cards, tudo com `var(--*)` e zero valor solto.

---

**Este sistema aguarda sua aprovacao. Nada sera desenhado antes dela.**
