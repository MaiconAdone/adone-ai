// Origem do visitante (UTMs, gclid, página de entrada, referência), guardada no próprio navegador
// e enviada junto do lead/agendamento para a planilha. Dado first-party: não vai para terceiros.

import { z } from "zod";

export const AttributionSchema = z.object({
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    gclid: z.string().max(300).optional(),
    landing_page: z.string().max(300).optional(),
    referrer: z.string().max(300).optional(),
});

export type Attribution = z.infer<typeof AttributionSchema>;

const STORAGE_KEY = "adone_attribution";
const CAMPAIGN_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;

function read(): Attribution | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? AttributionSchema.parse(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
}

// Chamado a cada carregamento de página. Vale o último acesso não direto (campanha ou outro site):
// uma visita direta depois não apaga a origem anterior.
export function captureAttribution(): void {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hasCampaign = CAMPAIGN_PARAMS.some(p => params.get(p));
    const externalReferrer = document.referrer && !document.referrer.startsWith(window.location.origin)
        ? document.referrer
        : "";

    if (!hasCampaign && !externalReferrer) {
        // Visita direta: só registra a página de entrada se ainda não houver nada
        if (!read()) save({ landing_page: window.location.pathname });
        return;
    }

    const data: Attribution = { landing_page: window.location.pathname };
    for (const p of CAMPAIGN_PARAMS) {
        const value = params.get(p);
        if (value) data[p] = value.slice(0, 200);
    }
    if (externalReferrer) data.referrer = externalReferrer.slice(0, 300);
    save(data);
}

function save(data: Attribution): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Navegação anônima ou armazenamento bloqueado: segue sem atribuição
    }
}

export function getAttribution(): Attribution {
    return (typeof window !== "undefined" && read()) || {};
}

// Colunas da planilha correspondentes (mesmos nomes de sheet-schema.mjs)
export function attributionColumns(a?: Attribution) {
    return {
        "UTM source": a?.utm_source || "",
        "UTM medium": a?.utm_medium || "",
        "UTM campaign": a?.utm_campaign || "",
        "UTM term": a?.utm_term || "",
        "UTM content": a?.utm_content || "",
        "gclid": a?.gclid || "",
        "Página de entrada": a?.landing_page || "",
        "Referência": a?.referrer || "",
    };
}
