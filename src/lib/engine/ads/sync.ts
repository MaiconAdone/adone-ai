// Sincronização de hora em hora do Google Ads e do LinkedIn Ads para a planilha (abas "Desempenho Ads" e
// "Termos de busca"), e o resumo que os agentes de Mídia e Estrategista leem para aprender com as campanhas.
// Somente leitura: os agentes recomendam, o Maicon aplica.

import { isGoogleConfigured, sheetId, sheetsApi } from "../agenda/google";
import { saveIntegrationValue } from "../linkedin/connection";
import { ensureSheet, formatSheetDate, readSheet, type SheetRow } from "../marketing/workspace";
import { fetchGoogleDaily, fetchSearchTerms, googleAdsConfigured } from "./google-ads";
import { fetchLinkedInDaily, linkedinAdsConnected } from "./linkedin-ads";
import type { AdsRow, SearchTermRow } from "./types";

export const ADS_SHEET = "Desempenho Ads";
const ADS_HEADERS = ["Data", "Plataforma", "Campanha", "Grupo / conjunto", "Impressões", "Cliques", "Gasto (R$)", "Conversões"] as const;
export const TERMS_SHEET = "Termos de busca";
const TERMS_HEADERS = ["Termo", "Campanha", "Grupo", "Impressões", "Cliques", "Gasto (R$)", "Conversões"] as const;
export const LAST_SYNC_KEY = "ads_ultima_sincronizacao";

const num = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");

// Reescreve a aba inteira (os últimos 30 dias chegam completos a cada sincronização)
async function replaceSheet(title: string, headers: readonly string[], rows: string[][]): Promise<void> {
    await ensureSheet(title, headers);
    const api = sheetsApi();
    await api.spreadsheets.values.clear({ spreadsheetId: sheetId(), range: `${title}!A2:Z` });
    if (rows.length) {
        await api.spreadsheets.values.update({
            spreadsheetId: sheetId(),
            range: `${title}!A2`,
            valueInputOption: "RAW", // mantém as datas AAAA-MM-DD como texto (comparáveis)
            requestBody: { values: rows },
        });
    }
}

export async function syncAds(): Promise<string> {
    if (!isGoogleConfigured()) return "Planilha não configurada";
    const google = googleAdsConfigured();
    const linkedin = await linkedinAdsConnected();
    if (!google && !linkedin) return "Nenhuma plataforma de anúncios conectada";

    const parts: string[] = [];
    const rows: AdsRow[] = [];
    let terms: SearchTermRow[] = [];

    if (google) {
        try {
            const [daily, searchTerms] = await Promise.all([fetchGoogleDaily(), fetchSearchTerms()]);
            rows.push(...daily);
            terms = searchTerms;
            parts.push(`Google Ads: ${daily.length} linhas`);
        } catch (err) {
            parts.push(`Google Ads: falhou (${err instanceof Error ? err.message.slice(0, 200) : err})`);
        }
    }
    if (linkedin) {
        try {
            const daily = await fetchLinkedInDaily();
            rows.push(...daily);
            parts.push(`LinkedIn Ads: ${daily.length} linhas`);
        } catch (err) {
            parts.push(`LinkedIn Ads: falhou (${err instanceof Error ? err.message.slice(0, 200) : err})`);
        }
    }

    // Só reescreve o que veio: uma plataforma fora do ar não apaga os dados da outra
    const failed = new Set(parts.filter(p => p.includes("falhou")).map(p => p.split(":")[0]));
    const kept = failed.size ? (await readSheet(ADS_SHEET).catch(() => [])).filter(r => failed.has(r.Plataforma)) : [];
    const sorted = rows.sort((a, b) => a.date.localeCompare(b.date) || a.platform.localeCompare(b.platform));
    await replaceSheet(ADS_SHEET, ADS_HEADERS, [
        ...kept.map(r => ADS_HEADERS.map(h => r[h] ?? "")),
        ...sorted.map(r => [r.date, r.platform, r.campaign, r.group, String(r.impressions), String(r.clicks), num(r.spend), num(r.conversions)]),
    ]);
    if (google && !failed.has("Google Ads")) {
        await replaceSheet(TERMS_SHEET, TERMS_HEADERS, terms.map(t => [t.term, t.campaign, t.group, String(t.impressions), String(t.clicks), num(t.spend), num(t.conversions)]));
    }

    const summary = `${formatSheetDate(new Date())} — ${parts.join(" | ")}`;
    await saveIntegrationValue(LAST_SYNC_KEY, summary).catch(() => undefined);
    return summary;
}

