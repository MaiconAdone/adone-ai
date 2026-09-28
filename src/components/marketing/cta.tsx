"use client";

import Link from "next/link";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import Container from "../global/container";
import { Button } from "../ui/button";
import { BackgroundVideo } from "../effects/background-video";
import { VIDEOS } from "@/constants/media";

const CTA = () => {
    return (
        <section className="w-full px-3 md:px-6 py-12 md:py-16">
            <div className="relative mx-auto max-w-[1320px] min-h-[520px] overflow-hidden rounded-[28px] bg-ink">
                <BackgroundVideo {...VIDEOS.cta} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_50%_50%,rgba(10,20,27,0.86)_0%,rgba(10,20,27,0.7)_60%,rgba(10,20,27,0.55)_100%)]" />

                <Container>
                    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-white/5 px-4 py-1.5 text-xs font-medium text-cream/90 backdrop-blur">
                            <CalendarIcon className="h-3.5 w-3.5 text-brand-400" />
                            Diagnóstico de 30 minutos, sem custo
                        </div>

                        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight !leading-[1.1] text-white">
                            Sua empresa está <span className="text-brand-400">deixando dinheiro</span> na mesa
                        </h2>

                        <p className="max-w-xl text-base md:text-lg text-cream/80">
                            Cada mês sem IA é um mês perdendo para concorrentes que já automatizam, preveem e escalam. Comece com um diagnóstico de 30 minutos.
                        </p>

                        <div className="mt-2 flex w-full flex-col sm:flex-row items-center justify-center gap-3">
                            <Button asChild size="xl" className="w-full sm:w-auto rounded-full bg-brand-400 text-ink font-semibold hover:bg-brand-300 hover:opacity-100 px-8">
                                <Link href="#contato">
                                    Agendar diagnóstico
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="xl" variant="ghost" className="w-full sm:w-auto rounded-full border border-cream/30 text-white hover:bg-white/10 hover:text-white px-8">
                                <Link href="#cases">Ver depoimentos</Link>
                            </Button>
                        </div>

                        <p className="text-xs text-cream/60">
                            Sem pressão comercial. Só valor real para o seu negócio.
                        </p>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default CTA;
