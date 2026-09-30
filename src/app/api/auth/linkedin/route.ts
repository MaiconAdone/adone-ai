import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { safeEqual } from "@/lib/rate-limit";
import { LINKEDIN_APPS, saveConnection, type LinkedInApp } from "@/lib/engine/linkedin/connection";

const STATE_COOKIE = "adone_linkedin_state";

// GET /api/auth/linkedin — retorno da autorização (dos dois apps): guarda o token na planilha e volta ao painel
export async function GET(req: NextRequest) {
    // O cookie guarda "state.app": qual dos dois apps (página ou anúncios) está sendo conectado
    const [expectedState, appName] = (req.cookies.get(STATE_COOKIE)?.value ?? "").split(".");
    const app: LinkedInApp = appName === "ads" ? "ads" : "page";
    const back = (status: string) => {
        const res = NextResponse.redirect(new URL(`/painel?linkedin=${status}&app=${app}`, req.url));
        res.cookies.delete(STATE_COOKIE);
        return res;
    };

    if (!(await hasPainelSession())) return NextResponse.redirect(new URL("/painel/login", req.url));

    const params = req.nextUrl.searchParams;
    if (!expectedState || !safeEqual(params.get("state") ?? "", expectedState)) return back("erro-sessao");
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
                client_id: LINKEDIN_APPS[app].clientId(),
                client_secret: LINKEDIN_APPS[app].clientSecret(),
            }),
        });
        const data = await tokenRes.json();
        if (!tokenRes.ok || !data.access_token) throw new Error(JSON.stringify(data).slice(0, 300));

        await saveConnection(app, data.access_token, Number(data.expires_in) || 60 * 86400);
        return back("ok");
    } catch (err) {
        console.error("[LinkedIn OAuth] Falha ao obter token:", err);
        return back("erro");
    }
}
