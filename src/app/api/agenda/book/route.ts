import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createBooking, SlotUnavailableError } from "@/lib/engine/agenda/booking";
import { AttributionSchema } from "@/lib/attribution";
import { isGoogleConfigured } from "@/lib/engine/agenda/google";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const BookingSchema = z.object({
    start: z.string().min(10).max(40),
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(120),
    phone: z.string().trim().regex(/^[\d\s()+-]{10,20}$/),
    company: z.string().trim().max(100).optional(),
    notes: z.string().trim().max(1000).optional(),
    origin: z.enum(["site", "vick", "whatsapp"]).default("site"),
    website: z.string().optional(), // campo-armadilha para robôs
    attribution: AttributionSchema.optional(),
});

// POST /api/agenda/book — confirma um agendamento
export async function POST(req: NextRequest) {
    if (!isGoogleConfigured()) {
        return NextResponse.json({ error: "A agenda está indisponível no momento." }, { status: 503 });
    }
    if (!rateLimit(`agenda-book:${getClientIp(req)}`, 5, 60 * 60 * 1000)) {
        return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 });
    }

    const parsed = BookingSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ error: "Confira os dados preenchidos." }, { status: 400 });
    }

    const { website, ...input } = parsed.data;
    // Robô preencheu o campo invisível: finge sucesso sem agendar
    if (website) {
        return NextResponse.json({ ok: true });
    }

    try {
        const result = await createBooking(input);
        return NextResponse.json({ ok: true, ...result });
    } catch (err) {
        if (err instanceof SlotUnavailableError) {
            return NextResponse.json({ error: "Esse horário acabou de ser ocupado. Escolha outro, por favor." }, { status: 409 });
        }
        console.error("[/api/agenda/book]", err);
        return NextResponse.json({ error: "Não foi possível concluir o agendamento. Tente novamente em instantes." }, { status: 500 });
    }
}
