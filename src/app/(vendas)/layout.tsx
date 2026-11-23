import React from "react";

import { ScrollProgress } from "@/components/motion/scroll-progress";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

// Páginas de vendas: sem o menu do site (Navbar e botão de diagnóstico) e sem rodapé
export default function VendasLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollProgress />
            <main className="relative mx-auto w-full">{children}</main>
            <WhatsAppButton />
        </>
    );
}
