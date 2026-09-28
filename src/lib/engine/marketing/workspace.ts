// Área de trabalho dos agentes de marketing na planilha "Adone — Leads e Agendamentos":
// abas de Estratégia e Conteúdo, com a coluna Status usada para aprovação humana.

import { isGoogleConfigured, sheetId, sheetsApi } from "../agenda/google";
import { appendRow, nowLabel } from "../agenda/sheets";
import { BOOKINGS_HEADERS, BOOKINGS_SHEET, LEADS_SHEET, MEETING_RESULTS } from "../agenda/sheet-schema.mjs";

export const STATUS = {
    pending: "Aguardando aprovação",
    approved: "Aprovado",
    rejected: "Rejeitado",
    published: "Publicado",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export const STRATEGY_SHEET = "Estratégia";
export const STRATEGY_HEADERS = [
    "Semana",
    "Criado em",
    "Status",
    "Cliente ideal (ICP)",
    "Posicionamento",
    "Temas de conteúdo",
    "Hipóteses de campanha",
    "Leitura dos números",
    "Ajustes recomendados",
    "Seus comentários",
] as const;

export const CONTENT_SHEET = "Conteúdo";
export const CONTENT_HEADERS = [
    "Criado em",
    "Status",
    "Tipo",
    "Título",
    "Slug",
    "Palavra-chave",
    "Setor",
    "Meta description",
    "Resumo",
    "Texto (Markdown)",
    "Semana da estratégia",
    "Seus comentários",
    "Imagem (ID no Drive)",
    "Publicar em",
] as const;

export const CAMPAIGNS_SHEET = "Campanhas";
export const CAMPAIGNS_HEADERS = [
    "Criado em",
    "Status",
    "Plataforma",
    "Campanha",
    "Objetivo",
    "Orçamento diário (R$)",
    "Segmentação / palavras-chave",
    "Anúncios",
    "Negativas",
    "URL final (com UTM)",
    "Justificativa",
    "Métrica de sucesso",
    "Alertas",
    "Semana da estratégia",
    "Seus comentários",
] as const;

// Execuções dos agentes (lidas pelo painel)
export const RUNS_SHEET = "Execuções";
export const RUNS_HEADERS = ["Início", "Agente", "Resultado", "Duração (s)", "Resumo"] as const;

// Investimento lançado manualmente enquanto as APIs de anúncios não estão liberadas
export const INVESTMENT_SHEET = "Investimento";
export const INVESTMENT_HEADERS = [
    "Semana (início)",
    "Plataforma",
    "Campanha",
    "Valor gasto (R$)",
    "Impressões",
    "Cliques",
    "Observações",
] as const;

export type SheetRow = Record<string, string>;

const ensured = new Set<string>();

// Cria a aba (com cabeçalho, linha congelada e lista de status) se ainda não existir
export async function ensureSheet(title: string, headers: readonly string[]): Promise<void> {
    if (ensured.has(title)) return;
    const api = sheetsApi();
    const { data } = await api.spreadsheets.get({ spreadsheetId: sheetId(), fields: "sheets.properties" });
    if (!data.sheets?.some(s => s.properties?.title === title)) {
        const { data: created } = await api.spreadsheets.batchUpdate({
            spreadsheetId: sheetId(),
            requestBody: { requests: [{ addSheet: { properties: { title, gridProperties: { frozenRowCount: 1 } } } }] },
        });
        const newSheetId = created.replies?.[0]?.addSheet?.properties?.sheetId ?? 0;
        await api.spreadsheets.values.update({
            spreadsheetId: sheetId(),
            range: `${title}!A1`,
            valueInputOption: "RAW",
            requestBody: { values: [Array.from(headers)] },
        });
        const statusColumn = headers.indexOf("Status");
        await api.spreadsheets.batchUpdate({
            spreadsheetId: sheetId(),
            requestBody: {
                requests: [
                    {
                        repeatCell: {
                            range: { sheetId: newSheetId, startRowIndex: 0, endRowIndex: 1 },
                            cell: { userEnteredFormat: { textFormat: { bold: true } } },
                            fields: "userEnteredFormat.textFormat.bold",
                        },
                    },
                    // Lista suspensa na coluna Status: é aqui que o Maicon aprova ou rejeita
                    ...(statusColumn >= 0 ? [{
                        setDataValidation: {
                            range: { sheetId: newSheetId, startRowIndex: 1, startColumnIndex: statusColumn, endColumnIndex: statusColumn + 1 },
                            rule: {
                                condition: { type: "ONE_OF_LIST", values: Object.values(STATUS).map(v => ({ userEnteredValue: v })) },
                                showCustomUi: true,
                                strict: true,
                            },
                        },
                    }] : []),
                ],
            },
        });
        console.log(`[Marketing] Aba "${title}" criada na planilha`);
    }
    ensured.add(title);
}

// Número da linha na planilha (para atualizar células depois)
export const ROW_KEY = "_linha";

export async function readSheet(title: string): Promise<SheetRow[]> {
    if (!isGoogleConfigured()) return [];
    const { data } = await sheetsApi().spreadsheets.values.get({ spreadsheetId: sheetId(), range: `${title}!A:Z` });
    const [headers = [], ...rows] = data.values || [];
    return rows.map((row, i) => ({
        ...Object.fromEntries(headers.map((h, j) => [String(h), String(row[j] ?? "")])),
        [ROW_KEY]: String(i + 2),
    }));
}

function columnLetter(index: number): string {
    let letter = "";
    for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) letter = String.fromCharCode(65 + ((n - 1) % 26)) + letter;
    return letter;
}

