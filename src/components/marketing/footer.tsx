"use client";

import { FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Particles } from "../ui/particles";
import { LinkedinIcon, InstagramIcon, YoutubeIcon, MessageCircleIcon } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full py-10 relative border-t border-foreground/5">
            <Container>
                <Wrapper className="relative flex flex-col md:flex-row justify-between pb-20 overflow-hidden">
                    <Particles
                        className="absolute inset-0 w-full -z-10"
                        quantity={30}
                        ease={10}
                        color="#8b5cf6"
                        refresh
                    />

                    {/* Brand column */}
                    <div className="flex flex-col items-start max-w-56 mb-10 md:mb-0">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/img/logo2.png"
                                alt="Adone AI"
                                width={41}
                                height={28}
                                className="h-7 w-auto object-contain"
                            />
                            <span className="text-xl font-bold font-heading">
                                Adone AI
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                            Transformando dados em vantagem competitiva com Machine Learning e Inteligência Artificial.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <Link href="https://linkedin.com/company/adone-ai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-foreground/10 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200">
                                <LinkedinIcon className="w-4 h-4 text-muted-foreground hover:text-violet-400 transition-colors" />
                            </Link>
                            <Link href="https://instagram.com/adoneai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-foreground/10 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200">
                                <InstagramIcon className="w-4 h-4 text-muted-foreground hover:text-violet-400 transition-colors" />
                            </Link>
                            <Link href="https://youtube.com/@adoneai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-foreground/10 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200">
                                <YoutubeIcon className="w-4 h-4 text-muted-foreground hover:text-violet-400 transition-colors" />
                            </Link>
                            <Link href="https://wa.me/5511926025637" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-foreground/10 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200">
                                <MessageCircleIcon className="w-4 h-4 text-muted-foreground hover:text-violet-400 transition-colors" />
                            </Link>
                        </div>

                        {/* CTA */}
                        <Link
                            href="#contato"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-2.5 rounded-lg transition-all duration-300"
                        >
                            Diagnóstico Gratuito
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-lg mt-0">
                        {FOOTER_LINKS?.map((section, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <h4 className="text-sm font-semibold text-foreground/90">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3 w-full">
                                    {section.links.map((link, i) => (
                                        <li key={i} className="text-sm text-muted-foreground hover:text-foreground transition-all w-full">
                                            <Link href={link.href} className="w-full hover:text-violet-400 transition-colors duration-200">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </Container>

            {/* Bottom bar */}
            <Container>
                <Wrapper className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-foreground/5 relative">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Adone AI. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
                        <span className="text-foreground/20">·</span>
                        <Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link>
                        <span className="text-foreground/20">·</span>
                        <Link href="/lgpd" className="hover:text-foreground transition-colors">LGPD</Link>
                    </div>
                </Wrapper>
            </Container>
        </footer>
    );
};

export default Footer;
