"use client";

import { cn } from "@/functions";
import { ArrowRightIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";
import Menu from "./menu";
import MobileMenu from "./mobile-menu";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    return (
        <header
            className={cn(
                "fixed top-0 inset-x-0 z-[100] bg-white/90 backdrop-blur-md transition-shadow duration-300",
                isOpen ? "h-dvh" : "h-16 lg:h-[72px]",
                scrolled || isOpen ? "shadow-[0_1px_0_rgba(10,20,27,0.08),0_8px_24px_-16px_rgba(10,20,27,0.25)]" : "shadow-[0_1px_0_rgba(10,20,27,0.06)]"
            )}
        >
            <Wrapper className="relative flex flex-col bg-white/0">
                <div className="flex items-center justify-between w-full h-16 lg:h-[72px]">
                    <div className="flex items-center flex-1 lg:flex-none">
                        <Link href="/" className="flex items-center gap-2.5">
                            <Image
                                src="/img/logo2.png"
                                alt="Adone Intelligence"
                                width={53}
                                height={36}
                                className="h-9 w-auto object-contain rounded-md"
                                priority
                            />
                            <span style={{ fontFamily: "var(--font-space)" }} className="text-[15px] font-semibold tracking-tight text-foreground whitespace-nowrap lg:hidden xl:inline">
                                Adone Intelligence
                            </span>
                        </Link>
                        <div className="items-center hidden ml-6 lg:flex">
                            <Menu />
                        </div>
                    </div>
                    <div className="items-center flex gap-2 lg:gap-4">
                        <Button size="sm" asChild className="hidden sm:flex h-10 px-5 rounded-full bg-brand-400 text-ink font-semibold hover:bg-brand-300 hover:opacity-100">
                            <Link href="/#contato">
                                Diagnóstico
                                <ArrowRightIcon className="w-4 h-4 ml-2 hidden lg:block" />
                            </Link>
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsOpen((prev) => !prev)}
                            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                            className="lg:hidden p-2 w-9 h-9"
                        >
                            {isOpen ? <XIcon className="w-5 h-5 duration-300" /> : <Icons.menu className="w-4 h-4 duration-300" />}
                        </Button>
                    </div>
                </div>
                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </Wrapper>
        </header>
    )
};

export default Navbar
