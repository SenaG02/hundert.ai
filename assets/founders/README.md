# Fotos dos fundadores

Os dois arquivos que o card de lideranca da landing usa
(`landing.dc.html`, secao "Quem senta na mesa"):

- `jefferson.png` - ja aplicada
- `guilherme.jpg` ou `guilherme.png` - falta

Nome exato (`jefferson` / `guilherme`), qualquer extensao de imagem
comum. Ao adicionar `guilherme`, ajuste o `src` correspondente em
`landing.dc.html` se a extensao nao for `.jpg`.

## jefferson.png - estado atual (provisorio)

`jefferson.png` hoje e um retrato simples: recorte manual de uma peca de
identidade que chegou pronta (fundo em gradiente laranja, nome e cargo
desenhados dentro da imagem, canto chanfrado), removendo esse grafismo
para sobrar so rosto e ombros - feito com `tools/image/crop-png.mjs`
(script proprio deste repositorio, decodifica os pixels do PNG, corta o
retangulo pedido, reescreve um PNG valido). Comando exato usado sobre o
arquivo original (`Jefferson.JPG.png`, ja removido do repositorio):
`node tools/image/crop-png.mjs Jefferson.JPG.png jefferson.png 450 100 880 1100`.

Esse recorte era para a especificacao anterior (retrato neutro + texto
desenhado pelo card em HTML). A especificacao mudou - ver secao abaixo -
entao `jefferson.png` e um placeholder de transicao ate a peca nova
(feita no Figma, no padrao da referencia V4) substituir o arquivo.

## Especificacao (atual)

**Peca pronta e autocontida, como a referencia V4 (Flavio Augusto):**
fundo, nome e cargo desenhados dentro da propria imagem. O card nao
desenha mais nenhuma informacao em HTML por cima da foto - so a imagem,
do jeito que ela vier do Figma.

- Formato: PNG ou JPG, a peca inteira (fundo + foto + texto), do jeito
  que foi montada no Figma. Nao enviar so o retrato solto - o texto e o
  fundo fazem parte do arquivo agora.
- Proporcao: livre. O card nao forca nenhum quadro fixo nem corta a
  imagem - `.leader-slide img` renderiza na largura da coluna com altura
  em `auto`, preservando a proporcao original do arquivo. Envie do
  tamanho que fez no Figma.
- Nome do arquivo: `jefferson.png` / `guilherme.jpg` ou `.png` (ajustar o
  `src` em `landing.dc.html` se a extensao for diferente de `.png` /
  `.jpg`).
- **Texto alternativo:** como o nome e cargo agora estao so dentro da
  imagem (nao em HTML), o `alt` de cada `<img>` em `landing.dc.html`
  carrega essa informacao para quem usa leitor de tela. Ja atualizado
  para o texto atual - se algo mudar (cargo, credencial), atualizar o
  `alt` junto com a imagem.

## Como funciona

O card alterna entre os dois retratos a cada 7 segundos (bloco "Card de
lideranca" no `<script>` no fim de `landing.dc.html`), com pausa em
hover e em foco de teclado, e clicar num dos dois pontos troca na hora e
trava a troca automatica - exigencia de acessibilidade (WCAG 2.2.2) para
qualquer conteudo que se move sozinho por mais de 5 segundos. Sem botao
de pausa visivel de proposito: os tres caminhos acima ja cobrem a regra.

Enquanto os arquivos nao existirem aqui, o navegador mostra um circulo
com as iniciais no lugar da foto. Isso nao e um erro nem placeholder de
texto falso: e o estado de fallback ja programado, pensado para
desaparecer sozinho assim que os arquivos forem adicionados. Nenhum
codigo precisa mudar.
