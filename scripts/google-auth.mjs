// Autoriza o site a usar a Agenda e as Planilhas da conta Google (rodar uma vez, localmente):
//   node scripts/google-auth.mjs
// Lê GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET do .env.local, abre o consentimento do Google,
// grava GOOGLE_REFRESH_TOKEN no .env.local e, se ainda não houver, cria a agenda "Adone — Diagnósticos"
// (GOOGLE_CALENDAR_ID) e a planilha de leads/agendamentos (GOOGLE_SHEET_ID).

import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { auth, calendar } from "@googleapis/calendar";
import { sheets } from "@googleapis/sheets";
import {
    LEADS_SHEET, BOOKINGS_SHEET, LEADS_HEADERS, BOOKINGS_HEADERS,
} from "../src/lib/engine/agenda/sheet-schema.mjs";

const ENV_FILE = ".env.local";
const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}`;
const SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.freebusy",
    // Criar a agenda dedicada "Adone — Diagnósticos"
    "https://www.googleapis.com/auth/calendar.app.created",
    "https://www.googleapis.com/auth/spreadsheets",
];

function readEnv() {
    const env = {};
    for (const line of readFileSync(ENV_FILE, "utf-8").split(/\r?\n/)) {
        const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
        if (match) env[match[1]] = match[2].trim();
    }
    return env;
}

function setEnv(name, value) {
    let content = readFileSync(ENV_FILE, "utf-8");
    const pattern = new RegExp(`^${name}=.*$`, "m");
    content = pattern.test(content)
        ? content.replace(pattern, `${name}=${value}`)
        : `${content.replace(/\n?$/, "\n")}${name}=${value}\n`;
    writeFileSync(ENV_FILE, content);
}

async function createCalendar(client) {
    const api = calendar({ version: "v3", auth: client });
    const { data } = await api.calendars.insert({
        requestBody: {
            summary: "Adone — Diagnósticos",
            description: "Reuniões de diagnóstico agendadas pelo site e pela Vick (WhatsApp).",
            timeZone: "America/Sao_Paulo",
        },
    });
    return data;
}

async function createSpreadsheet(client) {
    const api = sheets({ version: "v4", auth: client });
    const { data } = await api.spreadsheets.create({
        requestBody: {
            properties: { title: "Adone — Leads e Agendamentos", locale: "pt_BR", timeZone: "America/Sao_Paulo" },
            sheets: [
                { properties: { title: LEADS_SHEET, gridProperties: { frozenRowCount: 1 } } },
                { properties: { title: BOOKINGS_SHEET, gridProperties: { frozenRowCount: 1 } } },
            ],
        },
    });
    await api.spreadsheets.values.batchUpdate({
        spreadsheetId: data.spreadsheetId,
        requestBody: {
            valueInputOption: "RAW",
            data: [
                { range: `${LEADS_SHEET}!A1`, values: [LEADS_HEADERS] },
                { range: `${BOOKINGS_SHEET}!A1`, values: [BOOKINGS_HEADERS] },
            ],
        },
    });
    // Cabeçalho em negrito
    await api.spreadsheets.batchUpdate({
        spreadsheetId: data.spreadsheetId,
        requestBody: {
            requests: data.sheets.map((sheet) => ({
                repeatCell: {
                    range: { sheetId: sheet.properties.sheetId, startRowIndex: 0, endRowIndex: 1 },
                    cell: { userEnteredFormat: { textFormat: { bold: true } } },
                    fields: "userEnteredFormat.textFormat.bold",
                },
            })),
        },
    });
    return data;
}

const env = readEnv();
if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    console.error("Preencha GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET no .env.local antes de rodar este script.");
    process.exit(1);
}

const client = new auth.OAuth2(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, REDIRECT_URI);
const authUrl = client.generateAuthUrl({ access_type: "offline", prompt: "consent", scope: SCOPES });

const server = createServer(async (req, res) => {
    const url = new URL(req.url, REDIRECT_URI);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    if (!code && !error) {
        res.writeHead(404).end();
        return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    try {
        if (error) throw new Error(`Autorização recusada: ${error}`);

        const { tokens } = await client.getToken(code);
        if (!tokens.refresh_token) throw new Error("O Google não devolveu um refresh token. Rode o script de novo.");
        client.setCredentials(tokens);
        setEnv("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
        console.log("✓ GOOGLE_REFRESH_TOKEN gravado no .env.local");

        const calendarId = readEnv().GOOGLE_CALENDAR_ID;
        if (!calendarId || calendarId === "primary") {
            const created = await createCalendar(client);
            setEnv("GOOGLE_CALENDAR_ID", created.id);
            console.log(`✓ Agenda criada: ${created.summary}`);
        } else {
            console.log("✓ GOOGLE_CALENDAR_ID já existia; agenda mantida");
        }

        if (!readEnv().GOOGLE_SHEET_ID) {
            const sheet = await createSpreadsheet(client);
            setEnv("GOOGLE_SHEET_ID", sheet.spreadsheetId);
            console.log(`✓ Planilha criada: ${sheet.spreadsheetUrl}`);
        } else {
            console.log("✓ GOOGLE_SHEET_ID já existia; planilha mantida");
        }

        res.end("<h2>Pronto! A Adone já pode usar sua Agenda e Planilhas. Pode fechar esta aba.</h2>");
    } catch (err) {
        console.error("✗", err.message);
        res.end(`<h2>Algo deu errado:</h2><pre>${String(err.message).replace(/</g, "&lt;")}</pre>`);
    } finally {
        server.close();
    }
});

server.listen(PORT, "127.0.0.1", () => {
    console.log("Abra este endereço no navegador, entre com adonetecnologia@gmail.com e autorize:\n");
    console.log(authUrl + "\n");
});
