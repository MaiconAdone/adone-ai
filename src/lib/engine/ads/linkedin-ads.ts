// Leitura do LinkedIn Ads (Advertising API, somente relatórios; nada é alterado no Campaign Manager).
// O token vem do app de anúncios, conectado no /painel ("Conectar LinkedIn Ads", escopos r_ads e r_ads_reporting).
// Na API, "campaign" é o conjunto de anúncios e "campaign group" é a campanha que aparece no Campaign Manager.

import { AD_ACCOUNT_ID, daysUntilExpiry, getConnection } from "../linkedin/connection";
import type { AdsRow } from "./types";

const API = "https://api.linkedin.com/rest";
const API_VERSION = process.env.LINKEDIN_API_VERSION || "202509";

async function get<T>(token: string, path: string): Promise<T> {
    const res = await fetch(`${API}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "LinkedIn-Version": API_VERSION,
            "X-Restli-Protocol-Version": "2.0.0",
        },
        signal: AbortSignal.timeout(60_000),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) throw new Error(`LinkedIn Ads recusou a consulta (${res.status}): ${JSON.stringify(body).slice(0, 300)}`);
    return body as T;
}

interface Named { id: number; name: string; campaignGroup?: string }

async function names(token: string, kind: "adCampaigns" | "adCampaignGroups"): Promise<Map<string, Named>> {
    const { elements = [] } = await get<{ elements?: Named[] }>(token, `/adAccounts/${AD_ACCOUNT_ID}/${kind}?q=search&pageSize=1000`);
    return new Map(elements.map(e => [String(e.id), e]));
}

const idFromUrn = (urn: string) => urn.split(":").pop() ?? urn;

interface AnalyticsElement {
    dateRange?: { start?: { year: number; month: number; day: number } };
    pivotValues?: string[];
    impressions?: number;
    clicks?: number;
    landingPageClicks?: number;
    costInLocalCurrency?: string;
    externalWebsiteConversions?: number;
}

export async function linkedinAdsConnected(): Promise<boolean> {
    const connection = await getConnection("ads").catch(() => null);
    const days = daysUntilExpiry(connection);
    return Boolean(connection && (days === null || days >= 0));
}

// Desempenho diário por conjunto de anúncios (últimos 30 dias)
export async function fetchLinkedInDaily(now = new Date()): Promise<AdsRow[]> {
    const connection = await getConnection("ads");
    if (!connection) throw new Error("LinkedIn Ads não conectado: use \"Conectar LinkedIn Ads\" no painel");

    const start = new Date(now.getTime() - 30 * 86_400_000);
    const d = (x: Date) => `(year:${x.getUTCFullYear()},month:${x.getUTCMonth() + 1},day:${x.getUTCDate()})`;
    const account = encodeURIComponent(`urn:li:sponsoredAccount:${AD_ACCOUNT_ID}`);
    // A API usa a sintaxe Rest.li: parênteses e vírgulas não podem ser codificados
    const query = [
        "q=analytics",
        "pivot=CAMPAIGN",
        "timeGranularity=DAILY",
        `dateRange=(start:${d(start)},end:${d(now)})`,
        `accounts=List(${account})`,
        "fields=dateRange,pivotValues,impressions,clicks,landingPageClicks,costInLocalCurrency,externalWebsiteConversions",
    ].join("&");

    const [analytics, campaigns, groups] = await Promise.all([
        get<{ elements?: AnalyticsElement[] }>(connection.token, `/adAnalytics?${query}`),
        names(connection.token, "adCampaigns"),
        names(connection.token, "adCampaignGroups"),
    ]);

    return (analytics.elements ?? []).map(e => {
        const campaign = campaigns.get(idFromUrn(e.pivotValues?.[0] ?? ""));
        const group = campaign?.campaignGroup ? groups.get(idFromUrn(campaign.campaignGroup)) : undefined;
        const s = e.dateRange?.start;
        return {
            date: s ? `${s.year}-${String(s.month).padStart(2, "0")}-${String(s.day).padStart(2, "0")}` : "",
            platform: "LinkedIn Ads" as const,
            campaign: group?.name ?? "",
            group: campaign?.name ?? e.pivotValues?.[0] ?? "",
            impressions: Number(e.impressions || 0),
            clicks: Number(e.landingPageClicks ?? e.clicks ?? 0),
            spend: Number(e.costInLocalCurrency || 0),
            conversions: Number(e.externalWebsiteConversions || 0),
        };
    });
}
