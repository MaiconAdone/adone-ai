import { NextRequest, NextResponse } from "next/server";
import { ada } from "@/lib/engine/chatbot/vick";
import { safeEqual } from "@/lib/rate-limit";

// GET /api/chat/session?id=xxx — uso interno (contém dados do lead)
// Exige o header x-webhook-secret igual ao WEBHOOK_SECRET
export async function GET(req: NextRequest) {
    if (!safeEqual(req.headers.get("x-webhook-secret"), process.env.WEBHOOK_SECRET)) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

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
