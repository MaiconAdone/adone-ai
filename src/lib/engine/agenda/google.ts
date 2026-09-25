// Clientes Google (Agenda + Planilhas) autenticados com a conta da Adone via refresh token
// Credenciais geradas por scripts/google-auth.mjs

import { auth, calendar, type calendar_v3 } from "@googleapis/calendar";
import { sheets, type sheets_v4 } from "@googleapis/sheets";

type OAuthClient = InstanceType<typeof auth.OAuth2>;

let client: OAuthClient | null = null;

export function isGoogleConfigured(): boolean {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_SHEET_ID } = process.env;
    return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && GOOGLE_REFRESH_TOKEN && GOOGLE_SHEET_ID);
}

function getClient(): OAuthClient {
    if (!client) {
        if (!isGoogleConfigured()) throw new Error("Integração com o Google não configurada");
        client = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
        client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    }
    return client;
}

export function calendarApi(): calendar_v3.Calendar {
    return calendar({ version: "v3", auth: getClient() });
}

export function sheetsApi(): sheets_v4.Sheets {
    // Mesmo cliente OAuth para as duas APIs (os pacotes compartilham o googleapis-common)
    return sheets({ version: "v4", auth: getClient() as unknown as sheets_v4.Options["auth"] });
}

// Agenda onde as reuniões são criadas ("Adone — Diagnósticos")
export function calendarId(): string {
    return process.env.GOOGLE_CALENDAR_ID || "primary";
}

// Agendas cujos compromissos bloqueiam horários: a de diagnósticos, a principal da conta
// e outras opcionais (GOOGLE_BUSY_CALENDARS, separadas por vírgula)
export function busyCalendarIds(): string[] {
    const extra = (process.env.GOOGLE_BUSY_CALENDARS || "").split(",").map(id => id.trim()).filter(Boolean);
    return Array.from(new Set([calendarId(), "primary", ...extra]));
}

export function sheetId(): string {
    return process.env.GOOGLE_SHEET_ID || "";
}
