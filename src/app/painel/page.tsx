import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";

import { hasPainelSession } from "@/lib/painel-auth";
import { getDashboardData } from "@/lib/engine/marketing/dashboard";
import { daysUntilExpiry, getConnection, readIntegrationValue, type LinkedInConnection } from "@/lib/engine/linkedin/connection";
import { googleAdsConfigured } from "@/lib/engine/ads/google-ads";
import { LAST_SYNC_KEY } from "@/lib/engine/ads/sync";
import { ROW_KEY } from "@/lib/engine/marketing/workspace";
import { AdsPerformance } from "@/components/painel/ads-performance";
import { ContactLeadButton, LogoutButton, RunAgentButton, WeeklyChart } from "@/components/painel/painel-actions";
import { cn } from "@/functions";

export const dynamic = "force-dynamic";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Delta({ current, previous }: { current: number; previous: number }) {
    if (previous === 0) return <span className="text-xs text-muted-foreground">sem base anterior</span>;
    const pct = Math.round(((current - previous) / previous) * 100);
    return <span className={cn("text-xs", pct >= 0 ? "text-green-500" : "text-red-400")}>{pct >= 0 ? "+" : ""}{pct}% vs. 30 dias anteriores</span>;
}

function Card({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <section className={cn("rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5", className)}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
            <div className="mt-4">{children}</div>
        </section>
    );
}

function StatusBadge({ status }: { status: string }) {
    const tone = status === "Aprovado" || status === "Publicado" || status === "Sucesso"
        ? "bg-green-500/15 text-green-600 light:text-green-700"
        : status === "Rejeitado" || status === "Falha"
            ? "bg-red-500/15 text-red-400 light:text-red-600"
            : "bg-amber-500/15 text-amber-500 light:text-amber-700";
    return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", tone)}>{status || "—"}</span>;
}

const LINKEDIN_MESSAGES: Record<string, string> = {
    ok: "conectado.",
    "sem-permissao": "o app no portal de desenvolvedores do LinkedIn ainda não tem o produto necessário (página: Community Management API; anúncios: Advertising API).",
    negado: "A autorização no LinkedIn foi cancelada.",
    "erro-sessao": "A autorização expirou. Clique em \"Conectar LinkedIn\" de novo.",
    erro: "O LinkedIn não devolveu o acesso. Tente de novo em instantes.",
};

function connectionText(connection: LinkedInConnection | null): string {
    const days = daysUntilExpiry(connection);
    if (!connection) return "não conectado";
    if (days !== null && days < 0) return "conexão expirada — reconecte";
    return `conectado${days !== null ? ` · expira em ${days} dia(s)` : ""}`;
}

