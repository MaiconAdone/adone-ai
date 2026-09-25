// Vick — Orquestradora principal do chatbot
// Gerencia sessões, troca entre agentes e mantém histórico

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { QUALIFIER_SYSTEM_PROMPT, LeadData, QualificationResult } from "./agents/qualifier";
import { PRESENTER_SYSTEM_PROMPT, buildPresenterContext } from "./agents/presenter";
import { SCHEDULER_SYSTEM_PROMPT, SCHEDULED_SYSTEM_PROMPT, getSchedulerContext } from "./agents/scheduler";
import { FOLLOWUP_SYSTEM_PROMPT } from "./agents/followup";
import { appendLead } from "../agenda/sheets";
import { getBookingUrl } from "../agenda/config";
import { getAvailableDays, type AvailableDay } from "../agenda/availability";
import { createBooking, SlotUnavailableError, type BookingResult } from "../agenda/booking";
import { isGoogleConfigured } from "../agenda/google";

type AgentStage = "qualifier" | "presenter" | "scheduler" | "followup" | "closed";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Session {
    id: string;
    stage: AgentStage;
    messages: Message[];
    leadData: LeadData;
    score: number;
    channel: "site" | "whatsapp";
    booking?: BookingResult;
    createdAt: Date;
    updatedAt: Date;
}

// Quantos dias com horário livre a Vick recebe por vez (mantém o prompt enxuto)
const SCHEDULER_MAX_DAYS = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limites para conter custo e abuso (a rota é pública)
export const MAX_USER_MESSAGE_CHARS = 1000;
const MAX_USER_TURNS = 30;
const MAX_OUTPUT_TOKENS = 1500;
const SESSION_TTL_MS = 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const INITIAL_MESSAGE = "Olá! Sou a Vick, assistente da Adone AI 👋\n\nAntes de qualquer coisa — o que trouxe você aqui hoje? Qual é o maior desafio operacional da sua empresa no momento?";

// Resposta estruturada do qualificador: o texto do lead fica separado dos dados de qualificação
const leadField = z.string();
const QualifierOutput = z.object({
    mensagem: z.string(),
    qualificacao: z
        .object({
            qualificado: z.boolean(),
            score: z.number(),
            dados: z.object({
                nome_lead: leadField,
                empresa: leadField,
                setor: leadField,
                dor_principal: leadField,
                tem_dados: leadField,
                urgencia: leadField,
                orcamento: leadField,
            }),
            proximo_agente: z.enum(["presenter", "followup"]),
        })
        .nullable(),
});

// Intenção de agendar, detectada na mensagem do lead (não na resposta da Vick)
const SCHEDULING_INTENT = ["agendar", "agenda", "marcar", "reunião", "reuniao", "call", "segunda", "terça", "terca", "quarta", "quinta", "sexta", "pode ser", "vamos", "topo", "quero"];

export class ChatConfigError extends Error {}

// Classifica a falha em um código curto (sem dados sensíveis) para diagnóstico em produção
export function classifyChatError(err: unknown): string {
    // Sem SITE_URL também: nenhuma variável chega em execução (problema de hospedagem, não da chave)
    if (err instanceof ChatConfigError) return process.env.SITE_URL ? "sem_chave" : "sem_ambiente";
    if (err instanceof OpenAI.AuthenticationError) return "chave_invalida";
    if (err instanceof OpenAI.PermissionDeniedError) return "sem_permissao";
    if (err instanceof OpenAI.RateLimitError) return "limite_ou_credito";
    if (err instanceof OpenAI.NotFoundError || err instanceof OpenAI.BadRequestError) return "modelo_ou_requisicao";
    if (err instanceof OpenAI.APIConnectionError) return "rede";
    if (err instanceof OpenAI.APIError) return "erro_openai";
    return "interno";
}

// Armazenamento em memória (substituir por Redis se houver mais de uma instância)
const sessions = new Map<string, Session>();

export class Vick {
    private client: OpenAI | null = null;
    private model: string;
    private bookingUrl: string;
    private lastCleanup = Date.now();

    constructor() {
        this.model = process.env.OPENAI_MODEL || "gpt-6-luna";
        this.bookingUrl = getBookingUrl();
    }

    // Cliente criado sob demanda para o build não exigir a chave
    private getClient(): OpenAI {
        if (!this.client) {
            // Tolera espaços, quebras de linha e aspas coladas junto ao valor no painel de hospedagem
            const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
            if (!apiKey) throw new ChatConfigError("OPENAI_API_KEY ausente");
            this.client = new OpenAI({ apiKey });
        }
        return this.client;
    }

