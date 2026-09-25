// Grava leads e agendamentos na planilha "Adone — Leads e Agendamentos"

import { AGENDA_TIMEZONE } from "./config";
import { isGoogleConfigured, sheetId, sheetsApi } from "./google";
import { BOOKINGS_HEADERS, BOOKINGS_SHEET, LEADS_HEADERS, LEADS_SHEET } from "./sheet-schema.mjs";

type LeadColumn = (typeof LEADS_HEADERS)[number];
type BookingColumn = (typeof BOOKINGS_HEADERS)[number];

export type LeadRow = Partial<Record<LeadColumn, string | number>>;
export type BookingRow = Partial<Record<BookingColumn, string | number>>;

export function nowLabel(): string {
    return new Date().toLocaleString("pt-BR", { timeZone: AGENDA_TIMEZONE });
}

async function appendRow(sheet: string, headers: readonly string[], row: Record<string, string | number | undefined>) {
    if (!isGoogleConfigured()) {
        console.log(`[Planilha] Google não configurado; linha de "${sheet}" não gravada`);
        return;
    }
    await sheetsApi().spreadsheets.values.append({
        spreadsheetId: sheetId(),
        range: `${sheet}!A1`,
        // RAW: o texto do visitante nunca é interpretado como fórmula
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: [headers.map(h => row[h] ?? "")] },
    });
}

// Falha na planilha não deve derrubar a conversa ou o agendamento
export async function appendLead(row: LeadRow): Promise<void> {
    try {
        await appendRow(LEADS_SHEET, LEADS_HEADERS, { Data: nowLabel(), ...row });
    } catch (err) {
        console.error("[Planilha] Erro ao gravar lead:", err);
    }
}

export async function appendBooking(row: BookingRow): Promise<void> {
    try {
        await appendRow(BOOKINGS_SHEET, BOOKINGS_HEADERS, { "Criado em": nowLabel(), ...row });
    } catch (err) {
        console.error("[Planilha] Erro ao gravar agendamento:", err);
    }
}
