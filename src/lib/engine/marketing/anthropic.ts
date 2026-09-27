// Chamadas à API da Anthropic para os agentes de marketing, com saída estruturada (Zod).
// Opus para decisões/análises (Estrategista, 1x por semana) e Sonnet para produção de conteúdo.

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod/v4";

export const STRATEGY_MODEL = process.env.MARKETING_STRATEGY_MODEL || "claude-opus-5-5";
export const CONTENT_MODEL = process.env.MARKETING_CONTENT_MODEL || "claude-sonnet-5";

let client: Anthropic | null = null;

function getClient(): Anthropic {
    if (!client) {
        const apiKey = process.env.ANTHROPIC_API_KEY?.trim().replace(/^["']|["']$/g, "");
        if (!apiKey) throw new Error("ANTHROPIC_API_KEY ausente");
        client = new Anthropic({ apiKey });
    }
    return client;
}

interface StructuredRequest<T extends z.ZodTypeAny> {
    model: string;
    effort: "low" | "medium" | "high" | "xhigh";
    system: string;
    prompt: string;
    schema: T;
    maxTokens?: number;
}

export async function generateStructured<T extends z.ZodTypeAny>(req: StructuredRequest<T>): Promise<z.infer<T>> {
    // Streaming: respostas longas (artigos, pensamento adaptativo) sem estourar o timeout HTTP
    const stream = getClient().messages.stream({
        model: req.model,
        max_tokens: req.maxTokens ?? 32000,
        system: req.system,
        // O helper do SDK 0.91 declara tipos do Zod 3, mas em execução usa Zod 4 (zod/v4) —
        // por isso os schemas são Zod 4 e o tipo é ajustado aqui; parsed_output continua validado
        output_config: { effort: req.effort, format: zodOutputFormat(req.schema as unknown as Parameters<typeof zodOutputFormat>[0]) },
        messages: [{ role: "user", content: req.prompt }],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") {
        throw new Error(`Modelo recusou a tarefa (${message.stop_details?.category ?? "sem categoria"})`);
    }
    if (message.stop_reason === "max_tokens") {
        throw new Error("Resposta cortada por limite de tokens");
    }
    if (!message.parsed_output) {
        throw new Error("Resposta sem o formato estruturado esperado");
    }
    console.log(`[Marketing] ${req.model}: ${message.usage.input_tokens} tokens de entrada, ${message.usage.output_tokens} de saída`);
    return message.parsed_output as z.infer<T>;
}
