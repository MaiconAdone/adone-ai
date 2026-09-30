// Agente de publicações da página da Adone no LinkedIn (seg, qua e sex, 9h).
// Cada post fala de um setor e, quando possível, traz UM dado de estudo publicado sobre o efeito de IA/ML
// no faturamento, nos custos ou nas decisões — com a fonte citada. O número só entra se aparecer de fato
// na página da fonte; sem essa confirmação, o post sai sem número (regra: nunca inventar estatística).

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { appendRow, nowLabel } from "../agenda/sheets";
import { COMPANY_CONTEXT } from "../marketing/company";
import { createLinkedInImage } from "../marketing/images";
import { CONTENT_MODEL } from "../marketing/llm";
import { notifyOwner } from "../marketing/notify";
import { ensureSheet, readSheet } from "../marketing/workspace";
import { daysUntilExpiry, getConnection } from "./connection";
import { postToLinkedIn } from "./poster";

export const SECTORS = ["varejo", "logística", "serviços financeiros", "saúde", "indústria", "educação"] as const;

const LOG_SHEET = "LinkedIn";
const LOG_HEADERS = ["Publicado em", "Setor", "Dado", "Fonte", "Link da fonte", "Texto", "ID do post"] as const;

const PostSchema = z.object({
    dado: z.object({
        numero: z.string().describe('O número exatamente como aparece na fonte, ex.: "20%" ou "3,5 pontos percentuais"'),
        afirmacao: z.string().describe("A afirmação do estudo em português, fiel ao original, em uma frase"),
        fonte: z.string().describe('Organização e título do estudo, ex.: "McKinsey — The State of AI"'),
        ano: z.string(),
        url: z.string().describe("Endereço da página onde o número aparece"),
    }).nullable().describe("null quando não houver estudo confiável com o número na página"),
    titulo_imagem: z.string().describe("Descrição curta da cena para a imagem do post (ambiente do setor, sem texto na imagem), até 120 caracteres"),
    texto: z.string().describe("Texto do post, sem a linha de fonte (ela é adicionada depois)"),
});
type Post = z.infer<typeof PostSchema>;

let client: OpenAI | null = null;
function openai(): OpenAI {
    if (!client) {
        const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
        if (!apiKey) throw new Error("OPENAI_API_KEY ausente");
        client = new OpenAI({ apiKey });
    }
    return client;
}

const SYSTEM = `Você escreve os posts da página da Adone Intelligence no LinkedIn.
${COMPANY_CONTEXT}

REGRAS DO POST:
- Público: diretores, sócios e gestores (TI, operações, finanças) de médias empresas brasileiras.
- Português do Brasil, tom "IA sem mistério": direto, sem jargão, focado em resultado de negócio.
- 900 a 1.300 caracteres. Primeira linha forte (sem "Você sabia"). Parágrafos curtos. Sem listas com emoji.
- Conecte o setor a usos concretos de IA/ML para decisão (previsão de demanda, inadimplência, churn,
  preço, manutenção, qualidade, atendimento) e ao que isso significa para o faturamento ou a margem.
- Termine com um convite discreto ao diagnóstico de 30 minutos (pelo site adoneintelligence.com.br ou
  falando com a Vick no WhatsApp) e 3 hashtags.
- Nunca invente clientes, cases, depoimentos ou números. Não prometa resultado.`;

async function research(sector: string, withData: boolean, rejectedUrls: string[] = []): Promise<Post> {
    const rejected = rejectedUrls.length
        ? `
Não use estas páginas (o número não foi encontrado nelas): ${rejectedUrls.join(", ")}. Procure outro estudo.`
        : "";
    const task = withData
        ? `Setor do post: ${sector}.
Pesquise na web UM dado de estudo publicado por organização reconhecida (ex.: McKinsey, BCG, Gartner, IBM,
Deloitte, PwC, Accenture, IDC, MIT, Stanford AI Index, OCDE, FGV, CNI, Febraban — evite mckinsey.com, que bloqueia a conferência automática) sobre o efeito da adoção de
IA/Machine Learning em empresas do setor ${sector} — de preferência sobre faturamento/receita, senão custos ou
qualidade das decisões. Copie o número exatamente como está na fonte e informe o endereço da página em que
ele aparece (não a home do site). Prefira estudos dos últimos 3 anos. Se não encontrar um dado confiável,
devolva "dado" como null e escreva o post sem números.
Escreva o post usando o dado (se houver) como gancho, sem citar a fonte no texto — ela vai numa linha à parte.${rejected}`
        : `Setor do post: ${sector}.
Escreva o post SEM nenhum número, porcentagem ou estatística (devolva "dado" como null).`;

    const response = await openai().responses.parse({
        model: CONTENT_MODEL,
        reasoning: { effort: "medium" },
        max_output_tokens: 16000,
        ...(withData ? { tools: [{ type: "web_search" as const }] } : {}),
        input: [
            { role: "system", content: SYSTEM },
            { role: "user", content: task },
        ],
        text: { format: zodTextFormat(PostSchema, "linkedin_post") },
    });
    if (!response.output_parsed) throw new Error("O modelo não devolveu o post no formato esperado");
    return response.output_parsed;
}

