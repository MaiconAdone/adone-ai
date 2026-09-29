import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { AGENT_LABELS, AGENTS, isRunning, runAgent, type AgentName } from "@/lib/engine/marketing/scheduler";

// POST /api/painel/run { agent, focus? } — botão "Rodar agora" do painel (sessão do painel)
// A rodada leva minutos e a hospedagem corta a requisição antes disso: o agente roda em segundo plano,
// registra o resultado na aba "Execuções" e avisa no WhatsApp.
export async function POST(req: NextRequest) {
    if (!(await hasPainelSession())) {
        return NextResponse.json({ error: "Sessão expirada. Entre de novo." }, { status: 401 });
    }
    const { agent, focus } = await req.json().catch(() => ({}));
    if (!AGENTS.includes(agent as AgentName)) {
        return NextResponse.json({ error: "Agente inválido" }, { status: 400 });
    }
    const name = agent as AgentName;
    if (isRunning(name)) {
        return NextResponse.json({ error: `${AGENT_LABELS[name]} já está em execução` }, { status: 409 });
    }
    // Tema opcional pedido no painel (só o agente de Conteúdo usa)
    const topic = typeof focus === "string" ? focus.slice(0, 300) : undefined;
    void runAgent(name, topic);
    return NextResponse.json(
        { summary: "Começou. Leva alguns minutos; você recebe o aviso no WhatsApp e o resultado aparece aqui ao recarregar." },
        { status: 202 },
    );
}
