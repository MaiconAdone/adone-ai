// Agente de Mídia (Aquisição): planos de campanha para Google Ads e LinkedIn Ads a partir da estratégia aprovada.
// O Maicon aprova na aba "Campanhas" e sobe nas plataformas; nada gasta verba sozinho.

import { z } from "zod";
import { COMPANY_CONTEXT } from "./company";
import { generateStructured, STRATEGY_MODEL } from "./llm";
import { notifyOwner } from "./notify";
import { buildMetricsSummary } from "./strategist";
import {
    appendCampaign, CAMPAIGNS_SHEET, readInvestment, readSheet, SheetRow, STATUS, STRATEGY_SHEET,
} from "./workspace";

const SITE_URL = "https://adoneintelligence.com.br";

// Limites das plataformas (caracteres)
const LIMITS = { googleTitle: 30, googleDescription: 90, linkedinIntro: 600, linkedinHeadline: 200 };

const MediaSchema = z.object({
    google_ads: z.object({
        campanha: z.string(),
        objetivo: z.string(),
        orcamento_diario_brl: z.number(),
        negativas: z.array(z.string()),
        grupos: z.array(z.object({
            nome: z.string(),
            pagina_destino: z.string().describe("Caminho do site, ex.: /agendar ou /blog/slug"),
            palavras_chave: z.array(z.object({ termo: z.string(), correspondencia: z.enum(["exata", "frase"]) })),
            titulos: z.array(z.string()).describe("10 a 15 títulos de anúncio responsivo, cada um com no máximo 30 caracteres"),
            descricoes: z.array(z.string()).describe("4 descrições, cada uma com no máximo 90 caracteres"),
        })),
    }),
    linkedin_ads: z.object({
        campanha: z.string(),
        objetivo: z.enum(["Visitas ao site", "Conversões no site", "Geração de leads"]),
        orcamento_diario_brl: z.number(),
        segmentacao: z.object({
            cargos: z.array(z.string()),
            funcoes: z.array(z.string()),
            senioridade: z.array(z.string()),
            setores: z.array(z.string()),
            porte_empresa: z.array(z.string()),
            localizacao: z.array(z.string()),
        }),
        anuncios: z.array(z.object({
            texto_introdutorio: z.string().describe("Idealmente até 150 caracteres (máximo 600)"),
            titulo: z.string().describe("Idealmente até 70 caracteres (máximo 200)"),
            cta: z.string(),
            pagina_destino: z.string(),
        })),
    }),
    justificativa: z.string(),
    metricas_sucesso: z.string(),
});

type MediaPlan = z.infer<typeof MediaSchema>;

const SYSTEM = `Você é o gestor de mídia paga da Adone Intelligence, especialista em Google Ads (rede de pesquisa)
e LinkedIn Ads para geração de leads B2B de alto valor. Seu objetivo é gerar diagnósticos agendados com médias
empresas que podem investir em IA/ML, com custo controlado.

${COMPANY_CONTEXT}

REGRAS:
- Google Ads: só rede de pesquisa, termos de fundo de funil (intenção de contratar), correspondência exata ou de
  frase, e negativas contra cursos, vagas, salários, "grátis", "o que é", trabalhos acadêmicos e ferramentas gratuitas.
- LinkedIn Ads: segmente por cargo/senioridade de decisão (diretoria, gerência, C-level), setores da estratégia e
  empresas com 51+ funcionários, Brasil.
- Orçamentos iniciais conservadores, pensados como teste; o Maicon decide a verba final.
- Páginas de destino: /agendar (diagnóstico) ou artigos do blog; nunca prometa resultado garantido.

FOCO EM QUEM PAGA ("prefiro um lead que paga do que 100 que só olham"):
- Os anúncios devem PRÉ-QUALIFICAR: deixe claro para quem é (médias empresas, 50+ funcionários) e que é um
  projeto de investimento (ex.: "projetos a partir de R$ 25 mil"). Menos cliques de curiosos = verba melhor usada.
- Google Ads: só termos com intenção de contratar ("consultoria", "empresa de", "implementar ... na empresa");
  nada de termos genéricos ou educativos. Negativas amplas: curso, grátis, gratuito, free, vaga, emprego,
  salário, o que é, como funciona, tcc, faculdade, pdf, ChatGPT, template, freelancer, barato.
- LinkedIn Ads: só decisores (Diretor, VP, C-level, Proprietário, Sócio, Gerente sênior) de empresas com 51+
  funcionários; objetivo "Conversões no site" levando a /agendar, em vez de formulários fáceis que geram
  leads frios.
- Métrica de sucesso sempre em reuniões qualificadas e custo por lead qualificado — nunca em cliques ou CTR.`;

