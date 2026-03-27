import { Metadata } from "next";
import Link from "next/link";
import { DatabaseIcon, ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Política de Dados | Adone AI",
    description: "Entenda como a Adone AI trata, armazena e protege os dados utilizados em projetos de Inteligência Artificial e Machine Learning.",
};

const SECTIONS = [
    {
        id: "introducao",
        title: "1. Introdução",
        content: `Esta Política de Dados descreve como a Adone AI coleta, processa, armazena e protege os dados utilizados na execução dos seus projetos de Inteligência Artificial e Machine Learning. Esta política complementa nossa Política de Privacidade e é aplicável especificamente ao uso de dados no contexto dos serviços contratados.`,
    },
    {
        id: "tipos-de-dados",
        title: "2. Tipos de Dados Tratados",
        content: `A Adone AI trabalha com diferentes categorias de dados dependendo do projeto:`,
        list: [
            "Dados estruturados: planilhas, bancos de dados relacionais, séries temporais, dados transacionais e registros operacionais fornecidos pelo Cliente.",
            "Dados não estruturados: textos, documentos, imagens, áudios, vídeos e outros arquivos utilizados em projetos de NLP e Visão Computacional.",
            "Dados de comportamento: logs de sistemas, registros de uso, eventos de aplicações e dados de rastreamento de processos.",
            "Dados de treinamento: conjuntos de dados rotulados ou brutos utilizados para treinar, validar e testar modelos de Machine Learning.",
            "Dados de produção: entradas e saídas dos modelos em ambiente produtivo, utilizados para monitoramento e retraining.",
            "Metadados: informações sobre a estrutura, origem e características dos datasets (schema, tamanho, distribuição de classes, etc.).",
        ],
    },
    {
        id: "principios",
        title: "3. Princípios do Tratamento de Dados",
        content: `O tratamento de dados na Adone AI segue os princípios estabelecidos pela LGPD e pelas melhores práticas de engenharia de dados:`,
        list: [
            "Finalidade: os dados são coletados e utilizados exclusivamente para as finalidades definidas em cada projeto.",
            "Adequação: utilizamos apenas os dados necessários para o objetivo proposto, evitando coleta excessiva.",
            "Necessidade: cada dataset é avaliado para garantir que apenas os campos estritamente necessários sejam processados.",
            "Qualidade: adotamos processos de validação, limpeza e documentação para garantir a qualidade dos dados.",
            "Transparência: documentamos o fluxo completo de dados de cada projeto, desde a origem até os entregáveis.",
            "Segurança: aplicamos controles técnicos e administrativos para proteger os dados durante todo o ciclo de vida.",
            "Não discriminação: avaliamos e mitigamos vieses nos datasets para garantir que os modelos não reproduzam discriminações.",
        ],
    },
    {
        id: "ciclo-de-vida",
        title: "4. Ciclo de Vida dos Dados",
        content: `Os dados passam pelas seguintes etapas em projetos da Adone AI:`,
        list: [
            "Ingestão: recebimento dos dados do Cliente via canais seguros (SFTP, API criptografada, storage privado na nuvem).",
            "Armazenamento intermediário: os dados são armazenados em ambientes isolados por projeto, com acesso restrito à equipe responsável.",
            "Exploração e análise: fase de EDA (Exploratory Data Analysis) para entender a estrutura, distribuição e qualidade dos dados.",
            "Pré-processamento: limpeza, normalização, feature engineering e transformações necessárias para o treinamento dos modelos.",
            "Treinamento e validação: uso dos dados para treinar, ajustar e avaliar os modelos de Machine Learning.",
            "Produção: monitoramento dos dados de entrada e saída do modelo em ambiente produtivo para detecção de drift e degradação.",
            "Descarte seguro: ao término do projeto, os dados são excluídos dos ambientes da Adone AI conforme acordado contratualmente.",
        ],
    },
    {
        id: "armazenamento",
        title: "5. Armazenamento e Infraestrutura",
        content: `Os dados dos projetos são armazenados em infraestrutura de nuvem de alta segurança:`,
        list: [
            "Ambientes de nuvem certificados (ISO 27001, SOC 2) com criptografia em repouso (AES-256) e em trânsito (TLS 1.3).",
            "Buckets e bancos de dados isolados por cliente e por projeto, sem compartilhamento de infraestrutura entre clientes.",
            "Controle de acesso baseado em função (RBAC): apenas membros da equipe do projeto têm acesso aos dados.",
            "Logs de auditoria de todos os acessos aos dados, com retenção de 1 ano para fins de rastreabilidade.",
            "Backups automáticos com frequência configurável e testados regularmente para garantir a recuperação.",
            "Opção de processamento de dados sensíveis em ambiente on-premise do Cliente, quando necessário para conformidade.",
        ],
    },
    {
        id: "qualidade",
        title: "6. Qualidade e Governança de Dados",
        content: `A Adone AI adota práticas robustas de governança para garantir a confiabilidade dos dados utilizados nos modelos:`,
        list: [
            "Data profiling: análise estatística automatizada dos datasets para identificar inconsistências, valores ausentes e outliers.",
            "Versionamento de dados: controle de versão de datasets e features para reprodutibilidade dos experimentos.",
            "Data lineage: rastreabilidade completa da origem e transformações aplicadas aos dados em cada etapa.",
            "Monitoramento de drift: detecção de mudanças na distribuição dos dados em produção para manter a precisão dos modelos.",
            "Documentação de schema: registro formal da estrutura, tipos e restrições de cada dataset.",
            "Validação contínua: pipelines automáticos de validação de qualidade executados a cada atualização de dados.",
        ],
    },
    {
        id: "anonimizacao",
        title: "7. Anonimização e Pseudonimização",
        content: `Quando os datasets contêm dados pessoais, aplicamos técnicas para reduzir o risco de identificação dos titulares:`,
        list: [
            "Anonimização: remoção ou transformação irreversível de identificadores diretos (nome, CPF, e-mail, telefone) quando não são necessários ao modelo.",
            "Pseudonimização: substituição de identificadores por tokens ou hashes reversíveis, quando a rastreabilidade interna é necessária.",
            "Generalização: substituição de valores precisos por faixas ou categorias (ex.: idade exata → faixa etária).",
            "Supressão: remoção de registros ou campos que não contribuem para o objetivo do modelo e representam risco desnecessário.",
            "Síntese de dados: geração de dados sintéticos estatisticamente equivalentes para fases de desenvolvimento e testes.",
            "k-anonimato e técnicas avançadas: aplicados em projetos que exigem alto nível de privacidade, como saúde e finanças.",
        ],
    },
    {
        id: "compartilhamento",
        title: "8. Compartilhamento e Transferência de Dados",
        content: `Os dados dos Clientes não são compartilhados com terceiros, exceto nas seguintes situações:`,
        list: [
            "Provedores de infraestrutura de nuvem (subprocessadores): AWS, Google Cloud ou Azure, conforme acordado com o Cliente, todos com cláusulas contratuais de proteção de dados.",
            "Ferramentas de MLOps e experimentos (ex.: MLflow, Weights & Biases): em ambientes isolados, com dados pseudonimizados quando possível.",
            "Equipes internas da Adone AI: acesso restrito por projeto, com segregação de funções.",
            "Determinação legal ou judicial: quando exigido por autoridade competente, com comunicação ao Cliente sempre que legalmente possível.",
        ],
        extra: "Dados de Clientes nunca são utilizados para treinar modelos de outros projetos ou produtos da Adone AI sem autorização expressa.",
    },
    {
        id: "retencao",
        title: "9. Retenção e Descarte",
        content: `O período de retenção dos dados é definido contratualmente com cada Cliente. Por padrão:`,
        list: [
            "Dados de projetos encerrados: excluídos em até 30 dias após a entrega final, salvo acordo contratual diferente.",
            "Modelos treinados: retidos pelo prazo acordado contratualmente para suporte e manutenção.",
            "Logs técnicos e de auditoria: retidos por 12 meses para fins de segurança e rastreabilidade.",
            "Dados de produção monitorados: retidos pelo período necessário para retraining e melhoria contínua do modelo.",
            "Backups: excluídos em até 60 dias após o descarte dos dados originais.",
        ],
        extra: "O descarte é realizado de forma segura, com sobrescrita de dados em disco ou destruição certificada, conforme a sensibilidade dos dados.",
    },
    {
        id: "seguranca",
        title: "10. Segurança Técnica",
        content: `A Adone AI implementa múltiplas camadas de segurança para proteger os dados dos projetos:`,
        list: [
            "Criptografia end-to-end: todos os dados em trânsito utilizam TLS 1.3; dados em repouso são criptografados com AES-256.",
            "Autenticação multifator (MFA): obrigatória para todos os membros da equipe que acessam ambientes com dados de clientes.",
            "Segmentação de rede: ambientes de dados isolados por VPC (Virtual Private Cloud) com regras de firewall restritivas.",
            "Escaneamento de vulnerabilidades: análises automatizadas periódicas dos sistemas e dependências utilizadas.",
            "Pen testing: testes de penetração anuais realizados por empresa especializada terceirizada.",
            "Resposta a incidentes: plano formalizado de resposta a incidentes de segurança, com notificação em até 72h conforme LGPD.",
        ],
    },
    {
        id: "ia-dados",
        title: "11. Dados em Modelos de IA",
        content: `O uso de dados no contexto de Machine Learning requer atenção especial a aspectos que vão além do tratamento convencional:`,
        list: [
            "Memorização de dados de treinamento: adotamos técnicas de regularização e avaliação para reduzir o risco de modelos memorizarem dados individuais.",
            "Inversão de modelo: avaliamos vulnerabilidades de inversão antes da entrega de modelos que podem ser acessados externamente.",
            "Inferência de associação: testamos os modelos contra ataques de inferência de associação em projetos com dados sensíveis.",
            "Fairness e viés: avaliamos métricas de equidade do modelo por grupos demográficos relevantes, mitigando vieses identificados.",
            "Explicabilidade: documentamos e disponibilizamos técnicas de interpretabilidade (SHAP, LIME) para modelos em produção crítica.",
            "Privacy by Design: a proteção de dados é incorporada desde o início do ciclo de desenvolvimento de cada modelo.",
        ],
    },
    {
        id: "responsabilidades",
        title: "12. Responsabilidades do Cliente",
        content: `O Cliente é responsável por:`,
        list: [
            "Garantir que possui autorização legal para fornecer os dados à Adone AI para as finalidades do projeto.",
            "Obter o consentimento necessário dos titulares de dados pessoais presentes nos datasets, quando aplicável.",
            "Informar a Adone AI sobre eventuais restrições legais, regulatórias ou setoriais aplicáveis aos dados.",
            "Notificar a Adone AI imediatamente em caso de identificação de dados sensíveis não declarados previamente.",
            "Manter a segurança dos canais de transferência de dados de sua responsabilidade.",
            "Garantir a precisão e completude dos dados fornecidos para treinamento dos modelos.",
        ],
    },
    {
        id: "incidentes",
        title: "13. Gestão de Incidentes",
        content: `Em caso de incidente de segurança envolvendo dados de projetos, a Adone AI adota o seguinte protocolo:`,
        list: [
            "Contenção imediata: isolamento dos sistemas afetados nas primeiras horas após a detecção.",
            "Avaliação de impacto: identificação dos dados afetados, extensão do incidente e titulares potencialmente impactados.",
            "Notificação ao Cliente: comunicação em até 24 horas após a confirmação do incidente, com detalhes disponíveis.",
            "Notificação à ANPD: realizada em até 72 horas quando o incidente envolver dados pessoais e representar risco aos titulares.",
            "Remediação: correção das vulnerabilidades exploradas e reforço dos controles de segurança.",
            "Relatório pós-incidente: documento detalhado com causa raiz, impacto, ações tomadas e melhorias implementadas.",
        ],
    },
    {
        id: "atualizacoes",
        title: "14. Atualizações desta Política",
        content: `Esta Política de Dados é revisada periodicamente para refletir mudanças técnicas, regulatórias ou nas nossas práticas de tratamento de dados. Alterações significativas serão comunicadas aos Clientes ativos com antecedência mínima de 15 dias. A versão vigente estará sempre disponível nesta página.`,
    },
    {
        id: "contato",
        title: "15. Contato",
        content: `Para dúvidas ou solicitações relacionadas ao tratamento de dados em projetos:`,
        list: [
            "E-mail do DPO: contato@adoneintelligence.com.br",
            "E-mail técnico: contato@adoneintelligence.com.br",
            "E-mail geral: contato@adoneintelligence.com.br",
        ],
        extra: "Para exercer seus direitos como titular de dados pessoais, consulte nossa Política de Privacidade.",
    },
];

