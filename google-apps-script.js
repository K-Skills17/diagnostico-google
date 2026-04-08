// =============================================================
// DIAGNÓSTICO DE GOOGLE MEU NEGÓCIO
// =============================================================
// INSTRUÇÕES DE INSTALAÇÃO:
// 1. Crie uma nova Google Sheet (ou use uma aba na sheet existente)
// 2. Vá em Extensões > Apps Script
// 3. Apague o código existente e cole este script inteiro
// 4. Clique em "Implantar" > "Nova implantação"
// 5. Tipo: "App da Web"
// 6. Executar como: "Eu" (sua conta)
// 7. Quem tem acesso: "Qualquer pessoa"
// 8. Clique em "Implantar" e copie a URL gerada
// 9. Cole a URL no arquivo src/config.js do app
// =============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Nome',
        'Clínica',
        'Email',
        'Cidade',
        'Nota Total',
        'Classificação',
        'Verificado',
        'Info Completa',
        'Categorias',
        'Qtd Fotos',
        'Fotos Profissionais',
        'Foto Equipe',
        'Foto Capa',
        'Qtd Avaliações',
        'Nota Média',
        'Responde Avaliações',
        'Sistema Avaliações',
        'Frequência Posts',
        'Publica Ofertas',
        'Descrição Serviços',
        'Pesquisou Google',
        'Top 3 Resultados'
      ]);

      sheet.getRange(1, 1, 1, 23).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('pt-BR'),
      data.nome || '',
      data.clinica || '',
      data.email || '',
      data.cidade || '',
      data.totalScore || '',
      data.grade || '',
      data.verificado || '',
      data.completo || '',
      data.categorias || '',
      data.qtdFotos || '',
      data.fotosProfissionais || '',
      data.fotoEquipe || '',
      data.fotoCapa || '',
      data.qtdAvaliacoes || '',
      data.notaMedia || '',
      data.respondeAvaliacoes || '',
      data.sistemaAvaliacoes || '',
      data.frequenciaPost || '',
      data.ofertas || '',
      data.descricaoServicos || '',
      data.pesquisou || '',
      data.topResultados || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Diagnóstico Google API ativa' }))
    .setMimeType(ContentService.MimeType.JSON);
}
