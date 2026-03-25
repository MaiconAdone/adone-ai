"use client";

import Link from "next/link";
import Container from "../global/container";
import { Button } from "../ui/button";
import { Particles } from "../ui/particles";
import RetroGrid from "../ui/retro-grid";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";

const CTA = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full relative">
            <Container>
                <div className="flex flex-col items-center justify-center text-center w-full px-4 md:px-8 mx-auto min-h-[480px] border border-foreground/10 rounded-3xl overflow-hidden relative">
                    {/* Glow bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-violet-600 blur-[8rem] opacity-50" />
                    {/* Glow top */}
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-purple-600/30 blur-[6rem] -z-10" />

                    <div className="flex flex-col items-center justify-center w-full z-20 py-16 gap-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-medium text-violet-300 mb-2">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            Diagnóstico 100% gratuito e sem compromisso
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-semibold !leading-tight">
                            Sua empresa está{" "}
                            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                                deixando dinheiro
                            </span>{" "}
                            na mesa
                        </h2>

                        <p className="text-base md:text-lg text-accent-foreground/70 max-w-xl mx-auto">
                            Cada mês sem IA é um mês perdendo para concorrentes que já automatizam, preveem e escalam. Comece agora com um diagnóstico gratuito de 60 minutos.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full">
                            <Button asChild size="lg" className="w-full sm:w-auto px-8 h-12 text-base font-semibold bg-violet-600 hover:bg-violet-500">
                                <Link href="#contato">
                                    Agendar Diagnóstico Gratuito
                                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto px-8 h-12 text-base">
                                <Link href="#cases">
                                    Ver Cases de Sucesso
                                </Link>
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                            Sem pressão comercial. Só valor real para o seu negócio.
                        </p>
                    </div>

                    <RetroGrid />
                    <Particles
                        refresh
                        ease={80}
                        color="#8b5cf6"
                        quantity={80}
                        className="size-full absolute inset-0"
                    />
                </div>
            </Container>
        </div>
    );
};

export default CTA;
