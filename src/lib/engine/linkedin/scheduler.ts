// LinkedIn Scheduler — gera e posta automaticamente 3x por semana
// Seg, Qua, Sex às 9h (horário de Brasília)

import { generateContent } from "../marketing/content-generator";
import { postToLinkedIn } from "./poster";

const SECTORS = ["varejo", "logística", "financeiro", "saúde", "indústria"];
const POST_TYPES = [
    { type: "educativo", day: "segunda" },
    { type: "case",      day: "quarta"  },
    { type: "cta",       day: "sexta"   },
];

// Tópicos rotativos para variar o conteúdo
const TOPICS: Record<string, string[]> = {
    educativo: [
        "como Machine Learning reduz custos operacionais",
        "3 sinais de que sua empresa está pronta para IA",
        "diferença entre IA generativa e IA preditiva nos negócios",
        "por que empresas que usam dados crescem 2x mais rápido",
        "automação inteligente vs automação tradicional",
    ],
    case: [
        "redução de no-show com IA preditiva em clínica de saúde",
        "otimização de rotas com ML em empresa de logística",
        "previsão de demanda salvando estoque no varejo",
        "manutenção preditiva reduzindo paradas na indústria",
        "chatbot IA triplicando atendimentos sem aumentar equipe",
    ],
    cta: [
        "diagnóstico gratuito de IA para sua empresa",
        "60 minutos para descobrir onde a IA gera resultado no seu negócio",
        "como começar com IA sem investimento alto",
    ],
};

function getTopicForToday(postType: string): string {
    const topics = TOPICS[postType] || TOPICS.educativo;
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return topics[dayOfYear % topics.length];
}

function getSectorForToday(): string {
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return SECTORS[dayOfYear % SECTORS.length];
}

export async function generateAndPost(): Promise<{ success: boolean; postId?: string | null; content?: string }> {
    const now = new Date();
    const day = now.toLocaleDateString("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" });

    // Determinar tipo de post pelo dia da semana
    let postType = "educativo";
    if (day.includes("quarta")) postType = "case";
    if (day.includes("sexta")) postType = "cta";

    const topic = getTopicForToday(postType);
    const sector = getSectorForToday();

    console.log(`[LinkedIn Scheduler] Gerando post: tipo=${postType}, setor=${sector}, tópico=${topic}`);

    try {
        const content = await generateContent({
            type: "linkedin_post",
            sector,
            topic,
        });

        const postId = await postToLinkedIn(content);

        return { success: !!postId, postId, content };
    } catch (err) {
        console.error("[LinkedIn Scheduler] Erro:", err);
        return { success: false };
    }
}
