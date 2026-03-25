// Módulo 4 — Agenda automatizada
// Webhooks do Cal.com → dispara WhatsApp + e-mail + CRM

import nodemailer from "nodemailer";
import axios from "axios";
import { emailBase } from "../utils/email-template";

interface BookingPayload {
    triggerEvent: "BOOKING_CREATED" | "BOOKING_CANCELLED" | "BOOKING_RESCHEDULED";
    payload: {
        uid: string;
        title: string;
        startTime: string;
        endTime: string;
        attendees: Array<{ name: string; email: string; timeZone: string }>;
        organizer: { name: string; email: string };
        meetingUrl?: string;
        description?: string;
        customInputs?: Record<string, string>;
    };
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function handleBookingCreated(booking: BookingPayload): Promise<void> {
    const attendee = booking.payload.attendees[0];
    const startDate = new Date(booking.payload.startTime);
    const formattedDate = startDate.toLocaleDateString("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });
    const formattedTime = startDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit", minute: "2-digit", timeZone: attendee.timeZone || "America/Sao_Paulo",
    });

    // 1. E-mail de confirmação para o lead
    await sendConfirmationEmail(attendee.email, attendee.name, formattedDate, formattedTime, booking.payload.meetingUrl || "");

    // 2. WhatsApp de confirmação (imediato)
    await sendWhatsApp(attendee.email, buildWhatsAppConfirmation(attendee.name, formattedDate, formattedTime, booking.payload.meetingUrl || ""));

    // 3. Agendar lembretes automáticos
    scheduleReminders(booking.payload.uid, attendee, formattedDate, formattedTime, booking.payload.meetingUrl || "", startDate);

    // 4. Notificar Maicon internamente
    await sendInternalNotification(attendee.name, attendee.email, formattedDate, formattedTime);

    console.log(`[Agenda] Reunião criada: ${attendee.name} em ${formattedDate} às ${formattedTime}`);
}

async function sendConfirmationEmail(
    to: string, name: string, date: string, time: string, meetUrl: string
): Promise<void> {
    await transporter.sendMail({
        from: `"Adone AI" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Reunião confirmada — Diagnóstico Gratuito Adone AI",
        html: emailBase(`
    <h2 style="color:#1f2937;margin-top:0;">Sua reunião está confirmada! 🎉</h2>
    <p style="margin:0 0 8px;">Olá, <strong>${name}</strong>!</p>
    <p style="color:#6b7280;">Estamos animados para conversar sobre como a Adone AI pode gerar resultados reais para o seu negócio.</p>
    <div style="background:#f3f4f6;border-radius:10px;padding:20px;margin:24px 0;border-left:4px solid #7c3aed;">
      <p style="margin:0;"><strong>📅 Data:</strong> ${date}</p>
      <p style="margin:8px 0 0;"><strong>🕐 Horário:</strong> ${time}</p>
      <p style="margin:8px 0 0;"><strong>⏱ Duração:</strong> 30 minutos</p>
      <p style="margin:8px 0 0;"><strong>📍 Formato:</strong> Google Meet (online)</p>
    </div>
    ${meetUrl ? `<div style="text-align:center;margin:28px 0;">
      <a href="${meetUrl}" style="background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
        Entrar na Reunião
      </a>
    </div>` : ""}
    <p style="color:#9ca3af;font-size:13px;margin-bottom:0;">Precisa reagendar? Responda este e-mail ou acesse o link de agendamento.</p>
`, "Sua reunião com a Adone AI está confirmada"),
    });
}

async function sendInternalNotification(name: string, email: string, date: string, time: string): Promise<void> {
    await transporter.sendMail({
        from: `"Vick — Adone AI" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: `🔔 Nova reunião: ${name} — ${date} às ${time}`,
        text: `Nova reunião agendada!\n\nLead: ${name}\nE-mail: ${email}\nData: ${date}\nHorário: ${time}`,
    });
}

function buildWhatsAppConfirmation(name: string, date: string, time: string, meetUrl: string): string {
    return `*Adone AI* 🤖

Olá ${name}! 👋
Sua reunião está confirmada!

📅 *${date}*
🕐 *${time}*
⏱ 30 minutos — Google Meet

${meetUrl ? `🔗 Link da reunião:\n${meetUrl}` : ""}

Vou te lembrar 24h e 1h antes. Qualquer dúvida, é só falar aqui! 😊`;
}

function scheduleReminders(
    bookingUid: string,
    attendee: { name: string; email: string },
    date: string,
    time: string,
    meetUrl: string,
    startDate: Date
): void {
    const now = Date.now();
    const msUntilMeeting = startDate.getTime() - now;

    // Lembrete 24h antes
    const ms24h = msUntilMeeting - 24 * 60 * 60 * 1000;
    if (ms24h > 0) {
        setTimeout(async () => {
            const msg = `Olá ${attendee.name}! 😊\n\nLembrando que nossa conversa é *amanhã às ${time}*.\n\n🔗 ${meetUrl}\n\nAté amanhã!`;
            await sendWhatsApp(attendee.email, msg);
        }, ms24h);
    }

    // Lembrete 1h antes
    const ms1h = msUntilMeeting - 60 * 60 * 1000;
    if (ms1h > 0) {
        setTimeout(async () => {
            const msg = `Olá ${attendee.name}! 👋\n\nNossa reunião começa em *1 hora*.\n\n🔗 Aqui está o link:\n${meetUrl}\n\nAté já!`;
            await sendWhatsApp(attendee.email, msg);
        }, ms1h);
    }
}

async function sendWhatsApp(identifier: string, message: string): Promise<void> {
    const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;
    if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
        console.log(`[WhatsApp] Não configurado. Mensagem para ${identifier}:\n${message}`);
        return;
    }

    try {
        await axios.post(
            `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
            { phone: identifier, message },
            { headers: { "client-token": ZAPI_CLIENT_TOKEN || "" } }
        );
    } catch (err) {
        console.error("[WhatsApp] Erro ao enviar:", err);
    }
}

export async function handleBookingCancelled(booking: BookingPayload): Promise<void> {
    const attendee = booking.payload.attendees[0];
    await transporter.sendMail({
        from: `"Adone AI" <${process.env.EMAIL_USER}>`,
        to: attendee.email,
        subject: "Reunião cancelada — Adone AI",
        text: `Olá ${attendee.name}, sua reunião foi cancelada.\n\nQuer reagendar? Acesse: ${process.env.BOOKING_URL}`,
    });
    console.log(`[Agenda] Reunião cancelada: ${attendee.name}`);
}
