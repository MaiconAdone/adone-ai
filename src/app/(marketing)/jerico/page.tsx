import {
    ArrowRight,
    Bot,
    BrainCircuit,
    CheckCircle2,
    Database,
    GitBranch,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Background, Container, Wrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

export const metadata: Metadata = {
    title: "Jerico | Plataforma local-first de IA e ML",
    description: "Compre o Jerico por R$ 1.199,00 e crie workflows de IA, ML e Chatbolt com agentes, memoria, RAG e governanca local-first.",
};

const included = [
    "Workflow visual por universos: ML, IA, ML + IA e Chatbolt",
    "Biblioteca expansiva de trabalhos com acoes por etapa",
    "Fluxos com agentes, RAG, MCP, memoria e guardrails",
    "Tratamento de dados, modelos preditivos e avaliacao",
    "Politica local-first com Ollama e ativacao economica de agentes",
    "Documentacao operacional para evoluir seus projetos",
];

const modules = [
    {
        icon: Database,
        title: "ML operacional",
        text: "Prepare dados, selecione arquivos, crie modelos de regressao, classificacao e previsao temporal.",
    },
    {
        icon: BrainCircuit,
        title: "IA agentica",
        text: "Monte agentes com prompts, memoria, tools, MCP, guardrails e avaliacao de respostas.",
    },
    {
        icon: Bot,
        title: "Chatbolt",
        text: "Projete chatbots com persona, intents, canais, feedback, RAG e monitoramento de conversas.",
    },
    {
        icon: Workflow,
        title: "Fluxos visuais",
        text: "Arraste trabalhos para o fluxo montado e combine etapas por objetivo de negocio.",
    },
];

const outcomes = [
    "Criar projetos IA/ML sem comecar do zero",
    "Reduzir custo usando contexto filtrado e execucao local",
    "Padronizar qualidade com checklists, evals e governanca",
    "Acelerar prototipos com workflows prontos para cada universo",
];

const JericoSalesPage = () => {
    return (
        <Background>
            <Wrapper className="relative overflow-hidden pt-28 pb-20">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-72 md:-top-28"
                        fill="rgba(139, 92, 246, 0.45)"
                    />
                    <section className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="relative z-10">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-200">
                                <Sparkles className="h-4 w-4" />
                                Plataforma Jerico para IA, ML e Chatbolt
                            </div>
                            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Construa workflows de IA e Machine Learning com governanca local-first.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                                O Jerico organiza agentes, dados, modelos preditivos, RAG, memoria e chatbots em uma experiencia visual para times que querem sair da ideia e chegar ao fluxo operacional.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button asChild size="xl" className="btn-primary">
                                    <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Jerico%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
                                        Comprar agora
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="xl" variant="subtle">
                                    <Link href="#oferta">Ver o que esta incluso</Link>
                                </Button>
                            </div>
                            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">4</strong>
                                    <span className="text-sm text-muted-foreground">universos</span>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">60</strong>
                                    <span className="text-sm text-muted-foreground">agentes disponiveis</span>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">R$ 1.199</strong>
                                    <span className="text-sm text-muted-foreground">pagamento unico</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-6 rounded-[2rem] bg-violet-500/20 blur-3xl" />
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1020] shadow-2xl shadow-violet-950/40">
                                <Image
                                    src="/images/dashboard.png"
                                    alt="Painel visual do Jerico com workflows e operacao de IA"
                                    width={1200}
                                    height={780}
                                    className="h-auto w-full"
                                    priority
                                />
                            </div>
                        </div>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section id="oferta" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Oferta de lancamento</p>
                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-5xl font-bold text-white">R$ 1.199,00</span>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                Acesso ao pacote Jerico para criar e operar fluxos de IA, ML e Chatbolt com base local-first.
                            </p>
                            <Button asChild size="xl" className="btn-primary mt-6 w-full">
                                <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Jerico%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
                                    Falar no WhatsApp
                                    <MessageCircle className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {included.map((item) => (
                                <div key={item} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-violet-300" />
                                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section>
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">O que o Jerico entrega</p>
                            <h2 className="mt-3 text-3xl font-bold text-white">Uma fabrica visual para transformar trabalho de IA em processo.</h2>
                        </div>
                        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {modules.map((module) => (
                                <div key={module.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                                    <module.icon className="h-7 w-7 text-violet-300" />
                                    <h3 className="mt-5 text-lg font-semibold text-white">{module.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Para quem e</p>
                            <h2 className="mt-3 text-3xl font-bold text-white">Times que precisam criar automacoes inteligentes com controle.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Ideal para consultores, founders, equipes de dados e operacoes que querem padronizar projetos de IA sem perder seguranca, rastreabilidade e custo previsivel.
                            </p>
                        </div>
                        <div className="grid gap-3">
                            {outcomes.map((item) => (
                                <div key={item} className="flex items-start gap-3">
                                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-violet-300" />
                                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-500/10 p-8 text-center">
                        <GitBranch className="mx-auto h-9 w-9 text-violet-200" />
                        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white">
                            Comece com o Jerico por R$ 1.199,00
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                            Fale com a Adone Intelligence para receber o pacote, orientacao inicial e proximos passos de implantacao.
                        </p>
                        <div className="mt-7 flex justify-center">
                            <Button asChild size="xl" className="btn-primary">
                                <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Jerico%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
                                    Quero meu Jerico
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </section>
                </Container>
            </Wrapper>
        </Background>
    );
};

export default JericoSalesPage;
