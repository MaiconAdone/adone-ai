// Leitura do Google Ads (somente consultas GAQL; nada é alterado na conta).
// Precisa de: GOOGLE_ADS_DEVELOPER_TOKEN (Central de API da conta de administrador), GOOGLE_ADS_CUSTOMER_ID
// (conta de anúncios, só dígitos), GOOGLE_ADS_LOGIN_CUSTOMER_ID (conta de administrador, se houver) e o
// GOOGLE_REFRESH_TOKEN da conta da empresa autorizado com o escopo "adwords" (scripts/google-auth.mjs).

import { auth } from "@googleapis/calendar";
import type { AdsRow, SearchTermRow } from "./types";

const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v22";

const digits = (value?: string) => (value || "").replace(/\D/g, "");

export function googleAdsConfigured(): boolean {
    return Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && digits(process.env.GOOGLE_ADS_CUSTOMER_ID) && process.env.GOOGLE_REFRESH_TOKEN);
}

async function accessToken(): Promise<string> {
    const client = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    const { token } = await client.getAccessToken();
    if (!token) throw new Error("Google não devolveu token de acesso");
    return token;
}

// Campos usados das linhas do GAQL (a API devolve camelCase; métricas numéricas vêm como string)
interface GoogleAdsResult {
    segments?: { date?: string };
    campaign?: { name?: string };
    adGroup?: { name?: string };
    searchTermView?: { searchTerm?: string };
    metrics?: { impressions?: string | number; clicks?: string | number; costMicros?: string | number; conversions?: string | number };
}

async function search(query: string): Promise<GoogleAdsResult[]> {
    const customerId = digits(process.env.GOOGLE_ADS_CUSTOMER_ID);
    const loginCustomerId = digits(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
    const res = await fetch(`https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}/googleAds:searchStream`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${await accessToken()}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
            ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {}),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(60_000),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) {
        const detail = JSON.stringify(body?.[0]?.error ?? body?.error ?? body).slice(0, 400);
        throw new Error(`Google Ads recusou a consulta (${res.status}): ${detail}`);
    }
    return (Array.isArray(body) ? body : []).flatMap((batch: { results?: GoogleAdsResult[] }) => batch.results ?? []);
}

const money = (micros: unknown) => Number(micros || 0) / 1_000_000;

// Desempenho diário por grupo de anúncios (últimos 30 dias)
export async function fetchGoogleDaily(): Promise<AdsRow[]> {
    const rows = await search(`
        SELECT segments.date, campaign.name, ad_group.name,
               metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM ad_group
        WHERE segments.date DURING LAST_30_DAYS`);
    return rows.map(r => ({
        date: r.segments?.date ?? "",
        platform: "Google Ads",
        campaign: r.campaign?.name ?? "",
        group: r.adGroup?.name ?? "",
        impressions: Number(r.metrics?.impressions || 0),
        clicks: Number(r.metrics?.clicks || 0),
        spend: money(r.metrics?.costMicros),
        conversions: Number(r.metrics?.conversions || 0),
    }));
}

// Termos de busca reais que dispararam os anúncios (base para negativar e achar novas palavras-chave)
export async function fetchSearchTerms(): Promise<SearchTermRow[]> {
    const rows = await search(`
        SELECT search_term_view.search_term, campaign.name, ad_group.name,
               metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM search_term_view
        WHERE segments.date DURING LAST_30_DAYS
        ORDER BY metrics.cost_micros DESC
        LIMIT 300`);
    return rows.map(r => ({
        term: r.searchTermView?.searchTerm ?? "",
        campaign: r.campaign?.name ?? "",
        group: r.adGroup?.name ?? "",
        impressions: Number(r.metrics?.impressions || 0),
        clicks: Number(r.metrics?.clicks || 0),
        spend: money(r.metrics?.costMicros),
        conversions: Number(r.metrics?.conversions || 0),
    }));
}
