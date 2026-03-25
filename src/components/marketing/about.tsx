"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import { CheckIcon, BrainCircuitIcon, UsersIcon, AwardIcon, Globe2Icon } from "lucide-react";
import { BorderBeam } from "../ui/border-beam";

const VALUES = [
    "Resultados antes de tecnologia — medimos tudo em R$",
    "Transparência total no processo e nos dados",
    "Equipe multidisciplinar: dados, negócio e engenharia",
    "Metodologia ágil com entregas em ciclos curtos",
    "Documentação completa e transferência de conhecimento",
    "Suporte contínuo após a entrega em produção",
];

const NUMBERS = [
    { icon: BrainCircuitIcon, value: "8+", label: "Anos de experiência em IA" },
    { icon: UsersIcon, value: "40+", label: "Especialistas em dados e IA" },
    { icon: AwardIcon, value: "120+", label: "Projetos entregues" },
    { icon: Globe2Icon, value: "12+", label: "Setores de atuação" },
];

const About = () => {
    return (
        <div id="sobre" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Sobre a Adone AI" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        Uma empresa de IA{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            obcecada por resultado
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Fundada por engenheiros de dados e especialistas em negócios, a Adone AI nasceu com uma missão clara: fazer a inteligência artificial gerar valor real e mensurável para empresas brasileiras.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 w-full items-center">
                    {/* Left: text */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xl md:text-2xl font-semibold font-heading text-foreground">
                                Não somos uma empresa de tecnologia. Somos uma empresa de resultado.
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Muitas empresas de IA vendem projetos complexos que ficam meses em desenvolvimento e nunca chegam à produção. Na Adone, fazemos diferente: entregamos MVPs funcionais em semanas, medimos tudo em impacto financeiro real e só consideramos um projeto bem-sucedido quando o cliente vê o retorno no seu negócio.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Nossa equipe combina PhDs em ciência de dados com executivos que já gerenciaram P&Ls — porque IA que não conversa com o negócio é apenas matemática cara.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                                Nossos princípios
                            </h4>
                            <ul className="grid grid-cols-1 gap-2.5">
                                {VALUES.map((value, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckIcon className="w-3 h-3 text-violet-400" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: numbers */}
                    <div className="grid grid-cols-2 gap-4">
                        {NUMBERS.map((item, i) => (
                            <div
                                key={i}
                                className="relative overflow-hidden flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02] hover:bg-violet-500/5 hover:border-violet-500/20 transition-all duration-300"
                            >
                                <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                    <item.icon strokeWidth={1.5} className="w-5 h-5 text-violet-400" />
                                </div>
                                <span className="text-3xl md:text-4xl font-bold font-heading bg-gradient-to-br from-violet-300 to-purple-300 bg-clip-text text-transparent">
                                    {item.value}
                                </span>
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                                <BorderBeam size={80} duration={8} delay={i * 2} />
                            </div>
                        ))}

                        {/* Mission card */}
                        <div className="col-span-2 relative overflow-hidden p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-purple-950/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -z-10" />
                            <p className="text-sm text-center italic text-muted-foreground leading-relaxed">
                                &ldquo;Nossa missão é democratizar a inteligência artificial para empresas brasileiras — com rigor técnico, clareza de resultado e parceria real.&rdquo;
                            </p>
                            <p className="text-xs text-center text-violet-400/80 mt-3 font-medium">
                                — Maicon Adone
                            </p>
                            <BorderBeam size={120} duration={10} />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default About;
