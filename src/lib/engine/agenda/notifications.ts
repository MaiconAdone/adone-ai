// Confirmações e lembretes de reunião (e-mail + WhatsApp)

import nodemailer from "nodemailer";
import axios from "axios";
import { emailBase } from "../utils/email-template";

export interface MeetingInfo {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    date: string; // "terça-feira, 29 de setembro de 2026"
    time: string; // "09:30"
    start: Date;
    meetUrl: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE !== "false",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const escapeHtml = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Z-API espera DDI + DDD + número, só dígitos
export function toWhatsAppNumber(phone?: string): string | null {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    if (digits.length >= 12 && digits.length <= 13) return digits;
    return null;
}

export async function sendWhatsApp(phone: string, message: string): Promise<void> {
    const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;
    if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
        console.log("[WhatsApp] Z-API não configurada");
        return;
    }
    try {
        await axios.post(
            `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
            { phone, message },
            { headers: { "client-token": ZAPI_CLIENT_TOKEN || "" } }
        );
    } catch (err) {
        console.error("[WhatsApp] Erro ao enviar:", err);
    }
}

async function sendConfirmationEmail(m: MeetingInfo): Promise<void> {
    await transporter.sendMail({
        from: `"Adone AI" <${process.env.EMAIL_USER}>`,
        to: m.email,
        subject: "Reunião confirmada — Diagnóstico Adone AI",
        html: emailBase(`
    <h2 style="color:#1f2937;margin-top:0;">Sua reunião está confirmada! 🎉</h2>
    <p style="margin:0 0 8px;">Olá, <strong>${escapeHtml(m.name)}</strong>!</p>
    <p style="color:#6b7280;">Estamos animados para conversar sobre como a Adone AI pode gerar resultados reais para o seu negócio.</p>
    <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:24px 0;border-left:4px solid #7c3aed;">
      <p style="margin:0;"><strong>📅 Data:</strong> ${m.date}</p>
      <p style="margin:8px 0 0;"><strong>🕐 Horário:</strong> ${m.time} (horário de Brasília)</p>
      <p style="margin:8px 0 0;"><strong>⏱ Duração:</strong> 30 minutos</p>
      <p style="margin:8px 0 0;"><strong>📍 Formato:</strong> Google Meet (online)</p>
    </div>
    ${m.meetUrl ? `<div style="text-align:center;margin:28px 0;">
      <a href="${m.meetUrl}" style="background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
        Entrar na Reunião
      </a>
    </div>` : ""}
    <p style="color:#9ca3af;font-size:13px;margin-bottom:0;">Você também recebeu o convite do Google Agenda. Precisa reagendar? É só responder este e-mail.</p>
`, "Sua reunião com a Adone AI está confirmada"),
    });
}

async function sendInternalNotification(m: MeetingInfo): Promise<void> {
    await transporter.sendMail({
        from: `"Vick — Adone AI" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: `🔔 Nova reunião: ${m.name} — ${m.date} às ${m.time}`,
        text: [
            "Nova reunião agendada pelo site!",
            "",
            `Lead: ${m.name}`,
            `Empresa: ${m.company || "-"}`,
            `E-mail: ${m.email}`,
            `WhatsApp: ${m.phone || "-"}`,
            `Data: ${m.date} às ${m.time}`,
            `Meet: ${m.meetUrl || "-"}`,
            "",
            `Observações: ${m.notes || "-"}`,
        ].join("\n"),
    });
}

function whatsAppConfirmation(m: MeetingInfo): string {
    return `*Adone AI* 🤖

Olá ${m.name}! 👋
Sua reunião está confirmada!

📅 *${m.date}*
🕐 *${m.time}* (horário de Brasília)
⏱ 30 minutos — Google Meet

${m.meetUrl ? `🔗 Link da reunião:\n${m.meetUrl}\n\n` : ""}Vou te lembrar 24h e 1h antes. Qualquer dúvida, é só falar aqui! 😊`;
}

// Lembretes em memória: valem enquanto o servidor não reinicia (um novo deploy os descarta)
function scheduleReminders(m: MeetingInfo, phone: string): void {
    const msUntil = m.start.getTime() - Date.now();
    const reminders: Array<[number, string]> = [
        [msUntil - 24 * 60 * 60 * 1000, `Olá ${m.name}! 😊\n\nLembrando que nossa conversa é *amanhã às ${m.time}*.\n\n🔗 ${m.meetUrl}\n\nAté amanhã!`],
        [msUntil - 60 * 60 * 1000, `Olá ${m.name}! 👋\n\nNossa reunião começa em *1 hora*.\n\n🔗 Aqui está o link:\n${m.meetUrl}\n\nAté já!`],
    ];
    for (const [delay, message] of reminders) {
        // setTimeout aceita no máximo ~24,8 dias
        if (delay > 0 && delay < 2_147_000_000) {
            setTimeout(() => void sendWhatsApp(phone, message), delay);
        }
    }
}

export async function notifyMeetingBooked(m: MeetingInfo, options = { whatsAppConfirmation: true }): Promise<void> {
    const results = await Promise.allSettled([
        sendConfirmationEmail(m),
        sendInternalNotification(m),
    ]);
    for (const r of results) {
        if (r.status === "rejected") console.error("[Agenda] Falha ao enviar e-mail:", r.reason);
    }

    const phone = toWhatsAppNumber(m.phone);
    if (phone) {
        if (options.whatsAppConfirmation) await sendWhatsApp(phone, whatsAppConfirmation(m));
        scheduleReminders(m, phone);
    }
}