// ---------- Resumo para os agentes ----------

const parseNum = (v: string | undefined) => Number(String(v ?? "0").replace(/\./g, "").replace(",", ".")) || 0;
const brl = (n: number) => `R$ ${n.toFixed(2)}`;

interface Totals { impressions: number; clicks: number; spend: number; conversions: number }

function add(map: Map<string, Totals>, key: string, r: SheetRow) {
    const t = map.get(key) ?? { impressions: 0, clicks: 0, spend: 0, conversions: 0 };
    t.impressions += parseNum(r["Impressões"]);
    t.clicks += parseNum(r.Cliques);
    t.spend += parseNum(r["Gasto (R$)"]);
    t.conversions += parseNum(r["Conversões"]);
    map.set(key, t);
}

function line(key: string, t: Totals): string {
    const ctr = t.impressions ? ((t.clicks / t.impressions) * 100).toFixed(2) + "%" : "-";
    const cpc = t.clicks ? brl(t.spend / t.clicks) : "-";
    const cpa = t.conversions ? brl(t.spend / t.conversions) : "sem conversão";
    return `${key}: ${t.impressions} impressões | ${t.clicks} cliques | CTR ${ctr} | CPC ${cpc} | gasto ${brl(t.spend)} | ${t.conversions} conversões | custo/conversão ${cpa}`;
}

// Gasto real das plataformas nos últimos N dias (null se não houver dados sincronizados)
export async function adsSpend(days = 30, now = new Date()): Promise<{ total: number; byPlatform: Record<string, number> } | null> {
    const rows = await readSheet(ADS_SHEET).catch(() => []);
    if (!rows.length) return null;
    const from = new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
    const byPlatform: Record<string, number> = {};
    for (const r of rows.filter(r => r.Data >= from)) byPlatform[r.Plataforma] = (byPlatform[r.Plataforma] ?? 0) + parseNum(r["Gasto (R$)"]);
    return { total: Object.values(byPlatform).reduce((a, b) => a + b, 0), byPlatform };
}

export async function buildAdsSummary(now = new Date()): Promise<string> {
    const [rows, terms] = await Promise.all([readSheet(ADS_SHEET).catch(() => []), readSheet(TERMS_SHEET).catch(() => [])]);
    if (!rows.length) return "Sem dados das plataformas de anúncio ainda (APIs não conectadas ou campanhas sem veiculação).";

    const since = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
    const out: string[] = [];
    for (const [label, days] of [["Últimos 7 dias", 7], ["Últimos 30 dias", 30]] as const) {
        const period = rows.filter(r => r.Data >= since(days));
        const byPlatform = new Map<string, Totals>();
        const byGroup = new Map<string, Totals>();
        for (const r of period) {
            add(byPlatform, r.Plataforma, r);
            add(byGroup, `${r.Plataforma} › ${r.Campanha} › ${r["Grupo / conjunto"]}`, r);
        }
        out.push(`${label.toUpperCase()}:`);
        byPlatform.forEach((t, k) => out.push(`  ${line(k, t)}`));
        [...byGroup.entries()].sort((a, b) => b[1].spend - a[1].spend).slice(0, 15).forEach(([k, t]) => out.push(`  - ${line(k, t)}`));
    }

    if (terms.length) {
        const wasted = terms
            .filter(t => parseNum(t["Conversões"]) === 0 && parseNum(t["Gasto (R$)"]) > 0)
            .sort((a, b) => parseNum(b["Gasto (R$)"]) - parseNum(a["Gasto (R$)"]))
            .slice(0, 20);
        const converting = terms.filter(t => parseNum(t["Conversões"]) > 0).slice(0, 15);
        out.push("", "TERMOS DE BUSCA DO GOOGLE (30 dias):");
        out.push(`  Com conversão: ${converting.map(t => `"${t.Termo}" (${t["Conversões"]} conv., ${brl(parseNum(t["Gasto (R$)"]))})`).join("; ") || "nenhum"}`);
        out.push(`  Gastaram sem converter: ${wasted.map(t => `"${t.Termo}" (${brl(parseNum(t["Gasto (R$)"]))}, ${t.Cliques} cliques)`).join("; ") || "nenhum"}`);
    }
    out.push("", "Observação: conversões das plataformas = cliques no WhatsApp/agendamentos rastreados pela tag; qualidade do lead está nos números de leads qualificados por UTM acima.");
    return out.join("\n");
}
