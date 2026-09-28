"use client";

import { FOOTER_LINKS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { LinkedinIcon, InstagramIcon, YoutubeIcon, MessageCircleIcon } from "lucide-react";

const Footer = () => {
    return (
        <footer className="dark-surface w-full pt-16 pb-10 relative bg-ink text-cream">
            <Container>
                <Wrapper className="relative flex flex-col md:flex-row justify-between pt-8 pb-16 overflow-hidden">
                    <div aria-hidden="true" className="absolute left-4 md:left-12 top-0 h-1.5 w-16 bg-brand-400" />

                    {/* Brand column */}
                    <div className="flex flex-col items-start max-w-56 mb-10 md:mb-0">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/img/logo2.png"
                                alt="Adone AI"
                                width={41}
                                height={28}
                                className="h-8 w-auto object-contain rounded-md ring-1 ring-cream/15"
                            />
                            <span className="text-xl font-bold font-heading text-white">
                                Adone AI
                            </span>
                        </div>
                        <p className="text-sm text-cream/70 mt-4 leading-relaxed">
                            Transformando dados em vantagem competitiva com Machine Learning e Inteligência Artificial.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <Link href="https://linkedin.com/company/adone-ai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-cream/15 hover:border-brand-400/60 hover:bg-brand-400/10 transition-all duration-200">
                                <LinkedinIcon className="w-4 h-4 text-cream/70 hover:text-brand-400 transition-colors" />
                            </Link>
                            <Link href="https://instagram.com/adoneai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-cream/15 hover:border-brand-400/60 hover:bg-brand-400/10 transition-all duration-200">
                                <InstagramIcon className="w-4 h-4 text-cream/70 hover:text-brand-400 transition-colors" />
                            </Link>
                            <Link href="https://youtube.com/@adoneai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-cream/15 hover:border-brand-400/60 hover:bg-brand-400/10 transition-all duration-200">
                                <YoutubeIcon className="w-4 h-4 text-cream/70 hover:text-brand-400 transition-colors" />
                            </Link>
                            <Link href="https://wa.me/5511926025637" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-cream/15 hover:border-brand-400/60 hover:bg-brand-400/10 transition-all duration-200">
                                <MessageCircleIcon className="w-4 h-4 text-cream/70 hover:text-brand-400 transition-colors" />
                            </Link>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/#contato"
                            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink bg-brand-400 hover:bg-brand-300 px-5 py-2.5 rounded-full transition-all duration-300"
                        >
                            Diagnóstico
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-lg mt-0">
                        {FOOTER_LINKS?.map((section, index) => (
                            <div key={index} className="flex flex-col gap-4">
                                <h4 className="text-sm font-semibold text-white">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3 w-full">
                                    {section.links.map((link, i) => (
                                        <li key={i} className="text-sm text-cream/70 transition-all w-full">
                                            <Link href={link.href} className="w-full hover:text-brand-400 transition-colors duration-200">
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
                <Wrapper className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cream/10 relative">
                    <p className="text-sm text-cream/60">
                        &copy; {new Date().getFullYear()} Adone AI. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-cream/60">
                        <Link href="/blog" className="hover:text-brand-400 transition-colors">Blog</Link>
                        <span className="text-cream/25">·</span>
                        <Link href="/privacidade" className="hover:text-brand-400 transition-colors">Privacidade</Link>
                        <span className="text-cream/25">·</span>
                        <Link href="/termos" className="hover:text-brand-400 transition-colors">Termos</Link>
                        <span className="text-cream/25">·</span>
                        <Link href="/lgpd" className="hover:text-brand-400 transition-colors">LGPD</Link>
                    </div>
                </Wrapper>
            </Container>
        </footer>
    );
};

export default Footer;
