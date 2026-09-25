// Vick — Orquestradora principal do chatbot
// Gerencia sessões, troca entre agentes e mantém histórico

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { QUALIFIER_SYSTEM_PROMPT, LeadData, QualificationResult } from "./agents/qualifier";
import { PRESENTER_SYSTEM_PROMPT, buildPresenterContext } from "./agents/presenter";
import { SCHEDULER_SYSTEM_PROMPT, getSchedulerContext } from "./agents/scheduler";
import { FOLLOWUP_SYSTEM_PROMPT } from "./agents/followup";
import { upsertContact, addNote } from "../crm/hubspot";

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
    createdAt: Date;
    updatedAt: Date;
}

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
const SCHEDULING_INTENT = ["agendar", "agenda", "marcar", "reunião", "reuniao", "call", "terça", "terca", "quinta", "sábado", "sabado", "pode ser", "vamos", "topo", "quero"];

// Armazenamento em memória (substituir por Redis se houver mais de uma instância)
const sessions = new Map<string, Session>();

export class Vick {
    private client: OpenAI | null = null;
    private model: string;
    private bookingUrl: string;
    private lastCleanup = Date.now();

    constructor() {
        this.model = process.env.OPENAI_MODEL || "gpt-6-luna";
        this.bookingUrl = process.env.BOOKING_URL || "https://cal.com/maicon-adone/diagnostico";
    }

    // Cliente criado sob demanda para o build não exigir a chave
    private getClient(): OpenAI {
        if (!this.client) this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return this.client;
    }

    private getSystemPrompt(session: Session): string {
        switch (session.stage) {
            case "qualifier":
                return QUALIFIER_SYSTEM_PROMPT;
            case "presenter":
                return PRESENTER_SYSTEM_PROMPT + "\n\n" + buildPresenterContext(session.leadData);
            case "scheduler":
            case "closed":
                return SCHEDULER_SYSTEM_PROMPT + "\n\n" + getSchedulerContext(session.leadData, this.bookingUrl);
            case "followup":
                return FOLLOWUP_SYSTEM_PROMPT;
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

        const input = [
            { role: "system" as const, content: this.getSystemPrompt(session) },
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

        await this.detectStageTransition(session, userMessage, reply, qualification);

        return reply;
    }

    private async detectStageTransition(
        session: Session,
        userMessage: string,
        reply: string,
        qualification: QualificationResult | null,
    ): Promise<void> {
        if (session.stage === "qualifier" && qualification) {
            session.leadData = qualification.dados;
            session.score = qualification.score;
            session.stage = qualification.proximo_agente;
            console.log(`[Vick] Lead ${session.id} qualificado. Score: ${qualification.score}. Próximo: ${qualification.proximo_agente}`);

            const isWhatsApp = session.channel === "whatsapp";
            const contactId = await upsertContact({
                name: qualification.dados.nome_lead || (isWhatsApp ? "Lead WhatsApp" : "Lead Site"),
                phone: isWhatsApp ? session.id.replace("whatsapp_", "") : undefined,
                company: qualification.dados.empresa,
                sector: qualification.dados.setor,
                score: qualification.score,
                source: session.channel,
                notes: `Lead qualificado pela Vick. Score: ${qualification.score}. Canal: ${session.channel}.`,
            });
            if (contactId) {
                await addNote(contactId, `Conversa com a Vick:\nDesafio: ${qualification.dados.dor_principal || "não informado"}\nUrgência: ${qualification.dados.urgencia || "não informada"}`);
            }
            return;
        }

        if (session.stage === "presenter") {
            const text = userMessage.toLowerCase();
            if (SCHEDULING_INTENT.some(k => text.includes(k))) {
                session.stage = "scheduler";
            }
            return;
        }

        if (session.stage === "scheduler" && reply.includes(this.bookingUrl)) {
            session.stage = "closed";
            console.log(`[Vick] Lead ${session.id} enviado para agendamento.`);
        }
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
