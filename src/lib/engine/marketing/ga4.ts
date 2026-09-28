// Números do Google Analytics 4 para o painel (API de dados do GA4).
// Requer GA4_PROPERTY_ID (ID numérico da propriedade) e acesso de Leitor da conta autorizada.

import { analyticsdata, type analyticsdata_v1beta } from "@googleapis/analyticsdata";
import { auth } from "@googleapis/calendar";

export interface Ga4Channel {
    channel: string;
    sessions: number;
    users: number;
    keyEvents: number;
}

export type Ga4Result =
    | { status: "ok"; channels: Ga4Channel[]; totals: Omit<Ga4Channel, "channel"> }
    | { status: "not_configured" }
    | { status: "error"; message: string };

// Nomes dos grupos de canais padrão do GA4, que a API devolve em inglês
const CHANNEL_NAMES: Record<string, string> = {
    Direct: "Direto",
    "Organic Search": "Busca orgânica",
    "Paid Search": "Busca paga",
    "Organic Social": "Social orgânico",
    "Paid Social": "Social pago",
    Referral: "Referência",
    Email: "E-mail",
    Display: "Display",
    "Cross-network": "Várias redes",
    "Organic Video": "Vídeo orgânico",
    "Paid Video": "Vídeo pago",
    Unassigned: "Não atribuído",
};

let client: analyticsdata_v1beta.Analyticsdata | null = null;

function api(): analyticsdata_v1beta.Analyticsdata {
    if (!client) {
        const oauth = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
        oauth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        client = analyticsdata({ version: "v1beta", auth: oauth as unknown as analyticsdata_v1beta.Options["auth"] });
    }
    return client;
}

export async function getGa4Channels(days = 30): Promise<Ga4Result> {
    const propertyId = process.env.GA4_PROPERTY_ID?.trim();
    if (!propertyId || !process.env.GOOGLE_REFRESH_TOKEN) return { status: "not_configured" };

    try {
        const { data } = await api().properties.runReport({
            property: `properties/${propertyId}`,
            requestBody: {
                dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
                dimensions: [{ name: "sessionDefaultChannelGroup" }],
                metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "keyEvents" }],
                orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
            },
        });
        const channels = (data.rows || []).map(r => ({
            channel: CHANNEL_NAMES[r.dimensionValues?.[0]?.value || ""] || r.dimensionValues?.[0]?.value || "(sem canal)",
            sessions: Number(r.metricValues?.[0]?.value || 0),
            users: Number(r.metricValues?.[1]?.value || 0),
            keyEvents: Number(r.metricValues?.[2]?.value || 0),
        }));
        const totals = channels.reduce(
            (t, c) => ({ sessions: t.sessions + c.sessions, users: t.users + c.users, keyEvents: t.keyEvents + c.keyEvents }),
            { sessions: 0, users: 0, keyEvents: 0 },
        );
        return { status: "ok", channels, totals };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[Painel] Falha ao ler o GA4:", message);
        return { status: "error", message };
    }
}
