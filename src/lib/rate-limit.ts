// Limitador de requisições em memória (janela deslizante por chave)
// Suficiente para um único processo Node; com várias instâncias, trocar por Redis.

import type { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

const hits = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();

    // Varre chaves expiradas de tempos em tempos para não crescer indefinidamente
    if (now - lastSweep > windowMs) {
        lastSweep = now;
        for (const [k, times] of Array.from(hits.entries())) {
            if (times.every(t => now - t > windowMs)) hits.delete(k);
        }
    }

    const recent = (hits.get(key) || []).filter(t => now - t < windowMs);
    if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
}

export function getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0].trim() || req.headers.get("x-real-ip") || "desconhecido";
}

// Comparação de segredos sem vazar informação por tempo de resposta
export function safeEqual(a: string | null | undefined, b: string | undefined): boolean {
    if (!a || !b) return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}
