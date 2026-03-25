"use client";

import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { BrainCircuitIcon, BarChart3Icon, BotIcon, EyeIcon, GitMergeIcon, MessageSquareTextIcon, TrendingUpIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    title: string;
    href: string;
    children: React.ReactNode;
    icon: React.ReactNode;
}

const Menu = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href="#processo" legacyBehavior passHref>
                        <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
                            Como Funciona
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground">
                        Soluções
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid rounded-3xl gap-3 p-4 md:w-[420px] lg:w-[540px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-4">
                                <NavigationMenuLink asChild>
                                    <Link
                                        href="#servicos"
                                        className="flex flex-col justify-end w-full h-full p-4 no-underline rounded-lg outline-none select-none bg-gradient-to-tr from-violet-950/60 to-violet-900/30 border border-violet-800/20 focus:shadow-md"
                                    >
                                        <Image
                                            src="/img/logo2.png"
                                            alt="Adone AI"
                                            width={41}
                                            height={28}
                                            className="h-7 w-auto object-contain"
                                        />
                                        <div className="my-2 text-lg font-semibold">
                                            Adone AI
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Soluções de IA e Machine Learning para empresas que querem crescer com inteligência.
                                        </p>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                            <Item title="Consultoria em IA" href="#servicos" icon={<BrainCircuitIcon className="w-5 h-5" />}>
                                Estratégia e roadmap de IA para o seu negócio.
                            </Item>
                            <Item title="Machine Learning Preditivo" href="#servicos" icon={<TrendingUpIcon className="w-5 h-5" />}>
                                Modelos que antecipam demandas e riscos.
                            </Item>
                            <Item title="Automação Inteligente" href="#servicos" icon={<GitMergeIcon className="w-5 h-5" />}>
                                Elimine processos manuais com IA.
                            </Item>
                            <Item title="NLP & Chatbots" href="#servicos" icon={<MessageSquareTextIcon className="w-5 h-5" />}>
                                Atendimento inteligente 24/7.
                            </Item>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="#segmentos" legacyBehavior passHref>
                        <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
                            Segmentos
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="#cases" legacyBehavior passHref>
                        <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
                            Cases
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href="#sobre" legacyBehavior passHref>
                        <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
                            Sobre
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
};

const Item = ({ title, href, children, icon, ...props }: Props) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    passHref
                    href={href}
                    {...props}
                    className="grid grid-cols-[.15fr_1fr] select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
                >
                    <div className="flex items-center mt-1 justify-center p-1 w-8 h-8 rounded-md border border-border/80">
                        {icon}
                    </div>
                    <div className="text-start ml-3">
                        <span className="text-sm group-hover:text-foreground font-normal leading-none">
                            {title}
                        </span>
                        <p className="text-sm mt-0.5 line-clamp-2 text-muted-foreground">
                            {children}
                        </p>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
};

Item.displayName = "Item";

export default Menu;
