// Rotinas dos agentes de marketing, dentro do próprio servidor do site.
// Só liga com MARKETING_AGENTS_ENABLED=true em produção (evita rodar no servidor de desenvolvimento).

import { mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import cron from "node-cron";
import { AGENDA_TIMEZONE } from "../agenda/config";
import { runLinkedInPost } from "../linkedin/agent";
import { markDuePostsPublished } from "./blog";
import { runContent } from "./content";
import { runMedia } from "./media";
import { notifyOwner } from "./notify";
import { runStrategist } from "./strategist";
import { appendRun, formatSheetDate } from "./workspace";

export const AGENTS = ["estrategista", "conteudo", "midia", "linkedin"] as const;
export type AgentName = (typeof AGENTS)[number];

export const AGENT_LABELS: Record<AgentName, string> = {
    estrategista: "Estrategista",
    conteudo: "Conteúdo",
    midia: "Mídia (Google Ads e LinkedIn Ads)",
    linkedin: "Posts da página no LinkedIn",
};

export const AGENT_SCHEDULE: Record<AgentName, string> = {
    estrategista: "Segundas, 7h",
    conteudo: "Terças, 7h",
    midia: "Quartas, 7h",
    linkedin: "Segundas, quartas e sextas, 9h",
};

const running = new Set<AgentName>();

export function isRunning(agent: AgentName): boolean {
    return running.has(agent);
}

async function execute(agent: AgentName, focus?: string): Promise<string> {
    if (agent === "estrategista") {
        const s = await runStrategist();
        return `Estratégia proposta com ${s.temas.length} temas`;
    }
    if (agent === "conteudo") {
        const articles = await runContent(focus);
        return `${articles.length} artigo(s) escrito(s)`;
    }
    if (agent === "linkedin") return runLinkedInPost(focus);
    const plan = await runMedia();
    return plan ? "Planos de Google Ads e LinkedIn Ads propostos" : "Sem estratégia aprovada";
}

// Executa um agente com trava, registra na aba "Execuções" e avisa o Maicon em caso de falha
export async function runAgent(agent: AgentName, focus?: string): Promise<{ ok: boolean; summary: string }> {
    if (running.has(agent)) return { ok: false, summary: `${AGENT_LABELS[agent]} já está em execução` };
    running.add(agent);
    const started = new Date();
    let result: { ok: boolean; summary: string };
    try {
        result = { ok: true, summary: await execute(agent, focus) };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[Marketing] Falha no agente ${agent}:`, err);
        await notifyOwner(`⚠️ O agente *${AGENT_LABELS[agent]}* falhou: ${message.slice(0, 300)}`).catch(() => undefined);
        result = { ok: false, summary: message.slice(0, 500) };
    } finally {
        running.delete(agent);
    }
    await appendRun({
        Início: formatSheetDate(started),
        Agente: AGENT_LABELS[agent],
        Resultado: result.ok ? "Sucesso" : "Falha",
        "Duração (s)": String(Math.round((Date.now() - started.getTime()) / 1000)),
        Resumo: result.summary,
    }).catch(err => console.error("[Marketing] Falha ao registrar execução:", err));
    return result;
}

// A hospedagem pode rodar o site em mais de um processo: cada um agendaria a mesma rotina.
// Um arquivo exclusivo por rotina e horário garante que só o primeiro processo execute.
function claimSlot(job: string): boolean {
    const slot = new Date().toISOString().slice(0, 13); // uma vez por hora cheia (UTC)
    const lockDir = join(tmpdir(), "adone-marketing-locks");
    try {
        mkdirSync(lockDir, { recursive: true });
        writeFileSync(join(lockDir, `${job}-${slot}.lock`), String(process.pid), { flag: "wx" });
        return true;
    } catch {
        return false; // outro processo já pegou este horário (ou disco indisponível)
    }
}

function scheduled(job: string, task: () => Promise<unknown>): () => void {
    return () => {
        if (!claimSlot(job)) {
            console.log(`[Marketing] ${job}: já executado por outro processo neste horário; pulando`);
            return;
        }
        void task().catch(err => console.error(`[Marketing] Falha na rotina ${job}:`, err));
    };
}

let started = false;

export function startMarketingScheduler(): void {
    if (started || process.env.MARKETING_AGENTS_ENABLED !== "true" || process.env.NODE_ENV !== "production") return;
    started = true;

    const options = { timezone: AGENDA_TIMEZONE, noOverlap: true };
    cron.schedule("0 7 * * 1", scheduled("estrategista", () => runAgent("estrategista")), { ...options, name: "marketing-estrategista" });
    cron.schedule("0 7 * * 2", scheduled("conteudo", () => runAgent("conteudo")), { ...options, name: "marketing-conteudo" });
    cron.schedule("0 7 * * 3", scheduled("midia", () => runAgent("midia")), { ...options, name: "marketing-midia" });
    cron.schedule("0 9 * * 1,3,5", scheduled("linkedin", () => runAgent("linkedin")), { ...options, name: "marketing-linkedin" });
    // Publicação automática do blog: marca como "Publicado" o que passou das 24h sem veto
    cron.schedule("5 * * * *", scheduled("blog-publicacao", markDuePostsPublished), { ...options, name: "blog-publicacao" });

    console.log("[Marketing] Rotinas agendadas: Estrategista (seg 7h), Conteúdo (ter 7h), Mídia (qua 7h), LinkedIn (seg/qua/sex 9h), publicação do blog (a cada hora)");
}
