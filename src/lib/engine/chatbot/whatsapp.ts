// Envio de mensagens pelo WhatsApp da Vick (Z-API) e utilitários de número
import axios from "axios";

export function isWhatsAppConfigured(): boolean {
    return Boolean(process.env.ZAPI_INSTANCE && process.env.ZAPI_TOKEN);
}

export async function sendWhatsAppText(phone: string, message: string): Promise<void> {
    const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;

    if (!ZAPI_INSTANCE || !ZAPI_TOKEN) {
        console.log("[WhatsApp] Z-API não configurada");
        return;
    }

    await axios.post(
        `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
        { phone, message },
        { headers: { "client-token": ZAPI_CLIENT_TOKEN || "" }, timeout: 15000 }
    );
}

// A Z-API aceita envios mesmo desconectada (ficam em fila sem entregar): por isso consultamos o status.
// true = conectado, false = desconectado, null = não deu para saber (Z-API fora do ar, rede etc.)
const STATUS_CACHE_MS = 60 * 1000;
let statusCache: { value: boolean | null; at: number } | null = null;

export async function getWhatsAppConnected(): Promise<boolean | null> {
    const { ZAPI_INSTANCE, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;
    if (!ZAPI_INSTANCE || !ZAPI_TOKEN) return null;
    if (statusCache && Date.now() - statusCache.at < STATUS_CACHE_MS) return statusCache.value;

    let value: boolean | null = null;
    try {
        const { data } = await axios.get(
            `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/status`,
            { headers: { "client-token": ZAPI_CLIENT_TOKEN || "" }, timeout: 10000 }
        );
        value = typeof data?.connected === "boolean" ? data.connected && data.smartphoneConnected !== false : null;
    } catch (err) {
        console.error("[WhatsApp] Não foi possível consultar o status da Z-API:", err instanceof Error ? err.message : err);
    }
    statusCache = { value, at: Date.now() };
    return value;
}

// Converte o que o visitante digitou em número brasileiro no formato da Z-API (55 + DDD + número).
// Retorna null quando não parece um celular/fixo brasileiro válido.
export function normalizeBrPhone(raw: string): string | null {
    const text = String(raw || "").trim();
    let digits = text.replace(/\D/g, "");
    if (digits.startsWith("00")) digits = digits.slice(2);
    // Código de país informado (+ ou 00) diferente do Brasil: não é número nosso para completar
    if ((text.startsWith("+") || text.startsWith("00")) && !digits.startsWith("55")) return null;
    if (digits.startsWith("0")) digits = digits.slice(1); // 0 + DDD (discagem de longa distância)
    if (digits.length === 10 || digits.length === 11) digits = "55" + digits;
    if (!digits.startsWith("55") || (digits.length !== 12 && digits.length !== 13)) return null;

    const ddd = Number(digits.slice(2, 4));
    if (ddd < 11 || ddd > 99) return null;
    return digits;
}

// Data (Brasília) do último contato por número: o webhook usa para reapresentar a Vick só em um novo dia
const lastContactDate = new Map<string, string>();

export function todayStr(): string {
    return new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function getLastContactDate(phone: string): string | undefined {
    return lastContactDate.get(phone);
}

export function markContactToday(phone: string): void {
    lastContactDate.set(phone, todayStr());
}
