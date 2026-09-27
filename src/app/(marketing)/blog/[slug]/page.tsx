import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Background, Container, Wrapper } from "@/components";
import { Button } from "@/components/ui/button";
import { getPost } from "@/lib/engine/marketing/blog";

export const revalidate = 600;
export const dynamicParams = true;

// Artigos são gerados sob demanda (e revalidados) na primeira visita
export function generateStaticParams() {
    return [];
}

interface Props {
    params: Promise<{ slug: string }>;
}

const SITE_URL = "https://adoneintelligence.com.br";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: "Artigo não encontrado" };
    return {
        title: post.title,
        description: post.description,
        alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
        openGraph: { title: post.title, description: post.description, type: "article", url: `${SITE_URL}/blog/${post.slug}` },
    };
}

// Markdown vem da planilha: HTML bruto é ignorado pelo react-markdown (sem rehype-raw)
const markdownComponents: Components = {
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold text-foreground">{children}</h3>,
    p: ({ children }) => <p className="mt-4 leading-8 text-foreground/80">{children}</p>,
    ul: ({ children }) => <ul className="mt-4 list-disc pl-6 space-y-2 text-foreground/80">{children}</ul>,
    ol: ({ children }) => <ol className="mt-4 list-decimal pl-6 space-y-2 text-foreground/80">{children}</ol>,
    li: ({ children }) => <li className="leading-7">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    a: ({ href, children }) => {
        const external = href?.startsWith("http") && !href.startsWith(SITE_URL);
        return (
            <a href={href} className="text-violet-400 underline underline-offset-2 hover:text-violet-300" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
            </a>
        );
    },
    blockquote: ({ children }) => <blockquote className="mt-6 border-l-4 border-violet-500/40 pl-4 italic text-muted-foreground">{children}</blockquote>,
    table: ({ children }) => <div className="mt-6 overflow-x-auto"><table className="w-full text-sm border-collapse">{children}</table></div>,
    th: ({ children }) => <th className="border border-foreground/10 bg-foreground/[0.04] px-3 py-2 text-left font-semibold">{children}</th>,
    td: ({ children }) => <td className="border border-foreground/10 px-3 py-2 text-foreground/80">{children}</td>,
    h1: ({ children }) => <h2 className="mt-10 text-2xl font-semibold text-foreground">{children}</h2>,
};

const BlogPostPage = async ({ params }: Props) => {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        inLanguage: "pt-BR",
        author: { "@type": "Person", name: "Maicon Adone" },
        publisher: { "@type": "Organization", name: "Adone Intelligence", url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        keywords: post.keyword,
    };

    return (
        <Background>
            <Wrapper className="relative pt-32 pb-20">
                <Container>
                    <article className="max-w-3xl mx-auto">
                        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Blog
                        </Link>
                        <p className="mt-6 text-sm text-muted-foreground">
                            {post.date}{post.sector ? ` · ${post.sector}` : ""} · por Maicon Adone
                        </p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-heading font-semibold !leading-tight text-foreground">
                            {post.title}
                        </h1>
                        <div className="mt-6">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                {post.markdown}
                            </ReactMarkdown>
                        </div>

                        <div className="mt-12 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6 text-center">
                            <p className="text-lg font-semibold text-foreground">Quer saber onde a IA gera resultado na sua empresa?</p>
                            <p className="mt-2 text-sm text-muted-foreground">Diagnóstico de 30 minutos com o Maicon, por Google Meet.</p>
                            <Button asChild size="lg" className="mt-5 bg-violet-600 hover:bg-violet-500 text-white">
                                <Link href="/agendar">
                                    Agendar diagnóstico <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </article>
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
                </Container>
            </Wrapper>
        </Background>
    );
};

export default BlogPostPage;
