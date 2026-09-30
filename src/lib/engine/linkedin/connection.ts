// Conexão com a página da Adone no LinkedIn: o token de acesso vale 60 dias e é renovado pelo Maicon
// no /painel ("Conectar LinkedIn"). Fica na aba "Integrações" da planilha (privada da empresa) para não
// depender das variáveis da hospedagem, que só mudam com novo deploy.

import { appendRow, nowLabel } from "../agenda/sheets";
import { ensureSheet, readSheet, updateCell } from "../marketing/workspace";

const SHEET = "Integrações";
const HEADERS = ["Chave", "Valor", "Atualizado em"] as const;

const KEYS = {
    token: "linkedin_access_token",
    expiresAt: "linkedin_expira_em",
    orgId: "linkedin_org_id",
} as const;

// Página da empresa no LinkedIn (linkedin.com/company/112545719)
export const DEFAULT_ORG_ID = "112545719";

export interface LinkedInConnection {
    token: string;
    orgId: string;
    expiresAt: Date | null;
}

async function readValues(): Promise<Map<string, { value: string; row: Record<string, string> }>> {
    await ensureSheet(SHEET, HEADERS);
    const rows = await readSheet(SHEET);
    return new Map(rows.filter(r => r.Chave).map(r => [r.Chave, { value: r.Valor, row: r }]));
}

async function writeValue(existing: Awaited<ReturnType<typeof readValues>>, key: string, value: string): Promise<void> {
    const current = existing.get(key);
    if (current) {
        await updateCell(SHEET, HEADERS, current.row, "Valor", value);
        await updateCell(SHEET, HEADERS, current.row, "Atualizado em", nowLabel());
    } else {
        await appendRow(SHEET, HEADERS, { Chave: key, Valor: value, "Atualizado em": nowLabel() });
    }
}

export async function saveConnection(token: string, expiresInSeconds: number, orgId: string): Promise<Date> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const existing = await readValues();
    await writeValue(existing, KEYS.token, token);
    await writeValue(existing, KEYS.expiresAt, expiresAt.toISOString());
    await writeValue(existing, KEYS.orgId, orgId);
    return expiresAt;
}

export async function getConnection(): Promise<LinkedInConnection | null> {
    const values = await readValues();
    const token = values.get(KEYS.token)?.value;
    if (!token) return null;
    const expires = values.get(KEYS.expiresAt)?.value;
    return {
        token,
        orgId: values.get(KEYS.orgId)?.value || DEFAULT_ORG_ID,
        expiresAt: expires ? new Date(expires) : null,
    };
}

export function daysUntilExpiry(connection: LinkedInConnection | null): number | null {
    if (!connection?.expiresAt) return null;
    return Math.floor((connection.expiresAt.getTime() - Date.now()) / 86_400_000);
}
