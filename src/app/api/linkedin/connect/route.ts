import { NextResponse } from "next/server";

// GET /api/linkedin/connect — alias explícito para iniciar o fluxo OAuth
export async function GET() {
    return NextResponse.redirect(new URL("/api/linkedin", process.env.SITE_URL || "http://localhost:3000"));
}