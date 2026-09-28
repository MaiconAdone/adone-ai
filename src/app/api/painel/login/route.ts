import { NextRequest, NextResponse } from "next/server";
import { createSessionValue, isPasswordValid, SESSION_COOKIE } from "@/lib/painel-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// POST /api/painel/login { password } — abre a sessão do painel
export async function POST(req: NextRequest) {
    if (!process.env.PAINEL_PASSWORD?.trim()) {
        return NextResponse.json({ error: "Painel não configurado (defina PAINEL_PASSWORD)." }, { status: 503 });
    }
    if (!rateLimit(`painel-login:${getClientIp(req)}`, 5, 15 * 60 * 1000)) {
        return NextResponse.json({ error: "Muitas tentativas. Aguarde 15 minutos." }, { status: 429 });
    }

    const { password } = await req.json().catch(() => ({}));
    if (typeof password !== "string" || !isPasswordValid(password)) {
        return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const session = createSessionValue();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: session.maxAge,
    });
    return res;
}

// DELETE /api/painel/login — encerra a sessão
export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE);
    return res;
}
