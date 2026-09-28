import type { Metadata } from "next";

// Painel interno: fora do Google
export const metadata: Metadata = {
    title: "Painel de marketing",
    robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background">{children}</div>;
}
