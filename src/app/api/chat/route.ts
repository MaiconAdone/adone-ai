import { NextRequest, NextResponse } from "next/server";
import { ada, MAX_USER_MESSAGE_CHARS } from "@/lib/engine/chatbot/vick";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SESSION_ID_PATTERN = /^[\w-]{8,80}$/;
const FALLBACK_MESSAGE = "Desculpe, estou com uma instabilidade agora 😕 Você pode falar direto com a nossa equipe pelo WhatsApp (botão verde aqui na página) ou tentar de novo em instantes.";

// POST /api/chat — inicia sessão ou envia mensagem (sempre pelo canal do site)
export async function POST(req: NextRequest) {
    const ip = getClientIp(req);

    try {
        const body = await req.json();
        const { sessionId, message } = body ?? {};

        if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
            return NextResponse.json({ error: "sessionId inválido" }, { status: 400 });
        }
        // Prefixo no servidor: o navegador nunca acessa sessões de outro canal (ex.: whatsapp_<telefone>)
        const internalId = `site_${sessionId}`;

        // Iniciar sessão (sem mensagem) → retorna mensagem inicial, sem chamar a IA
        if (!message) {
            if (!rateLimit(`chat-start:${ip}`, 20, 60 * 60 * 1000)) {
                return NextResponse.json({ error: "Muitas conversas iniciadas" }, { status: 429 });
            }
            await ada.getOrCreateSession(internalId, "site");
            return NextResponse.json({
                sessionId,
                message: ada.getInitialMessage(),
            });
        }

        if (typeof message !== "string" || message.length > MAX_USER_MESSAGE_CHARS) {
            return NextResponse.json(
                { error: "Mensagem inválida", message: `Sua mensagem ficou longa demais — pode resumir em até ${MAX_USER_MESSAGE_CHARS} caracteres?` },
                { status: 400 },
            );
        }

        // Cada mensagem é uma chamada paga à IA: limita por IP
        if (!rateLimit(`chat-msg:${ip}`, 30, 10 * 60 * 1000)) {
            return NextResponse.json(
                { error: "Muitas mensagens", message: "Você enviou muitas mensagens em pouco tempo. Aguarde alguns minutos e tente de novo 🙂" },
                { status: 429 },
            );
        }

        const reply = await ada.chat(internalId, message.trim(), "site");
        return NextResponse.json({ sessionId, message: reply });
    } catch (err) {
        console.error("[/api/chat]", err);
        return NextResponse.json({ error: "Erro interno", message: FALLBACK_MESSAGE }, { status: 500 });
    }
}
