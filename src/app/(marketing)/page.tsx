import {
    Background,
    Companies,
    Container,
    Hero,
    Services,
    HowItWorks,
    Perks,
    Segments,
    Cases,
    About,
    FAQ,
    Contact,
    CTA,
    Wrapper,
} from "@/components";
import { Spotlight } from "@/components/ui/spotlight";

const HomePage = () => {
    return (
        <Background>
            <Wrapper className="py-20 relative">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-60 md:-top-20"
                        fill="rgba(255, 255, 255, 0.5)"
                    />
                    <Hero />
                </Container>

                {/* Empresas que confiam */}
                <Container className="py-4">
                    <Companies />
                </Container>

                {/* Serviços */}
                <Services />

                {/* Como funciona */}
                <HowItWorks />

                {/* Benefícios / Por que Adone */}
                <Perks />

                {/* Segmentos atendidos */}
                <Segments />

                {/* Cases / Prova social */}
                <Cases />

                {/* Sobre a empresa */}
                <About />

                {/* FAQ */}
                <FAQ />

                {/* Formulário de contato */}
                <Contact />

                {/* CTA final */}
                <CTA />
            </Wrapper>
        </Background>
    );
};

export default HomePage;
