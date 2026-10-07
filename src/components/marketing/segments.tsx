"use client";

import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";
import { PHOTOS } from "@/constants/media";
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
        highlight: "Análise de crédito mais ágil",
        photo: PHOTOS.finance,
    },
    {
        icon: ShoppingCartIcon,
        title: "Varejo & E-commerce",
        description: "Recomendação de produtos, previsão de demanda, precificação dinâmica e prevenção de churn.",
        highlight: "Mais vendas por cliente",
        photo: PHOTOS.retail,
    },
    {
        icon: FactoryIcon,
        title: "Indústria & Manufatura",
        description: "Manutenção preditiva, controle de qualidade por visão computacional e otimização de linhas de produção.",
        highlight: "Menos paradas não planejadas",
        photo: PHOTOS.industry,
    },
    {
        icon: HeartPulseIcon,
        title: "Saúde & Life Sciences",
        description: "Diagnóstico assistido por IA, triagem inteligente, previsão de readmissão e análise de prontuários.",
        highlight: "Apoio à decisão clínica",
        photo: PHOTOS.health,
    },
    {
        icon: TruckIcon,
        title: "Logística & Supply Chain",
        description: "Otimização de rotas, previsão de demanda, gestão de estoque e rastreabilidade com IA.",
        highlight: "Menos estoque parado",
        photo: PHOTOS.logistics,
    },
    {
        icon: BuildingIcon,
        title: "Real Estate & Construção",
        description: "Previsão de preços, análise de risco de obras, aprovação inteligente de projetos e detecção de desvios.",
        highlight: "Preços e prazos com base em dados",
        photo: PHOTOS.realEstate,
    },
    {
        icon: ShieldIcon,
        title: "Seguros",
        description: "Precificação de riscos com ML, detecção de fraudes em sinistros e automação de processos de subscrição.",
        highlight: "Fraudes detectadas mais cedo",
        photo: PHOTOS.insurance,
    },
    {
        icon: ScaleIcon,
        title: "Jurídico & Compliance",
        description: "Análise de contratos com NLP, pesquisa jurídica automatizada e monitoramento regulatório inteligente.",
        highlight: "Contratos analisados em menos tempo",
        photo: PHOTOS.legal,
    },
    {
        icon: GraduationCapIcon,
        title: "Educação",
        description: "Personalização de aprendizado, previsão de evasão, automação de correção e análise de desempenho.",
        highlight: "Evasão identificada com antecedência",
        photo: PHOTOS.education,
    },
    {
        icon: LeafIcon,
        title: "Agronegócio",
        description: "Previsão de colheita, precificação de commodities, monitoramento de lavouras e gestão de riscos climáticos.",
        highlight: "Riscos de safra antecipados",
        photo: PHOTOS.agro,
    },
];

const Segments = () => {
    return (
        <section id="segmentos" className="w-full py-16 md:py-24 bg-cream-light scroll-mt-20">
            <Wrapper>
                <SectionHeader
                    badge="Segmentos atendidos"
                    title={<>IA aplicada ao <Highlight>seu setor</Highlight></>}
                    description="Cada indústria tem desafios próprios. Nossas soluções se adaptam à linguagem, aos dados e às dores de cada segmento."
                />

                <Container>
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {SEGMENTS.map((segment) => (
                            <article
                                key={segment.title}
                                className="group relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-5"
                            >
                                <Image
                                    src={segment.photo}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                                    className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur">
                                    <segment.icon strokeWidth={1.75} className="h-4 w-4" />
                                </div>
                                <h3 className="mt-3 font-heading text-lg font-semibold text-white">
                                    {segment.title}
                                </h3>
                                {/* Altura fixa de 3 linhas no celular/tablet: título e selo na mesma posição em todos os cards */}
                                <p className="mt-1.5 min-h-[4.875em] text-sm leading-relaxed text-cream/75 lg:min-h-0">
                                    {segment.description}
                                </p>
                                <span className="mt-3 self-start rounded-lg bg-brand-400 px-2.5 py-1 text-xs font-semibold leading-snug text-ink">
                                    {segment.highlight}
                                </span>
                            </article>
                        ))}
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default Segments;
