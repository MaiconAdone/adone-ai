"use client";

import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";
import { REVIEWS } from "@/constants";
import Marquee from "../ui/marquee";
import Image from "next/image";

const firstRow = REVIEWS.slice(0, REVIEWS.length / 2);
const secondRow = REVIEWS.slice(REVIEWS.length / 2);

const Cases = () => {
    return (
        <section id="cases" className="w-full py-16 md:py-24 scroll-mt-20 overflow-hidden">
            <Wrapper>
                <SectionHeader
                    badge="Depoimentos"
                    title={<>Empresas reais, <Highlight>resultados mensuráveis</Highlight></>}
                    description="Mais de 120 projetos entregues. Veja o que gestores e líderes que trabalharam com a Adone AI têm a dizer."
                />
            </Wrapper>

            <Container>
                <div className="mt-14 relative flex flex-col gap-4">
                    <Marquee pauseOnHover className="[--duration:45s]">
                        {firstRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <Marquee pauseOnHover reverse className="[--duration:45s]">
                        {secondRow.map((review) => (
                            <ReviewCard key={review.username} {...review} />
                        ))}
                    </Marquee>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
                </div>
            </Container>
        </section>
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
        <figure className="relative w-80 overflow-hidden rounded-2xl bg-cream-light ring-1 ring-ink/5 hover:ring-brand-500/40 p-6 transition-all duration-300 ease-in-out flex-shrink-0">
            <span aria-hidden="true" className="block font-heading text-5xl leading-none text-brand-400">&ldquo;</span>
            <blockquote className="mt-1 text-[15px] text-ink/80 leading-relaxed mb-5">
                {review}
            </blockquote>
            <div className="flex flex-row items-center gap-3 pt-4 border-t border-ink/10">
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
