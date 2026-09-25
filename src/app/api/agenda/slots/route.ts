import { NextRequest, NextResponse } from "next/server";
import { getAvailableDays } from "@/lib/engine/agenda/availability";
import { isGoogleConfigured } from "@/lib/engine/agenda/google";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET /api/agenda/slots — dias e horários livres para o diagnóstico
export async function GET(req: NextRequest) {
    if (!isGoogleConfigured()) {
        return NextResponse.json({ error: "Agenda indisponível" }, { status: 503 });
    }
    if (!rateLimit(`agenda-slots:${getClientIp(req)}`, 60, 10 * 60 * 1000)) {
        return NextResponse.json({ error: "Muitas consultas" }, { status: 429 });
    }

    try {
        const days = await getAvailableDays();
        return NextResponse.json({ days }, { headers: { "Cache-Control": "no-store" } });
    } catch (err) {
        console.error("[/api/agenda/slots]", err);
        return NextResponse.json({ error: "Agenda indisponível" }, { status: 503 });
    }
}
