"use client";

import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Container from "../global/container";
import NumberTicker from "../ui/number-ticker";
import RetroGrid from "../ui/retro-grid";
import { Particles } from "../ui/particles";

const STATS = [
    { value: 87, suffix: "%", label: "Redução de processos manuais" },
    { value: 3, suffix: "x", label: "Mais velocidade nas decisões" },
    { value: 98, suffix: "%", label: "Satisfação dos clientes" },
];

const Hero = () => {
    return (
        <div className="flex flex-col items-center text-center w-full max-w-5xl my-24 mx-auto z-40 relative overflow-hidden">
            {/* Glow top */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-purple-600/30 blur-[6rem] -z-10" />
            {/* Glow bottom */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-violet-600 blur-[8rem] opacity-50" />

            {/* Conteúdo acima dos efeitos */}
            <div className="relative z-20 flex flex-col items-center text-center w-full">
                <Container delay={0.0}>
                    <div className="pl-2 pr-1 py-1 rounded-full border border-foreground/10 hover:border-foreground/20 backdrop-blur-lg cursor-pointer flex items-center gap-2.5 select-none w-max mx-auto transition-all duration-300">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary/40 flex items-center justify-center relative">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex items-center justify-center animate-ping absolute" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <span className="inline-flex items-center justify-center gap-2 animate-text-gradient animate-background-shine bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-sm text-transparent">
                            Inteligência Artificial para Negócios Reais
                            <span className="text-xs text-secondary-foreground px-1.5 py-0.5 rounded-full bg-gradient-to-b from-foreground/20 to-foreground/10 flex items-center justify-center">
                                Conheça
                                <ChevronRightIcon className="w-3.5 h-3.5 ml-1 text-foreground/50" />
                            </span>
                        </span>
                    </div>
                </Container>

                <Container delay={0.05}>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50 bg-clip-text text-transparent py-2 lg:!leading-tight font-semibold tracking-tight mt-6 font-heading">
                        Transforme dados em{" "}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            vantagem competitiva
                        </span>{" "}
                        com IA
                    </h1>
                </Container>

                <Container delay={0.1}>
                    <p className="text-base sm:text-lg lg:text-xl mt-6 text-accent-foreground/60 max-w-2xl mx-auto leading-relaxed">
                        A Adone AI desenvolve soluções de Machine Learning e Inteligência Artificial
                        que eliminam processos manuais, antecipam resultados e geram escala real
                        para empresas que querem crescer com inteligência.
                    </p>
                </Container>

                <Container delay={0.15}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <Button asChild size="lg" className="w-full sm:w-auto px-8 h-12 text-base font-semibold">
                            <Link href="#contato">
                                Agendar Diagnóstico Gratuito
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base">
                            <Link href="#servicos">
                                Ver Soluções
                            </Link>
                        </Button>
                    </div>
                </Container>

                <Container delay={0.2}>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-2xl mx-auto">
                        {STATS.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="flex items-end gap-0.5">
                                    <span className="text-4xl font-bold font-heading bg-gradient-to-br from-violet-400 to-purple-300 bg-clip-text text-transparent">
                                        <NumberTicker value={stat.value} />
                                    </span>
                                    <span className="text-2xl font-bold text-violet-400 mb-0.5">{stat.suffix}</span>
                                </div>
                                <p className="text-sm text-muted-foreground text-center">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>

                <Container delay={0.25}>
                    <div className="mt-16 relative mx-auto w-full max-w-4xl">
                        <div className="rounded-2xl border border-neutral-700/60 bg-neutral-900/80 backdrop-blur-sm p-6 md:p-8">
                            <div className="absolute top-1/2 left-1/2 -z-10 w-3/4 h-32 -translate-x-1/2 -translate-y-1/2 bg-violet-600/20 blur-[5rem] rounded-full" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { icon: "🧠", title: "IA Sob Medida", desc: "Modelos treinados com os dados do seu negócio" },
                                    { icon: "⚡", title: "Resultado Rápido", desc: "Primeiros resultados em até 30 dias de projeto" },
                                    { icon: "📊", title: "Métricas Claras", desc: "ROI mensurável e dashboards em tempo real" },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center text-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all duration-300">
                                        <span className="text-3xl">{item.icon}</span>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Efeitos de fundo — idênticos ao bloco CTA */}
            <RetroGrid />
            <Particles
                refresh
                ease={80}
                color="#8b5cf6"
                quantity={80}
                className="size-full absolute inset-0"
            />
        </div>
    );
};

export default Hero;
