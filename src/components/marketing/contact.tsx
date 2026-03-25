"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";
import { Button } from "../ui/button";
import { ArrowRightIcon, CheckIcon, PhoneIcon, MailIcon, MapPinIcon, CalendarIcon, MessageCircleIcon } from "lucide-react";
import { toast } from "sonner";

const INTERESTS = [
    "Consultoria em IA",
    "Machine Learning Preditivo",
    "Automação Inteligente",
    "Visão Computacional",
    "NLP & Chatbots",
    "Análise de Dados",
    "Integração de IA",
    "Não sei ainda",
];

const COMPANY_SIZES = [
    "1–10 colaboradores",
    "11–50 colaboradores",
    "51–200 colaboradores",
    "201–1.000 colaboradores",
    "Acima de 1.000",
];

const CONTACT_INFO = [
    {
        icon: MessageCircleIcon,
        label: "WhatsApp",
        value: "(11) 92602-5637",
        href: "https://wa.me/5511926025637",
    },
    {
        icon: MailIcon,
        label: "E-mail",
        value: "contato@adoneintelligence.com.br",
        href: "mailto:contato@adoneintelligence.com.br",
    },
    {
        icon: MapPinIcon,
        label: "Endereço",
        value: "R. Pais Leme, 215, Cj 1713 — Pinheiros, São Paulo/SP, 05424-150",
        href: "https://maps.google.com/?q=Rua+Pais+Leme+215+Pinheiros+São+Paulo",
    },
    {
        icon: CalendarIcon,
        label: "Horário de atendimento",
        value: "Seg–Sex, 9h–18h",
        href: null,
    },
];

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        companySize: "",
        interest: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleInterest = (value: string) => {
        setForm((prev) => ({ ...prev, interest: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.company) {
            toast.error("Preencha nome, e-mail e empresa para continuar.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitted(true);
                toast.success("Mensagem enviada! Retornaremos em até 24 horas.");
            } else {
                toast.error(data.message || "Erro ao enviar. Tente novamente.");
            }
        } catch {
            toast.error("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="contato" className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full scroll-mt-20">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Fale Conosco" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-semibold !leading-snug mt-6">
                        Agende um{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            diagnóstico gratuito
                        </span>
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/70 mt-6">
                        Em 60 minutos, nossos especialistas analisam seu negócio e mostram onde a IA pode gerar mais resultado para você — sem compromisso.
                    </p>
                </div>
            </Container>

            <Container>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 w-full">
                    {/* Form */}
                    <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-6 md:p-8">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center text-center gap-5 py-12">
                                <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                                    <CheckIcon className="w-8 h-8 text-violet-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Mensagem enviada!</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Nossa equipe comercial retornará em até 24 horas úteis para agendar o diagnóstico gratuito.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                                >
                                    Enviar outra mensagem
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Nome completo *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="João Silva"
                                            required
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            E-mail corporativo *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="joao@empresa.com.br"
                                            required
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Empresa *
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={form.company}
                                            onChange={handleChange}
                                            placeholder="Nome da sua empresa"
                                            required
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            Telefone / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+55 (11) 99999-0000"
                                            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Company size */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Tamanho da empresa
                                    </label>
                                    <select
                                        name="companySize"
                                        value={form.companySize}
                                        onChange={handleChange}
                                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200 appearance-none"
                                    >
                                        <option value="" className="bg-neutral-900">Selecione o porte</option>
                                        {COMPANY_SIZES.map((s) => (
                                            <option key={s} value={s} className="bg-neutral-900">{s}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Interest */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Principal interesse
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => handleInterest(interest)}
                                                className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                                                    form.interest === interest
                                                        ? "bg-violet-600 border-violet-500 text-white"
                                                        : "bg-foreground/[0.03] border-foreground/10 text-muted-foreground hover:border-violet-500/30 hover:text-foreground"
                                                }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Desafio ou contexto
                                    </label>
                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Descreva brevemente o principal problema que quer resolver com IA..."
                                        rows={4}
                                        className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200 resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={loading}
                                    className="w-full h-12 text-base font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-60"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Enviando...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Agendar Diagnóstico Gratuito
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    Sem compromisso. Seus dados são tratados conforme a LGPD.
                                </p>
                            </form>
                        )}
                    </div>

                    {/* Contact info + social proof */}
                    <div className="flex flex-col gap-6">
                        {/* Info */}
                        <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-6 flex flex-col gap-5">
                            <h3 className="text-base font-semibold text-foreground">Informações de Contato</h3>
                            {CONTACT_INFO.map((info, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 flex-shrink-0">
                                        <info.icon strokeWidth={1.5} className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">{info.label}</p>
                                        {info.href ? (
                                            <Link href={info.href} target={info.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm font-medium text-foreground/90 hover:text-violet-400 transition-colors">
                                                {info.value}
                                            </Link>
                                        ) : (
                                            <p className="text-sm font-medium text-foreground/90">{info.value}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* What to expect */}
                        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-purple-950/20 p-6 flex flex-col gap-4">
                            <h3 className="text-base font-semibold text-foreground">O que esperar do diagnóstico</h3>
                            <ul className="flex flex-col gap-3">
                                {[
                                    "Reunião de 60 min com especialista em IA",
                                    "Mapeamento dos seus dados e processos",
                                    "Identificação das maiores oportunidades",
                                    "Estimativa de ROI potencial",
                                    "Proposta preliminar sem compromisso",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <CheckIcon className="w-3 h-3 text-violet-400" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Response time */}
                        <div className="rounded-2xl border border-foreground/5 bg-foreground/[0.02] p-4 text-center">
                            <p className="text-xs text-muted-foreground">
                                Tempo médio de resposta
                            </p>
                            <p className="text-2xl font-bold font-heading text-violet-400 mt-1">&lt; 4 horas</p>
                            <p className="text-xs text-muted-foreground mt-1">em dias úteis</p>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Contact;
