import React from 'react';
import { Navbar, Footer } from "@/components";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ScrollProgress } from "@/components/motion/scroll-progress";

interface Props {
    children: React.ReactNode
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <>
            <ScrollProgress />
            <Navbar />
            <main id="home" className="mx-auto w-full relative">
                {children}
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
};

export default MarketingLayout
