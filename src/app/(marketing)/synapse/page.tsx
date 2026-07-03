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
    title: "Synapse | Plataforma local-first de IA e ML",
    description: "Compre o Synapse por R$ 1.199,00 e crie workflows de IA, ML e Chatbolt com agentes, memória, RAG e governança local-first.",
};

const included = [
    "Workflow visual por universos: ML, IA, ML + IA e Chatbolt",
    "Biblioteca expansiva de trabalhos com ações por etapa",
    "Fluxos com agentes, RAG, MCP, memória e guardrails",
    "Tratamento de dados, modelos preditivos e avaliação",
    "Política local-first com Ollama e ativação econômica de agentes",
    "Documentação operacional para evoluir seus projetos",
];

const modules = [
    {
        icon: Database,
        title: "ML operacional",
        text: "Prepare dados, selecione arquivos, crie modelos de regressão, classificação e previsão temporal.",
    },
    {
        icon: BrainCircuit,
        title: "IA agêntica",
        text: "Monte agentes com prompts, memória, tools, MCP, guardrails e avaliação de respostas.",
    },
    {
        icon: Bot,
        title: "Chatbolt",
        text: "Projete chatbots com persona, intents, canais, feedback, RAG e monitoramento de conversas.",
    },
    {
        icon: Workflow,
        title: "Fluxos visuais",
        text: "Arraste trabalhos para o fluxo montado e combine etapas por objetivo de negócio.",
    },
];

const outcomes = [
    "Criar projetos IA/ML sem começar do zero",
    "Reduzir custo usando contexto filtrado e execução local",
    "Padronizar qualidade com checklists, evals e governança",
    "Acelerar protótipos com workflows prontos para cada universo",
];