export default function DadosPage() {
    const updatedAt = "19 de março de 2026";

    return (
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-24 md:py-32">

            {/* Header */}
            <div className="mb-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-400 transition-colors mb-8"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Voltar ao site
                </Link>

                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20">
                        <DatabaseIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
                        Legal · Dados
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
                    Política de Dados
                </h1>

                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                    Saiba como a{" "}
                    <span className="text-violet-400 font-medium">Adone AI</span>{" "}
                    coleta, processa, armazena e protege os dados utilizados nos projetos de Inteligência Artificial e Machine Learning, em conformidade com a LGPD e as melhores práticas de engenharia de dados.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Última atualização: <span className="text-foreground">{updatedAt}</span></span>
                    <span className="hidden sm:inline text-foreground/20">·</span>
                    <span>Versão: <span className="text-foreground">1.0</span></span>
                </div>
            </div>

            {/* Index */}
            <nav className="mb-12 p-5 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Índice
                </h2>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {SECTIONS.map((s) => (
                        <li key={s.id}>
                            <a
                                href={`#${s.id}`}
                                className="text-sm text-muted-foreground hover:text-violet-400 transition-colors"
                            >
                                {s.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-12">
                {SECTIONS.map((section) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className="scroll-mt-24 pb-12 border-b border-foreground/5 last:border-0"
                    >
                        <h2 className="text-lg md:text-xl font-semibold font-heading text-foreground mb-4">
                            {section.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {section.content}
                        </p>
                        {section.list && (
                            <ul className="space-y-2.5 mt-3">
                                {section.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                                        <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {section.extra && (
                            <p className="mt-4 text-sm text-muted-foreground leading-relaxed p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                                {section.extra}
                            </p>
                        )}
                    </section>
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-16 p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-purple-950/10 text-center">
                <DatabaseIcon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Dúvidas sobre o tratamento de dados nos projetos? Fale com nossa equipe em{" "}
                    <a href="mailto:contato@adoneintelligence.com.br" className="text-violet-400 hover:underline">
                        contato@adoneintelligence.com.br
                    </a>
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        ← Voltar ao site
                    </Link>
                    <span className="text-foreground/20">·</span>
                    <Link href="/privacidade" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        Política de Privacidade
                    </Link>
                    <span className="text-foreground/20">·</span>
                    <Link href="/termos" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        Termos de Uso
                    </Link>
                    <span className="text-foreground/20">·</span>
                    <Link href="/lgpd" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        LGPD
                    </Link>
                </div>
            </div>
        </div>
    );
}
