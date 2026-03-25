import { NextRequest, NextResponse } from "next/server";
import { handleBookingCreated, handleBookingCancelled } from "@/lib/engine/agenda/booking-handler";

export async function POST(req: NextRequest) {
    try {
        // Validar webhook secret
        const secret = req.headers.get("x-cal-signature-256") || req.headers.get("x-webhook-secret");
        if (process.env.WEBHOOK_SECRET && secret !== process.env.WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        switch (body.triggerEvent) {
            case "BOOKING_CREATED":
            case "BOOKING_RESCHEDULED":
                await handleBookingCreated(body);
                break;
            case "BOOKING_CANCELLED":
                await handleBookingCancelled(body);
                break;
            default:
                console.log("[Cal.com] Evento ignorado:", body.triggerEvent);
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[/api/webhooks/calcom]", err);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}
