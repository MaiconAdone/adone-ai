"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/functions";
import { useClickOutside } from "@/hooks";
import { motion } from "framer-motion";
import { BrainCircuitIcon, TrendingUpIcon, GitMergeIcon, MessageSquareTextIcon, EyeIcon, BarChart3Icon, HelpCircleIcon, BuildingIcon, UsersIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";
import React from 'react';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
    const ref = useClickOutside(() => setIsOpen(false));

    const variants = {
        open: { opacity: 1, y: 20 },
        closed: { opacity: 0, y: 0 },
    };

    return (
        <div
            ref={ref}
            className={cn(
                "absolute top-12 inset-x-0 size-full p-4 z-20 bg-inherit flex flex-1",
                isOpen ? "flex" : "hidden"
            )}
        >
            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className="size-full flex flex-col justify-start"
            >
                <ul className="flex flex-col items-start flex-1 w-full space-y-3">
                    <li
                        onClick={() => setIsOpen(false)}
                        className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80"
                    >
                        <Link href="#processo" className="flex items-center w-full text-start">
                            <BookOpenIcon className="w-4 h-4 mr-2" />
                            Como Funciona
                        </Link>
                    </li>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="solucoes" className="border-transparent">
                            <AccordionTrigger className="px-4 py-2 text-lg hover:text-muted-foreground font-normal">
                                <span className="flex items-center">
                                    <BrainCircuitIcon className="w-4 h-4 mr-2" />
                                    Soluções
                                </span>
                            </AccordionTrigger>
                            <AccordionContent onClick={() => setIsOpen(false)} className="flex flex-col items-start gap-1 mt-1">
                                {[
                                    { icon: BrainCircuitIcon, label: "Consultoria em IA" },
                                    { icon: TrendingUpIcon, label: "Machine Learning Preditivo" },
                                    { icon: GitMergeIcon, label: "Automação Inteligente" },
                                    { icon: EyeIcon, label: "Visão Computacional" },
                                    { icon: MessageSquareTextIcon, label: "NLP & Chatbots" },
                                    { icon: BarChart3Icon, label: "Análise de Dados" },
                                ].map(({ icon: Icon, label }) => (
                                    <li key={label} className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                                        <Link href="#servicos" className="flex items-center w-full text-start">
                                            <Icon className="w-4 h-4 mr-2" />
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <li onClick={() => setIsOpen(false)} className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                        <Link href="#segmentos" className="flex items-center w-full text-start">
                            <BuildingIcon className="w-4 h-4 mr-2" />
                            Segmentos
                        </Link>
                    </li>
                    <li onClick={() => setIsOpen(false)} className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                        <Link href="#cases" className="flex items-center w-full text-start">
                            <UsersIcon className="w-4 h-4 mr-2" />
                            Cases
                        </Link>
                    </li>
                    <li onClick={() => setIsOpen(false)} className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                        <Link href="#faq" className="flex items-center w-full text-start">
                            <HelpCircleIcon className="w-4 h-4 mr-2" />
                            FAQ
                        </Link>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
};

export default MobileMenu;
