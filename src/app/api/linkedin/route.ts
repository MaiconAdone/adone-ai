import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { isInternalRequest, unauthorized } from "@/lib/internal-auth";
import { hasPainelSession } from "@/lib/painel-auth";
import { runLinkedInPost } from "@/lib/engine/linkedin/agent";
import { LINKEDIN_APPS, type LinkedInApp } from "@/lib/engine/linkedin/connection";

const LINKEDIN_STATE_COOKIE = "adone_linkedin_state";

// POST /api/linkedin { setor? } — gera e publica um post na página (uso interno, exige o segredo)
export async function POST(req: NextRequest) {
    if (!isInternalRequest(req)) return unauthorized();
    try {
        const body = await req.json().catch(() => ({}));
        const summary = await runLinkedInPost(typeof body.setor === "string" ? body.setor : undefined);
        return NextResponse.json({ ok: true, summary });
    } catch (err) {
        console.error("[/api/linkedin]", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "Erro interno" }, { status: 500 });
    }
}

// GET /api/linkedin?app=page|ads — botões "Conectar" do painel: inicia a autorização no LinkedIn
export async function GET(req: NextRequest) {
    if (!(await hasPainelSession())) return NextResponse.redirect(new URL("/painel/login", req.url));

    const app: LinkedInApp = req.nextUrl.searchParams.get("app") === "ads" ? "ads" : "page";
    const state = randomBytes(16).toString("hex");
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.search = new URLSearchParams({
        response_type: "code",
        client_id: LINKEDIN_APPS[app].clientId(),
        redirect_uri: `${process.env.SITE_URL}/api/auth/linkedin`,
        state,
        scope: LINKEDIN_APPS[app].scope,
    }).toString();

    const res = NextResponse.redirect(authUrl);
    res.cookies.set(LINKEDIN_STATE_COOKIE, `${state}.${app}`, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
    return res;
}
