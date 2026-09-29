// A Vick inicia a conversa no WhatsApp com um lead do formulário do site
// (na hora do envio do formulário ou depois, pelo /painel)
import { ada, type FormLead } from "./vick";
import { getWhatsAppConnected, isWhatsAppConfigured, markContactToday, normalizeBrPhone, resolveWhatsAppPhone, sendWhatsAppText } from "./whatsapp";
import { checkWhatsAppHealth } from "./whatsapp-monitor";

export type OutreachResult =
    | { ok: true; phone: string }
    | { ok: false; reason: "nao_configurado" | "telefone_invalido" | "sem_whatsapp" | "conversa_em_andamento" | "desconectado" | "falha_envio" };

export const OUTREACH_REASONS: Record<Exclude<OutreachResult, { ok: true }>["reason"], string> = {
    nao_configurado:       "WhatsApp (Z-API) não configurado",
    telefone_invalido:     "Telefone inválido",
    sem_whatsapp:          "Esse número não tem WhatsApp",
    conversa_em_andamento: "O lead já está conversando com a Vick",
    desconectado:          "WhatsApp da Vick desconectado",
    falha_envio:           "Falha ao enviar a mensagem",
};

// late: o contato foi deixado há algum tempo (a abertura não diz "recebi agora")
export async function startVickWithLead(rawPhone: string, lead: FormLead, options: { late?: boolean } = {}): Promise<OutreachResult> {
    if (!isWhatsAppConfigured()) return { ok: false, reason: "nao_configurado" };

    const typed = normalizeBrPhone(rawPhone);
    if (!typed) return { ok: false, reason: "telefone_invalido" };

    // Desconectada, a Z-API aceita e não entrega: não conta como contato feito e avisa o Maicon
    if ((await getWhatsAppConnected()) === false) {
        void checkWhatsAppHealth();
        return { ok: false, reason: "desconectado" };
    }

    // O número como o WhatsApp registra (ex.: celulares antigos sem o 9): é com ele que as respostas chegam no webhook
    const phone = await resolveWhatsAppPhone(typed);
    if (phone === false) return { ok: false, reason: "sem_whatsapp" };

    // Já existe uma conversa em andamento com esse número: não interrompe
    const existing = ada.getSession(`whatsapp_${phone}`);
    if (existing?.messages.some(m => m.role === "user")) return { ok: false, reason: "conversa_em_andamento" };

    try {
        const opening = ada.startFromForm(phone, lead, options);
        await sendWhatsAppText(phone, opening);
        markContactToday(phone);
        console.log(`[Vick] Conversa iniciada no WhatsApp com lead do formulário (${phone.slice(0, 4)}…).`);
        return { ok: true, phone };
    } catch (err) {
        ada.deleteSession(`whatsapp_${phone}`);
        console.error("[Vick] Falha ao iniciar a conversa no WhatsApp:", err instanceof Error ? err.message : err);
        return { ok: false, reason: "falha_envio" };
    }
}
