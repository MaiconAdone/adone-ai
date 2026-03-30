import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getOrgId } from "@/lib/engine/linkedin/poster";

// GET /api/auth/linkedin — callback OAuth do LinkedIn
export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const error = req.nextUrl.searchParams.get("error");

    if (error) {
        return NextResponse.json({ error: "Autorização negada pelo LinkedIn" }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: "Código de autorização não encontrado" }, { status: 400 });
    }

    try {
        // Trocar code por access_token
        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: `${process.env.SITE_URL}/api/auth/linkedin`,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token, expires_in } = tokenRes.data;

        // Buscar ID da organização automaticamente
        const orgId = await getOrgId(access_token);

        // Retornar token e orgId para configurar nas variáveis de ambiente
        return NextResponse.json({
            ok: true,
            message: "✅ Copie esses valores e adicione nas variáveis de ambiente da Hostinger:",
            LINKEDIN_ACCESS_TOKEN: access_token,
            LINKEDIN_ORG_ID: orgId,
            expires_in_days: Math.floor(expires_in / 86400),
        });
    } catch (err: any) {
        console.error("[LinkedIn OAuth]", err?.response?.data || err.message);
        return NextResponse.json({ error: "Erro ao obter token", details: err?.response?.data }, { status: 500 });
    }
}
