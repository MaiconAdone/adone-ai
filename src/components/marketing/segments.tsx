"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import {
    ShoppingCartIcon,
    HeartPulseIcon,
    FactoryIcon,
    TruckIcon,
    LandmarkIcon,
    ShieldIcon,
    ScaleIcon,
    GraduationCapIcon,
    LeafIcon,
    BuildingIcon,
} from "lucide-react";

const SEGMENTS = [
    {
        icon: LandmarkIcon,
        title: "Financeiro & Fintechs",
        description: "Análise de crédito, detecção de fraudes, previsão de inadimplência e personalização de ofertas com IA.",
        highlight: "Redução de 60% no tempo de análise",
    },
    {
        icon: ShoppingCartIcon,
        title: "Varejo & E-commerce",
        description: "Recomendação de produtos, previsão de demanda, precificação dinâmica e prevenção de churn.",
        highlight: "+22% no ticket médio",
    },
    {
        icon: FactoryIcon,
        title: "Indústria & Manufatura",
        description: "Manutenção preditiva, controle de qualidade por visão computacional e otimização de linhas de produção.",
        highlight: "78% menos paradas não planejadas",
    },
    {
        icon: HeartPulseIcon,
        title: "Saúde & Life Sciences",
        description: "Diagnóstico assistido por IA, triagem inteligente, previsão de readmissão e análise de prontuários.",
        highlight: "94% de acurácia em diagnósticos",
    },
    {
        icon: TruckIcon,
        title: "Logística & Supply Chain",
        description: "Otimização de rotas, previsão de demanda, gestão de estoque e rastreabilidade com IA.",
        highlight: "34% de redução em estoque parado",
    },
    {
        icon: BuildingIcon,
        title: "Real Estate & Construção",
        description: "Previsão de preços, análise de risco de obras, aprovação inteligente de projetos e detecção de desvios.",
        highlight: "89% de precisão em previsões",
    },
    {
        icon: ShieldIcon,
        title: "Seguros",
        description: "Precificação de riscos com ML, detecção de fraudes em sinistros e automação de processos de subscrição.",
        highlight: "45% de redução em fraudes",
    },
    {
        icon: ScaleIcon,
        title: "Jurídico & Compliance",
        description: "Análise de contratos com NLP, pesquisa jurídica automatizada e monitoramento regulatório inteligente.",
        highlight: "70% mais rápido na análise",
    },
    {
        icon: GraduationCapIcon,
        title: "Educação",
        description: "Personalização de aprendizado, previsão de evasão, automação de correção e análise de desempenho.",
        highlight: "55% de redução na evasão",
    },
    {
        icon: LeafIcon,
        title: "Agronegócio",
        description: "Previsão de colheita, precificação de commodities, monitoramento de lavouras e gestão de riscos climáticos.",
        highlight: "R$ 2,4M economizados/semestre",
    },
];

const Segments = () => {
    return (
        <div id="segmentos" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Segmentos Atendidos" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        IA aplicada ao{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            seu setor
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Cada indústria tem seus desafios específicos. Nossas soluções são adaptadas à linguagem, aos dados e às dores de cada segmento.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
                    {SEGMENTS.map((segment, i) => (
                        <div
                            key={i}
                            className="group flex flex-col gap-3 p-5 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-violet-500/5 hover:border-violet-500/20 transition-all duration-300 cursor-default"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-foreground/5 border border-foreground/10 group-hover:bg-violet-500/10 group-hover:border-violet-500/30 transition-all duration-300 flex-shrink-0">
                                    <segment.icon strokeWidth={1.5} className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 transition-colors duration-300" />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground/90 leading-tight">
                                    {segment.title}
                                </h3>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {segment.description}
                            </p>
                            <div className="mt-auto pt-2 border-t border-foreground/5">
                                <span className="text-xs font-medium text-violet-400/80 bg-violet-500/10 px-2 py-0.5 rounded-full">
                                    {segment.highlight}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Segments;
