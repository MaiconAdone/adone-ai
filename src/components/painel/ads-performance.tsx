// Desempenho das campanhas pagas no /painel, lido das abas "Desempenho Ads" e "Termos de busca"
// (preenchidas de hora em hora pelo script do Google Ads e pela sincronização do site).

import type { SheetRow } from "@/lib/engine/marketing/workspace";

interface Totals { impressions: number; clicks: number; spend: number; conversions: number }

const parseNum = (v: string | undefined) => Number(String(v ?? "0").replace(/\./g, "").replace(",", ".")) || 0;
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const int = (n: number) => n.toLocaleString("pt-BR");

function sum(rows: SheetRow[]): Totals {
    return rows.reduce<Totals>((t, r) => ({
        impressions: t.impressions + parseNum(r["Impressões"]),
        clicks: t.clicks + parseNum(r.Cliques),
        spend: t.spend + parseNum(r["Gasto (R$)"]),
        conversions: t.conversions + parseNum(r["Conversões"]),
    }), { impressions: 0, clicks: 0, spend: 0, conversions: 0 });
}

const ctr = (t: Totals) => (t.impressions ? `${((t.clicks / t.impressions) * 100).toFixed(2).replace(".", ",")}%` : "—");
const cpc = (t: Totals) => (t.clicks ? brl(t.spend / t.clicks) : "—");
const cpa = (t: Totals) => (t.conversions ? brl(t.spend / t.conversions) : "—");

// Datas da aba são AAAA-MM-DD no fuso de Brasília
function isoDaysAgo(days: number, now: Date): string {
    return new Date(now.getTime() - days * 86_400_000).toLocaleDateString("sv-SE", { timeZone: "America/Sao_Paulo" });
}

const th = "pb-2 font-medium text-right";
const td = "py-1.5 text-right";

function MetricsRow({ label, t, strong }: { label: React.ReactNode; t: Totals; strong?: boolean }) {
    return (
        <tr className={strong ? "border-t border-foreground/10 font-semibold text-foreground" : "border-t border-foreground/5"}>
            <td className="py-1.5 text-foreground">{label}</td>
            <td className={td}>{int(t.impressions)}</td>
            <td className={td}>{int(t.clicks)}</td>
            <td className={td}>{ctr(t)}</td>
            <td className={td}>{cpc(t)}</td>
            <td className={td}>{brl(t.spend)}</td>
            <td className={td}>{t.conversions ? t.conversions.toLocaleString("pt-BR") : "0"}</td>
            <td className={td}>{cpa(t)}</td>
        </tr>
    );
}

function MetricsHead({ first }: { first: string }) {
    return (
        <thead>
            <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">{first}</th>
                <th className={th}>Impr.</th>
                <th className={th}>Cliques</th>
                <th className={th}>CTR</th>
                <th className={th}>CPC</th>
                <th className={th}>Gasto</th>
                <th className={th}>Conv.</th>
                <th className={th}>Custo/conv.</th>
            </tr>
        </thead>
    );
}

export function AdsPerformance({ rows, terms, lastSync, now = new Date() }: { rows: SheetRow[]; terms: SheetRow[]; lastSync?: string; now?: Date }) {
    const platforms = [...new Set(rows.map(r => r.Plataforma).filter(Boolean))].sort();
    const from7 = isoDaysAgo(7, now);
    const from30 = isoDaysAgo(30, now);
    const last30 = rows.filter(r => r.Data >= from30);

    const groups = new Map<string, SheetRow[]>();
    for (const r of last30) {
        const key = `${r.Plataforma} › ${r.Campanha} › ${r["Grupo / conjunto"]}`;
        groups.set(key, [...(groups.get(key) ?? []), r]);
    }
    const days = [...new Set(rows.map(r => r.Data))].sort().reverse().slice(0, 7);
    const topTerms = [...terms].sort((a, b) => parseNum(b["Gasto (R$)"]) - parseNum(a["Gasto (R$)"])).slice(0, 10);

    return (
        <section className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Campanhas pagas</h2>
                <p className="text-xs text-muted-foreground">Última sincronização: {lastSync || "ainda não sincronizou"}</p>
            </div>

            {rows.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">
                    Sem dados ainda. Instale o script <code>scripts/google-ads-script.js</code> no Google Ads (Ferramentas › Ações em massa ›
                    Scripts, de hora em hora) ou configure a API para preencher a aba &quot;Desempenho Ads&quot; da planilha.
                </p>
            ) : (
                <div className="mt-4 space-y-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <MetricsHead first="Período" />
                            <tbody>
                                {platforms.flatMap(p => [
                                    <MetricsRow key={`${p}-7`} label={`${p} · 7 dias`} t={sum(rows.filter(r => r.Plataforma === p && r.Data >= from7))} />,
                                    <MetricsRow key={`${p}-30`} label={`${p} · 30 dias`} t={sum(last30.filter(r => r.Plataforma === p))} strong />,
                                ])}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Por campanha e grupo (30 dias)</p>
                        <table className="w-full text-sm">
                            <MetricsHead first="Campanha › grupo" />
                            <tbody>
                                {[...groups.entries()]
                                    .map(([key, list]) => [key, sum(list)] as const)
                                    .sort((a, b) => b[1].spend - a[1].spend)
                                    .map(([key, t]) => <MetricsRow key={key} label={key} t={t} />)}
                            </tbody>
                        </table>
                    </div>

                    <div className="overflow-x-auto">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">Por dia (todas as plataformas)</p>
                        <table className="w-full text-sm">
                            <MetricsHead first="Dia" />
                            <tbody>
                                {days.map(d => (
                                    <MetricsRow key={d} label={d.split("-").reverse().join("/")} t={sum(rows.filter(r => r.Data === d))} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {topTerms.length > 0 && (
                        <div className="overflow-x-auto">
                            <p className="mb-2 text-xs font-medium text-muted-foreground">Termos de busca do Google que mais gastaram (30 dias)</p>
                            <table className="w-full text-sm">
                                <MetricsHead first="Termo" />
                                <tbody>
                                    {topTerms.map(t => <MetricsRow key={`${t.Termo}-${t.Grupo}`} label={t.Termo} t={sum([t])} />)}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                        Conversões = cliques no WhatsApp e agendamentos rastreados pela tag. Enquanto as conversões do Google Ads não estiverem
                        configuradas, a qualidade dos leads aparece no funil por canal (UTM) acima.
                    </p>
                </div>
            )}
        </section>
    );
}
