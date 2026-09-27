// Agente Estrategista (Aquisição → Engajamento → Monetização → Retenção)
// Semanal: lê os números da planilha e a estratégia anterior e propõe a estratégia da semana.
// Tudo fica "Aguardando aprovação" até o Maicon aprovar na planilha.

import { z } from "zod/v4"; // o helper de saída estruturada da Anthropic usa Zod 4
import { AGENDA_TIMEZONE } from "../agenda/config";
import { COMPANY_CONTEXT } from "./company";
import { generateStructured, STRATEGY_MODEL } from "./anthropic";
import { notifyOwner } from "./notify";
import {
    appendStrategy, parseSheetDate, readBookings, readLeads, readSheet, SheetRow, STATUS, STRATEGY_SHEET,
} from "./workspace";

const StrategySchema = z.object({
    icp: z.string().describe("Cliente ideal: porte, faturamento, setores, cargos decisores, sinais de que pode investir em IA/ML"),
    posicionamento: z.string().describe("Como a Adone deve se posicionar para esse cliente, em 3 a 5 frases"),
    temas: z.array(z.object({
        titulo: z.string(),
        palavra_chave: z.string().describe("Termo de busca principal no Google, em português"),
        intencao: z.enum(["informacional", "comercial"]),
        setor: z.string(),
        dor: z.string(),
    })).describe("4 a 6 temas de artigos de blog para esta semana e a próxima"),
    hipoteses_campanha: z.array(z.object({
        hipotese: z.string(),
        canal: z.enum(["Google Ads", "SEO/blog", "Prospecção ativa", "LinkedIn", "Outro"]),
        metrica_sucesso: z.string(),
    })).describe("2 a 4 hipóteses testáveis"),
    leitura_numeros: z.string().describe("O que os números mostram, sem inventar dados que não foram fornecidos"),
    ajustes: z.string().describe("O que mudar em relação à estratégia anterior e por quê"),
});

export type Strategy = z.infer<typeof StrategySchema>;

const SYSTEM = `Você é o Estrategista de marketing da Adone Intelligence: um estrategista sênior de growth B2B.
Você trabalha com um ciclo de quatro pilares — aquisição, engajamento, monetização e retenção — e decide
com base em dados. Seu foco é gerar reuniões de diagnóstico com empresas que PODEM pagar por projetos de IA/ML.

${COMPANY_CONTEXT}

Seja específico e acionável. Se os dados forem poucos ou zero, diga isso claramente e proponha como gerar
dados (ex.: primeiros testes), em vez de tirar conclusões. Escreva em português do Brasil.`;

function weekLabel(date = new Date()): string {
    // Segunda-feira da semana, no fuso de Brasília
    const sp = new Date(date.toLocaleString("en-US", { timeZone: AGENDA_TIMEZONE }));
    const monday = new Date(sp);
    monday.setDate(sp.getDate() - ((sp.getDay() + 6) % 7));
    return `Semana de ${monday.toLocaleDateString("pt-BR")}`;
}

