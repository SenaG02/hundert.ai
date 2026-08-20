# Fotos dos fundadores

Os dois arquivos que o card de lideranca da landing usa
(`landing.dc.html`, secao "Quem senta na mesa"):

- `jefferson.png` - ja aplicada
- `guilherme.jpg` ou `guilherme.png` - falta

Nome exato (`jefferson` / `guilherme`), qualquer extensao de imagem
comum. Ao adicionar `guilherme`, ajuste o `src` correspondente em
`landing.dc.html` se a extensao nao for `.jpg`.

## jefferson.png - o que e o arquivo

`jefferson.png` e a peca final feita no Figma: 1588x2249, PNG com canal
alfa real (RGBA) - cerca de 20% dos pixels sao totalmente transparentes
(`alpha = 0`), incluindo os quatro cantos, formando o corte poligonal.
Fundo em gradiente laranja, nome e cargo desenhados dentro da imagem, e
o corte de canto e transparencia de verdade - nao uma cor solida - para
o fundo branco do painel aparecer por baixo.

Uma versao anterior deste arquivo foi recortada a mao (removendo o
gradiente e o corte, sobrando so rosto e ombros) por engano, achando que
o grafismo era indesejado. Nao era: e o design final. O arquivo atual e
o original, sem recorte. `tools/image/crop-png.mjs` continua no
repositorio como utilitario generico de recorte de PNG, mas nao e usado
neste arquivo.

## Especificacao (atual)

**Peca pronta e autocontida, como a referencia V4 (Flavio Augusto):**
fundo, corte poligonal de canto, faixa de texto lateral rotacionada e
texto de base, tudo desenhado dentro da propria imagem. O card renderiza
a imagem crua - nao desenha nenhuma informacao em HTML por cima, e o
container nao aplica raio de borda, `overflow:hidden`, `clip-path`,
borda nem fundo proprios (isso cortaria ou empilharia chrome sobre um
desenho que ja veio pronto do canto ao canto).

- Formato: PNG ou JPG, a peca inteira (fundo + foto + texto + corte de
  canto), do jeito que foi montada no Figma. Nao enviar so o retrato
  solto - todo o grafismo faz parte do arquivo agora.
- Proporcao: livre. O card nao forca nenhum quadro, nao corta e nao
  arredonda a imagem - `.leader-slide img` renderiza na largura da
  coluna com altura em `auto`, no formato exato do arquivo, cantos
  poligonais inclusos. Envie do tamanho que fez no Figma.
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
