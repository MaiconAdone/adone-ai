import { NextRequest, NextResponse } from "next/server";
import { ada } from "@/lib/engine/chatbot/vick";
import axios from "axios";

// Recebe mensagens do WhatsApp via Z-API e responde com a Vick
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Z-API envia diferentes tipos de eventos — filtrar só mensagens de texto recebidas
        if (!body.text?.message || body.fromMe) {
            return NextResponse.json({ ok: true });
        }

        const phone = body.phone as string;      // ex: "5511926025637"
        const message = body.text.message as string;

        if (!phone || !message) {
            return NextResponse.json({ ok: true });
        }

        // Usar o número como sessionId para manter contexto por lead
        const sessionId = `whatsapp_${phone}`;

        // Obter ou criar sessão da Vick
        await ada.getOrCreateSession(sessionId, "whatsapp");

        // Gerar resposta da Vick
        const reply = await ada.chat(sessionId, message, "whatsapp");

        // Enviar resposta pelo WhatsApp via Z-API
        await sendWhatsAppReply(phone, reply);

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[/api/webhooks/whatsapp]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

async function sendWhatsAppReply(phone: string, message: string): Promise<void> {
    const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;

    if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
        console.log("[WhatsApp] Z-API não configurada");
        return;
    }

    await axios.post(
        `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
        { phone, message },
        { headers: { "client-token": ZAPI_CLIENT_TOKEN || "" } }
    );
}
