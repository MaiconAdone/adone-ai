// Chamadas à OpenAI para os agentes de marketing, com saída estruturada (Zod).
// Modelo mais forte para decisões/análises (Estrategista, 1x por semana) e intermediário para conteúdo.

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import type { z } from "zod";

export const STRATEGY_MODEL = process.env.MARKETING_STRATEGY_MODEL || "gpt-6-astra";
export const CONTENT_MODEL = process.env.MARKETING_CONTENT_MODEL || "gpt-6-sol";

let client: OpenAI | null = null;

function getClient(): OpenAI {
    if (!client) {
        // Tolera espaços, quebras de linha e aspas coladas junto ao valor no painel de hospedagem
        const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
        if (!apiKey) throw new Error("OPENAI_API_KEY ausente");
        client = new OpenAI({ apiKey });
    }
    return client;
}

interface StructuredRequest<T extends z.ZodTypeAny> {
    model: string;
    effort: "low" | "medium" | "high";
    system: string;
    prompt: string;
    schema: T;
    name: string;
    maxOutputTokens?: number;
}

// Texto livre (posts, e-mails, calendários) — usado pelo gerador de conteúdo legado
export async function generateText(req: { model?: string; effort?: "low" | "medium" | "high"; system: string; prompt: string }): Promise<string> {
    const response = await getClient().responses.create({
        model: req.model ?? CONTENT_MODEL,
        reasoning: { effort: req.effort ?? "low" },
        max_output_tokens: 8000,
        input: [
            { role: "system", content: req.system },
            { role: "user", content: req.prompt },
        ],
    });
    return response.output_text.trim();
}

export async function generateStructured<T extends z.ZodTypeAny>(req: StructuredRequest<T>): Promise<z.infer<T>> {
    const response = await getClient().responses.parse({
        model: req.model,
        reasoning: { effort: req.effort },
        // Inclui o raciocínio do modelo: margem folgada para artigos longos
        max_output_tokens: req.maxOutputTokens ?? 32000,
        input: [
            { role: "system", content: req.system },
            { role: "user", content: req.prompt },
        ],
        text: { format: zodTextFormat(req.schema, req.name) },
    });

    if (response.status === "incomplete") {
        throw new Error(`Resposta incompleta (${response.incomplete_details?.reason ?? "motivo desconhecido"})`);
    }
    if (!response.output_parsed) {
        throw new Error("Resposta sem o formato estruturado esperado");
    }
    console.log(`[Marketing] ${req.model}: ${response.usage?.input_tokens ?? 0} tokens de entrada, ${response.usage?.output_tokens ?? 0} de saída`);
    return response.output_parsed as z.infer<T>;
}
