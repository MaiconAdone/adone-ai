// Eventos de conversão para GA4 e Google Ads (via gtag, carregado em components/global/analytics.tsx).
// Sem IDs configurados ou sem gtag carregado, as chamadas simplesmente não fazem nada.

type Gtag = (...args: unknown[]) => void;

declare global {
    interface Window {
        gtag?: Gtag;
        dataLayer?: unknown[];
    }
}

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

// Rótulos de conversão do Google Ads (Ferramentas → Conversões → Tag → send_to = AW-XXX/<rótulo>)
const ADS_LABELS = {
    lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
    booking: process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL || "",
    whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || "",
};

export type ConversionKind = keyof typeof ADS_LABELS;

// Nomes de evento no GA4 (generate_lead é recomendado pelo Google para formulários de lead)
const GA4_EVENTS: Record<ConversionKind, string> = {
    lead: "generate_lead",
    booking: "agendamento_confirmado",
    whatsapp: "clique_whatsapp",
};

export const analyticsEnabled = Boolean(GA4_ID || GOOGLE_ADS_ID);

export function trackConversion(kind: ConversionKind, params: Record<string, string | number> = {}): void {
    if (typeof window === "undefined" || !window.gtag) return;

    window.gtag("event", GA4_EVENTS[kind], params);

    const label = ADS_LABELS[kind];
    if (GOOGLE_ADS_ID && label) {
        window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
    }
}

// Consentimento (LGPD): guardado no navegador; sem escolha, tudo fica negado
export type ConsentChoice = "granted" | "denied";
const CONSENT_KEY = "adone_consent";

export function getConsent(): ConsentChoice | null {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === "granted" || value === "denied" ? value : null;
    } catch {
        return null;
    }
}

export function setConsent(choice: ConsentChoice): void {
    try {
        localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // Sem armazenamento: vale só para esta visita
    }
    window.gtag?.("consent", "update", {
        ad_storage: choice,
        ad_user_data: choice,
        ad_personalization: choice,
        analytics_storage: choice,
    });
}
