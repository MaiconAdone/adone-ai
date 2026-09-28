"use client";

import Image from "next/image";
import { PERKS } from "@/constants";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";
import { PHOTOS } from "@/constants/media";

const Perks = () => {
    return (
        <section className="w-full py-16 md:py-24">
            <Wrapper>
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
                    <div className="lg:sticky lg:top-28">
                        <SectionHeader
                            align="left"
                            badge="Por que a Adone AI"
                            title={<>Resultados que <Highlight>aparecem no seu P&L</Highlight></>}
                            description="Não vendemos tecnologia pela tecnologia. Cada solução é medida por impacto financeiro real: receita, custo e produtividade."
                        />
                        <Container delay={0.1}>
                            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[24px]">
                                <Image
                                    src={PHOTOS.sunnyMeeting}
                                    alt="Reunião de negócios analisando resultados"
                                    fill
                                    sizes="(min-width: 1024px) 480px, 100vw"
                                    className="object-cover"
                                />
                                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 backdrop-blur">
                                    <p className="font-heading text-2xl font-semibold text-ink">
                                        R$ 48M<span className="text-brand-700">+</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">gerados para clientes com projetos de IA</p>
                                </div>
                            </div>
                        </Container>
                    </div>

                    <Container delay={0.15}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-ink/10 ring-1 ring-ink/10">
                            {PERKS.map((perk) => (
                                <div key={perk.title} className="group bg-white p-7 transition-colors duration-300 hover:bg-brand-50/60">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-brand-400 transition-transform duration-300 group-hover:-translate-y-0.5">
                                        <perk.icon strokeWidth={1.6} className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                                        {perk.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {perk.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>
            </Wrapper>
        </section>
    );
};

export default Perks;
