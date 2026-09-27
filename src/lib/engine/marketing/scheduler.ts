// Rotinas semanais dos agentes de marketing, dentro do próprio servidor do site.
// Só liga com MARKETING_AGENTS_ENABLED=true em produção (evita rodar no servidor de desenvolvimento).

import cron from "node-cron";
import { AGENDA_TIMEZONE } from "../agenda/config";
import { runContent } from "./content";
import { notifyOwner } from "./notify";
import { runStrategist } from "./strategist";

export type AgentName = "estrategista" | "conteudo";

const running = new Set<AgentName>();

// Executa um agente com trava (não roda duas vezes ao mesmo tempo) e avisa o Maicon em caso de falha
export async function runAgent(agent: AgentName): Promise<{ ok: boolean; summary: string }> {
    if (running.has(agent)) return { ok: false, summary: `${agent} já está em execução` };
    running.add(agent);
    try {
        if (agent === "estrategista") {
            const s = await runStrategist();
            return { ok: true, summary: `Estratégia proposta com ${s.temas.length} temas` };
        }
        const articles = await runContent();
        return { ok: true, summary: `${articles.length} artigo(s) escrito(s)` };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[Marketing] Falha no agente ${agent}:`, err);
        await notifyOwner(`⚠️ O agente *${agent}* falhou: ${message.slice(0, 300)}`).catch(() => undefined);
        return { ok: false, summary: message };
    } finally {
        running.delete(agent);
    }
}

let started = false;

export function startMarketingScheduler(): void {
    if (started || process.env.MARKETING_AGENTS_ENABLED !== "true" || process.env.NODE_ENV !== "production") return;
    started = true;

    const options = { timezone: AGENDA_TIMEZONE, noOverlap: true };
    cron.schedule("0 7 * * 1", () => void runAgent("estrategista"), { ...options, name: "marketing-estrategista" });
    cron.schedule("0 7 * * 2", () => void runAgent("conteudo"), { ...options, name: "marketing-conteudo" });

    console.log("[Marketing] Rotinas agendadas: Estrategista (seg 7h) e Conteúdo (ter 7h), horário de Brasília");
}
