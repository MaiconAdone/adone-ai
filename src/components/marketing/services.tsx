"use client";

import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";
import { PHOTOS } from "@/constants/media";
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
        photo: PHOTOS.consulting,
    },
    {
        icon: TrendingUpIcon,
        title: "Machine Learning Preditivo",
        description: "Modelos preditivos sob medida para prever demanda, churn, inadimplência, preços e qualquer variável crítica do seu negócio com acurácia superior a 90%.",
        tag: "Previsão",
        photo: PHOTOS.predictive,
    },
    {
        icon: GitMergeIcon,
        title: "Automação Inteligente",
        description: "Elimine gargalos operacionais com RPA potencializado por IA. Automatize processos de aprovação, classificação de documentos, atendimento e muito mais.",
        tag: "Operações",
        photo: PHOTOS.automation,
    },
    {
        icon: EyeIcon,
        title: "Visão Computacional",
        description: "Análise de imagens e vídeos em tempo real para controle de qualidade, detecção de falhas em linha de produção, segurança patrimonial e inspeção automatizada.",
        tag: "Indústria",
        photo: PHOTOS.vision,
    },
    {
        icon: MessageSquareTextIcon,
        title: "NLP & Chatbots Inteligentes",
        description: "Processamento de linguagem natural para chatbots que entendem contexto, analisam sentimento em feedbacks, classificam tickets e extraem informações de documentos.",
        tag: "Linguagem",
        photo: PHOTOS.chatbots,
    },
    {
        icon: BarChart3Icon,
        title: "Análise Avançada de Dados",
        description: "Dashboards analíticos em tempo real, discovery de padrões ocultos nos seus dados e relatórios executivos que traduzem complexidade em decisões simples.",
        tag: "Dados",
        photo: PHOTOS.analytics,
    },
    {
        icon: PuzzleIcon,
        title: "Integração de IA em Sistemas",
        description: "Integração das nossas soluções de IA com seu ERP, CRM, e-commerce ou sistema legado via API. Sem migração de plataforma, sem interrupção das operações.",
        tag: "Integração",
        photo: PHOTOS.integration,
    },
];

const Services = () => {
    return (
        <section id="servicos" className="w-full py-16 md:py-24 scroll-mt-20">
            <Wrapper>
                <SectionHeader
                    badge="Soluções"
                    title={<>IA que resolve <Highlight>problemas reais</Highlight> de negócio</>}
                    description="Nossas soluções nascem das dores da sua empresa, não de templates genéricos. Cada projeto é único, com entrega orientada a resultado."
                />

                <Container>
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {SERVICES.map((service) => (
                            <Link
                                key={service.title}
                                href="#contato"
                                className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(10,20,27,0.45)] hover:ring-brand-500/40"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <Image
                                        src={service.photo}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
                                        {service.tag}
                                    </span>
                                    <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-400 text-ink">
                                        <service.icon strokeWidth={1.75} className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="font-heading text-lg font-semibold text-foreground">
                                        {service.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {service.description}
                                    </p>
                                    <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                                        Quero essa solução
                                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </Link>
                        ))}

                        {/* Cartão de chamada */}
                        <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-cream">
                            <div>
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-400 text-ink">
                                    <BrainCircuitIcon strokeWidth={1.75} className="h-5 w-5" />
                                </div>
                                <h3 className="mt-5 font-heading text-xl font-semibold text-white">
                                    Não encontrou o que precisa?
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                                    Desenvolvemos soluções sob medida para qualquer desafio de negócio que envolva dados e inteligência artificial.
                                </p>
                            </div>
                            <Link
                                href="#contato"
                                className="mt-6 inline-flex w-max items-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-300"
                            >
                                Fale com um especialista
                                <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </Container>
            </Wrapper>
        </section>
    );
};

export default Services;
