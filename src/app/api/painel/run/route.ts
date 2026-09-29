import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { AGENTS, runAgent, type AgentName } from "@/lib/engine/marketing/scheduler";

// Rodadas longas (modelo pensando + artigos + imagens)
export const maxDuration = 300;

// POST /api/painel/run { agent } — botão "Rodar agora" do painel (sessão do painel)
export async function POST(req: NextRequest) {
    if (!(await hasPainelSession())) {
        return NextResponse.json({ error: "Sessão expirada. Entre de novo." }, { status: 401 });
    }
    const { agent, focus } = await req.json().catch(() => ({}));
    if (!AGENTS.includes(agent as AgentName)) {
        return NextResponse.json({ error: "Agente inválido" }, { status: 400 });
    }
    // Tema opcional pedido no painel (só o agente de Conteúdo usa)
    const topic = typeof focus === "string" ? focus.slice(0, 300) : undefined;
    const result = await runAgent(agent as AgentName, topic);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
