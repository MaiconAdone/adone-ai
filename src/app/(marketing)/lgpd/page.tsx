import { Metadata } from "next";
import Link from "next/link";
import { ScaleIcon, ArrowLeftIcon, CheckIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "LGPD | Adone AI",
    description: "Saiba como a Adone AI está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e como exercer seus direitos como titular.",
};

const SECTIONS = [
    {
        id: "o-que-e-lgpd",
        title: "1. O que é a LGPD?",
        content: `A Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018) é a legislação brasileira que regula o tratamento de dados pessoais por pessoas físicas e jurídicas, com o objetivo de proteger os direitos fundamentais de liberdade, privacidade e o livre desenvolvimento da personalidade da pessoa natural.`,
        list: [
            "Vigência: a LGPD entrou em vigor em setembro de 2020, com sanções administrativas a partir de agosto de 2021.",
            "Abrangência: aplica-se a qualquer operação de tratamento de dados de pessoas físicas realizada no Brasil, independentemente do meio ou do país sede da organização.",
            "Autoridade reguladora: a Autoridade Nacional de Proteção de Dados (ANPD) é o órgão responsável por zelar pela aplicação da LGPD.",
            "Sanções: as infrações à LGPD podem resultar em multas de até 2% do faturamento da empresa, limitadas a R$ 50 milhões por infração.",
        ],
    },
    {
        id: "compromisso",
        title: "2. Compromisso da Adone AI com a LGPD",
        content: `A Adone AI está comprometida com a conformidade à LGPD em todas as suas operações. Como empresa de Inteligência Artificial, reconhecemos a responsabilidade adicional que temos no tratamento de dados — especialmente por desenvolvermos soluções que, por sua natureza, processam grandes volumes de informações. Nossas ações incluem:`,
        list: [
            "Nomeação de Encarregado de Dados (DPO) responsável por supervisionar a conformidade com a LGPD.",
            "Mapeamento completo dos fluxos de dados pessoais (data mapping) em todas as operações.",
            "Avaliação de impacto à proteção de dados (DPIA) para projetos de alto risco.",
            "Treinamentos periódicos de todos os colaboradores sobre proteção de dados e LGPD.",
            "Revisão contínua de contratos com fornecedores para inclusão de cláusulas de proteção de dados.",
            "Implementação do princípio de Privacy by Design em todos os projetos de IA.",
        ],
    },
    {
        id: "dados-pessoais",
        title: "3. O que são Dados Pessoais?",
        content: `A LGPD define dado pessoal como qualquer informação relacionada a pessoa natural identificada ou identificável. Dados pessoais sensíveis recebem proteção reforçada pela lei.`,
        list: [
            "Dados pessoais comuns: nome, CPF, RG, endereço, e-mail, telefone, localização, dados de navegação, dados profissionais.",
            "Dados pessoais sensíveis: origem racial ou étnica, convicção religiosa, opinião política, dado referente à saúde ou à vida sexual, dado genético ou biométrico.",
            "Dados anonimizados: dados que, após processo técnico de anonimização, não permitem identificação do titular — não são considerados dados pessoais pela LGPD.",
            "Dados de crianças e adolescentes: tratados com proteção especial, exigindo consentimento específico dos pais ou responsáveis legais.",
        ],
        extra: "Em projetos de IA, a Adone AI avalia cada dataset para classificar corretamente os dados, aplicando os controles adequados a cada categoria.",
    },
    {
        id: "bases-legais",
        title: "4. Bases Legais para Tratamento de Dados",
        content: `A LGPD estabelece 10 bases legais que autorizam o tratamento de dados pessoais. A Adone AI identifica e documenta a base legal aplicável em cada operação de tratamento:`,
        list: [
            "I — Consentimento: manifestação livre, informada e inequívoca do titular. Utilizado para comunicações de marketing e envio de conteúdos.",
            "II — Cumprimento de obrigação legal: para atendimento a exigências fiscais, trabalhistas e regulatórias.",
            "III — Execução de políticas públicas: não aplicável às operações da Adone AI.",
            "IV — Estudos por órgão de pesquisa: para projetos de P&D com dados anonimizados ou pseudonimizados.",
            "V — Execução de contrato: para prestação dos serviços contratados pelo Cliente.",
            "VI — Exercício regular de direitos: para defesa em processos judiciais ou administrativos.",
            "VII — Proteção da vida: em situações de emergência envolvendo risco à vida.",
            "VIII — Tutela da saúde: aplicável em projetos do setor de saúde com profissionais habilitados.",
            "IX — Legítimo interesse: para análise de desempenho do site, segurança e melhoria de serviços.",
            "X — Proteção do crédito: não aplicável às operações da Adone AI.",
        ],
    },
    {
        id: "direitos",
        title: "5. Seus Direitos como Titular de Dados",
        content: `A LGPD garante aos titulares de dados pessoais um conjunto de direitos que podem ser exercidos a qualquer momento perante a Adone AI:`,
        list: [
            "Confirmação (art. 18, I): saber se a Adone AI realiza algum tratamento dos seus dados pessoais.",
            "Acesso (art. 18, II): obter cópia dos dados pessoais que possuímos sobre você.",
            "Correção (art. 18, III): solicitar a atualização de dados incompletos, inexatos ou desatualizados.",
            "Anonimização, bloqueio ou eliminação (art. 18, IV): de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.",
            "Portabilidade (art. 18, V): receber seus dados em formato estruturado e interoperável para transferência a outro fornecedor.",
            "Eliminação (art. 18, VI): exclusão dos dados tratados com base em consentimento, quando você revogar.",
            "Informação sobre compartilhamento (art. 18, VII): saber com quais entidades públicas e privadas seus dados são compartilhados.",
            "Informação sobre não consentimento (art. 18, VIII): ser informado sobre a possibilidade de não fornecer consentimento e as consequências.",
            "Revogação do consentimento (art. 18, IX): retirar o consentimento a qualquer momento, sem prejuízo às operações anteriores.",
            "Oposição (art. 18, §2º): opor-se a tratamentos realizados com base em outras bases legais que não o consentimento, em caso de descumprimento.",
        ],
        extra: "Para exercer qualquer um desses direitos, envie uma solicitação para privacidade@adoneintelligence.com.br. Responderemos em até 15 dias úteis, conforme estabelecido pela LGPD.",
    },
    {
        id: "como-exercer",
        title: "6. Como Exercer seus Direitos",
        content: `Para exercer seus direitos como titular de dados pessoais perante a Adone AI, siga os passos abaixo:`,
        list: [
            "Envie um e-mail para privacidade@adoneintelligence.com.br com o assunto: 'Solicitação de Direito LGPD'.",
            "Informe seu nome completo e dados de contato para que possamos identificá-lo como titular.",
            "Descreva claramente qual direito deseja exercer e, se necessário, forneça detalhes adicionais.",
            "Inclua documentação de identificação quando solicitado, para proteção contra fraudes.",
            "Aguarde nossa resposta em até 15 dias úteis. Em casos complexos, informaremos sobre eventual prorrogação.",
        ],
        extra: "Caso não fique satisfeito com nossa resposta, você pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados (ANPD) pelo site gov.br/anpd.",
    },
    {
        id: "dpo",
        title: "7. Encarregado de Dados (DPO)",
        content: `A Adone AI nomeou um Encarregado de Proteção de Dados (Data Protection Officer — DPO) conforme exigido pela LGPD para organizações que realizam tratamento em larga escala de dados pessoais ou sensíveis. O DPO é o canal oficial de comunicação entre a Adone AI, os titulares de dados e a ANPD.`,
        list: [
            "Canal de contato do DPO: privacidade@adoneintelligence.com.br",
            "Responsabilidades: orientar colaboradores, receber demandas dos titulares, interagir com a ANPD e fiscalizar a conformidade interna.",
            "Independência: o DPO atua com independência técnica e não recebe instruções que comprometam sua atuação imparcial.",
        ],
    },
    {
        id: "consentimento",
        title: "8. Consentimento e sua Gestão",
        content: `Quando o tratamento de dados pessoais pela Adone AI se baseia em consentimento, garantimos que ele seja:`,
        list: [
            "Livre: sem qualquer condicionamento ou pressão para obtenção.",
            "Informado: precedido de informações claras sobre a finalidade, forma de tratamento e direitos do titular.",
            "Inequívoco: manifestado por ação positiva e explícita do titular, sem ambiguidades.",
            "Específico: vinculado a finalidades determinadas, não sendo válido para usos futuros não declarados.",
            "Revogável: o titular pode revogar o consentimento a qualquer momento, por meio simples e gratuito.",
        ],
        extra: "Consentimentos obtidos pela Adone AI são registrados com data, hora, forma de coleta e finalidade declarada, para fins de demonstração de conformidade (accountability).",
    },
    {
        id: "transferencia-internacional",
        title: "9. Transferência Internacional de Dados",
        content: `A LGPD (art. 33) estabelece requisitos para a transferência de dados pessoais para países estrangeiros. A Adone AI realiza transferências internacionais apenas quando:`,
        list: [
            "O país de destino oferece grau de proteção de dados pessoais adequado ao brasileiro, conforme avaliação da ANPD.",
            "O operador receptor oferece garantias de conformidade por meio de cláusulas contratuais padrão aprovadas pela ANPD.",
            "Há consentimento específico e em destaque do titular para a transferência.",
            "A transferência é necessária para execução de contrato do qual o titular é parte.",
        ],
        extra: "Nossos principais provedores de infraestrutura (cloud) são certificados em padrões internacionais de segurança e possuem cláusulas contratuais adequadas para transferência de dados com o Brasil.",
    },
    {
        id: "ia-lgpd",
        title: "10. Inteligência Artificial e LGPD",
        content: `O uso de IA para processamento de dados pessoais cria responsabilidades específicas que a Adone AI trata com rigor:`,
        list: [
            "Decisões automatizadas (art. 20): quando um modelo de IA toma decisões que afetam o titular, garantimos o direito de revisão humana e explicação dos critérios utilizados.",
            "Perfis e profiling: quando realizamos análise de perfil com dados pessoais, informamos o titular e garantimos transparência sobre os critérios.",
            "Minimização de dados: treinamos modelos com o mínimo de dados pessoais necessários, priorizando dados anonimizados ou sintéticos.",
            "DPIA para projetos de alto risco: realizamos Avaliação de Impacto à Proteção de Dados antes de iniciar projetos que possam gerar riscos elevados aos titulares.",
            "Explicabilidade: documentamos e disponibilizamos mecanismos de explicação dos modelos para que titulares entendam as decisões que os afetam.",
        ],
        extra: "A Adone AI acompanha ativamente as regulamentações da ANPD sobre uso de IA e atualiza suas práticas conforme novas diretrizes forem publicadas.",
    },
    {
        id: "incidentes",
        title: "11. Comunicação de Incidentes de Segurança",
        content: `Em caso de incidente de segurança que possa acarretar risco ou dano relevante aos titulares, a Adone AI adota o seguinte protocolo conforme art. 48 da LGPD:`,
        list: [
            "Notificação à ANPD: em prazo razoável, definido pela ANPD, contendo: descrição da natureza dos dados afetados, informações sobre os titulares envolvidos, medidas técnicas e de segurança adotadas e riscos relacionados ao incidente.",
            "Notificação aos titulares afetados: quando o incidente puder acarretar risco ou dano relevante, comunicamos diretamente os titulares.",
            "Relatório completo: elaboramos relatório detalhado com causa raiz, extensão do incidente, medidas de contenção e melhorias implementadas.",
        ],
    },
    {
        id: "anpd",
        title: "12. Autoridade Nacional de Proteção de Dados (ANPD)",
        content: `A ANPD é o órgão federal responsável por zelar pela proteção de dados pessoais e por implementar e fiscalizar o cumprimento da LGPD no Brasil.`,
        list: [
            "Canal de reclamações: os titulares podem registrar reclamações contra controladores de dados no site oficial da ANPD.",
            "Fiscalização: a ANPD pode realizar inspeções e auditorias para verificar a conformidade das organizações com a LGPD.",
            "Sanções: advertência, multa simples (até 2% do faturamento, limitada a R$ 50 milhões por infração), multa diária, publicização da infração, bloqueio ou eliminação dos dados.",
            "Site oficial: gov.br/anpd",
        ],
    },
    {
        id: "atualizacoes",
        title: "13. Atualizações desta Página",
        content: `Esta página é revisada periodicamente para refletir mudanças na legislação, nas regulamentações da ANPD e nas práticas da Adone AI. Atualizações relevantes serão comunicadas aos nossos clientes. A versão vigente estará sempre disponível em adoneintelligence.com.br/lgpd.`,
    },
    {
        id: "contato",
        title: "14. Contato",
        content: `Para exercer seus direitos, tirar dúvidas sobre a LGPD ou sobre as práticas de proteção de dados da Adone AI:`,
        list: [
            "DPO / Privacidade: privacidade@adoneintelligence.com.br",
            "Contato geral: contato@adoneintelligence.com.br",
            "WhatsApp: (11) 92602-5637",
            "ANPD (reclamações): gov.br/anpd",
        ],
    },
];

