import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheckIcon, ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Política de Privacidade | Adone AI",
    description: "Saiba como a Adone AI coleta, usa e protege seus dados pessoais em conformidade com a LGPD.",
};

const SECTIONS = [
    {
        id: "controlador",
        title: "1. Identificação do Controlador",
        content: `A Adone AI é a controladora dos dados pessoais tratados neste site e nos serviços relacionados. Qualquer dúvida sobre o tratamento dos seus dados pode ser enviada ao nosso Encarregado de Dados (DPO) pelo e-mail: privacidade@adoneintelligence.com.br.`,
    },
    {
        id: "dados-coletados",
        title: "2. Dados Pessoais Coletados",
        content: `Coletamos apenas os dados estritamente necessários para a prestação dos nossos serviços:`,
        list: [
            "Nome completo — para identificação e personalização do atendimento.",
            "E-mail corporativo — para comunicação sobre projetos, propostas e suporte.",
            "Empresa e cargo — para entender o contexto do negócio e oferecer soluções adequadas.",
            "Telefone (opcional) — para contato comercial quando solicitado.",
            "Dados de navegação — endereço IP, tipo de navegador, páginas visitadas e tempo de sessão, coletados via cookies para análise de desempenho do site.",
            "Dados de uso dos sistemas — quando você utiliza plataformas ou APIs contratadas da Adone AI, registramos logs técnicos para garantia de qualidade e segurança.",
        ],
    },
    {
        id: "finalidade",
        title: "3. Finalidade do Tratamento",
        content: `Seus dados são tratados para as seguintes finalidades:`,
        list: [
            "Responder às solicitações enviadas pelo formulário de contato.",
            "Elaborar propostas comerciais e diagnósticos técnicos personalizados.",
            "Enviar comunicações sobre soluções de IA relevantes ao seu negócio (somente com consentimento).",
            "Executar contratos de prestação de serviços de Machine Learning e Inteligência Artificial.",
            "Cumprir obrigações legais e regulatórias aplicáveis.",
            "Analisar o desempenho do site para melhorar a experiência do usuário.",
            "Garantir a segurança e integridade dos sistemas e dados dos clientes.",
        ],
    },
    {
        id: "base-legal",
        title: "4. Base Legal (LGPD — Lei nº 13.709/2018)",
        content: `Todos os tratamentos de dados realizados pela Adone AI possuem base legal prevista na Lei Geral de Proteção de Dados:`,
        list: [
            "Consentimento (art. 7º, I): para envio de conteúdos e comunicações de marketing.",
            "Execução de contrato (art. 7º, V): para prestação dos serviços contratados.",
            "Legítimo interesse (art. 7º, IX): para análise de desempenho do site e melhoria de serviços.",
            "Cumprimento de obrigação legal (art. 7º, II): para atendimento a exigências fiscais, contábeis e regulatórias.",
        ],
    },
    {
        id: "compartilhamento",
        title: "5. Compartilhamento de Dados",
        content: `A Adone AI não vende, aluga ou comercializa seus dados pessoais. O compartilhamento ocorre apenas nas seguintes situações:`,
        list: [
            "Fornecedores de infraestrutura e cloud (ex.: servidores, hospedagem) — sujeitos a acordos de confidencialidade e proteção de dados.",
            "Ferramentas de análise e monitoramento de desempenho do site — com dados anonimizados ou pseudonimizados.",
            "Parceiros técnicos envolvidos na execução dos projetos — mediante cláusulas contratuais de proteção de dados.",
            "Autoridades competentes — quando exigido por lei ou ordem judicial.",
        ],
    },
    {
        id: "seguranca",
        title: "6. Segurança da Informação",
        content: `A Adone AI adota medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição:`,
        list: [
            "Criptografia de dados em trânsito (TLS/HTTPS) e em repouso.",
            "Controle de acesso baseado em função (RBAC) nos sistemas internos.",
            "Monitoramento contínuo de vulnerabilidades e logs de auditoria.",
            "Backups automáticos com retenção segura e testada.",
            "Treinamentos periódicos de segurança da informação para toda a equipe.",
            "Política de resposta a incidentes com notificação à ANPD e aos titulares quando aplicável.",
        ],
    },
    {
        id: "retencao",
        title: "7. Retenção de Dados",
        content: `Os dados pessoais são retidos pelo tempo necessário ao cumprimento das finalidades descritas:`,
        list: [
            "Dados de contato e leads: até 2 anos após o último contato ou enquanto houver relação comercial.",
            "Dados de clientes ativos: durante toda a vigência contratual e por 5 anos após o encerramento (obrigações fiscais e legais).",
            "Logs técnicos de sistemas: 90 dias para fins de segurança e diagnóstico.",
            "Dados de navegação via cookies: conforme configuração de cada cookie (detalhado na seção de Cookies).",
        ],
    },
    {
        id: "cookies",
        title: "8. Cookies e Tecnologias de Rastreamento",
        content: `Utilizamos cookies para melhorar a experiência de navegação e analisar o desempenho do site:`,
        list: [
            "Cookies essenciais: necessários para o funcionamento básico do site. Não podem ser desativados.",
            "Cookies analíticos: coletam informações sobre como os visitantes utilizam o site (páginas visitadas, tempo de permanência). Podem ser desativados nas configurações do navegador.",
            "Cookies de preferências: armazenam configurações do usuário, como idioma ou tema. Podem ser desativados.",
        ],
        extra: "Você pode gerenciar ou desativar os cookies a qualquer momento nas configurações do seu navegador. A desativação de cookies essenciais pode impactar a funcionalidade do site.",
    },
    {
        id: "direitos",
        title: "9. Direitos do Titular de Dados",
        content: `Nos termos da LGPD, você possui os seguintes direitos em relação aos seus dados pessoais:`,
        list: [
            "Confirmação: saber se tratamos seus dados pessoais.",
            "Acesso: obter uma cópia dos dados que possuímos sobre você.",
            "Correção: solicitar a atualização de dados incompletos, inexatos ou desatualizados.",
            "Anonimização, bloqueio ou eliminação: de dados desnecessários ou tratados em desconformidade com a LGPD.",
            "Portabilidade: receber seus dados em formato estruturado para transferência a outro fornecedor.",
            "Revogação do consentimento: retirar o consentimento a qualquer momento, sem prejuízo à legalidade do tratamento anterior.",
            "Oposição: opor-se a tratamentos realizados com base em legítimo interesse.",
            "Informação sobre compartilhamento: saber com quais entidades seus dados foram compartilhados.",
        ],
        extra: "Para exercer qualquer um desses direitos, envie uma solicitação para privacidade@adoneintelligence.com.br. Responderemos em até 15 dias úteis.",
    },
    {
        id: "menores",
        title: "10. Dados de Menores",
        content: `Os serviços da Adone AI são direcionados exclusivamente a pessoas jurídicas e profissionais adultos. Não coletamos intencionalmente dados de menores de 18 anos. Caso identifiquemos tal situação, os dados serão imediatamente excluídos.`,
    },
    {
        id: "transferencia",
        title: "11. Transferência Internacional de Dados",
        content: `Alguns dos nossos fornecedores de infraestrutura possuem servidores fora do Brasil. Quando isso ocorre, garantimos que a transferência internacional atenda aos requisitos da LGPD, incluindo a adoção de cláusulas contratuais padrão ou a verificação de que o país de destino oferece grau de proteção adequado.`,
    },
    {
        id: "alteracoes",
        title: "12. Alterações nesta Política",
        content: `Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nas nossas práticas ou na legislação aplicável. A data da última atualização é indicada abaixo. Alterações relevantes serão comunicadas por e-mail aos nossos clientes e parceiros.`,
    },
    {
        id: "contato",
        title: "13. Contato e DPO",
        content: `Para dúvidas, solicitações ou reclamações relacionadas ao tratamento de dados pessoais:`,
        list: [
            "E-mail do DPO: privacidade@adoneintelligence.com.br",
            "E-mail geral: contato@adoneintelligence.com.br",
            "Site: adoneintelligence.com.br",
        ],
        extra: "Você também pode registrar reclamações junto à Autoridade Nacional de Proteção de Dados (ANPD): gov.br/anpd",
    },
];

export default function PrivacidadePage() {
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
                        <ShieldCheckIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
                        Legal · Privacidade
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
                    Política de Privacidade
                </h1>

                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                    A Adone AI está comprometida com a transparência e a proteção dos seus dados pessoais, em conformidade com a{" "}
                    <span className="text-violet-400 font-medium">Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</span>.
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
                <ShieldCheckIcon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Levamos a proteção de dados a sério. Se tiver qualquer dúvida sobre como tratamos suas informações, entre em contato com nosso DPO em{" "}
                    <a href="mailto:privacidade@adoneintelligence.com.br" className="text-violet-400 hover:underline">
                        privacidade@adoneintelligence.com.br
                    </a>
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <Link href="/" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        ← Voltar ao site
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
