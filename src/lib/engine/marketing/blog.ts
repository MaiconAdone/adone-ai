// Leitura dos artigos publicados (aba "Conteúdo") para o blog do site.
// Publicação automática: "Aguardando aprovação" vai ao ar quando passa o "Publicar em";
// "Rejeitado" nunca aparece.

import {
    CONTENT_HEADERS, CONTENT_SHEET, parseSheetDate, readSheet, SheetRow, STATUS, updateCell,
} from "./workspace";

export interface BlogPost {
    title: string;
    slug: string;
    description: string;
    excerpt: string;
    keyword: string;
    sector: string;
    markdown: string;
    date: string; // "25/09/2026"
    imageId: string;
}

function isDue(row: SheetRow, now: Date): boolean {
    const publishAt = parseSheetDate(row["Publicar em"] || "");
    return publishAt !== null && publishAt <= now;
}

export function isVisible(row: SheetRow, now = new Date()): boolean {
    if (row.Tipo !== "Artigo de blog" || !row.Slug || !row["Texto (Markdown)"]) return false;
    if (row.Status === STATUS.approved || row.Status === STATUS.published) return true;
    return row.Status === STATUS.pending && isDue(row, now);
}

function toPost(r: SheetRow): BlogPost {
    return {
        title: r.Título,
        slug: r.Slug,
        description: r["Meta description"],
        excerpt: r.Resumo,
        keyword: r["Palavra-chave"],
        sector: r.Setor,
        markdown: r["Texto (Markdown)"],
        date: (r["Publicar em"] || r["Criado em"] || "").split(",")[0],
        imageId: r["Imagem (ID no Drive)"] || "",
    };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
    try {
        const now = new Date();
        const rows = await readSheet(CONTENT_SHEET);
        return rows.filter(r => isVisible(r, now)).map(toPost).reverse(); // mais recentes primeiro
    } catch (err) {
        // Sem Google (ex.: build local) o blog fica vazio em vez de quebrar a página
        console.error("[Blog] Não foi possível ler os artigos:", err);
        return [];
    }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
    return (await getPublishedPosts()).find(p => p.slug === slug) ?? null;
}

// Só serve imagens de artigos visíveis (evita expor outros arquivos do Drive)
export async function isPublishedImage(imageId: string): Promise<boolean> {
    return (await getPublishedPosts()).some(p => p.imageId === imageId);
}

// Rotina de hora em hora: marca como "Publicado" o que foi ao ar pelo prazo, para a planilha refletir o site
export async function markDuePostsPublished(): Promise<number> {
    const now = new Date();
    const due = (await readSheet(CONTENT_SHEET)).filter(r => r.Status === STATUS.pending && isVisible(r, now));
    for (const row of due) {
        await updateCell(CONTENT_SHEET, CONTENT_HEADERS, row, "Status", STATUS.published);
    }
    if (due.length) console.log(`[Blog] ${due.length} artigo(s) publicado(s) pelo prazo`);
    return due.length;
}
