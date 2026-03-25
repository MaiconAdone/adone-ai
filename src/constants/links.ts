import { ChartPieIcon, CreditCardIcon, LineChartIcon, MegaphoneIcon, MessageSquareTextIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type Link = {
    href: string;
    label: string;
    icon: LucideIcon;
}

export const SIDEBAR_LINKS: Link[] = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: ChartPieIcon,
    },
    {
        href: "/dashboard/campaigns",
        label: "Campanhas",
        icon: MegaphoneIcon
    },
    {
        href: "/dashboard/analytics",
        label: "Analytics",
        icon: LineChartIcon
    },
    {
        href: "/dashboard/posts",
        label: "Posts",
        icon: MessageSquareTextIcon
    },
    {
        href: "/dashboard/engagement",
        label: "Engajamento",
        icon: UsersIcon
    },
    {
        href: "/dashboard/billing",
        label: "Faturamento",
        icon: CreditCardIcon
    },
    {
        href: "/dashboard/settings",
        label: "Configurações",
        icon: SettingsIcon
    },
];

export const FOOTER_LINKS = [
    {
        title: "Soluções",
        links: [
            { name: "Consultoria em IA", href: "#servicos" },
            { name: "Machine Learning", href: "#servicos" },
            { name: "Automação Inteligente", href: "#servicos" },
            { name: "Visão Computacional", href: "#servicos" },
            { name: "NLP & Chatbots", href: "#servicos" },
        ],
    },
    {
        title: "Empresa",
        links: [
            { name: "Sobre Nós", href: "#sobre" },
            { name: "Cases de Sucesso", href: "#cases" },
            { name: "Como Funciona", href: "#processo" },
            { name: "Segmentos", href: "#segmentos" },
        ],
    },
    {
        title: "Legal",
        links: [
            { name: "Privacidade", href: "/privacidade" },
            { name: "Termos de Uso", href: "/termos" },
            { name: "Política de Dados", href: "/dados" },
            { name: "LGPD", href: "/lgpd" },
        ],
    },
    {
        title: "Contato",
        links: [
            { name: "Fale Conosco", href: "#contato" },
            { name: "Agendar Reunião", href: "#contato" },
            { name: "LinkedIn", href: "https://linkedin.com/company/adone-ai" },
            { name: "WhatsApp", href: "https://wa.me/5511926025637" },
        ],
    },
];
