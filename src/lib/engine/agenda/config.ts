// Regras da agenda de diagnósticos do Maicon

export const AGENDA_TIMEZONE = "America/Sao_Paulo";
// Brasília sem horário de verão desde 2019
export const AGENDA_UTC_OFFSET = "-03:00";

// 0 = domingo … 6 = sábado → segunda a sexta
export const AGENDA_WEEKDAYS = [1, 2, 3, 4, 5];
export const AGENDA_START_HOUR = 10;
export const AGENDA_END_HOUR = 16; // última reunião termina às 16h
export const AGENDA_SLOT_MINUTES = 30;

export const AGENDA_HORIZON_DAYS = 21; // até quantos dias à frente oferecer horários
export const AGENDA_MIN_NOTICE_HOURS = 12; // antecedência mínima para agendar

export function getBookingUrl(): string {
    const site = process.env.SITE_URL || "https://adoneintelligence.com.br";
    return process.env.BOOKING_URL || `${site.replace(/\/$/, "")}/agendar`;
}
