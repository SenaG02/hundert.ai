# Formulario da landing -> Google Sheets

A landing envia o lead direto do navegador para um Apps Script publicado como Web App,
que grava uma linha na planilha. Sem servidor proprio, sem chave secreta na pagina.

## Por que este caminho

O Google Sheets nao aceita escrita anonima pela API: qualquer chamada direta exigiria uma
credencial, e credencial dentro do JavaScript da pagina fica visivel para qualquer visitante.
O Apps Script resolve isso invertendo a relacao: o script roda com a **sua** conta, no
servidor do Google, e a pagina so consegue pedir aquilo que o codigo aceita.

## Passo a passo

1. Crie a planilha que vai receber os leads.
2. Nela, abra **Extensoes > Apps Script**.
3. Apague o conteudo e cole o `Codigo.gs` deste diretorio.
4. Ajuste o `CONFIG` no topo:
   - `ABA`: nome da aba. Ela e criada sozinha, com cabecalho, no primeiro lead
   - `ORIGENS`: assim que a LP estiver no ar, coloque o dominio dela. Enquanto estiver vazio,
     qualquer origem consegue postar
   - `EMAIL_AVISO`: opcional, dispara um e-mail a cada lead
5. **Implantar > Nova implantacao > Tipo: App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorize quando o Google pedir. O aviso de "app nao verificado" e esperado para script
   proprio: siga em **Avancado > Ir para (nome do projeto)**.
7. Copie a URL da implantacao. Ela termina em `/exec`.
8. Cole essa URL em `landing.dc.html`, na constante `ENDPOINT` do topo do script.

## Testando

Abra a URL `/exec` direto no navegador. A resposta deve ser:

```json
{"ok":true,"servico":"hundert-leads","aba":"Leads"}
```

Depois, envie o formulario da landing e confira a linha na planilha. Cada envio grava
data, os seis campos do formulario, o consentimento, a pagina, o referrer, as cinco UTMs,
`gclid`, `fbclid` e o dispositivo.

## Ao republicar o script

Cada nova implantacao pode gerar uma URL nova. Prefira **Implantar > Gerenciar implantacoes >
editar (icone de lapis) > Versao: Nova**, que mantem a mesma URL e evita que a LP no ar aponte
para um endpoint morto.

## O que este arranjo nao faz

- **Nao esconde a URL.** Ela vive no JavaScript da pagina, como qualquer endpoint publico de
  formulario. Ler a planilha continua exigindo permissao; o que a URL aceita e escrita, de
  quem a conhecer. O honeypot barra o robo comum. Contra alguem determinado, o passo seguinte
  e um captcha (Turnstile ou reCAPTCHA) validado dentro do `doPost`
- **Nao substitui CRM.** Planilha e um bom comeco e um pessimo lugar para gerir funil. Quando
  o volume justificar, o mesmo payload JSON serve para RD Station, HubSpot ou um webhook
  n8n: muda o destino, nao o formulario
- **Nao tem retentativa.** Se o envio falhar, a pessoa ve o erro e o botao volta a funcionar.
  Nenhum lead e gravado em duplicidade, e nenhum e perdido em silencio

## LGPD

O formulario coleta dado pessoal e por isso pede consentimento explicito, com link para a
politica de privacidade. Esse link precisa existir e apontar para um texto real antes de a
pagina receber trafego. A planilha herda a responsabilidade: controle quem tem acesso a ela.
