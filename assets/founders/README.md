# Fotos dos fundadores

Os dois arquivos que o card de lideranca da landing usa
(`landing.dc.html`, secao "Quem senta na mesa"):

- `jefferson.png` - ja aplicada
- `guilherme.jpg` ou `guilherme.png` - falta

Nome exato (`jefferson` / `guilherme`), qualquer extensao de imagem
comum. Ao adicionar `guilherme`, ajuste o `src` correspondente em
`landing.dc.html` se a extensao nao for `.jpg`.

## jefferson.png - de onde veio

Recortada a mao de uma peca de identidade ja pronta (fundo em gradiente
laranja, nome e cargo desenhados dentro da imagem, canto chanfrado) que
chegou como o unico material disponivel. O recorte usado
(`tools/image/crop-png.mjs`, script proprio deste repositorio - decodifica
os pixels do PNG, corta o retangulo pedido e reescreve um PNG valido)
isolou so o rosto e ombros, removendo a faixa de nome vertical a
esquerda, a legenda inferior e o canto chanfrado, na proporcao 4:5 que o
card espera. Comando exato aplicado sobre o arquivo original
(`Jefferson.JPG.png`, ja removido do repositorio apos o recorte):
`node tools/image/crop-png.mjs Jefferson.JPG.png jefferson.png 450 100 880 1100`.
O fundo laranja da peca original permanece - so o texto duplicado e a
forma cortada foram removidos, que era o problema real (duplicar
informacao que o card ja desenha em HTML, misturando duas paletas de cor
na mesma tela).

Se uma foto nova, mais neutra, aparecer depois, e so substituir o
arquivo - o card nao muda.

## Especificacao

- **Retrato simples, sem grafismo.** So a foto: sem gradiente de fundo,
  sem nome ou cargo desenhado dentro da imagem, sem moldura ou canto
  cortado. O card ja desenha nome, cargo e credencial em HTML por cima da
  foto, no sistema visual da Hundert - uma peca pronta com texto embutido
  duplica essa informacao e mistura duas paletas de cor diferentes na
  mesma tela.
- Proporcao 4:5 (retrato). A imagem e cortada automaticamente
  (`object-fit: cover`) para preencher esse quadro - enquadre o rosto
  centralizado, com folga nas bordas para o corte nao cortar a cabeca.
- Minimo recomendado: 800x1000px.
- Fundo e iluminacao parecidos entre as duas fotos ajudam o card a nao
  parecer duas fotos de fontes diferentes quando alterna.

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
