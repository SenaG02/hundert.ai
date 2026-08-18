# Observacao visual - LP de referencia (V4 Company, "go-modular-b")

Fonte: 8 screenshots de tela cheia enviados pelo cliente em 2026-08-18, navegador em
~1920px de largura. A pagina nunca foi carregada por esta sessao (bloqueio de egresso),
entao **nada aqui vem do CSS**. Tudo abaixo foi lido do render.

Marca de evidencia usada no DESIGN.md:

| Marca | Significado |
|---|---|
| `[E-vis]` | Observado nos screenshots. Estrutura e comportamento sao confiaveis; valores numericos (hex, px) sao aproximados a olho |
| `[D]` | Derivado por calculo a partir de `[E-vis]`, com a conta declarada |
| `[I]` | Preenchido por decisao, com o motivo declarado |

Nao existe `[E]` neste sistema. `[E]` exigiria o dump de `getComputedStyle`, que continua
pendente. O caminho para promover `[E-vis]` para `[E]` esta em `DOSSIER.md`.

## Sequencia de secoes observada

| # | Secao | Fundo | Conteudo |
|---|---|---|---|
| 1 | Nav | escuro | Marca a esquerda, 4 links a direita (Depoimentos, Pra quem e, O que a V4 faz, FAQ). Sem CTA no header |
| 2 | Hero | escuro | Split 50/50. Esquerda: eyebrow com ponto vermelho, H1 de 4 linhas, paragrafo, 3 itens com check vermelho, faixa de logos de parceiros. Direita: card cinza claro com 6 campos e CTA verde |
| 3 | Conselheiro | claro | Painel claro com canto superior esquerdo muito arredondado. H2 em duas linhas (segunda em vermelho), paragrafo, CTA verde pill. A direita, card-retrato vermelho com nome em tipo vazado na vertical e legenda embaixo |
| 4 | Depoimentos | claro | H2 em duas linhas (segunda em vermelho). Carrossel de cards coral com 5 estrelas, titulo caixa alta, regua, citacao, avatar + nome/cargo. Botao circular de avanco |
| 5 | Lideranca | escuro | H2 com trecho em vermelho. Faixa horizontal de cards escuros com numeros grandes em vermelho e fonte monoespacada. CTA verde pill centralizado |
| 6 | Servicos | escuro | H2 com trecho em vermelho. Fila de pills de aba (ativa: texto e borda vermelhos, ponto vermelho). Card branco grande com titulo bicolor e bolhas circulares de logos. Duas colunas de texto. CTA verde |
| 7 | IA e Tecnologia | escuro | Brilho radial vermelho no fundo. Texto a esquerda com 3 checks vermelhos e CTA verde. A direita, constelacao de bolhas escuras com logos de IA ligadas por linhas finas a um circulo branco central com a marca |
| 8 | FAQ | escuro | H2. Seis linhas de acordeao em cards escuros com icone de mais. Rodape com marca, "Retornar ao topo", regua, linha legal com dois links vermelhos |

Ritmo: **escuro - claro - escuro**. O bloco claro (secoes 3 e 4) e um painel unico com raio
muito grande nos cantos que encostam no escuro, nao duas secoes separadas.

## A regra do acento

O achado que contradiz a leitura obvia da marca: **o vermelho nunca e o botao.**

| Papel | Cor | Onde aparece |
|---|---|---|
| Marca e enfase | vermelho | logo, checks, ponto do eyebrow, segunda linha dos H2, numeros de metrica, aba ativa, links do rodape, brilho de fundo, card-retrato |
| Acao | verde | todos os CTAs primarios, sem excecao: "Falar com especialista", "Solicite seu diagnostico", "Agendar Reuniao", "Falar com um consultor", "Saber Mais" |

O vermelho carrega quantidade e identidade. O verde carrega decisao, e aparece uma vez por
secao. Nenhum CTA primario vermelho foi observado em nenhum dos 8 prints. Essa separacao e o
que impede a pagina de virar ruido: com tudo vermelho, nada seria clicavel.

Onde o acento **nunca** aparece: em texto corrido, em borda de campo de formulario, em fundo
de secao inteira, e em qualquer coisa dentro do card do formulario (que e o unico ponto da
pagina onde a paleta inverte para cinza claro e o verde fica sozinho).

## Formas

- CTA primario: pill totalmente arredondado, com brilho verde difuso ao redor, seta dentro de circulo a direita do rotulo
- Card de formulario: raio grande (~24px), fundo cinza claro, campos brancos de raio menor (~10px)
- Cards escuros (metricas, FAQ): raio ~16px, borda de baixissimo contraste
- Painel claro: raio muito grande (~56px) nos cantos de encontro com o escuro
- Card-retrato e card branco de servico: raio ~24px, com recorte chanfrado em um canto no card-retrato

## Tipografia observada

Grotesca de desenho geometrico, `a` de dois andares, terminais horizontais. Display com
tracking negativo e entrelinha muito curta (o H1 ocupa 4 linhas com folga minima entre elas).
Numeros de metrica em fonte monoespacada, que e a unica quebra de familia da pagina.
Eyebrow em caixa alta com tracking positivo alto. **O nome da familia nao e determinavel por
screenshot** - so o dump ou o painel de fontes do DevTools resolve.

## Falhas de contraste medidas na paleta observada

Calculado sobre os valores aproximados, com a formula WCAG 2.1:

| Par | Razao | Veredito |
|---|---|---|
| branco sobre o verde do CTA | 2.28:1 | reprova ate para texto grande |
| branco sobre o coral do depoimento | 3.33:1 | reprova para corpo |
| vermelho da marca sobre o fundo escuro | 4.16:1 | reprova para corpo, passa para texto grande |
| estrela dourada sobre o coral | 1.81:1 | sem alternativa textual para a nota |

O DESIGN.md corrige as quatro. As correcoes estao na secao "Onde o sistema diverge da
referencia de proposito".