export default async function PainelPage({ searchParams }: { searchParams: Promise<{ linkedin?: string; app?: string }> }) {
    if (!(await hasPainelSession())) redirect("/painel/login");
    const [data, linkedinPage, linkedinAds, lastSync, params] = await Promise.all([
        getDashboardData(),
        getConnection("page").catch(() => null),
        getConnection("ads").catch(() => null),
        readIntegrationValue(LAST_SYNC_KEY).catch(() => undefined),
        searchParams,
    ]);
    const linkedinMessage = params.linkedin
        ? `${params.app === "ads" ? "LinkedIn Ads" : "Página do LinkedIn"}: ${LINKEDIN_MESSAGES[params.linkedin] ?? params.linkedin}`
        : undefined;
    const { totals } = data;
    const costPerMeeting = totals.spend > 0 && totals.meetings > 0 ? totals.spend / totals.meetings : null;
    const costPerQualified = totals.spend > 0 && totals.qualified > 0 ? totals.spend / totals.qualified : null;
    const qualificationRate = totals.leads > 0 ? Math.round((totals.qualified / totals.leads) * 100) : null;
    const pct = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : "—");

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Painel de marketing</h1>
                    <p className="text-sm text-muted-foreground">
                        Atualizado em {new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} · últimos 30 dias
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={data.sheetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-brand-700 hover:underline">
                        Planilha <ExternalLinkIcon className="ml-1 h-3.5 w-3.5" />
                    </Link>
                    <Link href="/blog" target="_blank" className="inline-flex items-center text-sm text-brand-700 hover:underline ml-3">
                        Blog <ExternalLinkIcon className="ml-1 h-3.5 w-3.5" />
                    </Link>
                    <LogoutButton />
                </div>
            </header>

            {/* Números principais — foco em quem pode pagar, não em volume */}
            <p className="mt-6 text-sm text-muted-foreground">
                <strong className="text-foreground">&ldquo;Prefiro um lead que paga do que 100 que só olham.&rdquo;</strong>{" "}
                O que importa aqui são qualificados e reuniões com empresas do perfil — volume é só referência.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
                {[
                    { label: "Leads qualificados", value: totals.qualified, delta: <span className="text-xs text-muted-foreground">taxa de qualificação: {qualificationRate !== null ? `${qualificationRate}%` : "—"}</span> },
                    { label: "Reuniões", value: totals.meetings, delta: <Delta current={totals.meetings} previous={totals.meetingsPrev} /> },
                    { label: "Custo por qualificado", value: costPerQualified ? brl(costPerQualified) : "—", delta: <span className="text-xs text-muted-foreground">mídia paga ÷ qualificados</span> },
                    { label: "Custo por reunião", value: costPerMeeting ? brl(costPerMeeting) : "—", delta: <span className="text-xs text-muted-foreground">investido: {brl(totals.spend)}</span> },
                    { label: "Leads (volume)", value: totals.leads, delta: <Delta current={totals.leads} previous={totals.leadsPrev} /> },
                ].map(kpi => (
                    <div key={kpi.label} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <p className="mt-1 text-2xl font-semibold text-foreground">{kpi.value}</p>
                        <div className="mt-1">{kpi.delta}</div>
                    </div>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <Card title="Funil por canal">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-muted-foreground">
                                    <th className="pb-2 font-medium">Canal</th>
                                    <th className="pb-2 font-medium text-right">Leads</th>
                                    <th className="pb-2 font-medium text-right">Qualif.</th>
                                    <th className="pb-2 font-medium text-right">Taxa qualif.</th>
                                    <th className="pb-2 font-medium text-right">Reuniões</th>
                                    <th className="pb-2 font-medium text-right">Gasto</th>
                                    <th className="pb-2 font-medium text-right">Custo/qualificado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.funnel.map(row => (
                                    <tr key={row.channel} className="border-t border-foreground/5">
                                        <td className="py-2 text-foreground">{row.channel}</td>
                                        <td className="py-2 text-right">{row.leads}</td>
                                        <td className="py-2 text-right">{row.qualified}</td>
                                        <td className="py-2 text-right">{pct(row.qualified, row.leads)}</td>
                                        <td className="py-2 text-right">{row.meetings}</td>
                                        <td className="py-2 text-right">{row.spend > 0 ? brl(row.spend) : "—"}</td>
                                        <td className="py-2 text-right">{row.costPerQualified ? brl(row.costPerQualified) : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!data.hasInvestment && (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Custos aparecem quando o script do Google Ads / a sincronização do LinkedIn Ads preencherem a aba &quot;Desempenho Ads&quot;
                            (ou quando você lançar os gastos na aba &quot;Investimento&quot; da planilha).
                        </p>
                    )}
                </Card>

                <Card title="Google Analytics (30 dias)">
                    {data.ga4.status === "ok" ? (
                        <>
                            <p className="text-sm text-foreground">
                                <strong>{data.ga4.totals.sessions}</strong> visitas · <strong>{data.ga4.totals.users}</strong> usuários · <strong>{data.ga4.totals.keyEvents}</strong> eventos principais
                            </p>
                            <ul className="mt-3 space-y-1 text-sm">
                                {data.ga4.channels.slice(0, 6).map(c => (
                                    <li key={c.channel} className="flex justify-between border-t border-foreground/5 pt-1">
                                        <span className="text-muted-foreground">{c.channel}</span>
                                        <span className="text-foreground">{c.sessions}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : data.ga4.status === "not_configured" ? (
                        <p className="text-sm text-muted-foreground">Defina <code>GA4_PROPERTY_ID</code> para ver visitas por canal.</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Sem acesso ao GA4 ainda. Adicione <strong>adoneintelligence@gmail.com</strong> como <strong>Leitor</strong> na propriedade do Google Analytics.
                        </p>
                    )}
                </Card>
            </div>

            <AdsPerformance rows={data.ads.rows} terms={data.ads.terms} lastSync={lastSync} />

            {/* Monetização: reunião → proposta → contrato, desde o início (contratos fecham semanas depois) */}
            <Card title="Resultado comercial (desde o início)" className="mt-6">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {[
                        { label: "Propostas", value: data.revenue.total.proposals },
                        { label: "Contratos", value: data.revenue.total.won },
                        { label: "Receita", value: brl(data.revenue.total.revenue) },
                        { label: "Custo por contrato", value: data.revenue.total.costPerWon ? brl(data.revenue.total.costPerWon) : "—" },
                        { label: "Retorno sobre mídia", value: data.revenue.total.returnOnSpend ? `${data.revenue.total.returnOnSpend.toFixed(1)}x` : "—" },
                    ].map(kpi => (
                        <div key={kpi.label}>
                            <p className="text-xs text-muted-foreground">{kpi.label}</p>
                            <p className="mt-1 text-xl font-semibold text-foreground">{kpi.value}</p>
                        </div>
                    ))}
                </div>
                {data.revenue.byChannel.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-muted-foreground">
                                    <th className="pb-2 font-medium">Canal</th>
                                    <th className="pb-2 font-medium text-right">Reuniões</th>
                                    <th className="pb-2 font-medium text-right">Propostas</th>
                                    <th className="pb-2 font-medium text-right">Contratos</th>
                                    <th className="pb-2 font-medium text-right">Receita</th>
                                    <th className="pb-2 font-medium text-right">Gasto</th>
                                    <th className="pb-2 font-medium text-right">Retorno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.revenue.byChannel.map(row => (
                                    <tr key={row.channel} className="border-t border-foreground/5">
                                        <td className="py-2 text-foreground">{row.channel}</td>
                                        <td className="py-2 text-right">{row.meetings}</td>
                                        <td className="py-2 text-right">{row.proposals}</td>
                                        <td className="py-2 text-right">{row.won}</td>
                                        <td className="py-2 text-right">{row.revenue > 0 ? brl(row.revenue) : "—"}</td>
                                        <td className="py-2 text-right">{row.spend > 0 ? brl(row.spend) : "—"}</td>
                                        <td className="py-2 text-right">{row.returnOnSpend ? `${row.returnOnSpend.toFixed(1)}x` : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                    Depois de cada reunião, preencha &quot;Resultado da reunião&quot; e, se fechou, &quot;Valor do contrato (R$)&quot; na aba
                    &quot;Agendamentos&quot; da planilha ({data.revenue.filled} de {data.revenue.total.meetings} reuniões com resultado).
                </p>
            </Card>

            <Card title="Leads do formulário (14 dias)" className="mt-6">
                {data.formLeads.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum lead do formulário com telefone nos últimos 14 dias.</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                        {data.formLeads.map(l => (
                            <li key={l[ROW_KEY]} className="flex flex-wrap items-center justify-between gap-3 border-t border-foreground/5 pt-2 first:border-0 first:pt-0">
                                <div>
                                    <p className="text-foreground">{l.Nome} · {l.Empresa}</p>
                                    <p className="text-muted-foreground">{l.Data} · {l.Telefone}{l.Interesse ? ` · ${l.Interesse}` : ""}{l.Porte ? ` · ${l.Porte}` : ""}</p>
                                </div>
                                <ContactLeadButton row={l[ROW_KEY]} />
                            </li>
                        ))}
                    </ul>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                    A Vick já chama automaticamente quem preenche o formulário. Use o botão quando o WhatsApp estava fora do ar ou o lead ficou sem contato.
                </p>
            </Card>

            <Card title="Leads e reuniões por semana" className="mt-6">
                <WeeklyChart data={data.weekly} />
            </Card>

            <Card title="Integrações" className="mt-6">
                <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-foreground"><strong>Página no LinkedIn</strong> (posts automáticos): {connectionText(linkedinPage)}</p>
                        <a href="/api/linkedin?app=page" className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-foreground/5">
                            {linkedinPage ? "Renovar" : "Conectar"} página
                        </a>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-foreground"><strong>LinkedIn Ads</strong> (desempenho das campanhas): {connectionText(linkedinAds)}</p>
                        <a href="/api/linkedin?app=ads" className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-foreground/5">
                            {linkedinAds ? "Renovar" : "Conectar"} LinkedIn Ads
                        </a>
                    </div>
                    <p className="text-foreground">
                        <strong>Google Ads</strong> (desempenho e termos de busca): {googleAdsConfigured() ? "API configurada" : data.ads.rows.some(r => r.Plataforma === "Google Ads") ? "via script do Google Ads (API aguardando token de desenvolvedor)" : "aguardando o script do Google Ads ou o token de desenvolvedor da API"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Última sincronização dos anúncios: {lastSync || "ainda não sincronizou"} · os agentes só leem os dados e recomendam; nada é alterado nas contas.
                    </p>
                </div>
                {linkedinMessage && <p className="mt-2 text-xs text-muted-foreground">{linkedinMessage}</p>}
            </Card>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {data.agents.map(a => (
                    <Card key={a.agent} title={a.label}>
                        <p className="text-xs text-muted-foreground">Rotina: {a.schedule}</p>
                        {a.lastRun ? (
                            <div className="mt-3 text-sm">
                                <p className="text-foreground">Última execução: {a.lastRun["Início"]}</p>
                                <p className="mt-1"><StatusBadge status={a.lastRun.Resultado} /> <span className="text-muted-foreground">{a.lastRun["Duração (s)"]}s</span></p>
                                <p className="mt-1 text-muted-foreground">{a.lastRun.Resumo}</p>
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-muted-foreground">Ainda não rodou.</p>
                        )}
                        <div className="mt-4"><RunAgentButton agent={a.agent} running={a.running} /></div>
                    </Card>
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card title="Aprovações">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-foreground">Estratégia {data.strategy ? `(${data.strategy.Semana})` : ""}</span>
                            <StatusBadge status={data.strategy?.Status || "Nenhuma"} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-foreground">Artigos no blog</span>
                            <span className="text-muted-foreground">{data.content.published} publicados · {data.content.rejected} rejeitados</span>
                        </div>
                        {data.content.pending.length > 0 && (
                            <div>
                                <p className="text-foreground">Vão ao ar automaticamente (se você não rejeitar):</p>
                                <ul className="mt-1 space-y-1">
                                    {data.content.pending.map(c => (
                                        <li key={c.Slug} className="text-muted-foreground">• {c.Título} — {c["Publicar em"]}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Planos de campanha">
                    {data.campaigns.length === 0 ? (
                        <p className="text-sm text-muted-foreground">O agente de Mídia ainda não propôs campanhas.</p>
                    ) : (
                        <ul className="space-y-3 text-sm">
                            {data.campaigns.map((c, i) => (
                                <li key={`${c.Campanha}-${i}`} className="flex items-start justify-between gap-3 border-t border-foreground/5 pt-2 first:border-0 first:pt-0">
                                    <div>
                                        <p className="text-foreground">{c.Plataforma} · {c.Campanha}</p>
                                        <p className="text-muted-foreground">R$ {c["Orçamento diário (R$)"]}/dia sugerido · {c["Criado em"]?.split(",")[0]}</p>
                                        {c.Alertas && <p className="text-xs text-amber-500">{c.Alertas.split("\n")[0]}</p>}
                                    </div>
                                    <StatusBadge status={c.Status} />
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            </div>

            <Card title="Execuções recentes" className="mt-6">
                {data.recentRuns.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma execução registrada ainda.</p>
                ) : (
                    <ul className="space-y-2 text-sm">
                        {data.recentRuns.map((r, i) => (
                            <li key={i} className="flex flex-wrap items-center gap-2 border-t border-foreground/5 pt-2 first:border-0 first:pt-0">
                                <StatusBadge status={r.Resultado} />
                                <span className="text-foreground">{r.Agente}</span>
                                <span className="text-muted-foreground">{r["Início"]} · {r["Duração (s)"]}s · {r.Resumo}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </main>
    );
}
