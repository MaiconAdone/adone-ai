// Conexões com o LinkedIn, renovadas pelo Maicon no /painel. São dois apps no portal de desenvolvedores:
// - "page": publica na página da empresa (Community Management API, que exige um app só dela);
// - "ads": lê os relatórios do Campaign Manager (Advertising API).
// Os tokens valem 60 dias e ficam na aba "Integrações" da planilha (privada da empresa), para não depender
// das variáveis da hospedagem, que só mudam com novo deploy.

import { appendRow, nowLabel } from "../agenda/sheets";
import { ensureSheet, readSheet, updateCell } from "../marketing/workspace";

const SHEET = "Integrações";
const HEADERS = ["Chave", "Valor", "Atualizado em"] as const;

export type LinkedInApp = "page" | "ads";

// Client IDs são públicos (aparecem na tela de autorização); os segredos ficam nas variáveis de ambiente
export const LINKEDIN_APPS: Record<LinkedInApp, { clientId: () => string; clientSecret: () => string; scope: string; label: string }> = {
    page: {
        clientId: () => process.env.LINKEDIN_PAGE_CLIENT_ID || "77u6vqv4ak1gxg",
        clientSecret: () => process.env.LINKEDIN_PAGE_CLIENT_SECRET || "",
        scope: "w_organization_social r_organization_social",
        label: "página",
    },
    ads: {
        clientId: () => process.env.LINKEDIN_ADS_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID || "776b2gwn3djmfj",
        clientSecret: () => process.env.LINKEDIN_ADS_CLIENT_SECRET || process.env.LINKEDIN_CLIENT_SECRET || "",
        scope: "r_ads r_ads_reporting",
        label: "anúncios",
    },
};

const KEYS: Record<LinkedInApp, { token: string; expiresAt: string }> = {
    page: { token: "linkedin_access_token", expiresAt: "linkedin_expira_em" },
    ads: { token: "linkedin_ads_access_token", expiresAt: "linkedin_ads_expira_em" },
};

// Página da empresa no LinkedIn (linkedin.com/company/112545719) e conta de anúncios do Campaign Manager
export const DEFAULT_ORG_ID = "112545719";
export const AD_ACCOUNT_ID = process.env.LINKEDIN_AD_ACCOUNT_ID || "559858251";

export interface LinkedInConnection {
    token: string;
    orgId: string;
    expiresAt: Date | null;
}

type Values = Map<string, { value: string; row: Record<string, string> }>;

async function readValues(): Promise<Values> {
    await ensureSheet(SHEET, HEADERS);
    const rows = await readSheet(SHEET);
    return new Map(rows.filter(r => r.Chave).map(r => [r.Chave, { value: r.Valor, row: r }]));
}

async function writeValue(existing: Values, key: string, value: string): Promise<void> {
    const current = existing.get(key);
    if (current) {
        await updateCell(SHEET, HEADERS, current.row, "Valor", value);
        await updateCell(SHEET, HEADERS, current.row, "Atualizado em", nowLabel());
    } else {
        await appendRow(SHEET, HEADERS, { Chave: key, Valor: value, "Atualizado em": nowLabel() });
    }
}

// Valor avulso na aba Integrações (ex.: resultado da última sincronização de anúncios)
export async function saveIntegrationValue(key: string, value: string): Promise<void> {
    await writeValue(await readValues(), key, value);
}

export async function readIntegrationValue(key: string): Promise<string | undefined> {
    return (await readValues()).get(key)?.value;
}

export async function saveConnection(app: LinkedInApp, token: string, expiresInSeconds: number): Promise<Date> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const existing = await readValues();
    await writeValue(existing, KEYS[app].token, token);
    await writeValue(existing, KEYS[app].expiresAt, expiresAt.toISOString());
    return expiresAt;
}

export async function getConnection(app: LinkedInApp = "page"): Promise<LinkedInConnection | null> {
    const values = await readValues();
    const token = values.get(KEYS[app].token)?.value;
    if (!token) return null;
    const expires = values.get(KEYS[app].expiresAt)?.value;
    return {
        token,
        orgId: values.get("linkedin_org_id")?.value || DEFAULT_ORG_ID,
        expiresAt: expires ? new Date(expires) : null,
    };
}

export function daysUntilExpiry(connection: LinkedInConnection | null): number | null {
    if (!connection?.expiresAt) return null;
    return Math.floor((connection.expiresAt.getTime() - Date.now()) / 86_400_000);
}