    private getSystemPrompt(session: Session, days: AvailableDay[]): string {
        const bookingUrl = this.personalBookingUrl(session);
        switch (session.stage) {
            case "qualifier":
                return QUALIFIER_SYSTEM_PROMPT;
            case "presenter":
                return PRESENTER_SYSTEM_PROMPT + "\n\n" + buildPresenterContext(session.leadData);
            case "scheduler":
                return (SCHEDULER_SYSTEM_PROMPT + "\n\n" + getSchedulerContext(session.leadData, bookingUrl, days))
                    .replace(/\[BOOKING_URL\]/g, bookingUrl);
            case "closed": {
                const b = session.booking;
                const details = b ? `\nREUNIÃO AGENDADA: ${b.date}, às ${b.time} (Brasília). Meet: ${b.meetUrl || "enviado por e-mail"}` : "";
                return SCHEDULED_SYSTEM_PROMPT.replace(/\[BOOKING_URL\]/g, bookingUrl) + details;
            }
            case "followup":
                return FOLLOWUP_SYSTEM_PROMPT;
        }
    }

    // Horários livres para a Vick oferecer (mesma fonte da página /agendar)
    private async schedulerDays(): Promise<AvailableDay[]> {
        if (!isGoogleConfigured()) return [];
        try {
            return (await getAvailableDays()).slice(0, SCHEDULER_MAX_DAYS);
        } catch (err) {
            console.error("[Vick] Falha ao consultar a agenda:", err);
            return [];
        }
    }

    private schedulerSchema(days: AvailableDay[]) {
        const starts = days.flatMap(d => d.slots.map(s => s.start));
        return z.object({
            mensagem: z.string(),
            agendamento: z
                .object({
                    // Só aceita horários da lista: o modelo não consegue inventar um
                    inicio: z.enum(starts as [string, ...string[]]),
                    nome: z.string(),
                    email: z.string(),
                    empresa: z.string(),
                })
                .nullable(),
        });
    }

    private async bookFromChat(
        session: Session,
        choice: { inicio: string; nome: string; email: string; empresa: string },
    ): Promise<string> {
        const email = choice.email.trim();
        if (!EMAIL_PATTERN.test(email)) {
            return "Acho que o e-mail veio com algum erro de digitação 😅 Pode me mandar de novo? É para onde vai o convite com o link da reunião.";
        }

        try {
            const booking = await createBooking({
                start: choice.inicio,
                name: choice.nome.trim() || session.leadData.nome_lead || "Lead",
                email,
                phone: this.whatsAppPhone(session) || "",
                company: choice.empresa.trim() || session.leadData.empresa,
                notes: session.leadData.dor_principal,
                origin: session.channel === "whatsapp" ? "whatsapp" : "vick",
                // A própria resposta da Vick já é a confirmação no WhatsApp
                sendWhatsAppConfirmation: false,
            });
            session.booking = booking;
            session.stage = "closed";
            console.log(`[Vick] Lead ${session.id} agendado para ${booking.date} às ${booking.time}.`);

            return [
                "Pronto, está agendado! ✅",
                "",
                `📅 *${booking.date}*`,
                `🕐 *${booking.time}* (horário de Brasília) — 30 minutos`,
                booking.meetUrl ? `🔗 Link do Google Meet:\n${booking.meetUrl}` : "",
                "",
                `Mandei o convite do Google Agenda para ${email}. Vou te lembrar aqui 24h e 1h antes 😊`,
            ].filter((line, i, all) => line || all[i - 1]).join("\n");
        } catch (err) {
            if (err instanceof SlotUnavailableError) {
                return "Poxa, esse horário acabou de ser ocupado 😕 Quer escolher outro? Posso te passar as opções que ainda estão livres.";
            }
            console.error("[Vick] Falha ao agendar:", err);
            return `Tive um problema para reservar agora 😕 Você pode escolher o horário direto aqui: ${this.personalBookingUrl(session)} — ou me chamar de novo em instantes.`;
        }
    }

