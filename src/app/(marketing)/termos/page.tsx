import { Metadata } from "next";
import Link from "next/link";
import { ScrollTextIcon, ArrowLeftIcon } from "lucide-react";

export const metadata: Metadata = {
    title: "Termos de Uso | Adone AI",
    description: "Leia os Termos de Uso da Adone AI e entenda as condições para utilização dos nossos serviços de Inteligência Artificial e Machine Learning.",
};

const SECTIONS = [
    {
        id: "aceitacao",
        title: "1. Aceitação dos Termos",
        content: `Ao acessar o site adoneintelligence.com.br, solicitar um diagnóstico, contratar ou utilizar qualquer serviço da Adone AI, você ("Cliente" ou "Usuário") declara ter lido, compreendido e concordado integralmente com estes Termos de Uso. Caso não concorde com alguma cláusula, não utilize nossos serviços e entre em contato para esclarecimentos antes de prosseguir.`,
    },
    {
        id: "definicoes",
        title: "2. Definições",
        content: `Para fins destes Termos, os seguintes termos têm os significados abaixo:`,
        list: [
            "Adone AI: empresa prestadora de serviços de Inteligência Artificial, Machine Learning e automação inteligente.",
            "Cliente: pessoa jurídica ou profissional autônomo que contrata os serviços da Adone AI.",
            "Usuário: qualquer pessoa que acesse o site adoneintelligence.com.br, independentemente de contratação.",
            "Serviços: consultoria em IA, desenvolvimento de modelos de Machine Learning, automação de processos, projetos de NLP, visão computacional e demais soluções oferecidas.",
            "Plataforma: site adoneintelligence.com.br e quaisquer sistemas, APIs ou ambientes digitais disponibilizados pela Adone AI.",
            "Dados do Cliente: informações, datasets, modelos ou ativos digitais fornecidos pelo Cliente para execução dos serviços.",
            "Entregáveis: relatórios, modelos treinados, código-fonte, dashboards, documentações e demais produtos resultantes dos serviços.",
        ],
    },
    {
        id: "servicos",
        title: "3. Descrição dos Serviços",
        content: `A Adone AI oferece serviços especializados em Inteligência Artificial e tecnologia para empresas:`,
        list: [
            "Consultoria estratégica em IA: diagnóstico do negócio, roadmap de IA e definição de casos de uso prioritários.",
            "Desenvolvimento de modelos de Machine Learning: modelos preditivos, classificadores, detectores de anomalias e soluções sob medida.",
            "Automação inteligente: automação de processos com IA, bots e sistemas de decisão automatizados.",
            "Processamento de Linguagem Natural (NLP): chatbots, análise de sentimentos, extração de informações e assistentes virtuais.",
            "Visão Computacional: reconhecimento de imagens, controle de qualidade visual, detecção de objetos.",
            "Treinamento e capacitação: workshops e treinamentos em IA para equipes técnicas e de negócio.",
            "Suporte e manutenção: monitoramento de modelos em produção, retraining e suporte técnico contínuo.",
        ],
        extra: "Os serviços são formalizados por proposta comercial e contrato específico. Estes Termos de Uso são complementares e não substituem o contrato firmado entre as partes.",
    },
    {
        id: "cadastro",
        title: "4. Acesso ao Site e Formulários",
        content: `Ao preencher formulários no site (ex.: formulário de contato ou solicitação de diagnóstico), o Usuário garante que:`,
        list: [
            "As informações fornecidas são verdadeiras, precisas, atuais e completas.",
            "Possui autorização para fornecer os dados da empresa em nome da qual atua.",
            "Não utilizará o site ou os formulários para finalidades ilícitas, fraudulentas ou que violem direitos de terceiros.",
            "Não tentará acessar áreas restritas da plataforma sem autorização.",
        ],
    },
    {
        id: "propriedade-intelectual",
        title: "5. Propriedade Intelectual",
        content: `Todo o conteúdo do site adoneintelligence.com.br — incluindo textos, imagens, logotipos, interfaces, código-fonte e metodologias — é de propriedade exclusiva da Adone AI ou de seus licenciadores, protegido pela Lei nº 9.610/1998 (Lei de Direitos Autorais) e demais normas de propriedade intelectual.`,
        list: [
            "É vedada a reprodução, distribuição, modificação ou uso comercial do conteúdo do site sem autorização prévia e expressa da Adone AI.",
            "Os Entregáveis desenvolvidos para o Cliente serão objeto de cessão de direitos conforme estabelecido no contrato específico.",
            "Metodologias, frameworks, modelos genéricos e know-how desenvolvidos pela Adone AI permanecem de sua propriedade, mesmo quando utilizados em projetos para clientes.",
            "O Cliente mantém a propriedade integral dos seus dados e ativos fornecidos para execução dos projetos.",
        ],
    },
    {
        id: "confidencialidade",
        title: "6. Confidencialidade",
        content: `As partes se comprometem a manter sigilo sobre todas as informações confidenciais trocadas no contexto dos serviços:`,
        list: [
            "Dados estratégicos, financeiros, operacionais e tecnológicos compartilhados pelo Cliente.",
            "Metodologias, processos internos e know-how da Adone AI.",
            "Informações sobre projetos, clientes e parceiros de ambas as partes.",
            "A obrigação de confidencialidade persiste por 5 (cinco) anos após o encerramento da relação contratual.",
        ],
        extra: "Excetua-se da obrigação de confidencialidade informações que já sejam públicas, que precisem ser divulgadas por determinação legal ou judicial, ou que sejam desenvolvidas independentemente pela parte receptora.",
    },
    {
        id: "uso-aceitavel",
        title: "7. Uso Aceitável",
        content: `O Usuário concorda em utilizar o site e os serviços da Adone AI exclusivamente para fins legítimos e em conformidade com a legislação brasileira. É expressamente proibido:`,
        list: [
            "Usar os serviços para desenvolver soluções que violem direitos fundamentais, promovam discriminação ou causem danos a terceiros.",
            "Fornecer dados obtidos de forma ilícita ou sem as devidas autorizações de uso.",
            "Tentar reverter a engenharia, descompilar ou extrair modelos ou código-fonte proprietário da Adone AI.",
            "Sublicenciar, revender ou transferir os serviços a terceiros sem autorização por escrito.",
            "Realizar ataques de negação de serviço (DoS/DDoS) ou qualquer ação que prejudique a infraestrutura da plataforma.",
            "Usar os serviços para treinamento de modelos concorrentes sem autorização expressa.",
        ],
    },
    {
        id: "pagamento",
        title: "8. Pagamentos e Cancelamento",
        content: `As condições comerciais, valores, prazos de pagamento e política de cancelamento são definidos no contrato específico firmado com cada cliente. De forma geral:`,
        list: [
            "Os valores dos projetos são acordados previamente em proposta comercial aprovada pelo Cliente.",
            "Atrasos no pagamento podem resultar na suspensão dos serviços, conforme cláusulas contratuais.",
            "O diagnóstico inicial é gratuito e sem compromisso de contratação.",
            "Cancelamentos após o início da execução do projeto estão sujeitos às penalidades previstas em contrato.",
            "Reembolsos são avaliados caso a caso, considerando o estágio de execução dos serviços.",
        ],
    },
    {
        id: "responsabilidades",
        title: "9. Limitação de Responsabilidade",
        content: `A Adone AI envidar todos os esforços técnicos e profissionais para entregar resultados de qualidade. Contudo:`,
        list: [
            "Modelos de Machine Learning são probabilísticos e não garantem 100% de acurácia em todas as situações.",
            "A Adone AI não se responsabiliza por decisões de negócio tomadas exclusivamente com base nas previsões dos modelos sem supervisão humana adequada.",
            "A responsabilidade da Adone AI por danos diretos é limitada ao valor pago pelo Cliente no projeto específico.",
            "A Adone AI não se responsabiliza por danos indiretos, lucros cessantes ou danos emergentes não previstos em contrato.",
            "O Cliente é responsável pela qualidade, integridade e legalidade dos dados fornecidos para treinamento dos modelos.",
            "A Adone AI não se responsabiliza por indisponibilidades de serviços de terceiros (cloud, APIs externas) que impactem os projetos.",
        ],
    },
    {
        id: "privacidade",
        title: "10. Privacidade e Proteção de Dados",
        content: `O tratamento de dados pessoais pela Adone AI é regido pela nossa Política de Privacidade, em conformidade com a LGPD (Lei nº 13.709/2018). Ao utilizar nossos serviços, o Cliente autoriza o tratamento dos dados necessários à execução contratual. Consulte nossa Política de Privacidade para detalhes completos sobre coleta, uso, armazenamento e direitos dos titulares.`,
    },
    {
        id: "ia-etica",
        title: "11. IA Responsável e Ética",
        content: `A Adone AI adota princípios de desenvolvimento responsável de Inteligência Artificial:`,
        list: [
            "Transparência: documentamos e explicamos o funcionamento dos modelos entregues.",
            "Equidade: avaliamos e mitigamos vieses nos modelos antes da entrega.",
            "Privacidade by design: proteção de dados é considerada desde o início de cada projeto.",
            "Supervisão humana: recomendamos que decisões críticas envolvam revisão humana dos resultados dos modelos.",
            "Conformidade regulatória: os projetos são desenvolvidos respeitando a LGPD e demais regulamentações setoriais aplicáveis.",
        ],
        extra: "Nos reservamos o direito de recusar projetos que, a nosso critério, possam resultar em danos à sociedade, violações de direitos fundamentais ou usos antiéticos da tecnologia.",
    },
    {
        id: "links",
        title: "12. Links Externos",
        content: `O site adoneintelligence.com.br pode conter links para sites e recursos de terceiros. Esses links são fornecidos para conveniência do usuário e não representam endosso ou responsabilidade da Adone AI sobre o conteúdo, políticas ou práticas desses sites. Recomendamos a leitura dos termos e políticas de privacidade de cada site externo acessado.`,
    },
    {
        id: "modificacoes",
        title: "13. Modificações nos Termos",
        content: `A Adone AI reserva-se o direito de modificar estes Termos de Uso a qualquer momento. Alterações relevantes serão comunicadas com antecedência mínima de 30 dias por e-mail aos clientes ativos. O uso continuado dos serviços após a vigência das alterações constitui aceitação dos novos termos. Recomendamos a revisão periódica desta página.`,
    },
    {
        id: "rescisao",
        title: "14. Rescisão",
        content: `A Adone AI pode suspender ou encerrar o acesso ao site ou serviços em caso de:`,
        list: [
            "Violação destes Termos de Uso ou do contrato firmado.",
            "Uso indevido ou ilícito da plataforma ou dos serviços.",
            "Inadimplência após os prazos previstos em contrato.",
            "Solicitação do próprio Cliente, conforme as condições contratuais.",
        ],
        extra: "Em caso de encerramento, o Cliente receberá os Entregáveis produzidos até a data da rescisão, proporcionalmente ao valor pago.",
    },
    {
        id: "legislacao",
        title: "15. Lei Aplicável e Foro",
        content: `Estes Termos de Uso são regidos pela legislação da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer conflitos decorrentes deste instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja. Antes de qualquer medida judicial, as partes se comprometem a buscar solução amigável no prazo de 30 dias.`,
    },
    {
        id: "contato",
        title: "16. Contato",
        content: `Para dúvidas, solicitações ou comunicações relacionadas a estes Termos de Uso:`,
        list: [
            "E-mail: contato@adoneintelligence.com.br",
            "E-mail jurídico: juridico@adoneintelligence.com.br",
            "Site: adoneintelligence.com.br",
        ],
    },
];

export default function TermosPage() {
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
                        <ScrollTextIcon className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="text-xs font-medium text-violet-400 uppercase tracking-widest">
                        Legal · Termos
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-4">
                    Termos de Uso
                </h1>

                <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                    Estes Termos de Uso regulam o acesso ao site e a contratação dos serviços da{" "}
                    <span className="text-violet-400 font-medium">Adone AI</span>. Leia com atenção antes de utilizar nossa plataforma ou contratar nossos serviços.
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
                <ScrollTextIcon className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                    Dúvidas sobre estes termos? Fale com nossa equipe jurídica em{" "}
                    <a href="mailto:juridico@adoneintelligence.com.br" className="text-violet-400 hover:underline">
                        juridico@adoneintelligence.com.br
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
                    <Link href="/lgpd" className="text-muted-foreground hover:text-violet-400 transition-colors">
                        LGPD
                    </Link>
                </div>
            </div>
        </div>
    );
}
