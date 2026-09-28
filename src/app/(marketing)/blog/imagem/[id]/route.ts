import { NextRequest, NextResponse } from "next/server";
import { isPublishedImage } from "@/lib/engine/marketing/blog";
import { downloadImage } from "@/lib/engine/marketing/images";

// GET /blog/imagem/[id] — capa de um artigo publicado, lida do Google Drive
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^[\w-]{10,100}$/.test(id) || !(await isPublishedImage(id))) {
        return new NextResponse("Imagem não encontrada", { status: 404 });
    }

    try {
        const image = await downloadImage(id);
        return new NextResponse(new Uint8Array(image), {
            headers: {
                "Content-Type": "image/webp",
                // A imagem de um ID nunca muda: cache longo no navegador e na CDN
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch (err) {
        console.error("[Blog] Falha ao ler imagem do Drive:", err);
        return new NextResponse("Imagem indisponível", { status: 502 });
    }
}
