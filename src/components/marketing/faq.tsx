"use client";

import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const FAQS = [
    {
        question: "Minha empresa precisa ter muito volume de dados para começar?",
        answer: "Não necessariamente. Trabalhamos com empresas em diferentes estágios de maturidade de dados. Em alguns casos, até 6 meses de histórico já são suficientes para construir modelos úteis. No diagnóstico gratuito, avaliamos o que você tem disponível e identificamos o melhor ponto de partida."
    },
    {
        question: "Quanto tempo leva para ver os primeiros resultados?",
        answer: "Nossa Prova de Conceito (PoC) tem duração de 2 a 4 semanas. Após a validação, a implementação completa geralmente leva de 4 a 12 semanas dependendo da complexidade. A maioria dos nossos clientes reporta impacto mensurável em até 90 dias do início do projeto."
    },
    {
        question: "Como fica a integração com meu sistema atual (ERP, CRM)?",
        answer: "Desenvolvemos APIs e conectores que se integram aos principais sistemas do mercado — SAP, Salesforce, TOTVS, Oracle, entre outros — sem necessidade de migração. Seu time continua operando nos sistemas existentes enquanto a IA trabalha em background."
    },
    {
        question: "Meus dados ficam seguros? Como tratam a LGPD?",
        answer: "Todos os projetos são desenvolvidos com conformidade à LGPD desde a concepção. Assinamos DPA (Data Processing Agreement) com todos os clientes, trabalhamos com anonimização e pseudonimização quando necessário, e você mantém total propriedade e controle sobre seus dados."
    },
    {
        question: "Qual o investimento mínimo para trabalhar com a Adone AI?",
        answer: "Os projetos variam conforme escopo, complexidade e volume de dados. Temos soluções a partir de R$ 25.000 para projetos pontuais de análise e PoC, até contratos de parceria anual para empresas que querem escalar IA em múltiplas frentes. O diagnóstico é sempre gratuito."
    },
    {
        question: "O que acontece após a entrega? Vocês oferecem suporte?",
        answer: "Sim. Oferecemos planos de suporte e evolução contínua que incluem monitoramento dos modelos em produção, retreinamento periódico com novos dados, adição de novas funcionalidades e suporte técnico. IA é um ativo vivo — precisa evoluir com o negócio."
    },
    {
        question: "Minha empresa não tem time de TI/dados. Conseguem implementar assim mesmo?",
        answer: "Com certeza. Grande parte dos nossos clientes não tem equipe interna de dados. Atuamos como seu time externo de IA, cuidando de toda a infraestrutura, desenvolvimento e operação. Também treinamos sua equipe para interpretar e usar os modelos no dia a dia."
    },
    {
        question: "Como é medido o ROI dos projetos?",
        answer: "Antes de iniciar, definimos juntos os KPIs financeiros do projeto — redução de custo, aumento de receita, ganho de produtividade. Durante e após a implementação, acompanhamos esses indicadores e produzimos relatórios mensais de impacto. Nada fica na subjetividade."
    },
];

const FAQ = () => {
    return (
        <div id="faq" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Dúvidas Frequentes" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        Perguntas que{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            todo gestor faz
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Respondemos as principais dúvidas antes de você agendar uma conversa. Se tiver alguma que não está aqui, é só entrar em contato.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 w-full max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {FAQS.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                value={`item-${i}`}
                                className="border border-foreground/5 rounded-2xl px-6 bg-foreground/[0.02] hover:bg-foreground/[0.04] data-[state=open]:bg-violet-500/5 data-[state=open]:border-violet-500/20 transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left font-medium text-foreground/90 hover:no-underline hover:text-foreground py-5 text-sm md:text-base">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center p-6 rounded-2xl border border-foreground/5 bg-foreground/[0.02]">
                        <p className="text-sm text-muted-foreground">
                            Ainda tem dúvidas? Nossos especialistas respondem em até 24 horas.
                        </p>
                        <Link
                            href="#contato"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 whitespace-nowrap transition-colors"
                        >
                            Falar com especialista <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default FAQ;
