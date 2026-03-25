import { NextRequest, NextResponse } from "next/server";
import { ada } from "@/lib/engine/chatbot/vick";

// GET /api/chat/session?id=xxx
export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("id");

    if (!sessionId) {
        return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }

    const session = ada.getSession(sessionId);

    if (!session) {
        return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    return NextResponse.json({
        id: session.id,
        stage: session.stage,
        score: session.score,
        leadData: session.leadData,
        messageCount: session.messages.length,
    });
}