function slug(text: string): string {
    return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function withUtm(path: string, source: string, medium: string, campaign: string): string {
    const url = new URL(path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", slug(campaign));
    return url.toString();
}

// Remove textos acima do limite da plataforma e devolve os alertas
function enforceLimits(plan: MediaPlan): { google: string[]; linkedin: string[] } {
    const google: string[] = [];
    for (const g of plan.google_ads.grupos) {
        const titles = g.titulos.filter(t => t.length <= LIMITS.googleTitle);
        const descriptions = g.descricoes.filter(d => d.length <= LIMITS.googleDescription);
        if (titles.length < g.titulos.length) google.push(`${g.nome}: ${g.titulos.length - titles.length} título(s) acima de ${LIMITS.googleTitle} caracteres removido(s)`);
        if (descriptions.length < g.descricoes.length) google.push(`${g.nome}: ${g.descricoes.length - descriptions.length} descrição(ões) acima de ${LIMITS.googleDescription} caracteres removida(s)`);
        if (titles.length < 3) google.push(`${g.nome}: menos de 3 títulos válidos — o Google exige no mínimo 3`);
        if (descriptions.length < 2) google.push(`${g.nome}: menos de 2 descrições válidas — o Google exige no mínimo 2`);
        g.titulos = titles;
        g.descricoes = descriptions;
    }
    const linkedin: string[] = [];
    plan.linkedin_ads.anuncios = plan.linkedin_ads.anuncios.filter((a, i) => {
        const ok = a.texto_introdutorio.length <= LIMITS.linkedinIntro && a.titulo.length <= LIMITS.linkedinHeadline;
        if (!ok) linkedin.push(`Anúncio ${i + 1} acima do limite de caracteres do LinkedIn — removido`);
        return ok;
    });
    return { google, linkedin };
}

function investmentText(rows: SheetRow[]): string {
    if (!rows.length) return "(nenhum investimento lançado ainda)";
    return rows.slice(-12).map(r => `${r["Semana (início)"]} | ${r.Plataforma} | ${r.Campanha} | R$ ${r["Valor gasto (R$)"]} | ${r.Cliques} cliques`).join("\n");
}

export async function runMedia(): Promise<MediaPlan | null> {
    const [strategies, campaigns, investment, metrics] = await Promise.all([
        readSheet(STRATEGY_SHEET).catch(() => []),
        readSheet(CAMPAIGNS_SHEET).catch(() => []),
        readInvestment().catch(() => []),
        buildMetricsSummary(),
    ]);
    const strategy = [...strategies].reverse().find(r => r.Status === STATUS.approved);
    if (!strategy) {
        await notifyOwner("📣 O agente de Mídia não rodou: não há estratégia *Aprovada* na aba \"Estratégia\".");
        return null;
    }
    const lastCampaigns = campaigns.slice(-4).map(c => `${c.Plataforma} | ${c.Campanha} | ${c.Status} | comentários: ${c["Seus comentários"] || "-"}`).join("\n") || "(nenhuma)";

    const plan = await generateStructured({
        model: STRATEGY_MODEL,
        effort: "high",
        system: SYSTEM,
        name: "plano_de_midia",
        schema: MediaSchema,
        prompt: [
            `ESTRATÉGIA APROVADA (${strategy.Semana}):`,
            `ICP: ${strategy["Cliente ideal (ICP)"]}`,
            `Posicionamento: ${strategy.Posicionamento}`,
            `Hipóteses: ${strategy["Hipóteses de campanha"]}`,
            strategy["Seus comentários"] ? `Comentários do Maicon: ${strategy["Seus comentários"]}` : "",
            "", "NÚMEROS:", metrics,
            "", "INVESTIMENTO LANÇADO:", investmentText(investment),
            "", "CAMPANHAS ANTERIORES:", lastCampaigns,
            "", "Monte o plano desta semana para Google Ads e LinkedIn Ads (prioridade inicial dos dois canais).",
        ].join("\n"),
    });

    const alerts = enforceLimits(plan);
    const g = plan.google_ads;
    const l = plan.linkedin_ads;

    await appendCampaign({
        Plataforma: "Google Ads",
        Campanha: g.campanha,
        Objetivo: g.objetivo,
        "Orçamento diário (R$)": g.orcamento_diario_brl.toFixed(2),
        "Segmentação / palavras-chave": g.grupos.map(gr =>
            `[${gr.nome}]\n` + gr.palavras_chave.map(k => k.correspondencia === "exata" ? `[${k.termo}]` : `"${k.termo}"`).join("\n")
        ).join("\n\n"),
        Anúncios: g.grupos.map(gr => `[${gr.nome}]\nTítulos:\n${gr.titulos.join("\n")}\nDescrições:\n${gr.descricoes.join("\n")}`).join("\n\n"),
        Negativas: g.negativas.join("\n"),
        "URL final (com UTM)": g.grupos.map(gr => `${gr.nome}: ${withUtm(gr.pagina_destino, "google", "cpc", g.campanha)}`).join("\n"),
        Justificativa: plan.justificativa,
        "Métrica de sucesso": plan.metricas_sucesso,
        Alertas: alerts.google.join("\n"),
        "Semana da estratégia": strategy.Semana,
    });

    const s = l.segmentacao;
    await appendCampaign({
        Plataforma: "LinkedIn Ads",
        Campanha: l.campanha,
        Objetivo: l.objetivo,
        "Orçamento diário (R$)": l.orcamento_diario_brl.toFixed(2),
        "Segmentação / palavras-chave": [
            `Cargos: ${s.cargos.join(", ")}`,
            `Funções: ${s.funcoes.join(", ")}`,
            `Senioridade: ${s.senioridade.join(", ")}`,
            `Setores: ${s.setores.join(", ")}`,
            `Porte: ${s.porte_empresa.join(", ")}`,
            `Localização: ${s.localizacao.join(", ")}`,
        ].join("\n"),
        Anúncios: l.anuncios.map((a, i) => `[Anúncio ${i + 1}]\nTexto: ${a.texto_introdutorio}\nTítulo: ${a.titulo}\nCTA: ${a.cta}`).join("\n\n"),
        "URL final (com UTM)": l.anuncios.map((a, i) => `Anúncio ${i + 1}: ${withUtm(a.pagina_destino, "linkedin", "paid_social", l.campanha)}`).join("\n"),
        Justificativa: plan.justificativa,
        "Métrica de sucesso": plan.metricas_sucesso,
        Alertas: alerts.linkedin.join("\n"),
        "Semana da estratégia": strategy.Semana,
    });

    await notifyOwner(
        `📣 *Planos de campanha prontos para revisão*\n\n` +
        `• Google Ads: ${g.campanha} (R$ ${g.orcamento_diario_brl.toFixed(0)}/dia sugerido)\n` +
        `• LinkedIn Ads: ${l.campanha} (R$ ${l.orcamento_diario_brl.toFixed(0)}/dia sugerido)\n\n` +
        `Revise na aba "Campanhas". Nada é ativado sozinho: após aprovar, suba nas plataformas com as URLs com UTM da planilha.`
    );
    return plan;
}
