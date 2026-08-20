# Fotos dos fundadores

Coloque aqui os dois arquivos que o card de lideranca da landing usa
(`landing.dc.html`, secao "Quem senta na mesa"):

- `jefferson.jpg`
- `guilherme.jpg`

Nomes exatos, extensao `.jpg`. Se preferir `.png`, ajuste os dois `src` no
HTML (busque por `assets/founders/`).

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
