// Canais de aquisição e resultado comercial por canal (usado pelo painel e pelo Estrategista)

import { isProposal, isWon, parseMoney, type SheetRow } from "./workspace";

export const CHANNELS = ["Google Ads", "LinkedIn Ads", "LinkedIn orgânico", "Busca orgânica", "WhatsApp (Vick)", "Direto / outros"] as const;
export type Channel = (typeof CHANNELS)[number];

// Canal de um lead ou reunião a partir da origem gravada na planilha
export function channelOf(row: SheetRow): Channel {
    const source = (row["UTM source"] || "").toLowerCase();
    const medium = (row["UTM medium"] || "").toLowerCase();
    const referrer = (row["Referência"] || "").toLowerCase();
    const origin = `${row.Canal || ""} ${row.Origem || ""}`.toLowerCase();

    if (source === "google" && ["cpc", "ppc", "paid"].includes(medium)) return "Google Ads";
    if (row.gclid) return "Google Ads";
    if (source === "linkedin") return medium.includes("paid") ? "LinkedIn Ads" : "LinkedIn orgânico";
    if (origin.includes("whatsapp")) return "WhatsApp (Vick)";
    if (!source && /google\.|bing\.|duckduckgo\.|yahoo\./.test(referrer)) return "Busca orgânica";
    if (!source && referrer.includes("linkedin.")) return "LinkedIn orgânico";
    return "Direto / outros";
}

// Resultado comercial desde o início: contratos fecham semanas depois da reunião,
// então esta visão não usa a janela de 30 dias
export interface RevenueStats {
    channel: Channel | "Total";
    meetings: number;
    proposals: number;
    won: number;
    revenue: number;
    spend: number;
    costPerWon: number | null;
    returnOnSpend: number | null;
}

export function revenueStats(channel: Channel | "Total", bookings: SheetRow[], spend: number): RevenueStats {
    const won = bookings.filter(isWon);
    const revenue = won.reduce((s, r) => s + parseMoney(r["Valor do contrato (R$)"] || ""), 0);
    return {
        channel,
        meetings: bookings.length,
        proposals: bookings.filter(isProposal).length,
        won: won.length,
        revenue,
        spend,
        costPerWon: spend > 0 && won.length > 0 ? spend / won.length : null,
        returnOnSpend: spend > 0 && revenue > 0 ? revenue / spend : null,
    };
}