// Confere se o número citado aparece na página da fonte (HTML); PDFs e páginas que bloqueiam robôs não passam
async function numberAppearsInSource(dado: NonNullable<Post["dado"]>): Promise<boolean> {
    const digits = dado.numero.match(/\d+(?:[.,]\d+)?/)?.[0];
    if (!digits || !/^https?:\/\//.test(dado.url)) return false;
    try {
        const res = await fetch(dado.url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
                Accept: "text/html",
            },
            signal: AbortSignal.timeout(15_000),
            redirect: "follow",
        });
        if (!res.ok || !(res.headers.get("content-type") || "").includes("text/html")) return false;
        const text = (await res.text()).replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ").toLowerCase();
        // A frase exata ("6 in 10", "2 to 5 percent") ou o número colado a % / percent / pontos
        if (text.includes(dado.numero.toLowerCase().replace(/\s+/g, " ").trim())) return true;
        const alt = digits.includes(",") ? digits.replace(",", ".") : digits.replace(".", ",");
        return [digits, alt].some(d => new RegExp(`(^|[^\d.,])${d.replace(".", "\.")}\s?(%|percent|por cento|pontos|p\.p\.)`).test(text));
    } catch {
        return false;
    }
}

// A busca na web devolve citações em markdown, ex.: "([deloitte.com](https://...))"; o LinkedIn não renderiza markdown
function stripCitations(value: string): string {
    return value
        .replace(/\s*\(\[[^\]]*\]\([^)]*\)\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .trim();
}

async function nextSector(): Promise<string> {
    const rows = await readSheet(LOG_SHEET).catch(() => []);
    const last = rows.at(-1)?.Setor;
    const index = SECTORS.indexOf(last as (typeof SECTORS)[number]);
    return SECTORS[(index + 1) % SECTORS.length];
}

// Gera o post (sem publicar): pesquisa o dado e só o mantém se o número aparecer na fonte
export async function draftLinkedInPost(sector: string): Promise<{ post: Post; dado: Post["dado"]; text: string }> {
    // Até duas fontes diferentes; se nenhuma confirmar o número, o post sai sem números
    const rejected: string[] = [];
    let post = await research(sector, true);
    let verified = false;
    while (post.dado && !(verified = await numberAppearsInSource(post.dado))) {
        console.log(`[LinkedIn] Número "${post.dado.numero}" não confirmado em ${post.dado.url}`);
        rejected.push(post.dado.url);
        post = rejected.length < 2 ? await research(sector, true, rejected) : await research(sector, false);
    }
    const dado = verified && post.dado ? { ...post.dado, fonte: stripCitations(post.dado.fonte) } : null;
    // A fonte entra antes das hashtags finais
    const body = stripCitations(post.texto);
    const hashtags = body.match(/\n\s*((?:#[\p{L}\p{N}_]+\s*)+)$/u);
    const main = hashtags ? body.slice(0, hashtags.index).trimEnd() : body;
    const source = dado ? `\n\nFonte: ${dado.fonte} (${dado.ano}) — ${dado.url}` : "";
    const text = `${main}${source}${hashtags ? `\n\n${hashtags[1].trim()}` : ""}`;
    return { post, dado, text };
}

export async function runLinkedInPost(focus?: string): Promise<string> {
    const connection = await getConnection();
    const days = daysUntilExpiry(connection);
    if (days !== null && days <= 7 && days >= 0) {
        await notifyOwner(`🔑 A conexão com a página do LinkedIn expira em ${days} dia(s). Renove em ${process.env.SITE_URL || ""}/painel → "Conectar LinkedIn".`).catch(() => undefined);
    }

    await ensureSheet(LOG_SHEET, LOG_HEADERS);
    const sector = focus?.trim() || await nextSector();

    const { post, dado, text } = await draftLinkedInPost(sector);
    const image = await createLinkedInImage(`${post.titulo_imagem} (setor: ${sector})`).catch(err => {
        console.error("[LinkedIn] Falha ao gerar imagem; publicando só texto:", err);
        return null;
    });

    const postId = await postToLinkedIn(text, image);
    await appendRow(LOG_SHEET, LOG_HEADERS, {
        "Publicado em": nowLabel(),
        Setor: sector,
        Dado: dado ? `${dado.numero} — ${dado.afirmacao}` : "(sem número)",
        Fonte: dado ? `${dado.fonte} (${dado.ano})` : "",
        "Link da fonte": dado?.url ?? "",
        Texto: text,
        "ID do post": postId,
    });
    return `Post publicado na página (${sector}${dado ? `, dado: ${dado.numero} — ${dado.fonte}` : ", sem número"})`;
}
