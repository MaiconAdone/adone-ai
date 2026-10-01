// Script do Google Ads (Ferramentas > Ações em massa > Scripts), agendado de hora em hora na conta
// "Adone Intelligence" (257-821-9244). Grava o desempenho na planilha do site enquanto a API do Google Ads
// (token de desenvolvedor) não é liberada: abas "Desempenho Ads" e "Termos de busca", no mesmo formato de
// src/lib/engine/ads/sync.ts, que o /painel e os agentes leem. Somente leitura na conta de anúncios.
// Não roda no site: copie este arquivo inteiro para o editor de scripts do Google Ads.

var SHEET_ID = "COLE_AQUI_O_ID_DA_PLANILHA"; // GOOGLE_SHEET_ID
var ADS_SHEET = "Desempenho Ads";
var ADS_HEADERS = ["Data", "Plataforma", "Campanha", "Grupo / conjunto", "Impressões", "Cliques", "Gasto (R$)", "Conversões"];
var TERMS_SHEET = "Termos de busca";
var TERMS_HEADERS = ["Termo", "Campanha", "Grupo", "Impressões", "Cliques", "Gasto (R$)", "Conversões"];
var PLATFORM = "Google Ads";

function main() {
    var book = SpreadsheetApp.openById(SHEET_ID);

    var daily = rows(
        "SELECT segments.date, campaign.name, ad_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
        "FROM ad_group WHERE segments.date DURING LAST_30_DAYS",
        function (r) {
            return [r["segments.date"], PLATFORM, r["campaign.name"], r["ad_group.name"], r["metrics.impressions"], r["metrics.clicks"], money(r["metrics.cost_micros"]), num(r["metrics.conversions"])];
        });
    var terms = rows(
        "SELECT search_term_view.search_term, campaign.name, ad_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
        "FROM search_term_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 300",
        function (r) {
            return [r["search_term_view.search_term"], r["campaign.name"], r["ad_group.name"], r["metrics.impressions"], r["metrics.clicks"], money(r["metrics.cost_micros"]), num(r["metrics.conversions"])];
        });

    // Mantém as linhas das outras plataformas (LinkedIn Ads, sincronizado pelo site)
    var adsSheet = sheet(book, ADS_SHEET, ADS_HEADERS);
    var others = existing(adsSheet).filter(function (r) { return r[1] !== PLATFORM; });
    var all = others.concat(daily).sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0; });
    replace(adsSheet, ADS_HEADERS.length, all);
    replace(sheet(book, TERMS_SHEET, TERMS_HEADERS), TERMS_HEADERS.length, terms);

    var stamp = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy, HH:mm:ss");
    setIntegration(book, "ads_ultima_sincronizacao", stamp + " — Google Ads (script): " + daily.length + " linhas, " + terms.length + " termos", stamp);
    Logger.log("Google Ads: %s linhas diárias, %s termos de busca", daily.length, terms.length);
}

function rows(query, map) {
    var out = [];
    var it = AdsApp.report(query).rows();
    while (it.hasNext()) out.push(map(it.next()).map(String));
    return out;
}

// Valores no formato do site: vírgula decimal, gravados como texto
function num(value) { return String(Math.round(Number(value || 0) * 100) / 100).replace(".", ","); }
function money(micros) { return num(Number(micros || 0) / 1000000); }

function sheet(book, title, headers) {
    var s = book.getSheetByName(title) || book.insertSheet(title);
    s.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
    s.setFrozenRows(1);
    return s;
}

function existing(s) {
    var last = s.getLastRow();
    if (last < 2) return [];
    return s.getRange(2, 1, last - 1, ADS_HEADERS.length).getDisplayValues().filter(function (r) { return r[0]; });
}

function replace(s, width, values) {
    var last = s.getLastRow();
    if (last >= 2) s.getRange(2, 1, last - 1, Math.max(width, s.getLastColumn())).clearContent();
    if (!values.length) return;
    var range = s.getRange(2, 1, values.length, width);
    range.setNumberFormat("@"); // texto puro: datas AAAA-MM-DD comparáveis e "42,87" sem conversão
    range.setValues(values);
}

function setIntegration(book, key, value, stamp) {
    var s = sheet(book, "Integrações", ["Chave", "Valor", "Atualizado em"]);
    var last = s.getLastRow();
    var keys = last >= 2 ? s.getRange(2, 1, last - 1, 1).getValues() : [];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i][0] === key) {
            s.getRange(i + 2, 2, 1, 2).setNumberFormat("@").setValues([[value, stamp]]);
            return;
        }
    }
    s.getRange(last + 1, 1, 1, 3).setNumberFormat("@").setValues([[key, value, stamp]]);
}
