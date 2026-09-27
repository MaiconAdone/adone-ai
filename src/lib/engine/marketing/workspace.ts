// Área de trabalho dos agentes de marketing na planilha "Adone — Leads e Agendamentos":
// abas de Estratégia e Conteúdo, com a coluna Status usada para aprovação humana.

import { isGoogleConfigured, sheetId, sheetsApi } from "../agenda/google";
import { appendRow, nowLabel } from "../agenda/sheets";
import { BOOKINGS_SHEET, LEADS_SHEET } from "../agenda/sheet-schema.mjs";

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

export async function readSheet(title: string): Promise<SheetRow[]> {
    if (!isGoogleConfigured()) return [];
    const { data } = await sheetsApi().spreadsheets.values.get({ spreadsheetId: sheetId(), range: `${title}!A:Z` });
    const [headers = [], ...rows] = data.values || [];
    return rows.map(row => Object.fromEntries(headers.map((h, i) => [String(h), String(row[i] ?? "")])));
}

export async function appendStrategy(row: Partial<Record<(typeof STRATEGY_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(STRATEGY_SHEET, STRATEGY_HEADERS);
    await appendRow(STRATEGY_SHEET, STRATEGY_HEADERS, { "Criado em": nowLabel(), Status: STATUS.pending, ...row });
}

export async function appendContent(row: Partial<Record<(typeof CONTENT_HEADERS)[number], string>>): Promise<void> {
    await ensureSheet(CONTENT_SHEET, CONTENT_HEADERS);
    await appendRow(CONTENT_SHEET, CONTENT_HEADERS, { "Criado em": nowLabel(), Status: STATUS.pending, ...row });
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
    return readSheet(BOOKINGS_SHEET);
}
