import { NextRequest, NextResponse } from "next/server";
import { isInternalRequest, unauthorized } from "@/lib/internal-auth";
import { AGENTS, runAgent, type AgentName } from "@/lib/engine/marketing/scheduler";

// Rodadas longas (modelo pensando + artigos)
export const maxDuration = 300;

// POST /api/agents/run { "agent": "estrategista" | "conteudo" | "midia" } — disparo manual (header x-webhook-secret)
export async function POST(req: NextRequest) {
    if (!isInternalRequest(req)) return unauthorized();

    const { agent } = await req.json().catch(() => ({}));
    if (!AGENTS.includes(agent as AgentName)) {
        return NextResponse.json({ error: `agent deve ser: ${AGENTS.join(", ")}` }, { status: 400 });
    }

    const result = await runAgent(agent);
    return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
