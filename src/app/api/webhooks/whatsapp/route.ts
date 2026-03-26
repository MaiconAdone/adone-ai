import { NextRequest, NextResponse } from "next/server";
import { ada } from "@/lib/engine/chatbot/vick";
import axios from "axios";

const INTRO = "Olá, eu sou a Vick! A assistente Virtual da Adone Intelligence. 👋";

// Rastreia a data do último contato por número (reinicia apresentação no dia seguinte)
const lastContactDate = new Map<string, string>();

function todayStr(): string {
    return new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Recebe mensagens do WhatsApp via Z-API e responde com a Vick
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Filtrar só mensagens de texto recebidas (ignorar as enviadas por nós)
        if (!body.text?.message || body.fromMe) {
            return NextResponse.json({ ok: true });
        }

        const phone = body.phone as string;
        const message = body.text.message as string;

        if (!phone || !message) {
            return NextResponse.json({ ok: true });
        }

        const sessionId = `whatsapp_${phone}`;
        const today = todayStr();
        const lastDate = lastContactDate.get(phone);
        const isNewDay = !lastDate || lastDate !== today;

        // Novo dia → reinicia a sessão para nova conversa
        if (isNewDay) {
            // Força nova sessão deletando a antiga
            ada.deleteSession(sessionId);
            lastContactDate.set(phone, today);

            // Envia apresentação primeiro
            await sendWhatsAppReply(phone, INTRO);
        }

        // Criar/retomar sessão e gerar resposta
        await ada.getOrCreateSession(sessionId, "whatsapp");
        const reply = await ada.chat(sessionId, message, "whatsapp");
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
