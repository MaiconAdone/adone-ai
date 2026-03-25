"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import { SearchIcon, FlaskConicalIcon, RocketIcon, BarChart3Icon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const STEPS = [
    {
        number: "01",
        icon: SearchIcon,
        title: "Diagnóstico Gratuito",
        description: "Em uma reunião de 60 minutos, nossos especialistas mapeiam seus principais gargalos operacionais, analisam seus dados disponíveis e identificam onde a IA pode gerar o maior impacto financeiro.",
        deliverable: "Relatório de Oportunidades em IA",
    },
    {
        number: "02",
        icon: FlaskConicalIcon,
        title: "Prova de Conceito (PoC)",
        description: "Desenvolvemos um modelo funcional em 2 a 4 semanas usando dados reais da sua empresa. Você valida os resultados antes de qualquer compromisso de longo prazo.",
        deliverable: "MVP Funcional + Métricas de Validação",
    },
    {
        number: "03",
        icon: RocketIcon,
        title: "Implementação e Integração",
        description: "Com a PoC aprovada, implementamos a solução completa integrada aos seus sistemas existentes — ERP, CRM, APIs — com treinamento para o seu time.",
        deliverable: "Solução em Produção + Documentação",
    },
    {
        number: "04",
        icon: BarChart3Icon,
        title: "Evolução Contínua",
        description: "Monitoramos os modelos em produção, retreinamos com novos dados e evoluímos as funcionalidades conforme o negócio cresce. IA não é projeto, é processo.",
        deliverable: "Suporte, Monitoramento e Evolução",
    },
];

const HowItWorks = () => {
    return (
        <div id="processo" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Como Funciona" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        Do diagnóstico ao resultado{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            em 4 etapas
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Um processo estruturado e transparente para garantir que sua empresa veja resultados reais — não promessas genéricas.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 w-full relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-16 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {STEPS.map((step, i) => (
                            <div key={i} className="flex flex-col items-start gap-4 relative group">
                                {/* Step header */}
                                <div className="flex flex-col items-center w-full relative">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:border-violet-400/50 transition-all duration-300">
                                            <step.icon strokeWidth={1.5} className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-white">{step.number}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Step content */}
                                <div className="flex flex-col gap-3 w-full p-5 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-violet-500/20 transition-all duration-300">
                                    <h3 className="text-base font-semibold font-heading text-foreground">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                    <div className="mt-2 pt-3 border-t border-foreground/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                            <span className="text-xs font-medium text-violet-400/80">
                                                {step.deliverable}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow between steps (mobile/tablet) */}
                                {i < STEPS.length - 1 && (
                                    <div className="lg:hidden flex justify-center w-full py-2">
                                        <ArrowRightIcon className="w-4 h-4 text-violet-500/50 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>

            <Container delay={0.3}>
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        Pronto para começar? O diagnóstico inicial é gratuito e sem compromisso.
                    </p>
                    <Link
                        href="#contato"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-6 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 whitespace-nowrap"
                    >
                        Agendar Diagnóstico Gratuito
                        <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default HowItWorks;
