import { NextRequest, NextResponse } from "next/server";
import { scoreCompany, batchScore } from "@/lib/engine/scoring/lead-scorer";

// POST /api/scoring — pontua uma ou várias empresas
export async function POST(req: NextRequest) {
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