function countBy(rows: SheetRow[], key: string): string {
    const counts = new Map<string, number>();
    for (const r of rows) {
        const value = r[key]?.trim() || "(não informado)";
        counts.set(value, (counts.get(value) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}: ${v}`).join("; ") || "nenhum";
}

function inRange(rows: SheetRow[], dateColumn: string, from: Date, to: Date): SheetRow[] {
    return rows.filter(r => {
        const d = parseSheetDate(r[dateColumn] || "");
        return d !== null && d >= from && d < to;
    });
}

// Resumo textual dos números (últimos 30 dias vs. 30 anteriores) para o modelo
export async function buildMetricsSummary(now = new Date()): Promise<string> {
    const day = 24 * 60 * 60 * 1000;
    const [leads, bookings] = await Promise.all([readLeads(), readBookings()]);
    const cur = { from: new Date(now.getTime() - 30 * day), to: now };
    const prev = { from: new Date(now.getTime() - 60 * day), to: cur.from };

    const leadsCur = inRange(leads, "Data", cur.from, cur.to);
    const leadsPrev = inRange(leads, "Data", prev.from, prev.to);
    const bookCur = inRange(bookings, "Criado em", cur.from, cur.to);
    const bookPrev = inRange(bookings, "Criado em", prev.from, prev.to);
    const qualified = leadsCur.filter(r => r.Qualificado === "Sim" || Number(r.Score) >= 60);

    return [
        `Leads (últimos 30 dias): ${leadsCur.length} | 30 dias anteriores: ${leadsPrev.length}`,
        `Leads qualificados (últimos 30 dias): ${qualified.length}`,
        `Leads por canal: ${countBy(leadsCur, "Canal")}`,
        `Leads por origem (UTM source): ${countBy(leadsCur, "UTM source")}`,
        `Leads por campanha (UTM campaign): ${countBy(leadsCur, "UTM campaign")}`,
        `Leads por setor: ${countBy(leadsCur, "Setor")}`,
        `Leads por porte: ${countBy(leadsCur, "Porte")}`,
        `Reuniões agendadas (últimos 30 dias): ${bookCur.length} | 30 dias anteriores: ${bookPrev.length}`,
        `Reuniões por origem: ${countBy(bookCur, "Origem")}`,
        `Reuniões por campanha: ${countBy(bookCur, "UTM campaign")}`,
        "Observação: ainda não há dados de custo de mídia nem do Google Analytics nesta leitura.",
    ].join("\n");
}

function strategyText(row: SheetRow | undefined): string {
    if (!row) return "(nenhuma estratégia aprovada ainda — esta é a primeira)";
    return [
        `${row.Semana} — ${row.Status}`,
        `ICP: ${row["Cliente ideal (ICP)"]}`,
        `Posicionamento: ${row.Posicionamento}`,
        `Temas: ${row["Temas de conteúdo"]}`,
        `Hipóteses: ${row["Hipóteses de campanha"]}`,
        row["Seus comentários"] ? `Comentários do Maicon: ${row["Seus comentários"]}` : "",
    ].filter(Boolean).join("\n");
}

export function formatThemes(temas: Strategy["temas"]): string {
    return temas.map((t, i) => `${i + 1}. ${t.titulo} | palavra-chave: ${t.palavra_chave} | ${t.intencao} | setor: ${t.setor} | dor: ${t.dor}`).join("\n");
}

export async function runStrategist(): Promise<Strategy> {
    const [metrics, history] = await Promise.all([buildMetricsSummary(), readSheet(STRATEGY_SHEET).catch(() => [])]);
    const lastApproved = [...history].reverse().find(r => r.Status === STATUS.approved);
    const lastRejected = [...history].reverse().find(r => r.Status === STATUS.rejected && r["Seus comentários"]);

    const prompt = [
        `Semana: ${weekLabel()}`,
        "",
        "NÚMEROS DA PLANILHA:",
        metrics,
        "",
        "ÚLTIMA ESTRATÉGIA APROVADA:",
        strategyText(lastApproved),
        lastRejected ? `\nÚLTIMA ESTRATÉGIA REJEITADA E O MOTIVO:\n${strategyText(lastRejected)}` : "",
        "",
        "Proponha a estratégia desta semana. Os temas viram artigos de blog para SEO: priorize buscas que um",
        "decisor de média empresa faria ao considerar IA/ML, conectando cada tema a um serviço da Adone.",
    ].join("\n");

    const strategy = await generateStructured({
        model: STRATEGY_MODEL,
        effort: "high",
        system: SYSTEM,
        prompt,
        schema: StrategySchema,
    });

    await appendStrategy({
        Semana: weekLabel(),
        "Cliente ideal (ICP)": strategy.icp,
        Posicionamento: strategy.posicionamento,
        "Temas de conteúdo": formatThemes(strategy.temas),
        "Hipóteses de campanha": strategy.hipoteses_campanha.map(h => `• ${h.hipotese} (${h.canal}; sucesso: ${h.metrica_sucesso})`).join("\n"),
        "Leitura dos números": strategy.leitura_numeros,
        "Ajustes recomendados": strategy.ajustes,
    });

    await notifyOwner(
        `🧭 *Estratégia da ${weekLabel().toLowerCase()} pronta para revisão*\n\n` +
        `${strategy.temas.length} temas de conteúdo e ${strategy.hipoteses_campanha.length} hipóteses de campanha.\n` +
        `Revise na aba "Estratégia" e mude o Status para *Aprovado* (ou *Rejeitado*, com comentário).`
    );
    return strategy;
}
