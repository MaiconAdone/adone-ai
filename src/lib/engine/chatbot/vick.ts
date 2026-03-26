// Vick — Orquestradora principal do chatbot
// Gerencia sessões, troca entre agentes e mantém histórico

import Anthropic from "@anthropic-ai/sdk";
import { QUALIFIER_SYSTEM_PROMPT, LeadData, QualificationResult } from "./agents/qualifier";
import { PRESENTER_SYSTEM_PROMPT, buildPresenterContext } from "./agents/presenter";
import { SCHEDULER_SYSTEM_PROMPT, getSchedulerContext } from "./agents/scheduler";
import { FOLLOWUP_SYSTEM_PROMPT, buildFollowupSequence } from "./agents/followup";
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

// Armazenamento em memória (substituir por Redis em produção)
const sessions = new Map<string, Session>();

export class Vick {
    private client: Anthropic;
    private bookingUrl: string;

    constructor() {
        this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        this.bookingUrl = process.env.BOOKING_URL || "https://cal.com/maicon-adone/diagnostico";
    }

    private getSystemPrompt(session: Session): string {
        switch (session.stage) {
            case "qualifier":
                return QUALIFIER_SYSTEM_PROMPT;
            case "presenter":
                return PRESENTER_SYSTEM_PROMPT + "\n\n" + buildPresenterContext(session.leadData);
            case "scheduler":
                return SCHEDULER_SYSTEM_PROMPT + "\n\n" + getSchedulerContext(session.leadData, this.bookingUrl);
            case "followup":
                return FOLLOWUP_SYSTEM_PROMPT;
            default:
                return QUALIFIER_SYSTEM_PROMPT;
        }
    }

    async getOrCreateSession(sessionId: string, channel: "site" | "whatsapp" = "site"): Promise<Session> {
        if (!sessions.has(sessionId)) {
            const session: Session = {
                id: sessionId,
                stage: "qualifier",
                messages: [],
                leadData: {},
                score: 0,
                channel,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            sessions.set(sessionId, session);

            // Mensagem inicial da Vick
            const initialMessage = "Olá! Sou a Vick, assistente da Adone AI 👋\n\nAntes de qualquer coisa — o que trouxe você aqui hoje? Qual é o maior desafio operacional da sua empresa no momento?";
            session.messages.push({ role: "assistant", content: initialMessage });
        }
        return sessions.get(sessionId)!;
    }

    async chat(sessionId: string, userMessage: string, channel: "site" | "whatsapp" = "site"): Promise<string> {
        const session = await this.getOrCreateSession(sessionId, channel);
        session.messages.push({ role: "user", content: userMessage });
        session.updatedAt = new Date();

        const systemPrompt = this.getSystemPrompt(session);

        const response = await this.client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 1024,
            system: systemPrompt,
            messages: session.messages.map(m => ({ role: m.role, content: m.content })),
        });

        const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "";
        session.messages.push({ role: "assistant", content: assistantMessage });

        // Detectar transições de agente
        await this.detectStageTransition(session, assistantMessage);

        return assistantMessage;
    }

    private async detectStageTransition(session: Session, lastResponse: string): Promise<void> {
        // Qualificador retornou JSON → processar resultado
        if (session.stage === "qualifier" && lastResponse.includes('"qualificado"')) {
            try {
                const jsonMatch = lastResponse.match(/\{[\s\S]*"qualificado"[\s\S]*\}/);
                if (jsonMatch) {
                    const result: QualificationResult = JSON.parse(jsonMatch[0]);
                    session.leadData = result.dados;
                    session.score = result.score;
                    session.stage = result.proximo_agente;
                    console.log(`[Vick] Lead ${session.id} qualificado. Score: ${result.score}. Próximo: ${result.proximo_agente}`);

                    // Salvar lead no HubSpot automaticamente
                    const contactId = await upsertContact({
                        name: result.dados.nome_lead || "Lead WhatsApp",
                        phone: session.id.replace("whatsapp_", ""),
                        company: result.dados.empresa,
                        sector: result.dados.setor,
                        score: result.score,
                        source: session.channel,
                        notes: `Lead qualificado pela Vick. Score: ${result.score}. Canal: ${session.channel}.`,
                    });
                    if (contactId) {
                        await addNote(contactId, `Conversa com a Vick:\nDesafio: ${result.dados.dor_principal || "não informado"}\nUrgência: ${result.dados.urgencia || "não informada"}`);
                    }
                }
            } catch {
                // JSON malformado — manter no qualificador
            }
        }

        // Detectar se lead quer agendar (palavras-chave)
        if (session.stage === "presenter") {
            const agendaKeywords = ["terça", "quinta", "sábado", "sabado", "agendar", "quero", "sim", "pode ser", "topo", "vamos"];
            const hasInterest = agendaKeywords.some(k => lastResponse.toLowerCase().includes(k));
            if (hasInterest) {
                session.stage = "scheduler";
            }
        }

        // Detectar confirmação de agendamento
        if (session.stage === "scheduler" && lastResponse.includes(this.bookingUrl)) {
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
        return "Olá! Sou a Vick, assistente da Adone AI 👋\n\nAntes de qualquer coisa — o que trouxe você aqui hoje? Qual é o maior desafio operacional da sua empresa no momento?";
    }

    // Limpar sessões antigas (rodar a cada hora)
    cleanupSessions(): void {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        for (const [id, session] of Array.from(sessions.entries())) {
            if (session.updatedAt < oneHourAgo && session.stage !== "closed") {
                sessions.delete(id);
            }
        }
    }
}

export const ada = new Vick();
