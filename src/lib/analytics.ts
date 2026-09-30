// Eventos de conversão para GA4 e Google Ads (via gtag, carregado em components/global/analytics.tsx).
// Sem IDs configurados ou sem gtag carregado, as chamadas simplesmente não fazem nada.

type Gtag = (...args: unknown[]) => void;

declare global {
    interface Window {
        gtag?: Gtag;
        dataLayer?: unknown[];
        lintrk?: (action: string, data: Record<string, unknown>) => void;
    }
}

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
// IDs públicos (aparecem no código da página); a variável de ambiente, se definida, tem prioridade
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18480408314";
// LinkedIn Insight Tag (Campaign Manager → Fontes de dados → Insight Tag)
export const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "10965433";

// IDs de conversão do LinkedIn (Campaign Manager → Conversões), um por tipo
const LINKEDIN_CONVERSIONS = {
    lead: process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_LEAD || "",
    booking: process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_BOOKING || "",
    whatsapp: process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_WHATSAPP || "31572337", // "Contato WhatsApp (Vick)"
};

// Rótulos de conversão do Google Ads (Ferramentas → Conversões → Tag → send_to = AW-XXX/<rótulo>)
const ADS_LABELS = {
    lead: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
    booking: process.env.NEXT_PUBLIC_GOOGLE_ADS_BOOKING_LABEL || "LZXLCOvBnYkdEPrNkuxE", // "Reservar horário"
    whatsapp: process.env.NEXT_PUBLIC_GOOGLE_ADS_WHATSAPP_LABEL || "",
};

export type ConversionKind = keyof typeof ADS_LABELS;

// Nomes de evento no GA4 (generate_lead é recomendado pelo Google para formulários de lead)
const GA4_EVENTS: Record<ConversionKind, string> = {
    lead: "generate_lead",
    booking: "agendamento_confirmado",
    whatsapp: "clique_whatsapp",
};

export const analyticsEnabled = Boolean(GA4_ID || GOOGLE_ADS_ID || LINKEDIN_PARTNER_ID);

export function trackConversion(kind: ConversionKind, params: Record<string, string | number> = {}): void {
    if (typeof window === "undefined") return;

    if (window.gtag) {
        window.gtag("event", GA4_EVENTS[kind], params);
        const label = ADS_LABELS[kind];
        if (GOOGLE_ADS_ID && label) {
            window.gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
        }
    }

    // Só existe se o visitante aceitou os cookies (a Insight Tag carrega apenas com consentimento)
    const linkedinConversion = LINKEDIN_CONVERSIONS[kind];
    if (window.lintrk && linkedinConversion) {
        window.lintrk("track", { conversion_id: Number(linkedinConversion) });
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
