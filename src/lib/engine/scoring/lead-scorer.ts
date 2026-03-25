// Módulo 3 — Lead Scoring com IA
// Pontua empresas automaticamente com base em dados coletados

export interface Company {
    name: string;
    website?: string;
    sector?: string;
    employees?: number;
    revenue_estimate?: string;
    has_erp?: boolean;
    has_crm?: boolean;
    open_data_jobs?: number;      // vagas abertas de dados/BI
    growth_rate?: number;         // % crescimento da equipe (LinkedIn)
    tech_maturity?: "low" | "medium" | "high";
    founded_year?: number;
    linkedin_url?: string;
    contact_email?: string;
    contact_name?: string;
    contact_role?: string;
}

export interface ScoredLead {
    company: Company;
    score: number;
    tier: "hot" | "warm" | "cold";
    reasons: string[];
    recommended_action: string;
    personalized_opening: string;
}

const HIGH_VALUE_SECTORS = ["financeiro", "varejo", "logística", "logistica", "saúde", "saude", "indústria", "industria"];
const CURRENT_YEAR = new Date().getFullYear();

export function scoreCompany(company: Company): ScoredLead {
    let score = 0;
    const reasons: string[] = [];

    // Orçamento estimado por faturamento
    if (company.revenue_estimate?.includes("10M") || company.revenue_estimate?.includes("50M")) {
        score += 30;
        reasons.push("Faturamento alto → orçamento disponível para IA");
    } else if (company.revenue_estimate?.includes("5M")) {
        score += 20;
        reasons.push("Faturamento médio → elegível para projetos mid-market");
    }

    // Infraestrutura de dados existente
    if (company.has_erp && company.has_crm) {
        score += 20;
        reasons.push("Tem ERP + CRM → dados disponíveis para ML");
    } else if (company.has_erp || company.has_crm) {
        score += 10;
        reasons.push("Tem ERP ou CRM → base de dados parcial");
    }

    // Vagas abertas de dados (sinal de maturidade)
    if (company.open_data_jobs && company.open_data_jobs >= 3) {
        score += 25;
        reasons.push(`${company.open_data_jobs} vagas de dados abertas → investindo em dados`);
    } else if (company.open_data_jobs && company.open_data_jobs >= 1) {
        score += 12;
        reasons.push("Tem vagas de dados → iniciando jornada de dados");
    }

    // Crescimento da equipe
    if (company.growth_rate && company.growth_rate >= 20) {
        score += 15;
        reasons.push(`Crescimento de ${company.growth_rate}% → escala rápida, dores operacionais emergindo`);
    }

    // Setor de alta maturidade
    if (company.sector && HIGH_VALUE_SECTORS.some(s => company.sector!.toLowerCase().includes(s))) {
        score += 15;
        reasons.push(`Setor ${company.sector} → alta propensão a adotar IA`);
    }

    // Maturidade tecnológica
    if (company.tech_maturity === "high") {
        score += 10;
        reasons.push("Alta maturidade tecnológica → ciclo de venda mais curto");
    } else if (company.tech_maturity === "low") {
        score -= 10;
        reasons.push("Baixa maturidade tecnológica → ciclo de venda longo");
    }

    // Penalidades
    if (company.founded_year && CURRENT_YEAR - company.founded_year < 2) {
        score -= 20;
        reasons.push("Empresa muito nova → orçamento limitado");
    }

    score = Math.max(0, Math.min(100, score));

    const tier: "hot" | "warm" | "cold" =
        score >= 70 ? "hot" :
        score >= 40 ? "warm" : "cold";

    const recommended_action =
        tier === "hot" ? "Prospecção ativa imediata — e-mail personalizado + LinkedIn" :
        tier === "warm" ? "Sequência de nutrição por conteúdo (30 dias)" :
        "Remover da lista ativa";

    const personalized_opening = buildPersonalizedOpening(company, reasons[0] || "");

    return { company, score, tier, reasons, recommended_action, personalized_opening };
}

function buildPersonalizedOpening(company: Company, mainReason: string): string {
    const sectorMap: Record<string, string> = {
        varejo: "gestão de estoque e previsão de demanda",
        logistica: "otimização de rotas e previsão de atrasos",
        logística: "otimização de rotas e previsão de atrasos",
        financeiro: "detecção de fraudes e scoring de crédito",
        saude: "triagem inteligente e previsão de readmissão",
        saúde: "triagem inteligente e previsão de readmissão",
        industria: "manutenção preditiva e controle de qualidade",
        indústria: "manutenção preditiva e controle de qualidade",
    };

    const sector = company.sector?.toLowerCase() || "";
    const pain = Object.keys(sectorMap).find(k => sector.includes(k));
    const sectorPain = pain ? sectorMap[pain] : "processos operacionais";

    return `Assunto: ${company.name} — vi que vocês estão crescendo

Olá ${company.contact_name || ""},

Acompanho empresas de ${company.sector || "seu setor"} e vi que a ${company.name} ${mainReason.toLowerCase()}.

Empresas similares à de vocês geralmente têm ganhos expressivos com IA em ${sectorPain}.

Desenvolvemos um diagnóstico gratuito de 30 minutos onde identificamos exatamente onde ML pode gerar ROI mensurável para vocês.

Teria 30 minutos essa semana?

${process.env.BOOKING_URL || "https://cal.com/maicon-adone/diagnostico"}`;
}

export function batchScore(companies: Company[]): ScoredLead[] {
    return companies
        .map(scoreCompany)
        .sort((a, b) => b.score - a.score);
}
