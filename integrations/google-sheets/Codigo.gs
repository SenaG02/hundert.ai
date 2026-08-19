/**
 * Hundert AI - recebedor de leads da landing em Google Sheets.
 *
 * Publicar como Web App (Implantar > Nova implantacao > Tipo: App da Web):
 *   Executar como:        Eu
 *   Quem pode acessar:    Qualquer pessoa
 *
 * "Qualquer pessoa" assusta, mas e o correto aqui: o visitante da landing nao
 * tem conta Google. Isso NAO da acesso a planilha. A URL so aceita o que este
 * codigo aceita: uma linha na aba definida abaixo. Quem descobrir a URL
 * consegue, no maximo, criar linhas - por isso o honeypot e o limite de campo.
 */

var CONFIG = {
  ABA: 'Leads',
  // Origens autorizadas. Vazio = aceita qualquer uma. Preencha com o dominio
  // publicado para cortar envio de fora da sua LP.
  ORIGENS: [],          // ex.: ['https://hundert.ai', 'https://www.hundert.ai']
  MAX_CAMPO: 500,       // corte defensivo por campo
  EMAIL_AVISO: '',      // ex.: 'comercial@hundert.ai' para avisar a cada lead
};

var COLUNAS = [
  'recebido_em', 'nome', 'email', 'empresa', 'telefone', 'faturamento', 'segmento',
  'consentimento', 'pagina', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'utm_term', 'gclid', 'fbclid', 'dispositivo',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json({ ok: false, erro: 'sem_corpo' });

    var dados = JSON.parse(e.postData.contents);

    // Honeypot: campo escondido que so bot preenche. Responde ok para nao ensinar o bot.
    if (dados.website) return json({ ok: true });

    if (CONFIG.ORIGENS.length && dados.pagina) {
      var permitida = CONFIG.ORIGENS.some(function (o) { return dados.pagina.indexOf(o) === 0; });
      if (!permitida) return json({ ok: false, erro: 'origem_nao_autorizada' });
    }

    var faltando = ['nome', 'email', 'empresa', 'telefone'].filter(function (c) {
      return !dados[c] || !String(dados[c]).trim();
    });
    if (faltando.length) return json({ ok: false, erro: 'campos_obrigatorios', campos: faltando });

    var aba = planilha();
    aba.appendRow(COLUNAS.map(function (c) {
      if (c === 'recebido_em') return new Date();
      return corta(dados[c]);
    }));

    if (CONFIG.EMAIL_AVISO) {
      MailApp.sendEmail(CONFIG.EMAIL_AVISO, 'Novo lead: ' + corta(dados.empresa),
        COLUNAS.map(function (c) { return c + ': ' + (dados[c] || ''); }).join('\n'));
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, erro: 'falha_interna', detalhe: String(err) });
  }
}

/** Health check: abrir a URL no navegador deve responder {"ok":true,"servico":...}. */
function doGet() {
  return json({ ok: true, servico: 'hundert-leads', aba: CONFIG.ABA });
}

function planilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName(CONFIG.ABA) || ss.insertSheet(CONFIG.ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }
  return aba;
}

function corta(v) {
  return v == null ? '' : String(v).slice(0, CONFIG.MAX_CAMPO);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
