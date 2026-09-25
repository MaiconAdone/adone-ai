// Cria o agendamento: evento no Google Agenda (com Meet) + planilha + confirmações

import { randomUUID } from "crypto";
import { AGENDA_SLOT_MINUTES, AGENDA_TIMEZONE } from "./config";
import { isSlotAvailable } from "./availability";
import { calendarApi, calendarId } from "./google";
import { appendBooking } from "./sheets";
import { notifyMeetingBooked } from "./notifications";

export type BookingOrigin = "site" | "vick" | "whatsapp";

export interface BookingInput {
    start: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    notes?: string;
    origin: BookingOrigin;
    // false quando a confirmação já é dada na própria conversa do WhatsApp
    sendWhatsAppConfirmation?: boolean;
}

export interface BookingResult {
    date: string;
    time: string;
    meetUrl: string;
}

export class SlotUnavailableError extends Error {}

const ORIGIN_LABEL: Record<BookingOrigin, string> = {
    site: "Site",
    vick: "Vick (chat do site)",
    whatsapp: "Vick (WhatsApp)",
};

// Evita duas reservas simultâneas do mesmo horário neste processo
const pending = new Set<string>();

export async function createBooking(input: BookingInput): Promise<BookingResult> {
    const start = new Date(input.start);
    const key = String(start.getTime());
    if (pending.has(key)) throw new SlotUnavailableError();
    pending.add(key);

    try {
        if (!(await isSlotAvailable(input.start))) throw new SlotUnavailableError();

        const end = new Date(start.getTime() + AGENDA_SLOT_MINUTES * 60 * 1000);
        const who = input.company ? `${input.name} (${input.company})` : input.name;

        const { data: event } = await calendarApi().events.insert({
            calendarId: calendarId(),
            conferenceDataVersion: 1,
            sendUpdates: "all",
            requestBody: {
                summary: `Diagnóstico Adone AI — ${who}`,
                description: [
                    `Lead: ${input.name}`,
                    `Empresa: ${input.company || "-"}`,
                    `E-mail: ${input.email}`,
                    `WhatsApp: ${input.phone}`,
                    `Origem: ${ORIGIN_LABEL[input.origin]}`,
                    "",
                    `Observações: ${input.notes || "-"}`,
                ].join("\n"),
                start: { dateTime: start.toISOString(), timeZone: AGENDA_TIMEZONE },
                end: { dateTime: end.toISOString(), timeZone: AGENDA_TIMEZONE },
                attendees: [{ email: input.email, displayName: input.name }],
                conferenceData: {
                    createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } },
                },
                reminders: { useDefault: true },
            },
        });

        const meetUrl = event.hangoutLink
            || event.conferenceData?.entryPoints?.find(e => e.entryPointType === "video")?.uri
            || "";
        const date = start.toLocaleDateString("pt-BR", { timeZone: AGENDA_TIMEZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" });
        const time = start.toLocaleTimeString("pt-BR", { timeZone: AGENDA_TIMEZONE, hour: "2-digit", minute: "2-digit" });

        await appendBooking({
            "Data da reunião": start.toLocaleDateString("pt-BR", { timeZone: AGENDA_TIMEZONE }),
            "Horário": time,
            "Nome": input.name,
            "E-mail": input.email,
            "WhatsApp": input.phone,
            "Empresa": input.company || "",
            "Origem": ORIGIN_LABEL[input.origin],
            "Observações": input.notes || "",
            "Link do Meet": meetUrl,
            "ID do evento": event.id || "",
        });

        await notifyMeetingBooked({
            name: input.name,
            email: input.email,
            phone: input.phone,
            company: input.company,
            notes: input.notes,
            date,
            time,
            start,
            meetUrl,
        }, { whatsAppConfirmation: input.sendWhatsAppConfirmation !== false });

        console.log(`[Agenda] Reunião criada: ${input.name} em ${date} às ${time}`);
        return { date, time, meetUrl };
    } finally {
        pending.delete(key);
    }
}
