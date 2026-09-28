"use client";

import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { AnimatedCounter } from "../motion/animated-counter";
import { SectionHeader, Highlight } from "./section-header";

const NUMBERS = [
    { value: 8, prefix: "+", suffix: "", unit: "anos", label: "de experiência em IA e dados" },
    { value: 120, prefix: "+", suffix: "", unit: "projetos", label: "entregues e em produção" },
    { value: 40, prefix: "+", suffix: "", unit: "especialistas", label: "em dados, IA e negócios" },
    { value: 12, prefix: "+", suffix: "", unit: "setores", label: "atendidos no Brasil" },
];

// Faixa escura com os números da empresa, nas cores da logo (grafite + verde-água)
const StatsBand = () => {
    return (
        <section className="w-full px-3 md:px-6 py-6">
            <div className="relative mx-auto max-w-[1320px] overflow-hidden rounded-[28px] bg-ink py-16 md:py-24">
                <div aria-hidden="true" className="absolute left-0 top-16 h-2 w-24 md:w-40 bg-brand-400" />
                <div aria-hidden="true" className="absolute right-10 top-10 h-4 w-4 rounded-full bg-brand-400" />
                <Wrapper>
                    <SectionHeader
                        dark
                        badge="Em números"
                        title={<>Números que comprovam nossa <Highlight dark>entrega</Highlight></>}
                        description="Somos medidos pelo resultado dos clientes: cada projeto começa com uma meta financeira clara e termina com ela acompanhada."
                    />
                    <Container delay={0.1}>
                        <dl className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
                            {NUMBERS.map((item) => (
                                <div key={item.unit} className="border-l-2 border-brand-400/60 pl-5">
                                    <dt className="sr-only">{item.unit} {item.label}</dt>
                                    <dd>
                                        <span className="font-heading text-5xl md:text-6xl font-semibold text-white">
                                            <AnimatedCounter value={item.value} prefix={item.prefix} suffix={item.suffix} />
                                        </span>
                                        <span className="ml-2 font-heading text-lg font-semibold text-brand-400">{item.unit}</span>
                                        <p className="mt-2 text-sm text-cream/70">{item.label}</p>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Container>
                </Wrapper>
            </div>
        </section>
    );
};

export default StatsBand;
