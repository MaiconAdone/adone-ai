import { NextRequest, NextResponse } from "next/server";
import { isInternalRequest, unauthorized } from "@/lib/internal-auth";
import { generateContent, generateWeeklyContentCalendar } from "@/lib/engine/marketing/content-generator";

// POST /api/marketing
export async function POST(req: NextRequest) {
    // Rota interna: gera conteúdo com IA paga / expõe lógica de pontuação
    if (!isInternalRequest(req)) return unauthorized();

    try {
        const body = await req.json();
        const { action, ...params } = body;

        if (action === "calendar") {
            const calendar = await generateWeeklyContentCalendar(params.sector);
            return NextResponse.json({ calendar });
        }

        // Gerar conteúdo único
        const content = await generateContent(params);
        return NextResponse.json({ content });
    } catch (err) {
        console.error("[/api/marketing]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
