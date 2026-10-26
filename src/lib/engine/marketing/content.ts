// Agente de Conteúdo: cria a própria pauta e escreve artigos de blog (SEO), sem depender da estratégia
// Cada artigo já entra como "Publicado" e aparece em /blog; "Rejeitado" tira do ar.

import { z } from "zod";
import { COMPANY_CONTEXT } from "./company";
import { CONTENT_MODEL, generateStructured } from "./llm";
import { notifyOwner } from "./notify";
import { appendContent, CONTENT_SHEET, formatSheetDate, readSheet, STATUS } from "./workspace";
import { createCoverImage, imagesConfigured } from "./images";

const ARTICLES_PER_RUN = Number(process.env.MARKETING_ARTICLES_PER_RUN || 2);
const SITE_URL = process.env.SITE_URL || "https://adoneintelligence.com.br";

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
    imagem_tema: z.string().describe("Uma frase descrevendo a cena da imagem de capa (conceito visual do tema, sem texto na imagem)"),
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
- Escreva para quem vai DECIDIR e PAGAR, não para curiosos: aprofunde em custo, prazo, pré-requisitos,
  riscos e retorno — o que um diretor precisa para aprovar um projeto.
- Inclua, de forma natural, sinais que filtram quem não tem perfil: para quem a solução faz sentido (empresas
  médias, com dados em ERP/CRM e um problema de negócio mensurável) e que os projetos começam a partir de
  R$ 25 mil. Quem não tem perfil deve perceber isso lendo o artigo.
- Termine com uma seção "Próximo passo" convidando para o diagnóstico de 30 minutos em
  https://adoneintelligence.com.br/agendar, deixando claro que é para empresas com esse perfil
  (um único convite, sem pressão).
- Nada de números, clientes ou estudos inventados; exemplos hipotéticos devem ser marcados como tal.`;

function slugify(text: string): string {
    return text
        .normalize("NFD").replace(/[̀-ͯ]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

// focus: assuntos pedidos pelo Maicon no painel (ex.: "saúde; fraude") — um artigo por assunto.
// Sem focus, a própria pauta escolhe os temas: independe da aba "Estratégia".
export async function runContent(focus?: string): Promise<Article[]> {
    const topics = (focus || "").split(/[;\n]/).map(t => t.trim()).filter(Boolean).slice(0, 5);
    const contents = await readSheet(CONTENT_SHEET).catch(() => []);

    const existing = contents.map(c => `- ${c.Título} (${c["Palavra-chave"]}, ${c.Setor})`).join("\n") || "(nenhum artigo ainda)";
    const existingSlugs = new Set(contents.map(c => c.Slug));

    // Mesmo com tema pedido, sai no mínimo a quantidade padrão da rodada
    const limit = Math.max(topics.length, ARTICLES_PER_RUN);
    const plan = await generateStructured({
        model: CONTENT_MODEL,
        effort: "low",
        system: `Você organiza a pauta do blog de SEO da Adone Intelligence. Responda só com o formato pedido.\n\n${COMPANY_CONTEXT}`,
        prompt: topics.length ? [
            "O Maicon pediu artigos sobre os assuntos abaixo:",
            topics.map(t => `- ${t}`).join("\n"),
            "\nArtigos já escritos:",
            existing,
            `\nCrie exatamente ${limit} temas de artigo cobrindo todos esses assuntos. Se um assunto juntar setores ` +
            `(ex.: "Farmacêutica e Agronegócio"), faça um artigo para cada setor; se ainda sobrar vaga, use outro ângulo ` +
            `do mesmo assunto. Cada tema tem uma palavra-chave que um diretor de empresa média ` +
            `buscaria no Google ao considerar contratar IA para isso (não repita palavra-chave já usada). ` +
            `No campo setor, use um nome curto (ex.: "Saúde").`,
        ].join("\n") : [
            "Artigos já escritos:",
            existing,
            `\nCrie exatamente ${ARTICLES_PER_RUN} temas NOVOS de artigo, cada um com uma palavra-chave que um diretor de ` +
            `empresa média (50+ funcionários) buscaria no Google ao considerar contratar IA ou machine learning ` +
            `(custo, prazo, como contratar, casos de uso por setor, integração com ERP/CRM). ` +
            `Não repita palavra-chave nem assunto já escrito; varie o setor em relação aos artigos mais recentes. ` +
            `No campo setor, use um nome curto (ex.: "Saúde").`,
        ].join("\n"),
        schema: PlanSchema,
        name: "pauta_blog",
    });

    // Com tema pedido, sempre sai um artigo por assunto, mesmo se a pauta vier vazia
    const themes = topics.length && !plan.escolhidos.length
        ? topics.map(t => ({ titulo: `Inteligência artificial para ${t} em empresas médias`, palavra_chave: `inteligência artificial ${t}`, setor: t, dor: "" }))
        : plan.escolhidos;

    const articles: Article[] = [];
    for (const theme of themes.slice(0, limit)) {
        const article = await generateStructured({
            model: CONTENT_MODEL,
            effort: "medium",
            system: SYSTEM,
            prompt: [
                `Escreva o artigo sobre: ${theme.titulo}`,
                `Palavra-chave principal: ${theme.palavra_chave}`,
                `Setor em foco: ${theme.setor}`,
                `Dor do leitor: ${theme.dor}`,
            ].join("\n"),
            schema: ArticleSchema,
            name: "artigo_blog",
        });

        let slug = slugify(article.slug || article.titulo);
        if (existingSlugs.has(slug)) slug = `${slug}-${Date.now().toString(36)}`;
        existingSlugs.add(slug);

        // Capa gerada por IA; se falhar, o artigo segue sem imagem em vez de travar a rodada
        let imageId = "";
        if (imagesConfigured()) {
            try {
                imageId = await createCoverImage(article.imagem_tema, slug);
            } catch (err) {
                console.error(`[Marketing] Falha ao gerar a capa de "${article.titulo}":`, err);
            }
        }

        await appendContent({
            Tipo: "Artigo de blog",
            Título: article.titulo,
            Slug: slug,
            "Palavra-chave": theme.palavra_chave,
            Setor: theme.setor,
            "Meta description": article.meta_description,
            Resumo: article.resumo,
            "Texto (Markdown)": article.markdown,
            "Imagem (ID no Drive)": imageId,
            // Publicação automática: entra no blog assim que fica pronto (marcar "Rejeitado" tira do ar)
            Status: STATUS.published,
            "Publicar em": formatSheetDate(new Date()),
        });
        articles.push({ ...article, slug });
    }

    if (articles.length) {
        await notifyOwner(
            `✍️ *${articles.length} artigo(s) publicado(s) no blog*\n\n` +
            articles.map(a => `• ${a.titulo}\n  ${SITE_URL}/blog/${a.slug}`).join("\n") +
            `\n\nAparecem no site em até 10 minutos. Para tirar um do ar, marque o Status como *Rejeitado* na aba "Conteúdo".`
        );
    } else {
        await notifyOwner("✍️ O agente de Conteúdo rodou, mas não escreveu nenhum artigo. Peça um tema no painel (\"Rodar agora\").");
    }
    return articles;
}