export async function updateCell(title: string, headers: readonly string[], row: SheetRow, column: string, value: string): Promise<void> {
    const index = headers.indexOf(column);
    if (index < 0 || !row[ROW_KEY]) throw new Error(`Coluna ou linha inválida: ${column}`);
    await sheetsApi().spreadsheets.values.update({
        spreadsheetId: sheetId(),
        range: `${title}!${columnLetter(index)}${row[ROW_KEY]}`,
        valueInputOption: "RAW",
        requestBody: { values: [[value]] },
    });
}

export async function appendStrategy(row: Partial<Record<(typeof STRATEGY_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(STRATEGY_SHEET, STRATEGY_HEADERS);
    await appendRow(STRATEGY_SHEET, STRATEGY_HEADERS, { "Criado em": nowLabel(), Status: STATUS.pending, ...row });
}

export async function appendContent(row: Partial<Record<(typeof CONTENT_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(CONTENT_SHEET, CONTENT_HEADERS);
    await appendRow(CONTENT_SHEET, CONTENT_HEADERS, { "Criado em": nowLabel(), Status: STATUS.pending, ...row });
}

// Date → "25/09/2026, 15:58:13" (mesmo formato de nowLabel, horário de Brasília)
export function formatSheetDate(date: Date): string {
    return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// "25/09/2026, 15:58:13" → Date (datas gravadas por nowLabel, horário de Brasília)
export function parseSheetDate(value: string): Date | null {
    const m = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:,?\s+(\d{2}):(\d{2}))?/);
    if (!m) return null;
    const [, dd, mm, yyyy, hh = "12", mi = "00"] = m;
    return new Date(`${yyyy}-${mm}-${dd}T${hh}:${mi}:00-03:00`);
}

export async function readLeads(): Promise<SheetRow[]> {
    return readSheet(LEADS_SHEET);
}

export async function readBookings(): Promise<SheetRow[]> {
    await ensureBookingResultColumns();
    return readSheet(BOOKINGS_SHEET);
}

// Colunas de resultado comercial ("Resultado da reunião", "Valor do contrato") no fim da aba Agendamentos,
// acrescentadas em planilhas criadas antes delas existirem. Só mexe se o cabeçalho atual for o esperado.
let bookingColumnsChecked = false;

async function ensureBookingResultColumns(): Promise<void> {
    if (bookingColumnsChecked || !isGoogleConfigured()) return;
    const api = sheetsApi();
    const { data } = await api.spreadsheets.values.get({ spreadsheetId: sheetId(), range: `${BOOKINGS_SHEET}!1:1` });
    const current = (data.values?.[0] || []).map(String);
    const resultColumn = BOOKINGS_HEADERS.indexOf("Resultado da reunião");
    const isOldHeader = current.length === resultColumn && current.every((h, i) => h === BOOKINGS_HEADERS[i]);
    if (isOldHeader) {
        await api.spreadsheets.values.update({
            spreadsheetId: sheetId(),
            range: `${BOOKINGS_SHEET}!A1`,
            valueInputOption: "RAW",
            requestBody: { values: [Array.from(BOOKINGS_HEADERS)] },
        });
        const { data: meta } = await api.spreadsheets.get({ spreadsheetId: sheetId(), fields: "sheets.properties" });
        const tabId = meta.sheets?.find(s => s.properties?.title === BOOKINGS_SHEET)?.properties?.sheetId ?? 0;
        await api.spreadsheets.batchUpdate({
            spreadsheetId: sheetId(),
            requestBody: {
                requests: [
                    {
                        repeatCell: {
                            range: { sheetId: tabId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: resultColumn, endColumnIndex: resultColumn + 2 },
                            cell: { userEnteredFormat: { textFormat: { bold: true } } },
                            fields: "userEnteredFormat.textFormat.bold",
                        },
                    },
                    {
                        setDataValidation: {
                            range: { sheetId: tabId, startRowIndex: 1, startColumnIndex: resultColumn, endColumnIndex: resultColumn + 1 },
                            rule: {
                                condition: { type: "ONE_OF_LIST", values: MEETING_RESULTS.map(v => ({ userEnteredValue: v })) },
                                showCustomUi: true,
                                strict: true,
                            },
                        },
                    },
                ],
            },
        });
        console.log("[Marketing] Colunas de resultado comercial adicionadas à aba Agendamentos");
    }
    bookingColumnsChecked = true;
}

// Resultado comercial das reuniões (preenchido pelo Maicon na aba Agendamentos)
export const PROPOSAL_RESULTS = ["Proposta enviada", "Fechou", "Perdeu a proposta"];

export function isProposal(row: SheetRow): boolean {
    return PROPOSAL_RESULTS.includes(row["Resultado da reunião"] || "");
}

export function isWon(row: SheetRow): boolean {
    return row["Resultado da reunião"] === "Fechou";
}

export async function appendCampaign(row: Partial<Record<(typeof CAMPAIGNS_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(CAMPAIGNS_SHEET, CAMPAIGNS_HEADERS);
    await appendRow(CAMPAIGNS_SHEET, CAMPAIGNS_HEADERS, { "Criado em": nowLabel(), Status: STATUS.pending, ...row });
}

export async function appendRun(row: Partial<Record<(typeof RUNS_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(RUNS_SHEET, RUNS_HEADERS);
    await appendRow(RUNS_SHEET, RUNS_HEADERS, row);
}

export async function readInvestment(): Promise<SheetRow[]> {
    await ensureSheet(INVESTMENT_SHEET, INVESTMENT_HEADERS);
    return readSheet(INVESTMENT_SHEET);
}

// "R$ 1.250,50" / "1250.5" / "300" → número (valores digitados na aba Investimento)
export function parseMoney(value: string): number {
    const n = Number(String(value).replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
}
