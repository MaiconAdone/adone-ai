"use client";

import { ArrowRightIcon, BrainCircuitIcon, GaugeIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Container from "../global/container";
import NumberTicker from "../ui/number-ticker";
import { BackgroundVideo } from "../effects/background-video";
import { VIDEOS } from "@/constants/media";

const STATS = [
    { value: 87, suffix: "%", label: "menos processos manuais" },
    { value: 3, suffix: "x", label: "mais velocidade nas decisões" },
    { value: 98, suffix: "%", label: "de satisfação dos clientes" },
];

const VALUES = [
    { icon: BrainCircuitIcon, title: "IA sob medida", desc: "Modelos treinados com os dados do seu negócio, não templates genéricos." },
    { icon: ZapIcon, title: "Resultado rápido", desc: "Primeiros resultados em até 30 dias de projeto." },
    { icon: GaugeIcon, title: "Métricas claras", desc: "ROI mensurável e painéis acompanhados em tempo real." },
];

const Hero = () => {
    return (
        <section className="w-full pt-20 lg:pt-24 px-3 md:px-6">
            <div className="relative mx-auto w-full max-w-[1320px] min-h-[640px] md:min-h-[680px] overflow-hidden rounded-[28px] bg-ink">
                {/* No desktop o vídeo é mais largo que o bloco e ancorado à esquerda: a pessoa (centro do vídeo) fica à direita do texto */}
                <BackgroundVideo {...VIDEOS.hero} mediaClassName="md:w-[135%] md:max-w-none md:object-top" />
                {/* Degradê grafite (cor da logo) para o texto ficar legível sobre o vídeo */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,20,27,0.92)_0%,rgba(10,20,27,0.8)_38%,rgba(10,20,27,0.15)_62%,rgba(10,20,27,0.05)_100%)] max-md:bg-[linear-gradient(180deg,rgba(10,20,27,0.88)_0%,rgba(10,20,27,0.8)_60%,rgba(10,20,27,0.92)_100%)]" />

                <div className="relative z-10 flex flex-col justify-between h-full min-h-[640px] md:min-h-[680px] px-6 py-12 md:px-14 md:py-16">
                    <div className="max-w-2xl">
                        <Container delay={0}>
                            <div className="inline-flex items-center gap-2.5 rounded-full border border-cream/20 bg-white/5 backdrop-blur px-3.5 py-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-cream/90">
                                    Inteligência Artificial para negócios reais
                                </span>
                            </div>
                        </Container>

                        <Container delay={0.05}>
                            <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight !leading-[1.08] text-white">
                                Transforme dados em{" "}
                                <span className="relative sm:whitespace-nowrap text-brand-400">
                                    vantagem competitiva
                                </span>{" "}
                                com IA
                            </h1>
                        </Container>

                        <Container delay={0.1}>
                            <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-cream/80">
                                A Adone AI desenvolve soluções de Machine Learning e Inteligência Artificial
                                que eliminam processos manuais, antecipam resultados e geram escala real
                                para empresas que querem crescer com inteligência.
                            </p>
                        </Container>

                        <Container delay={0.15}>
                            <div className="mt-9 flex flex-col sm:flex-row gap-3">
                                <Button asChild size="xl" className="rounded-full bg-brand-400 text-ink font-semibold hover:bg-brand-300 hover:opacity-100 px-8">
                                    <Link href="#contato">
                                        Agendar diagnóstico
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                <Button asChild size="xl" variant="ghost" className="rounded-full border border-cream/30 text-white hover:bg-white/10 hover:text-white px-8">
                                    <Link href="#servicos">Ver soluções</Link>
                                </Button>
                            </div>
                        </Container>
                    </div>

                    <Container delay={0.2}>
                        <dl className="mt-14 grid grid-cols-3 gap-4 sm:gap-10 max-w-2xl border-t border-cream/15 pt-6">
                            {STATS.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="sr-only">{stat.label}</dt>
                                    <dd className="flex items-baseline gap-0.5 font-heading text-3xl sm:text-4xl font-semibold text-white">
                                        <NumberTicker value={stat.value} className="text-white" />
                                        <span className="text-brand-400">{stat.suffix}</span>
                                    </dd>
                                    <p aria-hidden="true" className="mt-1 text-xs sm:text-sm text-cream/70">{stat.label}</p>
                                </div>
                            ))}
                        </dl>
                    </Container>
                </div>
            </div>

            {/* Cartões brancos sobrepostos à base do vídeo */}
            <div className="relative z-10 mx-auto -mt-10 w-full max-w-[1180px] px-3 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {VALUES.map((item) => (
                        <div key={item.title} className="flex items-start gap-4 rounded-2xl bg-white p-5 md:p-6 shadow-[0_20px_50px_-24px_rgba(10,20,27,0.35)] ring-1 ring-ink/5">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                <item.icon className="h-5 w-5" strokeWidth={1.75} />
                            </div>
                            <div>
                                <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
