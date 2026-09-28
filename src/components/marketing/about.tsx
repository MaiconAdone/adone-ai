"use client";

import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { SectionHeader, Highlight } from "./section-header";
import { CheckIcon } from "lucide-react";

const VALUES = [
    "Resultados antes de tecnologia — medimos tudo em R$",
    "Transparência total no processo e nos dados",
    "Equipe multidisciplinar: dados, negócio e engenharia",
    "Metodologia ágil com entregas em ciclos curtos",
    "Documentação completa e transferência de conhecimento",
    "Suporte contínuo após a entrega em produção",
];

const About = () => {
    return (
        <section id="sobre" className="w-full py-16 md:py-24 bg-cream-light scroll-mt-20">
            <Wrapper>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Foto do fundador */}
                    <Container>
                        <div className="relative">
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink">
                                <Image
                                    src="/img/maicon.png"
                                    alt="Maicon Adone, fundador da Adone AI"
                                    fill
                                    sizes="(min-width: 1024px) 520px, 100vw"
                                    className="object-cover"
                                />
                            </div>
                            <div aria-hidden="true" className="absolute -left-3 top-10 h-2 w-20 bg-brand-400" />
                            <figure className="absolute -bottom-6 left-4 right-4 md:left-8 md:right-auto md:max-w-sm rounded-2xl bg-ink p-5 text-cream shadow-[0_24px_60px_-24px_rgba(10,20,27,0.6)]">
                                <blockquote className="text-sm leading-relaxed text-cream/85">
                                    &ldquo;Nossa missão é democratizar a inteligência artificial para empresas brasileiras, com rigor técnico, clareza de resultado e parceria real.&rdquo;
                                </blockquote>
                                <figcaption className="mt-3 text-sm font-semibold text-brand-400">
                                    Maicon Adone · Fundador
                                </figcaption>
                            </figure>
                        </div>
                    </Container>

                    <div className="mt-8 lg:mt-0">
                        <SectionHeader
                            align="left"
                            badge="Sobre a Adone AI"
                            title={<>Uma empresa de IA <Highlight>obcecada por resultado</Highlight></>}
                            description="Fundada por engenheiros de dados e especialistas em negócios, a Adone AI nasceu para fazer a inteligência artificial gerar valor real e mensurável para empresas brasileiras."
                        />
                        <Container delay={0.1}>
                            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Muitas empresas de IA vendem projetos complexos que ficam meses em desenvolvimento e nunca chegam à produção. Na Adone, entregamos MVPs funcionais em semanas, medimos tudo em impacto financeiro e só consideramos um projeto bem-sucedido quando o cliente vê o retorno no negócio.
                                </p>
                                <p>
                                    IA que não conversa com o negócio é apenas matemática cara. Por isso nosso time une ciência de dados, engenharia e gestão.
                                </p>
                            </div>
                            <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                                Nossos princípios
                            </h3>
                            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {VALUES.map((value) => (
                                    <li key={value} className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/5">
                                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-400">
                                            <CheckIcon className="h-3 w-3 text-ink" strokeWidth={3} />
                                        </span>
                                        <span className="text-sm text-ink/80">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
};

export default About;
