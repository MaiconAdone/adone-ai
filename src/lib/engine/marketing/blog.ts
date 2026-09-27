// Leitura dos artigos aprovados (aba "Conteúdo") para o blog do site

import { CONTENT_SHEET, readSheet, STATUS } from "./workspace";

export interface BlogPost {
    title: string;
    slug: string;
    description: string;
    excerpt: string;
    keyword: string;
    sector: string;
    markdown: string;
    date: string; // "25/09/2026"
}

const VISIBLE = new Set<string>([STATUS.approved, STATUS.published]);

export async function getPublishedPosts(): Promise<BlogPost[]> {
    try {
        const rows = await readSheet(CONTENT_SHEET);
        return rows
            .filter(r => VISIBLE.has(r.Status) && r.Tipo === "Artigo de blog" && r.Slug && r["Texto (Markdown)"])
            .map(r => ({
                title: r.Título,
                slug: r.Slug,
                description: r["Meta description"],
                excerpt: r.Resumo,
                keyword: r["Palavra-chave"],
                sector: r.Setor,
                markdown: r["Texto (Markdown)"],
                date: (r["Criado em"] || "").split(",")[0],
            }))
            .reverse(); // mais recentes primeiro
    } catch (err) {
        // Sem Google (ex.: build local) o blog fica vazio em vez de quebrar a página
        console.error("[Blog] Não foi possível ler os artigos:", err);
        return [];
    }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    return (await getPublishedPosts()).find(p => p.slug === slug) ?? null;
}
