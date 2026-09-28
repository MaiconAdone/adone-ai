import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { getPost, setPostImage } from "@/lib/engine/marketing/blog";
import { createCoverImage, imagesConfigured, uploadCoverImage } from "@/lib/engine/marketing/images";

// Troca da capa de um artigo do blog (lápis na capa). Tudo exige a sessão do painel.
//   GET                          → 200 se há sessão (o lápis só aparece para o Maicon)
//   GET  ?slug=…                 → { imageId } atual (acompanha a geração com IA)
//   POST multipart slug + file   → envia uma imagem do computador (troca na hora)
//   POST json { slug, prompt }   → gera outra com IA em segundo plano (demora mais que o limite da hospedagem)
//   POST json { slug, action: "revalidate" } → atualiza as páginas do blog depois da geração

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const SLUG_PATTERN = /^[a-z0-9-]{1,120}$/;
const generating = new Set<string>();

function refreshBlog(slug: string) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
}

const unauthorized = () => NextResponse.json({ error: "Entre no painel para trocar a imagem." }, { status: 401 });

export async function GET(req: NextRequest) {
    if (!(await hasPainelSession())) return unauthorized();
    const slug = req.nextUrl.searchParams.get("slug");
    if (!slug) return NextResponse.json({ ok: true });
    if (!SLUG_PATTERN.test(slug)) return NextResponse.json({ error: "Artigo inválido" }, { status: 400 });

    const post = await getPost(slug);
    if (!post) return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
    return NextResponse.json({ imageId: post.imageId, generating: generating.has(slug) });
}

export async function POST(req: NextRequest) {
    if (!(await hasPainelSession())) return unauthorized();
    if (!imagesConfigured()) return NextResponse.json({ error: "Pasta do Drive não configurada" }, { status: 503 });

    // Envio de arquivo
    if (req.headers.get("content-type")?.startsWith("multipart/form-data")) {
        const form = await req.formData().catch(() => null);
        const slug = String(form?.get("slug") || "");
        const file = form?.get("file");
        if (!SLUG_PATTERN.test(slug) || !(file instanceof File)) {
            return NextResponse.json({ error: "Envie o artigo e a imagem" }, { status: 400 });
        }
        if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Imagem acima de 10 MB" }, { status: 413 });
        if (!(await getPost(slug))) return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });

        try {
            const imageId = await uploadCoverImage(Buffer.from(await file.arrayBuffer()), slug);
            await setPostImage(slug, imageId);
            refreshBlog(slug);
            return NextResponse.json({ imageId });
        } catch (err) {
            console.error("[Blog] Falha ao trocar a capa:", err);
            return NextResponse.json({ error: "Não consegui usar essa imagem. Tente um JPG, PNG ou WebP." }, { status: 422 });
        }
    }

    const body = await req.json().catch(() => ({}));
    const slug = String(body.slug || "");
    if (!SLUG_PATTERN.test(slug)) return NextResponse.json({ error: "Artigo inválido" }, { status: 400 });

    if (body.action === "revalidate") {
        refreshBlog(slug);
        return NextResponse.json({ ok: true });
    }

    // Geração com IA
    const post = await getPost(slug);
    if (!post) return NextResponse.json({ error: "Artigo não encontrado" }, { status: 404 });
    if (generating.has(slug)) return NextResponse.json({ error: "Já estou gerando uma imagem para este artigo" }, { status: 409 });

    const details = String(body.prompt || "").trim().slice(0, 500);
    generating.add(slug);
    void createCoverImage(`${post.title} (palavra-chave: ${post.keyword})`, slug, details)
        .then(imageId => setPostImage(slug, imageId))
        .catch(err => console.error("[Blog] Falha ao gerar nova capa:", err))
        .finally(() => generating.delete(slug));

    return NextResponse.json({ started: true, previousImageId: post.imageId }, { status: 202 });
}
