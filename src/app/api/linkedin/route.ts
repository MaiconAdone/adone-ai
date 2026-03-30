import { NextRequest, NextResponse } from "next/server";
import { generateAndPost } from "@/lib/engine/linkedin/scheduler";
import { postToLinkedIn } from "@/lib/engine/linkedin/poster";

// POST /api/linkedin — postar no LinkedIn
export async function POST(req: NextRequest) {
    try {
        // Validar secret para evitar uso não autorizado
        const auth = req.headers.get("x-webhook-secret");
        if (process.env.WEBHOOK_SECRET && auth !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Post manual com texto específico
        if (body.text) {
            const postId = await postToLinkedIn(body.text);
            return NextResponse.json({ ok: !!postId, postId });
        }

        // Post automático (gera conteúdo + posta)
        const result = await generateAndPost();
        return NextResponse.json(result);

    } catch (err) {
        console.error("[/api/linkedin]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

// GET /api/linkedin/connect — inicia o fluxo OAuth
export async function GET() {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = `${process.env.SITE_URL}/api/auth/linkedin`;

    if (!clientId) {
        return NextResponse.json({ error: "LINKEDIN_CLIENT_ID não configurado" }, { status: 500 });
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_organization_social%20r_organization_social%20rw_organization_admin`;

    return NextResponse.redirect(authUrl);
}
