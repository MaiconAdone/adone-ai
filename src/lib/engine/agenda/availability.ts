// Horários livres: dias/horários do Maicon menos o que já está ocupado no Google Agenda

import {
    AGENDA_END_HOUR, AGENDA_HORIZON_DAYS, AGENDA_MIN_NOTICE_HOURS, AGENDA_SLOT_MINUTES,
    AGENDA_START_HOUR, AGENDA_TIMEZONE, AGENDA_UTC_OFFSET, AGENDA_WEEKDAYS,
} from "./config";
import { busyCalendarIds, calendarApi } from "./google";

export interface Slot {
    start: string; // ISO com fuso de Brasília
    time: string; // "09:30"
}

export interface AvailableDay {
    date: string; // "2026-09-29"
    label: string; // "terça-feira, 29 de setembro"
    slots: Slot[];
}

const MINUTE = 60 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

// Data (AAAA-MM-DD) em Brasília para um instante
function spDate(instant: Date): string {
    return instant.toLocaleDateString("en-CA", { timeZone: AGENDA_TIMEZONE });
}

// Todos os horários possíveis no período, ainda sem cruzar com a agenda
export function candidateSlots(now: Date): Date[] {
    const earliest = now.getTime() + AGENDA_MIN_NOTICE_HOURS * 60 * MINUTE;
    const result: Date[] = [];

    for (let offset = 0; offset <= AGENDA_HORIZON_DAYS; offset++) {
        const day = spDate(new Date(now.getTime() + offset * 24 * 60 * MINUTE));
        // Meio-dia em Brasília cai no mesmo dia em UTC → dia da semana correto
        if (!AGENDA_WEEKDAYS.includes(new Date(`${day}T12:00:00${AGENDA_UTC_OFFSET}`).getUTCDay())) continue;

        for (let minutes = AGENDA_START_HOUR * 60; minutes + AGENDA_SLOT_MINUTES <= AGENDA_END_HOUR * 60; minutes += AGENDA_SLOT_MINUTES) {
            const start = new Date(`${day}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00${AGENDA_UTC_OFFSET}`);
            if (start.getTime() >= earliest) result.push(start);
        }
    }
    return result;
}

async function busyIntervals(timeMin: Date, timeMax: Date): Promise<Array<[number, number]>> {
    const { data } = await calendarApi().freebusy.query({
        requestBody: {
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            timeZone: AGENDA_TIMEZONE,
            items: busyCalendarIds().map(id => ({ id })),
        },
    });
    const busy = Object.values(data.calendars || {}).flatMap(c => c.busy || []);
    return busy.map(b => [new Date(b.start!).getTime(), new Date(b.end!).getTime()]);
}

const overlaps = (start: number, end: number, busy: Array<[number, number]>) =>
    busy.some(([bStart, bEnd]) => start < bEnd && end > bStart);

function toSlot(start: Date): Slot {
    return {
        start: `${spDate(start)}T${start.toLocaleTimeString("pt-BR", { timeZone: AGENDA_TIMEZONE, hour: "2-digit", minute: "2-digit" })}:00${AGENDA_UTC_OFFSET}`,
        time: start.toLocaleTimeString("pt-BR", { timeZone: AGENDA_TIMEZONE, hour: "2-digit", minute: "2-digit" }),
    };
}

export async function getAvailableDays(now = new Date()): Promise<AvailableDay[]> {
    const candidates = candidateSlots(now);
    if (candidates.length === 0) return [];

    const last = candidates[candidates.length - 1];
    const busy = await busyIntervals(candidates[0], new Date(last.getTime() + AGENDA_SLOT_MINUTES * MINUTE));

    const days = new Map<string, AvailableDay>();
    for (const start of candidates) {
        const end = start.getTime() + AGENDA_SLOT_MINUTES * MINUTE;
        if (overlaps(start.getTime(), end, busy)) continue;

        const date = spDate(start);
        if (!days.has(date)) {
            days.set(date, {
                date,
                label: start.toLocaleDateString("pt-BR", { timeZone: AGENDA_TIMEZONE, weekday: "long", day: "numeric", month: "long" }),
                slots: [],
            });
        }
        days.get(date)!.slots.push(toSlot(start));
    }
    return Array.from(days.values());
}

// Confere se um horário pedido é válido pelas regras e continua livre na agenda
export async function isSlotAvailable(startIso: string, now = new Date()): Promise<boolean> {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return false;

    const valid = candidateSlots(now).some(c => c.getTime() === start.getTime());
    if (!valid) return false;

    const end = new Date(start.getTime() + AGENDA_SLOT_MINUTES * MINUTE);
    const busy = await busyIntervals(start, end);
    return !overlaps(start.getTime(), end.getTime(), busy);
}