const SynapseSalesPage = () => {
    return (
        <Background>
            <Wrapper className="relative overflow-hidden pt-28 pb-20">
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-72 md:-top-28"
                        fill="rgba(139, 92, 246, 0.45)"
                    />
                    <section className="relative z-10 text-center">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
                                <Image
                                    src="/img/logo2.png"
                                    alt="Logotipo Synapse"
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto rounded-full bg-violet-950/70 p-1"
                                    priority
                                />
                            </div>
                            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Synapse: a aplicação para construir workflows de IA e Machine Learning com governança local-first.
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                                O Synapse organiza agentes, dados, modelos preditivos, RAG, memória e chatbots em uma experiência visual para times que querem sair da ideia e chegar ao fluxo operacional.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Button asChild size="xl" className="btn-primary">
                                    <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Synapse%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
                                        Comprar agora
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="xl" variant="subtle">
                                    <Link href="#oferta">Ver o que está incluso</Link>
                                </Button>
                            </div>
                            <div className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">4</strong>
                                    <span className="text-sm text-muted-foreground">universos</span>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">60</strong>
                                    <span className="text-sm text-muted-foreground">agentes disponíveis</span>
                                </div>
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                                    <strong className="block text-2xl text-white">R$ 1.199</strong>
                                    <span className="text-sm text-muted-foreground">pagamento único</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative mx-auto mt-10 max-w-6xl">
                            <div className="absolute -inset-6 rounded-[2rem] bg-cyan-500/20 blur-3xl" />
                            <div className="relative grid gap-4 md:grid-cols-2">
                                <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-violet-950/40">
                                    <Image
                                        src="/img/tela.png"
                                        alt="Tela da aplicação Synapse"
                                        width={1892}
                                        height={887}
                                        className="h-full w-full object-contain"
                                        priority
                                    />
                                </div>
                                <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-violet-950/40">
                                    <Image
                                        src="/img/tela2.png"
                                        alt="Segunda tela da aplicação Synapse"
                                        width={1918}
                                        height={1009}
                                        className="h-full w-full object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </Container>

                <Container className="mt-12">
                    <section className="mx-auto max-w-4xl rounded-lg bg-white/[0.02] p-6">
                        <h2 className="text-2xl font-bold text-white">Synapse: A Plataforma de Engenharia de IA que Transforma a Forma de Construir Machine Learning e Inteligência Artificial</h2>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            A Inteligência Artificial está evoluindo rapidamente. O desafio deixou de ser apenas desenvolver modelos e passou a ser criar soluções inteligentes, escaláveis e capazes de colaborar entre si durante todo o ciclo de desenvolvimento.
                        </p>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            Foi com essa visão que nasceu o <strong>Synapse</strong>, a plataforma de engenharia de IA da Adone Intelligence.
                        </p>
                        <p className="mt-4 text-sm leading-7 text-muted-foreground">
                            O Synapse foi concebido para atuar como um ambiente completo de desenvolvimento, orquestração e automação de soluções de Inteligência Artificial, Machine Learning e agentes inteligentes, permitindo que desenvolvedores, cientistas de dados e empresas construam aplicações mais robustas, produtivas e fáceis de manter.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-white">O que é o Synapse?</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            O Synapse é uma plataforma de Engenharia de IA desenvolvida para integrar modelos de linguagem (LLMs), Machine Learning, agentes inteligentes, automação e ferramentas de desenvolvimento em uma única arquitetura.
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                            Mais do que um assistente de programação, o Synapse funciona como um orquestrador inteligente, capaz de distribuir tarefas entre diferentes modelos, gerenciar contexto, reutilizar conhecimento e automatizar atividades repetitivas durante o desenvolvimento.
                        </p>

                        <h3 className="mt-6 text-lg font-semibold text-white">Principais funcionalidades</h3>

                        <h4 className="mt-4 text-md font-semibold text-white">Engenharia de IA Agêntica</h4>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">O Synapse utiliza uma arquitetura baseada em múltiplos agentes especializados. Cada agente pode assumir responsabilidades específicas, como:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Arquitetura de software</li>
                            <li>Desenvolvimento de código</li>
                            <li>Revisão técnica</li>
                            <li>Testes automatizados</li>
                            <li>Documentação</li>
                            <li>Análise de dados</li>
                            <li>Engenharia de Machine Learning</li>
                            <li>MLOps</li>
                            <li>Observabilidade</li>
                        </ul>

                        <h4 className="mt-4 text-md font-semibold text-white">Desenvolvimento Inteligente</h4>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">O Synapse integra diferentes modelos de IA para selecionar automaticamente o mais adequado para cada tarefa. Dependendo da necessidade, pode utilizar:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Modelos locais executados via Ollama</li>
                            <li>Agentes especializados em programação</li>
                            <li>Modelos de linguagem comerciais</li>
                            <li>Ferramentas compatíveis com Model Context Protocol (MCP)</li>
                        </ul>

                        <h4 className="mt-4 text-md font-semibold text-white">Programação Assistida por Voz</h4>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">Uma das funcionalidades em desenvolvimento é o <strong>Synapse Voice</strong>, um assistente virtual para engenharia de software. Com ele, será possível utilizar comandos por voz para interagir com o ambiente de desenvolvimento, por exemplo:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Criar novos projetos</li>
                            <li>Gerar APIs</li>
                            <li>Executar testes</li>
                            <li>Corrigir erros</li>
                            <li>Revisar código</li>
                            <li>Abrir arquivos</li>
                            <li>Explicar implementações</li>
                            <li>Automatizar tarefas repetitivas</li>
                        </ul>

                        <h4 className="mt-4 text-md font-semibold text-white">Memória Inteligente</h4>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">O Synapse mantém contexto entre diferentes etapas do desenvolvimento, permitindo reutilizar conhecimento do projeto, compartilhar informações entre agentes, reduzir repetição de contexto e melhorar a qualidade das respostas.</p>

                        <h3 className="mt-6 text-lg font-semibold text-white">Como o Synapse melhora projetos de Machine Learning?</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">O desenvolvimento de modelos de Machine Learning envolve diversas etapas que normalmente utilizam ferramentas distintas. O Synapse integra essas atividades em um fluxo contínuo, incluindo:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Preparação de dados</li>
                            <li>Engenharia de atributos</li>
                            <li>Seleção automática de algoritmos</li>
                            <li>Treinamento</li>
                            <li>Avaliação de desempenho</li>
                            <li>Comparação entre modelos</li>
                            <li>Versionamento</li>
                            <li>Documentação automática</li>
                            <li>Monitoramento em produção</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold text-white">Como o Synapse acelera projetos de Inteligência Artificial?</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">Além do desenvolvimento tradicional de Machine Learning, o Synapse foi projetado para suportar aplicações modernas de IA, incluindo:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Sistemas baseados em LLMs</li>
                            <li>Aplicações com múltiplos agentes</li>
                            <li>Recuperação aumentada por contexto (RAG)</li>
                            <li>Automação empresarial inteligente</li>
                            <li>Assistentes especializados</li>
                            <li>Geração de código</li>
                            <li>Processamento de documentos</li>
                            <li>Integração com ferramentas corporativas</li>
                            <li>Execução de workflows inteligentes</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold text-white">Integração com o ecossistema de desenvolvimento</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">O Synapse foi pensado para trabalhar com ferramentas amplamente utilizadas por equipes de engenharia, como:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>VS Code</li>
                            <li>Git e GitHub</li>
                            <li>Docker</li>
                            <li>MCP Servers</li>
                            <li>Playwright</li>
                            <li>Ollama</li>
                            <li>Ambientes Linux e Windows</li>
                            <li>Plataformas de Machine Learning</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold text-white">Benefícios para empresas</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">Ao adotar o Synapse, organizações podem obter benefícios como:</p>
                        <ul className="mt-2 list-disc ml-6 text-sm text-muted-foreground">
                            <li>Maior produtividade das equipes técnicas</li>
                            <li>Redução do tempo de desenvolvimento</li>
                            <li>Padronização da engenharia de IA</li>
                            <li>Melhor governança dos projetos</li>
                            <li>Reutilização de componentes</li>
                            <li>Escalabilidade para novos projetos</li>
                            <li>Menor custo operacional por meio do uso inteligente de modelos locais e serviços externos</li>
                            <li>Maior qualidade e rastreabilidade das entregas</li>
                        </ul>

                        <h3 className="mt-6 text-lg font-semibold text-white">Nossa visão</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">Na Adone Intelligence, acreditamos que o futuro da Inteligência Artificial não está apenas em modelos cada vez maiores, mas em plataformas capazes de coordenar diferentes modelos, ferramentas e agentes de forma integrada. O Synapse representa essa visão: uma plataforma de Engenharia de IA construída para acelerar o desenvolvimento de soluções inteligentes, aumentar a produtividade das equipes e transformar a forma como empresas criam, implantam e evoluem aplicações de Machine Learning e Inteligência Artificial.</p>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">Estamos construindo um ecossistema preparado para os desafios da próxima geração de IA, combinando automação, colaboração entre agentes e engenharia de software moderna em uma única plataforma.</p>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section id="oferta" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Oferta de lançamento</p>
                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-5xl font-bold text-white">R$ 1.199,00</span>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                Acesso ao pacote Synapse para criar e operar fluxos de IA, ML e Chatbolt com base local-first.
                            </p>
                            <Button asChild size="xl" className="btn-primary mt-6 w-full">
                                <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Synapse%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
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
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">O que o Synapse entrega</p>
                            <h2 className="mt-3 text-3xl font-bold text-white">Uma fábrica visual para transformar trabalho de IA em processo.</h2>
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
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Para quem é</p>
                            <h2 className="mt-3 text-3xl font-bold text-white">Times que precisam criar automações inteligentes com controle.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Ideal para consultores, founders, equipes de dados e operações que querem padronizar projetos de IA sem perder segurança, rastreabilidade e custo previsível.
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
                    <section id="sobre" className="grid gap-8 rounded-3xl border border-white/10 bg-violet-950/90 p-8 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="flex flex-col justify-center rounded-3xl bg-violet-900/70 p-6 text-white shadow-2xl shadow-black/20">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-violet-300">Sobre</p>
                            <h2 className="mt-4 text-3xl font-bold text-white">Maicon Adone</h2>
                            <p className="mt-6 text-sm leading-7 text-violet-200">
                                Formado em Sistemas de Informação (2011), com experiência sólida em Ciência de Dados, Inteligência Artificial, Machine Learning e desenvolvimento de soluções baseadas em LLMs atuando na construção de aplicações inteligentes para ambientes corporativos.
                            </p>
                            <p className="mt-4 text-sm leading-7 text-violet-200">
                                Experiência no desenvolvimento de soluções com RAG — Retrieval-Augmented Generation, busca semântica, bancos vetoriais, embeddings, engenharia de prompts, integração com APIs, automação de processos e criação de assistentes inteligentes aplicados a diferentes contextos empresariais.
                            </p>
                            <p className="mt-4 text-sm leading-7 text-violet-200">
                                Atuo também com IA agêntica aplicada à transformação empresarial, desenvolvendo agentes inteligentes capazes de apoiar empresas na automação de fluxos complexos, análise de dados, tomada de decisão, atendimento, vendas, operações e integração entre sistemas. Essa abordagem permite conectar pessoas, dados, ferramentas e processos para gerar maior produtividade, eficiência operacional e escalabilidade.
                            </p>
                            <p className="mt-4 text-sm leading-7 text-violet-200">
                                Possuo conhecimento em LangChain e LangGraph para orquestração de cadeias, memória, ferramentas, agentes e pipelines avançados, além de integração de contextos e serviços via MCP — Model Context Protocol. Também tenho experiência em projetos de Inteligência Artificial e Machine Learning em ambientes cloud, incluindo AWS e Azure, com foco na construção de soluções escaláveis, seguras e orientadas a resultados.
                            </p>
                            <p className="mt-4 text-sm leading-7 text-violet-200">
                                Minha atuação combina engenharia de IA, ciência de dados, automação inteligente e visão de negócios, com o objetivo de transformar processos corporativos por meio de aplicações baseadas em LLMs, agentes inteligentes, arquiteturas RAG, análise de dados e soluções de IA aplicadas à transformação digital e empresarial.
                            </p>
                        </div>
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
                            <Image
                                src="/img/maicon.png"
                                alt="Foto do Maicon"
                                width={680}
                                height={680}
                                className="h-auto w-full rounded-3xl object-cover"
                                priority
                            />
                        </div>
                    </section>
                </Container>

                <Container className="mt-20">
                    <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-500/10 p-8 text-center">
                        <GitBranch className="mx-auto h-9 w-9 text-violet-200" />
                        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-white">
                            Comece com o Synapse por R$ 1.199,00
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                            Fale com a Adone Intelligence para receber o pacote, orientação inicial e próximos passos de implantação.
                        </p>
                        <div className="mt-7 flex justify-center">
                            <Button asChild size="xl" className="btn-primary">
                                <Link href="https://wa.me/5511926025637?text=Quero%20comprar%20o%20Synapse%20por%20R%24%201.199%2C00" target="_blank" rel="noopener noreferrer">
                                    Quero meu Synapse
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

export default SynapseSalesPage;
