// Agente de Conteúdo: transforma os temas da estratégia aprovada em artigos de blog (SEO)
// Cada artigo fica "Aguardando aprovação"; só "Aprovado"/"Publicado" aparece em /blog.

import { z } from "zod/v4"; // o helper de saída estruturada da Anthropic usa Zod 4
import { COMPANY_CONTEXT } from "./company";
import { CONTENT_MODEL, generateStructured } from "./anthropic";
import { notifyOwner } from "./notify";
import { appendContent, CONTENT_SHEET, readSheet, STATUS, STRATEGY_SHEET } from "./workspace";

const ARTICLES_PER_RUN = Number(process.env.MARKETING_ARTICLES_PER_RUN || 2);

const PlanSchema = z.object({
    escolhidos: z.array(z.object({
        titulo: z.string(),
        palavra_chave: z.string(),
        setor: z.string(),
        dor: z.string(),
    })),
});

const ArticleSchema = z.object({
    titulo: z.string().describe("Título do artigo, até 65 caracteres, com a palavra-chave"),
    slug: z.string().describe("Endereço em minúsculas, sem acentos, palavras separadas por hífen"),
    meta_description: z.string().describe("Descrição para o Google, 140 a 155 caracteres"),
    resumo: z.string().describe("Resumo de 1 a 2 frases para a lista do blog"),
    markdown: z.string().describe("Corpo do artigo em Markdown, sem o título H1"),
});

export type Article = z.infer<typeof ArticleSchema>;

const SYSTEM = `Você é o redator de conteúdo da Adone Intelligence, especialista em SEO e em explicar IA para
gestores de empresas médias no Brasil.

${COMPANY_CONTEXT}

REGRAS DO ARTIGO:
- Público: diretores e gestores (operações, finanças, comercial, TI) de empresas com 50+ funcionários.
- 1.200 a 1.800 palavras, em português do Brasil, parágrafos curtos, subtítulos ## e ### (sem H1).
- Use a palavra-chave no primeiro parágrafo e em pelo menos um subtítulo, de forma natural.
- Explique conceitos sem jargão; quando usar um termo técnico, explique em uma frase.
- Estrutura sugerida: o problema de negócio → como a IA/ML resolve → o que é preciso (dados, prazo,
  equipe) → como começar → erros comuns.
- Termine com uma seção "Próximo passo" convidando para o diagnóstico de 30 minutos em
  https://adoneintelligence.com.br/agendar (um único convite, sem pressão).
- Nada de números, clientes ou estudos inventados; exemplos hipotéticos devem ser marcados como tal.`;

function slugify(text: string): string {
    return text
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

export async function runContent(): Promise<Article[]> {
    const [strategies, contents] = await Promise.all([
        readSheet(STRATEGY_SHEET).catch(() => []),
        readSheet(CONTENT_SHEET).catch(() => []),
    ]);
    const strategy = [...strategies].reverse().find(r => r.Status === STATUS.approved);
    if (!strategy) {
        await notifyOwner("✍️ O agente de Conteúdo não rodou: não há estratégia *Aprovada* na aba \"Estratégia\". Aprove uma estratégia para eu escrever os artigos.");
        return [];
    }

    const existing = contents.map(c => `- ${c.Título} (${c["Palavra-chave"]})`).join("\n") || "(nenhum artigo ainda)";
    const existingSlugs = new Set(contents.map(c => c.Slug));

    // Escolhe os temas ainda não escritos (respeita edições feitas pelo Maicon no texto da estratégia)
    const plan = await generateStructured({
        model: CONTENT_MODEL,
        effort: "low",
        system: "Você organiza a pauta de um blog. Responda só com o formato pedido.",
        prompt: [
            `Temas da estratégia aprovada (${strategy.Semana}):`,
            strategy["Temas de conteúdo"],
            strategy["Seus comentários"] ? `\nComentários do Maicon: ${strategy["Seus comentários"]}` : "",
            "\nArtigos já escritos:",
            existing,
            `\nEscolha até ${ARTICLES_PER_RUN} temas da estratégia que ainda NÃO foram escritos (não repita palavra-chave).`,
        ].join("\n"),
        schema: PlanSchema,
    });

    const articles: Article[] = [];
    for (const theme of plan.escolhidos.slice(0, ARTICLES_PER_RUN)) {
        const article = await generateStructured({
            model: CONTENT_MODEL,
            effort: "medium",
            system: SYSTEM,
            prompt: [
                `Escreva o artigo sobre: ${theme.titulo}`,
                `Palavra-chave principal: ${theme.palavra_chave}`,
                `Setor em foco: ${theme.setor}`,
                `Dor do leitor: ${theme.dor}`,
                `Posicionamento da semana: ${strategy.Posicionamento}`,
            ].join("\n"),
            schema: ArticleSchema,
        });

        let slug = slugify(article.slug || article.titulo);
        if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
        existingSlugs.add(slug);

        await appendContent({
            Tipo: "Artigo de blog",
            Título: article.titulo,
            Slug: slug,
            "Palavra-chave": theme.palavra_chave,
            Setor: theme.setor,
            "Meta description": article.meta_description,
            Resumo: article.resumo,
            "Texto (Markdown)": article.markdown,
            "Semana da estratégia": strategy.Semana,
        });
        articles.push({ ...article, slug });
    }

    if (articles.length) {
        await notifyOwner(
            `✍️ *${articles.length} artigo(s) novo(s) para revisão*\n\n` +
            articles.map(a => `• ${a.titulo}`).join("\n") +
            `\n\nRevise na aba "Conteúdo" (pode editar o texto direto na célula) e mude o Status para *Aprovado* para publicar no blog.`
        );
    }
    return articles;
}
