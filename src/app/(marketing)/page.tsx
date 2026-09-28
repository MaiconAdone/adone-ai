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
import StatsBand from "@/components/marketing/stats-band";

const HomePage = () => {
    return (
        <Background>
            <Hero />

            {/* Empresas que confiam */}
            <Wrapper>
                <Container className="py-4">
                    <Companies />
                </Container>
            </Wrapper>

            {/* Soluções (cartões com foto) */}
            <Services />

            {/* Como funciona (foto interativa) */}
            <HowItWorks />

            {/* Por que a Adone */}
            <Perks />

            {/* Números */}
            <StatsBand />

            {/* Segmentos (mosaico de fotos) */}
            <Segments />

            {/* Depoimentos */}
            <Cases />

            {/* Sobre / fundador */}
            <About />

            {/* FAQ */}
            <Wrapper className="py-4">
                <FAQ />
            </Wrapper>

            {/* Formulário de contato */}
            <Wrapper>
                <Contact />
            </Wrapper>

            {/* Chamada final com vídeo */}
            <CTA />
        </Background>
    );
};

export default HomePage;
