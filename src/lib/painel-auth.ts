// Acesso ao /painel: senha única (PAINEL_PASSWORD) e sessão em cookie assinado (HMAC), válida por 12h.
// Trocar a senha invalida todas as sessões abertas.

import { createHmac } from "crypto";
import { cookies } from "next/headers";
import { safeEqual } from "./rate-limit";

export const SESSION_COOKIE = "adone_painel";
const SESSION_HOURS = 12;

function secret(): string | undefined {
    return process.env.PAINEL_PASSWORD?.trim() || undefined;
}

function sign(expiresAt: number, key: string): string {
    return createHmac("sha256", key).update(`painel:v1:${expiresAt}`).digest("base64url");
}

export function isPasswordValid(password: string): boolean {
    return safeEqual(password, secret());
}

export function createSessionValue(): { value: string; maxAge: number } {
    const key = secret();
    if (!key) throw new Error("PAINEL_PASSWORD não configurada");
    const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
    return { value: `${expiresAt}.${sign(expiresAt, key)}`, maxAge: SESSION_HOURS * 60 * 60 };
}

export function isSessionValid(value: string | undefined): boolean {
    const key = secret();
    if (!key || !value) return false;
    const [expires, signature] = value.split(".");
    const expiresAt = Number(expires);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
    return safeEqual(signature, sign(expiresAt, key));
}

export async function hasPainelSession(): Promise<boolean> {
    return isSessionValid((await cookies()).get(SESSION_COOKIE)?.value);
}
