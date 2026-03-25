import { NextRequest, NextResponse } from "next/server";
import { ada } from "@/lib/engine/chatbot/vick";

// POST /api/chat — inicia sessão ou envia mensagem
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, message, channel } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "sessionId é obrigatório" }, { status: 400 });
        }

        // Iniciar sessão (sem mensagem) → retorna mensagem inicial
        if (!message) {
            const session = await ada.getOrCreateSession(sessionId, channel || "site");
            return NextResponse.json({
                sessionId: session.id,
                message: ada.getInitialMessage(),
                stage: session.stage,
            });
        }

        // Enviar mensagem
        const reply = await ada.chat(sessionId, message, channel || "site");
        const session = ada.getSession(sessionId);

        return NextResponse.json({
            sessionId,
            message: reply,
            stage: session?.stage,
        });
    } catch (err) {
        console.error("[/api/chat]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
