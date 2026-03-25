"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import { REVIEWS } from "@/constants";
import Marquee from "../ui/marquee";
import Image from "next/image";

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

const HIGHLIGHTS = [
    { value: "120+", label: "Projetos Entregues" },
    { value: "R$ 48M+", label: "Gerados para Clientes" },
    { value: "98%", label: "Satisfação" },
    { value: "< 90 dias", label: "Tempo Médio de Entrega" },
];

const Cases = () => {
    return (
        <div id="cases" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Prova Social" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        Empresas reais,{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            resultados mensuráveis
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Mais de 120 projetos entregues. Veja o que os gestores e líderes das empresas que trabalharam com a Adone AI têm a dizer.
                    </p>
                </div>
            </Container>

            {/* Highlight numbers */}
            <Container>
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-3xl mx-auto">
                    {HIGHLIGHTS.map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-foreground/5 bg-foreground/[0.02] text-center">
                            <span className="text-2xl md:text-3xl font-bold font-heading bg-gradient-to-br from-violet-400 to-purple-300 bg-clip-text text-transparent">
                                {h.value}
                            </span>
                            <span className="text-xs text-muted-foreground">{h.label}</span>
                        </div>
                    ))}
                </div>
            </Container>

            {/* Testimonials marquee */}
            <Container>
                <div className="mt-16 w-full relative overflow-hidden">
                    <div className="relative flex flex-col items-center justify-center overflow-hidden gap-4">
                        <Marquee pauseOnHover className="[--duration:35s]">
                            {firstRow.map((review) => (
                                <ReviewCard key={review.username} {...review} />
                            ))}
                        </Marquee>
                        <Marquee pauseOnHover reverse className="[--duration:35s]">
                            {secondRow.map((review) => (
                                <ReviewCard key={review.username} {...review} />
                            ))}
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
                        <div className="absolute hidden lg:block top-1/4 left-1/4 w-32 h-32 rounded-full bg-violet-600/20 -z-10 blur-[6rem]" />
                        <div className="absolute hidden lg:block top-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-600/20 -z-10 blur-[6rem]" />
                    </div>
                </div>
            </Container>
        </div>
    );
};

const ReviewCard = ({
    img,
    name,
    username,
    review,
}: {
    img: string;
    name: string;
    username: string;
    review: string;
}) => {
    return (
        <figure className="relative w-72 cursor-pointer overflow-hidden rounded-2xl border border-foreground/5 bg-neutral-50/[.03] hover:bg-violet-500/[.05] hover:border-violet-500/20 p-5 transition-all duration-300 ease-in-out flex-shrink-0">
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-violet-400 text-xs">★</span>
                ))}
            </div>
            <blockquote className="text-sm text-muted-foreground leading-relaxed mb-4">
                &ldquo;{review}&rdquo;
            </blockquote>
            <div className="flex flex-row items-center gap-3 pt-3 border-t border-foreground/5">
                <Image className="rounded-full" width={36} height={36} alt={name} src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-semibold text-foreground">
                        {name}
                    </figcaption>
                    <p className="text-xs text-muted-foreground">{username}</p>
                </div>
            </div>
        </figure>
    );
};

export default Cases;
