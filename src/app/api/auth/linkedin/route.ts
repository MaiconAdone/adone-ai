import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { safeEqual } from "@/lib/rate-limit";
import { DEFAULT_ORG_ID, saveConnection } from "@/lib/engine/linkedin/connection";

const STATE_COOKIE = "adone_linkedin_state";

// GET /api/auth/linkedin — retorno da autorização: guarda o token na planilha e volta ao painel
export async function GET(req: NextRequest) {
    const back = (status: string) => {
        const res = NextResponse.redirect(new URL(`/painel?linkedin=${status}`, req.url));
        res.cookies.delete(STATE_COOKIE);
        return res;
    };

    if (!(await hasPainelSession())) return NextResponse.redirect(new URL("/painel/login", req.url));

    const params = req.nextUrl.searchParams;
    if (!safeEqual(params.get("state") ?? "", req.cookies.get(STATE_COOKIE)?.value)) return back("erro-sessao");
    if (params.get("error")) {
        console.error("[LinkedIn OAuth]", params.get("error"), params.get("error_description"));
        return back(params.get("error") === "unauthorized_scope_error" ? "sem-permissao" : "negado");
    }
    const code = params.get("code");
    if (!code) return back("negado");

    try {
        const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: `${process.env.SITE_URL}/api/auth/linkedin`,
                client_id: process.env.LINKEDIN_CLIENT_ID!,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
            }),
        });
        const data = await tokenRes.json();
        if (!tokenRes.ok || !data.access_token) throw new Error(JSON.stringify(data).slice(0, 300));

        await saveConnection(data.access_token, Number(data.expires_in) || 60 * 86400, DEFAULT_ORG_ID);
        return back("ok");
    } catch (err) {
        console.error("[LinkedIn OAuth] Falha ao obter token:", err);
        return back("erro");
    }
}
