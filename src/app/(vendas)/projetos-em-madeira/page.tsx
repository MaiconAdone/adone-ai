import type { Metadata } from "next";

import { AcervoMadeira } from "@/components/marketing/projetos-madeira/acervo-madeira";

export const metadata: Metadata = {
    title: "Projetos em Madeira | +2.000 páginas de passo a passo por R$ 19,90",
    description:
        "Acervo com 75 PDFs e mais de 2.000 páginas: móveis industriais, marcenaria com plano de corte, móveis de paletes, áreas gourmet, fogões a lenha e cozinhas caipiras. Acesso imediato pelo Google Drive.",
    openGraph: {
        title: "Projetos em Madeira — acervo completo por R$ 19,90",
        description: "+2.000 páginas de projetos passo a passo, organizados em 7 categorias. Acesso pelo Google Drive.",
        images: ["/projetos-madeira/areas-gourmet.webp"],
    },
};

export default function ProjetosEmMadeiraPage() {
    return <AcervoMadeira />;
}
