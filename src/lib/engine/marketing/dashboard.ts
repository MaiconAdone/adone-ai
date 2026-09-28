// Dados do painel /painel: agentes, aprovações pendentes e desempenho por canal.

import { isVisible } from "./blog";
import { getGa4Channels, type Ga4Result } from "./ga4";
import { sheetUrl } from "./notify";
import { AGENT_LABELS, AGENT_SCHEDULE, AGENTS, isRunning, type AgentName } from "./scheduler";
import {
    CAMPAIGNS_SHEET, CONTENT_SHEET, parseMoney, parseSheetDate, readBookings, readInvestment, readLeads, readSheet,
    RUNS_SHEET, SheetRow, STATUS, STRATEGY_SHEET,
} from "./workspace";

export const CHANNELS = ["Google Ads", "LinkedIn Ads", "LinkedIn orgânico", "Busca orgânica", "WhatsApp (Vick)", "Direto / outros"] as const;
export type Channel = (typeof CHANNELS)[number];

const DAY = 24 * 60 * 60 * 1000;

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

export interface ChannelStats {
    channel: Channel;
    leads: number;
    qualified: number;
    meetings: number;
    spend: number;
    costPerLead: number | null;
    costPerQualified: number | null;
    costPerMeeting: number | null;
}

export interface AgentStatus {
    agent: AgentName;
    label: string;
    schedule: string;
    running: boolean;
    lastRun: SheetRow | null;
}

export interface DashboardData {
    sheetUrl: string;
    agents: AgentStatus[];
    recentRuns: SheetRow[];
    strategy: SheetRow | null;
    content: { pending: SheetRow[]; published: number; rejected: number; total: number };
    campaigns: SheetRow[];
    funnel: ChannelStats[];
    totals: { leads: number; qualified: number; meetings: number; spend: number; leadsPrev: number; meetingsPrev: number };
    weekly: Array<{ week: string; leads: number; meetings: number }>;
    ga4: Ga4Result;
    hasInvestment: boolean;
}

function between(rows: SheetRow[], column: string, from: Date, to: Date): SheetRow[] {
    return rows.filter(r => {
        const d = parseSheetDate(r[column] || "");
        return d !== null && d >= from && d < to;
    });
}

function investmentChannel(platform: string): Channel {
    const p = platform.toLowerCase();
    if (p.includes("linkedin")) return "LinkedIn Ads";
    return "Google Ads";
}

const safe = <T>(promise: Promise<T>, fallback: T) => promise.catch(err => {
    console.error("[Painel] Falha ao ler dados:", err);
    return fallback;
});

export async function getDashboardData(now = new Date()): Promise<DashboardData> {
    const [leads, bookings, investment, runs, strategies, contents, campaigns, ga4] = await Promise.all([
        safe(readLeads(), []),
        safe(readBookings(), []),
        safe(readInvestment(), []),
        safe(readSheet(RUNS_SHEET), []),
        safe(readSheet(STRATEGY_SHEET), []),
        safe(readSheet(CONTENT_SHEET), []),
        safe(readSheet(CAMPAIGNS_SHEET), []),
        getGa4Channels(30),
    ]);

    const from = new Date(now.getTime() - 30 * DAY);
    const prevFrom = new Date(now.getTime() - 60 * DAY);
    const leads30 = between(leads, "Data", from, now);
    const bookings30 = between(bookings, "Criado em", from, now);
    const invest30 = investment.filter(r => {
        const d = parseSheetDate(r["Semana (início)"] || "");
        return d !== null && d >= from && d <= now;
    });

    const funnel: ChannelStats[] = CHANNELS.map(channel => {
        const channelLeads = leads30.filter(r => channelOf(r) === channel);
        const leadsCount = channelLeads.length;
        const qualified = channelLeads.filter(r => r.Qualificado === "Sim" || Number(r.Score) >= 60).length;
        const meetings = bookings30.filter(r => channelOf(r) === channel).length;
        const spend = invest30.filter(r => investmentChannel(r.Plataforma || "") === channel).reduce((s, r) => s + parseMoney(r["Valor gasto (R$)"]), 0);
        return {
            channel,
            leads: leadsCount,
            qualified,
            meetings,
            spend,
            costPerLead: spend > 0 && leadsCount > 0 ? spend / leadsCount : null,
            costPerQualified: spend > 0 && qualified > 0 ? spend / qualified : null,
            costPerMeeting: spend > 0 && meetings > 0 ? spend / meetings : null,
        };
    });

    const weekly = Array.from({ length: 8 }, (_, i) => {
        const end = new Date(now.getTime() - (7 - i) * 7 * DAY);
        const start = new Date(end.getTime() - 7 * DAY);
        return {
            week: start.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }),
            leads: between(leads, "Data", start, end).length,
            meetings: between(bookings, "Criado em", start, end).length,
        };
    });

    const agents: AgentStatus[] = AGENTS.map(agent => ({
        agent,
        label: AGENT_LABELS[agent],
        schedule: AGENT_SCHEDULE[agent],
        running: isRunning(agent),
        lastRun: [...runs].reverse().find(r => r.Agente === AGENT_LABELS[agent]) ?? null,
    }));

    return {
        sheetUrl: sheetUrl(),
        agents,
        recentRuns: runs.slice(-8).reverse(),
        strategy: strategies[strategies.length - 1] ?? null,
        content: {
            pending: contents.filter(c => c.Status === STATUS.pending && !isVisible(c, now)),
            published: contents.filter(c => isVisible(c, now)).length,
            rejected: contents.filter(c => c.Status === STATUS.rejected).length,
            total: contents.length,
        },
        campaigns: campaigns.slice(-4).reverse(),
        funnel,
        totals: {
            leads: leads30.length,
            qualified: funnel.reduce((s, f) => s + f.qualified, 0),
            meetings: bookings30.length,
            spend: funnel.reduce((s, f) => s + f.spend, 0),
            leadsPrev: between(leads, "Data", prevFrom, from).length,
            meetingsPrev: between(bookings, "Criado em", prevFrom, from).length,
        },
        weekly,
        ga4,
        hasInvestment: investment.length > 0,
    };
}
