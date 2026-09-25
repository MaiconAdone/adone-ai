import type { Metadata } from "next";
import { Suspense } from "react";

import { Background, Container, Wrapper } from "@/components";
import { SectionBadge } from "@/components/ui/section-bade";
import { BookingForm } from "@/components/marketing/booking-form";

export const metadata: Metadata = {
    title: "Agendar Diagnóstico",
    description: "Escolha um horário e agende uma conversa de 30 minutos com o Maicon para mapear onde a IA gera resultado no seu negócio.",
};

const AgendarPage = () => {
    return (
        <Background>
            <Wrapper className="relative pt-32 pb-20">
                <Container>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <SectionBadge title="Diagnóstico" />
                        <h1 className="text-3xl md:text-5xl font-heading font-semibold !leading-snug mt-6">
                            Agende sua{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                conversa com o Maicon
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-accent-foreground/70 mt-4">
                            30 minutos por Google Meet para entender seu desafio e mapear onde a IA pode gerar resultado. Escolha o dia e o horário que funcionam melhor para você.
                        </p>
                    </div>
                </Container>

                <Container delay={0.1} className="mt-12">
                    <Suspense>
                        <BookingForm />
                    </Suspense>
                </Container>
            </Wrapper>
        </Background>
    );
};

export default AgendarPage;
