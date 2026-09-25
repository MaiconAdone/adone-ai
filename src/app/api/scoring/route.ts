import { NextRequest, NextResponse } from "next/server";
import { isInternalRequest, unauthorized } from "@/lib/internal-auth";
import { scoreCompany, batchScore } from "@/lib/engine/scoring/lead-scorer";

// POST /api/scoring — pontua uma ou várias empresas
export async function POST(req: NextRequest) {
    // Rota interna: gera conteúdo com IA paga / expõe lógica de pontuação
    if (!isInternalRequest(req)) return unauthorized();

    try {
        const body = await req.json();

        // Batch scoring
        if (Array.isArray(body)) {
            const results = batchScore(body);
            return NextResponse.json({ results });
        }

        // Single scoring
        const result = scoreCompany(body);
        return NextResponse.json(result);
    } catch (err) {
        console.error("[/api/scoring]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
