"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, FlaskConicalIcon, RocketIcon, BarChart3Icon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/functions";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";

const STEPS = [
    {
        number: "01",
        icon: SearchIcon,
        title: "Diagnóstico",
        description: "Em uma reunião de 30 minutos, mapeamos seus principais gargalos operacionais, analisamos os dados disponíveis e identificamos onde a IA pode gerar o maior impacto financeiro.",
        deliverable: "Relatório de Oportunidades em IA",
        // Posição do ponto sobre a foto (em %)
        spot: { left: "30%", top: "18%" },
    },
    {
        number: "02",
        icon: FlaskConicalIcon,
        title: "Prova de Conceito (PoC)",
        description: "Desenvolvemos um modelo funcional em 2 a 4 semanas usando dados reais da sua empresa. Você valida os resultados antes de qualquer compromisso de longo prazo.",
        deliverable: "MVP Funcional + Métricas de Validação",
        spot: { left: "52%", top: "30%" },
    },
    {
        number: "03",
        icon: RocketIcon,
        title: "Implementação e Integração",
        description: "Com a PoC aprovada, implementamos a solução completa integrada aos seus sistemas existentes — ERP, CRM, APIs — com treinamento para o seu time.",
        deliverable: "Solução em Produção + Documentação",
        spot: { left: "62%", top: "58%" },
    },
    {
        number: "04",
        icon: BarChart3Icon,
        title: "Evolução Contínua",
        description: "Monitoramos os modelos em produção, retreinamos com novos dados e evoluímos as funcionalidades conforme o negócio cresce. IA não é projeto, é processo.",
        deliverable: "Suporte, Monitoramento e Evolução",
        spot: { left: "78%", top: "72%" },
    },
];

const HowItWorks = () => {
    const [active, setActive] = useState(0);
    const step = STEPS[active];

    return (
        <section id="processo" className="w-full py-16 md:py-24 bg-cream-light scroll-mt-20">
            <Wrapper>
                <SectionHeader
                    badge="Como funciona"
                    title={<>Do diagnóstico ao resultado <Highlight>em 4 etapas</Highlight></>}
                    description="Um processo estruturado e transparente para sua empresa ver resultado real, não promessas genéricas. Toque nos pontos da foto para conhecer cada etapa."
                />

                <Container>
                    <div className="relative mt-14 overflow-hidden rounded-[28px] bg-ink">
                        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
                            <Image
                                src="/img/equipe-reuniao.webp"
                                alt="Equipe em reunião analisando dados em um quadro de Analytics"
                                fill
                                sizes="(min-width: 1280px) 1100px, 100vw"
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-ink/25" />

                            {STEPS.map((item, i) => (
                                <button
                                    key={item.number}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    aria-label={`Etapa ${item.number}: ${item.title}`}
                                    aria-pressed={active === i}
                                    style={item.spot}
                                    className="group absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2"
                                >
                                    <span className="relative flex h-9 w-9 items-center justify-center">
                                        <span className={cn(
                                            "absolute inset-0 rounded-full bg-brand-400/50",
                                            active === i ? "animate-ping" : "opacity-0"
                                        )} />
                                        <span className={cn(
                                            "relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-2 transition-all duration-300",
                                            active === i
                                                ? "bg-brand-400 text-ink ring-white"
                                                : "bg-white/90 text-ink ring-white/60 group-hover:bg-brand-400"
                                        )}>
                                            {item.number}
                                        </span>
                                    </span>
                                    <span className="hidden md:inline rounded-full bg-ink/70 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
                                        {item.title}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Detalhe da etapa ativa */}
                        <div className="relative md:absolute md:bottom-6 md:left-6 md:max-w-md bg-white p-6 md:rounded-2xl md:shadow-[0_24px_60px_-24px_rgba(10,20,27,0.5)]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                                    <step.icon strokeWidth={1.75} className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Etapa {step.number}</p>
                                    <h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                                </div>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            <p className="mt-4 flex items-center gap-2 border-t border-ink/10 pt-3 text-xs font-semibold text-ink">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                                Entrega: {step.deliverable}
                            </p>
                        </div>
                    </div>

                    {/* Navegação por etapas (também serve como resumo) */}
                    <ol className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {STEPS.map((item, i) => (
                            <li key={item.number}>
                                <button
                                    type="button"
                                    onClick={() => setActive(i)}
                                    className={cn(
                                        "w-full rounded-xl border px-4 py-3 text-left transition-all duration-300",
                                        active === i
                                            ? "border-ink bg-ink text-white"
                                            : "border-ink/10 bg-white text-foreground hover:border-brand-500/50"
                                    )}
                                >
                                    <span className={cn("text-xs font-bold", active === i ? "text-brand-400" : "text-brand-700")}>{item.number}</span>
                                    <span className="block text-sm font-semibold">{item.title}</span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </Container>

                <Container delay={0.3}>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                        <p className="text-muted-foreground">
                            Pronto para começar? Agende um diagnóstico com nossos especialistas.
                        </p>
                        <Link
                            href="#contato"
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
                        >
                            Agendar diagnóstico
                            <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default HowItWorks;