    async getOrCreateSession(sessionId: string, channel: "site" | "whatsapp" = "site"): Promise<Session> {
        this.maybeCleanup();

        if (!sessions.has(sessionId)) {
            sessions.set(sessionId, {
                id: sessionId,
                stage: "qualifier",
                messages: [{ role: "assistant", content: INITIAL_MESSAGE }],
                leadData: {},
                score: 0,
                channel,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        return sessions.get(sessionId)!;
    }

    async chat(sessionId: string, userMessage: string, channel: "site" | "whatsapp" = "site"): Promise<string> {
        const session = await this.getOrCreateSession(sessionId, channel);

        const userTurns = session.messages.filter(m => m.role === "user").length;
        if (userTurns >= MAX_USER_TURNS) {
            return `Nossa conversa já está bem completa por aqui 😊 Para seguir, é só escolher um horário com o Maicon: ${this.bookingUrl}`;
        }

        session.messages.push({ role: "user", content: userMessage.slice(0, MAX_USER_MESSAGE_CHARS) });
        session.updatedAt = new Date();

        // Lead pediu para marcar: a própria resposta já oferece os horários
        if (session.stage === "presenter" && SCHEDULING_INTENT.some(k => userMessage.toLowerCase().includes(k))) {
            session.stage = "scheduler";
        }

        const days = session.stage === "scheduler" ? await this.schedulerDays() : [];

        const input = [
            { role: "system" as const, content: this.getSystemPrompt(session, days) },
            ...session.messages.map(m => ({ role: m.role, content: m.content })),
        ];

        let reply: string;
        let qualification: QualificationResult | null = null;

        try {
            if (session.stage === "qualifier") {
                const response = await this.getClient().responses.parse({
                    model: this.model,
                    input,
                    reasoning: { effort: "low" },
                    max_output_tokens: MAX_OUTPUT_TOKENS,
                    text: { format: zodTextFormat(QualifierOutput, "resposta_vick") },
                });
                const parsed = response.output_parsed;
                reply = parsed?.mensagem?.trim() || "";
                qualification = parsed?.qualificacao ?? null;
            } else if (session.stage === "scheduler" && days.length > 0) {
                const response = await this.getClient().responses.parse({
                    model: this.model,
                    input,
                    reasoning: { effort: "low" },
                    max_output_tokens: MAX_OUTPUT_TOKENS,
                    text: { format: zodTextFormat(this.schedulerSchema(days), "agendamento_vick") },
                });
                const parsed = response.output_parsed;
                reply = parsed?.agendamento
                    ? await this.bookFromChat(session, parsed.agendamento)
                    : parsed?.mensagem?.trim() || "";
            } else {
                const response = await this.getClient().responses.create({
                    model: this.model,
                    input,
                    reasoning: { effort: "low" },
                    max_output_tokens: MAX_OUTPUT_TOKENS,
                });
                reply = response.output_text.trim();
            }
        } catch (err) {
            // Não deixa a mensagem do lead sem par no histórico
            session.messages.pop();
            throw err;
        }

        if (!reply) {
            session.messages.pop();
            throw new Error("Resposta vazia do modelo");
        }

        session.messages.push({ role: "assistant", content: reply });

        await this.detectStageTransition(session, reply, qualification);

        return reply;
    }

    private async detectStageTransition(
        session: Session,
        reply: string,
        qualification: QualificationResult | null,
    ): Promise<void> {
        if (session.stage === "qualifier" && qualification) {
            session.leadData = qualification.dados;
            session.score = qualification.score;
            session.stage = qualification.proximo_agente;
            console.log(`[Vick] Lead ${session.id} qualificado. Score: ${qualification.score}. Próximo: ${qualification.proximo_agente}`);

            const d = qualification.dados;
            await appendLead({
                Canal: session.channel === "whatsapp" ? "Vick (WhatsApp)" : "Vick (chat do site)",
                Nome: d.nome_lead || "",
                Empresa: d.empresa || "",
                Setor: d.setor || "",
                Telefone: this.whatsAppPhone(session) || "",
                "Desafio / mensagem": d.dor_principal || "",
                "Tem dados": d.tem_dados || "",
                "Urgência": d.urgencia || "",
                "Orçamento": d.orcamento || "",
                Score: qualification.score,
                Qualificado: qualification.qualificado ? "Sim" : "Não",
            });
            return;
        }

        // Sem Google configurado a Vick só consegue mandar o link da agenda
        if (session.stage === "scheduler" && !isGoogleConfigured() && reply.includes(this.bookingUrl)) {
            session.stage = "closed";
            console.log(`[Vick] Lead ${session.id} enviado para agendamento pelo link.`);
        }
    }

    private whatsAppPhone(session: Session): string | null {
        return session.channel === "whatsapp" ? session.id.replace("whatsapp_", "") : null;
    }

    // Link da agenda com os dados já coletados, para o lead não digitar de novo
    private personalBookingUrl(session: Session): string {
        const params = new URLSearchParams({ origem: session.channel === "whatsapp" ? "whatsapp" : "vick" });
        if (session.leadData.nome_lead) params.set("nome", session.leadData.nome_lead);
        if (session.leadData.empresa) params.set("empresa", session.leadData.empresa);
        const phone = this.whatsAppPhone(session);
        if (phone) params.set("telefone", phone);
        return `${this.bookingUrl}?${params.toString()}`;
    }

    getSession(sessionId: string): Session | undefined {
        return sessions.get(sessionId);
    }

    deleteSession(sessionId: string): void {
        sessions.delete(sessionId);
    }

    getInitialMessage(): string {
        return INITIAL_MESSAGE;
    }

    // Remove sessões inativas; roda no máximo a cada 10 minutos, aproveitando as requisições
    private maybeCleanup(): void {
        if (Date.now() - this.lastCleanup < CLEANUP_INTERVAL_MS) return;
        this.lastCleanup = Date.now();
        this.cleanupSessions();
    }

    cleanupSessions(): void {
        const cutoff = new Date(Date.now() - SESSION_TTL_MS);
        for (const [id, session] of Array.from(sessions.entries())) {
            if (session.updatedAt < cutoff) {
                sessions.delete(id);
            }
        }
    }
}

export const ada = new Vick();
