import { ArrowDown, BookOpen, Download, MousePointerClick, Search, Spline } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Background, Container, Wrapper } from "@/components";
import { ArcExplorer } from "@/components/marketing/biblia-conectada/arc-explorer";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

export const metadata: Metadata = {
    title: "Bíblia Conectada | 344.799 referências cruzadas em arcos",
    description: "Visualização interativa das referências cruzadas da Bíblia, de Gênesis a Apocalipse: 344.799 ligações entre 31.102 versículos, com busca e o texto da Bíblia Livre.",
};

const stats = [
    ["344.799", "referências cruzadas"],
    ["31.102", "versículos"],
    ["1.189", "capítulos"],
    ["212", "ligações de Isaías 9:6"],
];

const howTo = [
    { icon: Spline, title: "Cada arco é uma ligação", text: "Um semicírculo liga dois versículos que citam ou ecoam um ao outro. Arcos curtos (dourados) ficam no mesmo livro; os longos (roxos) atravessam a Bíblia." },
    { icon: BookOpen, title: "A base são os capítulos", text: "Cada barra é um dos 1.189 capítulos, de Gênesis a Apocalipse; a altura é o número de versículos. A barra mais alta é o Salmo 119." },
    { icon: MousePointerClick, title: "Passe o mouse e clique", text: "O versículo sob o cursor mostra o texto e as ligações. Clique para fixar e ver a lista completa, ordenada pelos votos da base." },
    { icon: Search, title: "Busque um versículo", text: "Digite “Is 9:6”, “João 3:16” ou “Gn 1.1”. Use o filtro de votos para ver só as ligações mais fortes." },
];

const top = [
    ["Is 9:6", "212"],
    ["1Pe 2:9", "194"],
    ["Mt 28:20", "169"],
    ["Tt 2:14", "157"],
    ["Is 41:10", "156"],
];

const BibliaConectadaPage = () => {
    return (
        <Background>
            <Wrapper className="relative overflow-hidden pt-28 pb-20">
                {/* Hero */}
                <Container className="relative">
                    <Spotlight className="-top-40 left-0 md:left-72 md:-top-28" fill="rgba(0, 196, 160, 0.35)" />
                    <section className="relative z-10 text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-700">
                            <Spline className="h-4 w-4" /> Visualização de dados
                        </div>
                        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Bíblia Conectada
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Todas as referências cruzadas da Bíblia em um só gráfico, de Gênesis a Apocalipse. Explore os arcos, busque um versículo e veja como os textos se conectam.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild size="xl" className="btn-primary">
                                <Link href="#explorar">
                                    Explorar o gráfico
                                    <ArrowDown className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="xl" variant="subtle">
                                <Link href="#como-ler">Como ler</Link>
                            </Button>
                        </div>
                        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
                            {stats.map(([value, label]) => (
                                <div key={label} className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-4">
                                    <strong className="block text-2xl text-foreground">{value}</strong>
                                    <span className="text-sm text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Gráfico interativo */}
                <Container className="mt-16">
                    {/* mais largo que o miolo da página (max-w-6xl) para o gráfico ganhar espaço */}
                    <section id="explorar" className="relative left-1/2 w-[min(calc(100vw-2rem),1400px)] -translate-x-1/2 scroll-mt-28">
                        <ArcExplorer />
                    </section>
                </Container>

                {/* Como ler */}
                <Container className="mt-20">
                    <section id="como-ler" className="scroll-mt-28">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Como ler</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Um arco para cada ligação entre dois versículos.</h2>
                        </div>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {howTo.map(({ icon: Icon, title, text }) => (
                                <div key={title} className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-5">
                                    <Icon className="h-6 w-6 text-brand-600" />
                                    <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Números e reel */}
                <Container className="mt-20">
                    <section className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Os números</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Isaías 9:6 é o versículo mais conectado.</h2>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                                Contando cada par de versículos uma única vez, “Porque um menino nos nasceu” tem 212 ligações. O gráfico original de 2007 tinha 63.779 arcos; a base aberta de hoje reúne 344.799.
                            </p>
                            <ol className="mt-6 max-w-sm divide-y divide-foreground/10 rounded-xl border border-foreground/10">
                                {top.map(([refName, n], k) => (
                                    <li key={refName} className="flex items-center justify-between px-4 py-3 text-sm">
                                        <span><span className="mr-3 text-muted-foreground">{k + 1}.</span><b className="text-foreground">{refName}</b></span>
                                        <span className="text-brand-700">{n} ligações</span>
                                    </li>
                                ))}
                            </ol>
                            <Button asChild variant="subtle" className="mt-6">
                                <a href="/biblia-conectada/arco_geral.webp" download>
                                    <Download className="mr-2 h-4 w-4" /> Baixar o gráfico em alta resolução
                                </a>
                            </Button>
                        </div>
                        <video
                            src="/biblia-conectada/reel.mp4"
                            className="mx-auto aspect-[9/16] w-full max-w-[360px] rounded-2xl border border-ink/10 bg-black"
                            controls
                            muted
                            playsInline
                            preload="metadata"
                        />
                    </section>
                </Container>

                {/* Créditos */}
                <Container className="mt-20">
                    <section className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-6 text-sm leading-7 text-muted-foreground">
                        <h2 className="text-base font-semibold text-foreground">Fontes e créditos</h2>
                        <p className="mt-2">
                            Referências cruzadas:{" "}
                            <a href="https://www.openbible.info/labs/cross-references/" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">OpenBible.info</a>{" "}
                            (CC-BY), derivado do Treasury of Scripture Knowledge.
                            Texto: Bíblia Livre (BLIVRE), © Diego Santos, Mario Sérgio e Marco Teles, licença Creative Commons Atribuição 4.0 Brasil.
                            Visualização inspirada no trabalho de Chris Harrison e Christoph Römhild (2007).
                        </p>
                    </section>
                </Container>
            </Wrapper>
        </Background>
    );
};

export default BibliaConectadaPage;
