"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import MagicCard from "../ui/magic-card";
import {
    BrainCircuitIcon,
    TrendingUpIcon,
    GitMergeIcon,
    EyeIcon,
    MessageSquareTextIcon,
    BarChart3Icon,
    PuzzleIcon,
    ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

const SERVICES = [
    {
        icon: BrainCircuitIcon,
        title: "Consultoria em IA",
        description: "Diagnóstico estratégico do seu negócio e definição do roadmap de IA. Identificamos onde a inteligência artificial gera mais valor para a sua empresa — sem achismos.",
        tag: "Estratégia",
        color: "from-violet-500/20 to-purple-500/10",
    },
    {
        icon: TrendingUpIcon,
        title: "Machine Learning Preditivo",
        description: "Modelos preditivos sob medida para prever demanda, churn, inadimplência, preços e qualquer variável crítica do seu negócio com acurácia superior a 90%.",
        tag: "Previsão",
        color: "from-blue-500/20 to-indigo-500/10",
    },
    {
        icon: GitMergeIcon,
        title: "Automação Inteligente",
        description: "Elimine gargalos operacionais com RPA potencializado por IA. Automatize processos de aprovação, classificação de documentos, atendimento e muito mais.",
        tag: "Operações",
        color: "from-emerald-500/20 to-teal-500/10",
    },
    {
        icon: EyeIcon,
        title: "Visão Computacional",
        description: "Análise de imagens e vídeos em tempo real para controle de qualidade, detecção de falhas em linha de produção, segurança patrimonial e inspeção automatizada.",
        tag: "Indústria",
        color: "from-orange-500/20 to-amber-500/10",
    },
    {
        icon: MessageSquareTextIcon,
        title: "NLP & Chatbots Inteligentes",
        description: "Processamento de linguagem natural para chatbots que entendem contexto, analisam sentimento em feedbacks, classificam tickets e extraem informações de documentos.",
        tag: "Linguagem",
        color: "from-pink-500/20 to-rose-500/10",
    },
    {
        icon: BarChart3Icon,
        title: "Análise Avançada de Dados",
        description: "Dashboards analíticos em tempo real, discovery de padrões ocultos nos seus dados e relatórios executivos que traduzem complexidade em decisões simples.",
        tag: "Dados",
        color: "from-cyan-500/20 to-sky-500/10",
    },
    {
        icon: PuzzleIcon,
        title: "Integração de IA em Sistemas",
        description: "Integração das nossas soluções de IA com seu ERP, CRM, e-commerce ou sistema legado via API. Sem migração de plataforma, sem interrupção das operações.",
        tag: "Integração",
        color: "from-violet-500/20 to-fuchsia-500/10",
    },
];

const Services = () => {
    return (
        <div id="servicos" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Soluções" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        IA que resolve <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">problemas reais</span> de negócio
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6 max-w-xl">
                        Nossas soluções são desenvolvidas a partir das dores da sua empresa — não de templates genéricos. Cada projeto é único, com entrega orientada a resultado.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {SERVICES.map((service, i) => (
                        <MagicCard
                            key={i}
                            particles={true}
                            className={`flex flex-col items-start w-full bg-gradient-to-br ${service.color} bg-primary/[0.04] group cursor-pointer`}
                        >
                            <div className="bento-card w-full flex-col gap-4 p-6">
                                <div className="flex items-start justify-between w-full">
                                    <div className="p-2.5 rounded-xl bg-foreground/5 border border-foreground/10 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 transition-all duration-300">
                                        <service.icon strokeWidth={1.5} className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <span className="text-xs font-medium text-violet-400/80 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">
                                        {service.tag}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold font-heading text-foreground group-hover:text-violet-100 transition-colors duration-300">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                    <Link href="#contato" className="flex items-center gap-1">
                                        Saiba mais <ArrowRightIcon className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </MagicCard>
                    ))}

                    {/* Card CTA */}
                    <MagicCard particles={false} className="flex flex-col items-start w-full bg-gradient-to-br from-violet-600/30 to-purple-600/20 border-violet-500/30 group cursor-pointer md:col-span-1">
                        <div className="bento-card w-full flex-col gap-4 p-6 items-center justify-center text-center h-full">
                            <div className="flex flex-col items-center justify-center gap-4 h-full py-4">
                                <div className="p-4 rounded-2xl bg-violet-500/20 border border-violet-400/30">
                                    <BrainCircuitIcon strokeWidth={1.5} className="w-8 h-8 text-violet-300" />
                                </div>
                                <h3 className="text-lg font-semibold font-heading text-foreground">
                                    Não encontrou o que precisa?
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Desenvolvemos soluções customizadas para qualquer desafio de negócio que envolva dados e inteligência artificial.
                                </p>
                                <Link
                                    href="#contato"
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 px-5 py-2.5 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/25"
                                >
                                    Fale com um especialista
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </MagicCard>
                </div>
            </Container>
        </div>
    );
};

export default Services;
