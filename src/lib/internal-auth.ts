// Rotas internas (automação, painéis, agentes): exigem o header x-webhook-secret = WEBHOOK_SECRET.
// Sem WEBHOOK_SECRET configurado a rota fica fechada, nunca aberta.

import { NextRequest, NextResponse } from "next/server";
import { safeEqual } from "./rate-limit";

export function isInternalRequest(req: NextRequest): boolean {
    return safeEqual(req.headers.get("x-webhook-secret"), process.env.WEBHOOK_SECRET);
}

export function unauthorized(): NextResponse {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
