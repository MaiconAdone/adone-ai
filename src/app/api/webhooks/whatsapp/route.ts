import { NextRequest, NextResponse } from "next/server";
import { ada, classifyChatError, MAX_USER_MESSAGE_CHARS } from "@/lib/engine/chatbot/vick";
import { rateLimit, safeEqual } from "@/lib/rate-limit";
import axios from "axios";

const INTRO = "Olá, eu sou a Vick! A assistente Virtual da Adone Intelligence. 👋";
const FALLBACK_MESSAGE = "Desculpe, tive uma instabilidade agora 😕 Pode me mandar a mensagem de novo em instantes?";

// Rastreia a data do último contato por número (reinicia apresentação no dia seguinte)
const lastContactDate = new Map<string, string>();

function todayStr(): string {
    return new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

// Recebe mensagens do WhatsApp via Z-API e responde com a Vick
// URL cadastrada na Z-API: /api/webhooks/whatsapp?secret=<ZAPI_WEBHOOK_SECRET>
export async function POST(req: NextRequest) {
    // Sem o segredo, qualquer um poderia fazer a Vick enviar mensagens pelo nosso número
    if (!safeEqual(req.nextUrl.searchParams.get("secret"), process.env.ZAPI_WEBHOOK_SECRET)) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    let phone = "";

    try {
        const body = await req.json();

        // Só mensagens da nossa instância
        if (body.instanceId && body.instanceId !== process.env.ZAPI_INSTANCE) {
            return NextResponse.json({ error: "Instância inválida" }, { status: 403 });
        }

        // Filtrar só mensagens de texto recebidas em conversa individual (ignorar as nossas e grupos)
        if (!body.text?.message || body.fromMe || body.isGroup) {
            return NextResponse.json({ ok: true });
        }

        phone = String(body.phone || "");
        const message = String(body.text.message).slice(0, MAX_USER_MESSAGE_CHARS);

        if (!phone || !message) {
            return NextResponse.json({ ok: true });
        }

        // Cada mensagem é uma chamada paga à IA: limita por número
        if (!rateLimit(`whatsapp:${phone}`, 20, 10 * 60 * 1000)) {
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
        console.error(`[/api/webhooks/whatsapp] ${classifyChatError(err)}`, err);
        if (phone) {
            await sendWhatsAppReply(phone, FALLBACK_MESSAGE).catch(() => undefined);
        }
        // 200 para a Z-API não reenviar o evento e gerar respostas duplicadas
        return NextResponse.json({ ok: false });
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
