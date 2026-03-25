// Módulo 1 — Gerador de Conteúdo com IA
// Gera posts LinkedIn, artigos SEO e e-mails de nutrição

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type ContentType = "linkedin_post" | "seo_article" | "cold_email" | "nurture_email" | "whatsapp_message";

interface ContentRequest {
    type: ContentType;
    sector?: string;
    topic?: string;
    lead_name?: string;
    company_name?: string;
    pain_point?: string;
    tone?: "formal" | "casual" | "technical";
}

const CONTENT_PROMPTS: Record<ContentType, string> = {
    linkedin_post: `
Você é um especialista em marketing B2B para empresas de IA no Brasil.
Crie um post para o LinkedIn da Adone AI com as seguintes características:
- Começa com uma FRASE IMPACTANTE (sem "Você sabia que..." ou "Hoje vou falar sobre...")
- 3 a 5 parágrafos curtos (máximo 3 linhas cada)
- Tom: direto, confiante, baseado em dados reais
- Termina com uma pergunta que gera comentários
- Inclui 3-5 hashtags relevantes
- Máximo 1.300 caracteres
- NÃO use bullet points com • ou emojis excessivos
`,

    seo_article: `
Você é um especialista em SEO e marketing de conteúdo para empresas de tecnologia brasileiras.
Crie um artigo otimizado para SEO com:
- Título H1 com palavra-chave principal
- Introdução de 2 parágrafos (problema + solução)
- 5-7 seções H2 com conteúdo denso
- Exemplos reais com números
- CTA final para diagnóstico gratuito da Adone AI
- Tom: técnico mas acessível para tomadores de decisão
- 1.500 a 2.500 palavras
`,

    cold_email: `
Você é especialista em cold email B2B com foco em empresas de IA.
Crie um e-mail de prospecção fria com:
- Assunto: máximo 50 caracteres, personalizado com nome da empresa
- Parágrafo 1: observação específica sobre a empresa (use os dados fornecidos)
- Parágrafo 2: conexão com uma dor comum do setor + resultado que já geramos
- Parágrafo 3: CTA único e direto (30 minutos de diagnóstico gratuito)
- Tom: humano, direto, sem floreios corporativos
- Máximo 150 palavras no corpo
`,

    nurture_email: `
Você é especialista em e-mail marketing B2B para empresas de IA.
Crie um e-mail de nutrição para leads que ainda não estão prontos para comprar:
- Assunto curto e intrigante
- Conteúdo de valor (caso de uso, dado, insight do setor)
- Zero pitch de venda
- CTA suave: "Veja o caso completo" ou "Leia o estudo"
- Tom: educativo, próximo, sem pressão
- Máximo 200 palavras
`,

    whatsapp_message: `
Você é especialista em comunicação via WhatsApp para vendas B2B.
Crie uma mensagem de WhatsApp com:
- Tom informal mas profissional
- Máximo 3 parágrafos curtos
- Emojis usados com moderação (máximo 3)
- Sem formatação complexa
- CTA claro ao final
`,
};

export async function generateContent(request: ContentRequest): Promise<string> {
    const basePrompt = CONTENT_PROMPTS[request.type];

    const contextLines: string[] = [];
    if (request.sector) contextLines.push(`Setor: ${request.sector}`);
    if (request.topic) contextLines.push(`Tema/Tópico: ${request.topic}`);
    if (request.lead_name) contextLines.push(`Nome do lead: ${request.lead_name}`);
    if (request.company_name) contextLines.push(`Empresa: ${request.company_name}`);
    if (request.pain_point) contextLines.push(`Dor principal: ${request.pain_point}`);
    if (request.tone) contextLines.push(`Tom: ${request.tone}`);

    const userPrompt = contextLines.length > 0
        ? `CONTEXTO:\n${contextLines.join("\n")}\n\nGere o conteúdo agora.`
        : "Gere o conteúdo agora.";

    const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: basePrompt,
        messages: [{ role: "user", content: userPrompt }],
    });

    return response.content[0].type === "text" ? response.content[0].text : "";
}

// Gera calendário semanal de conteúdo para LinkedIn
export async function generateWeeklyContentCalendar(sector: string): Promise<string> {
    const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: `Você é um estrategista de conteúdo B2B especializado em IA para empresas brasileiras.
Crie um calendário de conteúdo semanal para o LinkedIn da Adone AI focado no setor de ${sector}.
Inclua: dia da semana, tema, gancho inicial, formato (texto/carrossel/vídeo), objetivo (alcance/engajamento/conversão).`,
        messages: [{
            role: "user",
            content: `Crie um calendário de 4 semanas de posts para o setor: ${sector}. Formato: tabela markdown.`,
        }],
    });

    return response.content[0].type === "text" ? response.content[0].text : "";
}
