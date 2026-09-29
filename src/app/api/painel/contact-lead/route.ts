import { NextRequest, NextResponse } from "next/server";
import { hasPainelSession } from "@/lib/painel-auth";
import { OUTREACH_REASONS, startVickWithLead } from "@/lib/engine/chatbot/outreach";
import { readLeads, ROW_KEY } from "@/lib/engine/marketing/workspace";

// POST /api/painel/contact-lead { row } — a Vick chama no WhatsApp um lead do formulário já gravado na planilha.
// Recebe só a linha: o telefone vem da planilha, nunca do navegador.
export async function POST(req: NextRequest) {
    if (!(await hasPainelSession())) {
        return NextResponse.json({ error: "Sessão expirada. Entre de novo." }, { status: 401 });
    }
    const { row } = await req.json().catch(() => ({}));
    const lead = (await readLeads()).find(r => r[ROW_KEY] === String(row));
    if (!lead || lead.Canal !== "Formulário do site" || !lead.Telefone) {
        return NextResponse.json({ error: "Lead não encontrado na planilha" }, { status: 404 });
    }

    const result = await startVickWithLead(lead.Telefone, {
        name:        lead.Nome || "",
        company:     lead.Empresa || "",
        email:       lead["E-mail"] || "",
        companySize: lead.Porte,
        interest:    lead.Interesse,
        message:     (lead["Desafio / mensagem"] || "").slice(0, 1000),
    }, { late: true });

    if (!result.ok) return NextResponse.json({ error: OUTREACH_REASONS[result.reason] }, { status: 409 });
    return NextResponse.json({ ok: true });
}