const RIGHTS = [
    "Confirmação de tratamento",
    "Acesso aos dados",
    "Correção de dados",
    "Anonimização ou eliminação",
    "Portabilidade",
    "Revogação do consentimento",
    "Informação sobre compartilhamento",
    "Oposição ao tratamento",
];

export default function LGPDPage() {
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
                        <ScaleIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
                        Legal · LGPD
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
                    LGPD
                </h1>

                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                    A{" "}
                    <span className="text-violet-400 font-medium">Adone AI</span>{" "}
                    está em conformidade com a{" "}
                    <span className="text-violet-400 font-medium">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</span>.
                    {" "}Entenda seus direitos, nossas obrigações e como tratamos dados pessoais com responsabilidade.
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Última atualização: <span className="text-foreground">{updatedAt}</span></span>
                    <span className="hidden sm:inline text-foreground/20">·</span>
                    <span>Versão: <span className="text-foreground">1.0</span></span>
                </div>
            </div>

            {/* Rights highlight card */}
            <div className="mb-12 p-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-purple-950/10">
                <h2 className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4">
                    Seus direitos garantidos pela LGPD
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {RIGHTS.map((right, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                                <CheckIcon className="w-3 h-3 text-violet-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">{right}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-5 pt-4 border-t border-violet-500/10">
                    <p className="text-xs text-muted-foreground">
                        Para exercer qualquer um desses direitos:{" "}
                        <a href="mailto:privacidade@adoneintelligence.com.br" className="text-violet-400 hover:underline">
                            privacidade@adoneintelligence.com.br
                        </a>
                    </p>
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
                <ScaleIcon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Dúvidas sobre a LGPD ou seus direitos? Fale com nosso DPO em{" "}
                    <a href="mailto:privacidade@adoneintelligence.com.br" className="text-violet-400 hover:underline">
                        privacidade@adoneintelligence.com.br
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
                    <Link href="/dados" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        Política de Dados
                    </Link>
                </div>
            </div>
        </div>
    );
}
