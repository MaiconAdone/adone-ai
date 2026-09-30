// Linhas normalizadas das plataformas de anúncio (Google Ads e LinkedIn Ads)

export interface AdsRow {
    date: string; // AAAA-MM-DD
    platform: "Google Ads" | "LinkedIn Ads";
    campaign: string; // Google: campanha | LinkedIn: grupo de campanhas
    group: string; // Google: grupo de anúncios | LinkedIn: conjunto de anúncios ("campaign" na API)
    impressions: number;
    clicks: number;
    spend: number; // R$
    conversions: number;
}

export interface SearchTermRow {
    term: string;
    campaign: string;
    group: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
}
