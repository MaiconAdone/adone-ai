import {
    ArrowRight,
    BookOpen,
    Bot,
    BrainCircuit,
    ChartNoAxesCombined,
    CheckCircle2,
    ClipboardList,
    Database,
    FileSearch,
    Gauge,
    GitBranch,
    Layers,
    MessageCircle,
    MessageSquareText,
    Network,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    TestTubeDiagonal,
    Workflow,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Background, Container, Wrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";

export const metadata: Metadata = {
    title: "Synapse | Fábrica de soluções de IA e Machine Learning",
    description: "Synapse é a fábrica enterprise de soluções de IA/ML da Adone: a partir de um briefing no chat, analisa o problema de negócio, escolhe a arquitetura e gera projetos governados de ML, IA, Chatbolt ou Híbrido.",
};

const BUY_URL = "https://wa.me/5511926025637?text=Quero%20comprar%20o%20Synapse%20por%20R%24%201.199%2C00";

const pipeline = [
    { icon: MessageSquareText, title: "Briefing no chat", text: "Objetivo, problema, universo, métrica, dados e risco." },
    { icon: FileSearch, title: "Análise da solução", text: "O analisador gera o ADR com a arquitetura recomendada." },
    { icon: ShieldCheck, title: "Gate SDD", text: "Nada é criado com briefing incompleto." },
    { icon: SlidersHorizontal, title: "Seleção de tecnologias", text: "Frameworks e templates escolhidos por cenário." },
    { icon: Layers, title: "Projeto gerado", text: "Workspace governado, só com o que o universo usa." },
    { icon: TestTubeDiagonal, title: "Testes e diagnóstico", text: "O projeto já nasce testado e validado." },
];

const universes = [
    {
        icon: Database,
        title: "ML",
        text: "Dados, estatística, features, baseline, experimentos, model card, métricas, monitoramento e drift.",
    },
    {
        icon: BrainCircuit,
        title: "IA",
        text: "LLMs, agentes como contratos, RAG, MCP, tool calling, memória, guardrails e observabilidade.",
    },
    {
        icon: Bot,
        title: "Chatbolt",
        text: "Assistentes conversacionais com RAG, handoff para humano, memória de sessão e evals de conversa.",
    },
    {
        icon: Network,
        title: "ML + IA (Híbrido)",
        text: "Modelos preditivos com LLM, RAG e agentes, compartilhando contratos, testes, evals e governança.",
    },
];

const engineering = [
    {
        icon: Database,
        title: "RAG escalável",
        text: "Escolhe o vector database pelo volume, latência, multi-tenant e sensibilidade dos dados. Busca híbrida (densa + BM25), fusão RRF, rerank e citação das fontes.",
    },
    {
        icon: Sparkles,
        title: "Fine-tuning com critério",
        text: "Escada de adaptação: prompt → RAG → fine-tuning. Só libera com eval set, baseline medido, dados sem PII, ganho mínimo e rollback para o modelo base.",
    },
    {
        icon: Gauge,
        title: "Harness engineering",
        text: "Tudo o que envolve o modelo para o agente ser confiável: contexto, limites de ferramentas, loop de controle, verificação, observabilidade e gate pass^k.",
    },
    {
        icon: Bot,
        title: "Agentes da solução",
        text: "Single agent first ou orquestrador + especialistas. Ações externas exigem aprovação humana e as ferramentas nunca são inventadas.",
    },
];

const governance = [
    "Um único assistente por tarefa, sem swarm, e 16 papéis que respondem por cada etapa",
    "Menor privilégio, aprovação humana para ação destrutiva ou externa e matriz de autonomia",
    "Roteamento de modelos por custo: perfis de tier e orçamento de tokens por tipo de pedido",
    "Separação de provedores: Claude Code usa Anthropic e Codex usa OpenAI",
    "Bloqueio de conteúdo sensível e dados restritos fora do ambiente aprovado",
    "Memória híbrida compartilhada entre os canais de conversa",
];

const transformation = [
    "Diagnóstico e mapeamento de processos",
    "Prontidão de dados e oportunidades priorizadas",
    "Arquitetura de automação e KPIs com baseline e meta",
    "Risco por regras explícitas (LOW a CRITICAL)",
    "Aprovação humana e simulação antes da execução real",
    "Avaliação de impacto e relatório final auditável",
];

const quality = [
    { title: "Evals", text: "Suítes de ML, IA (incluindo prompt injection), RAG (fidelidade às fontes) e retrieval (recall@k, MRR, nDCG)." },
    { title: "Quality gates", text: "Gates de prompt, RAG, ML, LLM ops, retrieval, fine-tuning e harness dos agentes." },
    { title: "Testes da fábrica", text: "Gera projetos dos quatro universos e roda os testes de cada um, com rollback se algo falhar." },
    { title: "CI", text: "Validação do stack enterprise e testes a cada push." },
];

const included = [
    "Fábrica de projetos para os 4 universos: ML, IA, Chatbolt e Híbrido",
    "Analisador de solução com ADR e gate de briefing (SDD)",
    "Catálogo de 14 frameworks e seleção de tecnologias por cenário",
    "RAG escalável, fine-tuning, harness e agentes da solução",
    "Tratamento estatístico de dados e camada local de modelos ML",
    "Evals, quality gates, testes e governança de agentes e custo",
    "IA agêntica para transformação empresarial",
    "Base de 24 livros traduzidos em contratos executáveis",
];

const outcomes = [
    "Sair do briefing a um projeto de IA/ML estruturado e testado",
    "Decidir arquitetura com ADR, em vez de começar do zero",
    "Padronizar qualidade com evals, quality gates e governança",
    "Controlar custo com roteamento de modelos e orçamento de tokens",
];

const SynapseSalesPage = () => {
    return (
        <Background>
            <Wrapper className="relative overflow-hidden pt-28 pb-20">
                {/* Hero */}
                <Container className="relative">
                    <Spotlight
                        className="-top-40 left-0 md:left-72 md:-top-28"
                        fill="rgba(139, 92, 246, 0.45)"
                    />
                    <section className="relative z-10 text-center">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200">
                            <Image
                                src="/img/synapse.png"
                                alt="Logotipo Synapse"
                                width={40}
                                height={40}
                                className="h-10 w-auto rounded-full bg-violet-950/70 p-1"
                                priority
                            />
                            Synapse Solution Factory
                        </div>
                        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            A fábrica enterprise de soluções de IA e Machine Learning.
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                            Você descreve o problema de negócio no chat. O Synapse analisa, escolhe a arquitetura e gera um projeto governado de ML, IA, Chatbolt ou Híbrido — com dados, agentes, RAG, evals e governança prontos para evoluir.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild size="xl" className="btn-primary">
                                <Link href={BUY_URL} target="_blank" rel="noopener noreferrer">
                                    Comprar agora
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="xl" variant="subtle">
                                <Link href="#como-funciona">Ver como funciona</Link>
                            </Button>
                        </div>
                        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 text-left sm:grid-cols-4">
                            {[
                                ["4", "universos de projeto"],
                                ["14", "frameworks no catálogo"],
                                ["24", "livros base"],
                                ["R$ 1.199", "pagamento único"],
                            ].map(([value, label]) => (
                                <div key={label} className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-4">
                                    <strong className="block text-2xl text-foreground">{value}</strong>
                                    <span className="text-sm text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Como funciona */}
                <Container className="mt-20">
                    <section id="como-funciona" className="scroll-mt-28">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Como funciona</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Do briefing ao projeto testado, sem pular etapas.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                O Synapse é o plano de controle e a única fábrica de projetos. Ele conversa pelo <strong className="text-foreground">VS Code Chat</strong>, <strong className="text-foreground">Claude Code</strong> ou <strong className="text-foreground">Codex</strong>, pergunta o que falta em vez de inventar e só cria o projeto quando o briefing está completo.
                            </p>
                        </div>
                        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {pipeline.map((step, index) => (
                                <li key={step.title} className="relative rounded-lg border border-foreground/10 bg-foreground/[0.04] p-5">
                                    <span className="absolute right-4 top-4 text-xs font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                                    <step.icon className="h-6 w-6 text-violet-300" />
                                    <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                                </li>
                            ))}
                        </ol>
                        <p className="mt-4 text-xs text-muted-foreground">
                            Roda como scripts locais, sem backend, frontend ou chaves de API próprias: Claude Code e Codex usam a própria autenticação.
                        </p>
                    </section>
                </Container>

                {/* Universos */}
                <Container className="mt-20">
                    <section>
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Quatro universos</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Cada projeto recebe só o que o seu universo precisa.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Artefatos que não se aplicam são removidos. Todos os universos herdam tratamento de dados, contratos, testes, evals, governança e harness engineering.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {universes.map((universe) => (
                                <div key={universe.title} className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-5">
                                    <universe.icon className="h-7 w-7 text-violet-300" />
                                    <h3 className="mt-5 text-lg font-semibold text-foreground">{universe.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{universe.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Engenharia de IA */}
                <Container className="mt-20">
                    <section>
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Engenharia de IA</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Política como fonte de verdade, código testável como entrega.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Cada capacidade segue o mesmo padrão: política → especificação → código testável → integração no analisador → herança pelos projetos gerados.
                            </p>
                        </div>
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {engineering.map((item) => (
                                <div key={item.title} className="flex gap-4 rounded-lg border border-foreground/10 bg-foreground/[0.04] p-5">
                                    <item.icon className="mt-1 h-6 w-6 flex-none text-violet-300" />
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Governança + Transformação */}
                <Container className="mt-20">
                    <section className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 md:p-8">
                            <ShieldCheck className="h-7 w-7 text-violet-300" />
                            <h2 className="mt-4 text-2xl font-bold text-foreground">Governança de agentes e custo</h2>
                            <ul className="mt-5 grid gap-3">
                                {governance.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-violet-300" />
                                        <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 md:p-8">
                            <Workflow className="h-7 w-7 text-violet-300" />
                            <h2 className="mt-4 text-2xl font-bold text-foreground">IA agêntica para transformação empresarial</h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Objetivos de negócio viram workflows auditáveis, executados por uma máquina de estados determinística. Nada é inventado: o que falta vira pergunta ao usuário.
                            </p>
                            <ul className="mt-5 grid gap-3">
                                {transformation.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-violet-300" />
                                        <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </Container>

                {/* Dados, ML e qualidade */}
                <Container className="mt-20">
                    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="grid gap-4">
                            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-5">
                                <ClipboardList className="h-6 w-6 text-violet-300" />
                                <h3 className="mt-4 font-semibold text-foreground">Tratamento estatístico de dados</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Coloque o arquivo bruto e peça no chat: o Synapse corrige nomes e tipos, remove duplicatas e gera o dataset tratado com relatório.
                                </p>
                            </div>
                            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-5">
                                <ChartNoAxesCombined className="h-6 w-6 text-violet-300" />
                                <h3 className="mt-4 font-semibold text-foreground">Camada local de modelos ML</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Baselines de regressão, classificação e séries temporais, com artefatos versionados e registry local de experimentos.
                                </p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 md:p-8">
                            <TestTubeDiagonal className="h-7 w-7 text-violet-300" />
                            <h2 className="mt-4 text-2xl font-bold text-foreground">Qualidade medida, não prometida</h2>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {quality.map((item) => (
                                    <div key={item.title}>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </Container>

                {/* Base de livros */}
                <Container className="mt-20">
                    <section className="flex flex-col gap-6 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 md:flex-row md:items-center md:p-8">
                        <BookOpen className="h-10 w-10 flex-none text-violet-300" />
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">24 livros transformados em contratos executáveis</h2>
                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                AI Engineering, LLM Engineer&apos;s Handbook, Designing Machine Learning Systems, Building LLMs for Production, AI Agents in Action e outras referências viram políticas, evals e código — sem copiar texto. Princípios: evals antes de otimizar, retrieval mensurável, contratos tipados e estado determinístico ao redor do raciocínio probabilístico.
                            </p>
                        </div>
                    </section>
                </Container>

                {/* Oferta */}
                <Container className="mt-20">
                    <section id="oferta" className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="rounded-lg border border-violet-400/20 bg-violet-500/10 p-6">
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Oferta de lançamento</p>
                            <div className="mt-4 flex items-end gap-2">
                                <span className="text-5xl font-bold text-foreground">R$ 1.199,00</span>
                            </div>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground">
                                Acesso à Synapse Solution Factory para criar projetos governados de ML, IA, Chatbolt e Híbrido.
                            </p>
                            <Button asChild size="xl" className="btn-primary mt-6 w-full">
                                <Link href={BUY_URL} target="_blank" rel="noopener noreferrer">
                                    Falar no WhatsApp
                                    <MessageCircle className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {included.map((item) => (
                                <div key={item} className="flex gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.04] p-4">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-violet-300" />
                                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </Container>

                {/* Para quem é */}
                <Container className="mt-20">
                    <section className="grid gap-8 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6 md:p-8 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wide text-violet-200">Para quem é</p>
                            <h2 className="mt-3 text-3xl font-bold text-foreground">Times que precisam entregar IA com controle.</h2>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Consultores, founders, equipes de dados e engenharia que querem padronizar projetos de IA e ML sem perder segurança, rastreabilidade e custo previsível.
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

                {/* Sobre */}
                <Container className="mt-20">
                    <section id="sobre" className="dark-surface grid gap-8 rounded-3xl border border-white/10 bg-violet-950/90 p-8 lg:grid-cols-[0.95fr_1.05fr]">
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
                            />
                        </div>
                    </section>
                </Container>

                {/* CTA final */}
                <Container className="mt-20">
                    <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-violet-500/10 p-8 text-center">
                        <GitBranch className="mx-auto h-9 w-9 text-violet-200" />
                        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold text-foreground">
                            Comece com o Synapse por R$ 1.199,00
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
                            Fale com a Adone Intelligence para receber a fábrica, orientação inicial e próximos passos de implantação.
                        </p>
                        <div className="mt-7 flex justify-center">
                            <Button asChild size="xl" className="btn-primary">
                                <Link href={BUY_URL} target="_blank" rel="noopener noreferrer">
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
