// Vigia a conexão do WhatsApp da Vick (Z-API) e avisa o Maicon por e-mail quando cai e quando volta.
// Desconectada, a Z-API aceita as mensagens mas não entrega: sem este aviso ninguém percebe.

import cron from "node-cron";
import { sendOwnerEmail } from "../agenda/notifications";
import { AGENDA_TIMEZONE } from "../agenda/config";
import { getWhatsAppConnected, isWhatsAppConfigured } from "./whatsapp";

// Enquanto continuar desconectado, repete o aviso a cada 6 horas
const REALERT_MS = 6 * 60 * 60 * 1000;

let downSince: Date | null = null;
let lastAlertAt = 0;
let checking = false;

function brTime(date: Date): string {
    return date.toLocaleString("pt-BR", { timeZone: AGENDA_TIMEZONE, dateStyle: "short", timeStyle: "short" });
}

export async function checkWhatsAppHealth(): Promise<void> {
    if (checking || !isWhatsAppConfigured()) return;
    checking = true;
    try {
        const connected = await getWhatsAppConnected();
        if (connected === null) return; // status desconhecido: não gera alarme falso

        if (!connected) {
            downSince ??= new Date();
            if (Date.now() - lastAlertAt < REALERT_MS) return;
            lastAlertAt = Date.now();
            await sendOwnerEmail(
                "⚠️ WhatsApp da Vick desconectado",
                [
                    `O WhatsApp da Vick está desconectado da Z-API desde ${brTime(downSince)} (horário de Brasília).`,
                    "",
                    "Enquanto isso, as mensagens ficam paradas na fila: a Vick não responde, os lembretes de reunião não chegam e os leads do formulário não são chamados no WhatsApp.",
                    "",
                    "Para reconectar:",
                    "1. Entre em https://app.z-api.io e abra a instância (menu Instâncias Web).",
                    "2. Gere o QR Code da conexão.",
                    "3. No celular da Vick: WhatsApp > Aparelhos conectados > Conectar um aparelho, e leia o QR Code.",
                    "",
                    "Ao reconectar, a fila é entregue. Você recebe outro e-mail quando a conexão voltar.",
                ].join("\n"),
            );
            console.warn("[WhatsApp] Desconectado: aviso enviado por e-mail.");
            return;
        }

        if (downSince) {
            const since = downSince;
            downSince = null;
            lastAlertAt = 0;
            await sendOwnerEmail(
                "✅ WhatsApp da Vick reconectado",
                `O WhatsApp da Vick voltou a ficar conectado (estava fora desde ${brTime(since)}, horário de Brasília). As mensagens em fila são entregues automaticamente.`,
            );
            console.log("[WhatsApp] Reconectado.");
        }
    } catch (err) {
        console.error("[WhatsApp] Falha no monitor de conexão:", err instanceof Error ? err.message : err);
    } finally {
        checking = false;
    }
}

let started = false;

export function startWhatsAppMonitor(): void {
    if (started || process.env.NODE_ENV !== "production" || !isWhatsAppConfigured()) return;
    started = true;
    cron.schedule("*/10 * * * *", () => void checkWhatsAppHealth(), { timezone: AGENDA_TIMEZONE, noOverlap: true, name: "whatsapp-monitor" });
    // Primeira checagem logo após subir o servidor
    void checkWhatsAppHealth();
    console.log("[WhatsApp] Monitor de conexão ativo (a cada 10 minutos).");
}
